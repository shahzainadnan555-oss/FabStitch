"use client";

import Image from "next/image";
import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { FabStitchPageLoader } from "@/components/brand/fabstitch-loader";
import { IconArrowRight, IconCheck } from "@/components/ui/icon";
import { postAuthDestination } from "@/features/auth/destination";
import { useSession } from "@/features/auth/session";
import { uniqueImagedOnboardingOptions } from "./fabric-images";
import { api } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";

type Schema = components["schemas"];
type TaxonomyItem = Schema["TaxonomyItemPublic"];
type OnboardingState = Schema["OnboardingStateResponse"];
type OnboardingOptions = Schema["OnboardingOptionsResponse"];
type OnboardingSaveRequest = Schema["OnboardingSaveRequest"];

type StepKey =
  | "customer_type"
  | "work_area"
  | "fabric_interests"
  | "use_cases"
  | "quantity_preference";

type Step = {
  key: StepKey;
  eyebrow: string;
  title: string;
  intro: string;
  ready: boolean;
};

function validInitial(
  item: TaxonomyItem | null | undefined,
  options: TaxonomyItem[],
): string {
  return item && options.some((option) => option.code === item.code)
    ? item.code
    : "";
}

function validInitialList(
  items: TaxonomyItem[] | undefined,
  options: TaxonomyItem[],
): string[] {
  const available = new Set(options.map((option) => option.code));
  return (items ?? [])
    .map((item) => item.code)
    .filter((code) => available.has(code));
}

export function OnboardingExperience({
  initial,
  options,
  editing = false,
  next = "/",
}: {
  initial: OnboardingState;
  options: OnboardingOptions;
  editing?: boolean;
  next?: string;
}) {
  const router = useRouter();
  const { setOnboarding, refresh } = useSession();
  const [isNavigating, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const [customerType, setCustomerType] = useState(() =>
    validInitial(initial.customer_type, options.customer_types),
  );
  const [workArea, setWorkArea] = useState(() =>
    validInitial(initial.work_area, options.work_areas),
  );
  const [fabricInterests, setFabricInterests] = useState(() =>
    validInitialList(initial.fabric_interests, options.fabric_interests),
  );
  const [useCases, setUseCases] = useState(() =>
    validInitialList(initial.use_cases, options.use_cases),
  );
  const [quantityPreference, setQuantityPreference] = useState(() =>
    validInitial(initial.quantity_preference, options.quantity_preferences),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const steps: Step[] = [
    {
      key: "customer_type",
      eyebrow: "Your business",
      title: "What best describes you?",
      intro:
        "Choose the closest fit. This shapes useful starting points, not what you are allowed to browse.",
      ready: Boolean(customerType),
    },
    {
      key: "work_area",
      eyebrow: "What you make",
      title: "Where does your work sit?",
      intro:
        "Pick the product area that best represents your day-to-day fabric decisions.",
      ready: Boolean(workArea),
    },
    {
      key: "fabric_interests",
      eyebrow: "Material interests",
      title: "Which fabrics draw your attention?",
      intro:
        "Choose one or several. You can still search the complete FabStitch catalogue.",
      ready: fabricInterests.length > 0,
    },
    {
      key: "use_cases",
      eyebrow: "Product fit",
      title: "What are you mainly sourcing for?",
      intro:
        "These application links become your quickest routes back into relevant fabric discovery.",
      ready: useCases.length > 0,
    },
    ...(options.quantity_preferences.length
      ? [
          {
            key: "quantity_preference" as const,
            eyebrow: "Typical quantity",
            title: "What order size do you usually source?",
            intro:
              "This helps FabStitch put practical MOQ ranges first. It does not limit the catalogue.",
            ready: Boolean(quantityPreference),
          },
        ]
      : []),
  ];

  const current = steps[step] ?? steps[0]!;
  const toggle = (
    value: string,
    values: string[],
    setValues: (next: string[]) => void,
  ) => {
    setValues(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body: OnboardingSaveRequest = {
      customer_type: customerType,
      work_area: workArea,
      fabric_interests: fabricInterests,
      use_cases: useCases,
      quantity_preference: quantityPreference || null,
    };
    setPending(true);
    setError(null);
    try {
      const response = await api.put<OnboardingState, OnboardingSaveRequest>(
        "/account/onboarding",
        { body },
      );
      if (!response.onboarding_completed && !editing) {
        setError(
          "Your preferences were saved, but onboarding is still incomplete. Try again.",
        );
        setPending(false);
        setOnboarding(response);
        return;
      }
      setOnboarding(response);
      await refresh({ persistOnUnauthorized: true }).catch(() => {});
      startTransition(() => {
        router.replace(
          editing
            ? "/account/preferences/?saved=1"
            : postAuthDestination(true, next),
        );
      });
    } catch (requestError) {
      setError(
        apiErrorMessage(
          requestError,
          "Your preferences could not be saved. Try again.",
        ),
      );
      setPending(false);
    }
  };

  if (isNavigating || (pending && !error && !editing)) {
    return (
      <FabStitchPageLoader
        label={isNavigating ? "Opening FabStitch" : "Saving your preferences"}
      />
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-[74rem]">
      <header className="grid gap-5 border-b border-rule pb-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="font-mono text-label tracking-[0.11em] text-gold-ink uppercase">
            {editing ? "Preferences" : "Make FabStitch yours"}
          </p>
          <p className="mt-2 max-w-[36rem] text-sm text-ink-3">
            A few quick choices, saved to your account and editable whenever
            your sourcing changes.
          </p>
        </div>
        <div className="min-w-48">
          <p className="flex justify-between font-mono text-label tabular-nums text-ink-3">
            <span>
              {String(step + 1).padStart(2, "0")} /{" "}
              {String(steps.length).padStart(2, "0")}
            </span>
            <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
          </p>
          <div
            className="mt-2 h-1 overflow-hidden rounded-full bg-rule"
            aria-hidden
          >
            <span
              className="block h-full origin-left bg-indigo transition-transform duration-300 ease-out"
              style={{
                transform: `scaleX(${(step + 1) / steps.length})`,
              }}
            />
          </div>
        </div>
      </header>

      <section
        key={current.key}
        className="fs-onboarding-step py-7 sm:py-10"
        aria-labelledby="onboarding-question"
      >
        <p className="font-mono text-label tracking-[0.1em] text-indigo uppercase">
          {current.eyebrow}
        </p>
        <h1
          id="onboarding-question"
          className="mt-2 max-w-[17ch] text-[clamp(2.25rem,5vw,4.8rem)] leading-[0.94] font-bold tracking-[-0.055em] text-balance text-ink"
        >
          {current.title}
        </h1>
        <p className="mt-4 max-w-[40rem] text-body text-ink-3 text-pretty">
          {current.intro}
        </p>

        {current.key === "customer_type" ? (
          <OptionGrid
            options={options.customer_types}
            selected={[customerType]}
            onSelect={setCustomerType}
          />
        ) : null}

        {current.key === "work_area" ? (
          <OptionGrid
            options={options.work_areas}
            selected={[workArea]}
            onSelect={setWorkArea}
          />
        ) : null}

        {current.key === "fabric_interests" ? (
          <FabricOptionGrid
            options={options.fabric_interests}
            selected={fabricInterests}
            onSelect={(value) =>
              toggle(value, fabricInterests, setFabricInterests)
            }
          />
        ) : null}

        {current.key === "use_cases" ? (
          <OptionGrid
            options={options.use_cases}
            selected={useCases}
            multiple
            onSelect={(value) => toggle(value, useCases, setUseCases)}
          />
        ) : null}

        {current.key === "quantity_preference" ? (
          <OptionGrid
            options={options.quantity_preferences}
            selected={[quantityPreference]}
            onSelect={setQuantityPreference}
          />
        ) : null}
      </section>

      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-sm border border-alert/30 bg-alert-wash px-4 py-3 text-sm text-alert"
        >
          {error}
        </p>
      ) : null}

      <footer className="flex items-center justify-between gap-3 border-t border-rule pt-5">
        <button
          type="button"
          onClick={() => setStep((value) => Math.max(value - 1, 0))}
          disabled={step === 0 || pending}
          className="h-11 rounded-sm border border-border bg-paper-raised px-5 text-sm font-semibold text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35"
        >
          Back
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            disabled={!current.ready || pending}
            onClick={() =>
              setStep((value) => Math.min(value + 1, steps.length - 1))
            }
            className="inline-flex h-11 items-center gap-2 rounded-sm bg-indigo px-5 text-sm font-semibold text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-indigo-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            Continue
            <IconArrowRight width={14} height={14} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!current.ready || pending}
            className="inline-flex h-11 items-center gap-2 rounded-sm bg-indigo px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending
              ? "Saving…"
              : editing
                ? "Save preferences"
                : "Enter marketplace"}
            {!pending ? <IconArrowRight width={14} height={14} /> : null}
          </button>
        )}
      </footer>
    </form>
  );
}

function FabricOptionGrid({
  options,
  selected,
  onSelect,
}: {
  options: TaxonomyItem[];
  selected: string[];
  onSelect: (value: string) => void;
}) {
  const imagedOptions = useMemo(
    () =>
      uniqueImagedOnboardingOptions(
        options.map((option) => ({
          code: option.code,
          display_name: option.display_name,
          id: option.id,
        })),
      ),
    [options],
  );

  return (
    <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {imagedOptions.map((option) => {
        const active = selected.includes(option.code);
        return (
          <li key={option.id}>
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(option.code)}
              className={cn(
                "group relative aspect-[4/5] w-full overflow-hidden rounded-md border text-left transition-[border-color,transform,box-shadow]",
                active
                  ? "border-indigo shadow-[0_0_0_2px_var(--color-indigo)]"
                  : "border-rule-2 hover:-translate-y-0.5 hover:border-indigo",
              )}
            >
              <Image
                src={option.image}
                alt=""
                fill
                sizes="(min-width: 640px) 22vw, 46vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-ink-surface/80 via-ink-surface/5 to-transparent"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 text-base font-semibold text-white">
                {option.display_name}
                {active ? (
                  <span className="grid size-6 place-items-center rounded-full bg-white text-indigo">
                    <IconCheck width={14} height={14} />
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function OptionGrid({
  options,
  selected,
  multiple = false,
  onSelect,
}: {
  options: TaxonomyItem[];
  selected: string[];
  multiple?: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <ul className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => {
        const active = selected.includes(option.code);
        return (
          <li key={option.id}>
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(option.code)}
              className={cn(
                "group flex min-h-24 w-full items-start justify-between gap-4 rounded-md border p-4 text-left transition-[border-color,background-color,transform,box-shadow]",
                active
                  ? "border-indigo bg-indigo-wash shadow-[0_0_0_1px_var(--color-indigo)]"
                  : "border-rule-2 bg-paper-raised hover:-translate-y-0.5 hover:border-indigo",
              )}
            >
              <span>
                <span className="block text-body font-semibold text-ink">
                  {option.display_name}
                </span>
                {option.description ? (
                  <span className="mt-1 line-clamp-2 block text-xs text-ink-3">
                    {option.description}
                  </span>
                ) : null}
              </span>
              <span
                aria-hidden
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border transition-colors",
                  active
                    ? "border-indigo bg-indigo text-white"
                    : "border-rule-2 bg-paper text-transparent",
                )}
              >
                <IconCheck width={13} height={13} />
              </span>
              <span className="sr-only">
                {multiple ? "Multiple selections allowed" : "Choose one"}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
