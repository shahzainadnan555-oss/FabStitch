import Link from "next/link";
import { IconCheck } from "@/components/ui/icon";
import type { components } from "@/lib/api/schema";

type OnboardingState = components["schemas"]["OnboardingStateResponse"];

export function SavedPreferences({
  preferences,
}: {
  preferences: OnboardingState;
}) {
  const groups = [
    {
      label: "Your business",
      values: preferences.customer_type
        ? [preferences.customer_type.display_name]
        : [],
    },
    {
      label: "What you do",
      values: preferences.work_area ? [preferences.work_area.display_name] : [],
    },
    {
      label: "Fabric interests",
      values: (preferences.fabric_interests ?? []).map(
        (item) => item.display_name,
      ),
    },
    {
      label: "Sourcing use cases",
      values: (preferences.use_cases ?? []).map((item) => item.display_name),
    },
    {
      label: "Typical quantity",
      values: preferences.quantity_preference
        ? [preferences.quantity_preference.display_name]
        : [],
    },
  ];

  return (
    <section
      aria-labelledby="saved-preferences-heading"
      className="overflow-hidden rounded-md border border-rule-2 bg-rule"
    >
      <header className="grid gap-6 bg-paper-raised p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="font-mono text-label text-gold-ink uppercase">
            Preferences
          </p>
          <h2
            id="saved-preferences-heading"
            className="mt-2 text-h2 font-semibold text-ink"
          >
            Your sourcing preferences
          </h2>
          <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-3">
            Your sourcing preferences are saved to your account. You can review
            or update them whenever your needs change.
          </p>
        </div>
        <Link
          href="/account/preferences/?edit=1"
          prefetch={false}
          className="inline-flex h-11 w-fit items-center justify-center rounded-sm border border-indigo bg-indigo px-5 text-sm font-semibold text-white transition-colors hover:border-indigo-hover hover:bg-indigo-hover"
        >
          Edit preferences
        </Link>
      </header>

      <div className="grid gap-px sm:grid-cols-2">
        {groups.map((group) => (
          <section key={group.label} className="bg-paper-raised p-5 sm:p-6">
            <h3 className="font-mono text-label text-ink-4 uppercase">
              {group.label}
            </h3>
            {group.values.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.values.map((value) => (
                  <li
                    key={value}
                    className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-indigo/35 bg-indigo-wash px-3.5 py-2 text-sm font-medium text-ink"
                  >
                    <span
                      aria-hidden
                      className="grid size-5 shrink-0 place-items-center rounded-full bg-indigo text-white"
                    >
                      <IconCheck width={12} height={12} />
                    </span>
                    {value}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-ink-3">No selection saved.</p>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}
