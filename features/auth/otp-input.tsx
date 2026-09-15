"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";

const LENGTH = 6;

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, LENGTH);
}

export function OtpInput({
  value,
  onChange,
  disabled = false,
  invalid = false,
  autoFocus = true,
  onComplete,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  onComplete?: (code: string) => void;
}) {
  const labelId = useId();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from(
    { length: LENGTH },
    (_, index) => value[index] ?? "",
  );

  useEffect(() => {
    if (!autoFocus || disabled) return;
    const filled = onlyDigits(value);
    const index = filled.length >= LENGTH ? LENGTH - 1 : filled.length;
    inputsRef.current[index]?.focus();
  }, [autoFocus, disabled, value]);

  const publish = useCallback(
    (nextDigits: string[]) => {
      const code = nextDigits.join("");
      onChange(code);
      if (code.length === LENGTH) onComplete?.(code);
    },
    [onChange, onComplete],
  );

  const focusAt = (index: number) => {
    const clamped = Math.max(0, Math.min(LENGTH - 1, index));
    inputsRef.current[clamped]?.focus();
    inputsRef.current[clamped]?.select();
  };

  const handleChange = (index: number, raw: string) => {
    if (disabled) return;
    const cleaned = onlyDigits(raw);
    if (!cleaned) {
      const next = [...digits];
      next[index] = "";
      publish(next);
      return;
    }

    if (cleaned.length > 1) {
      const next = [...digits];
      cleaned.split("").forEach((digit, offset) => {
        if (index + offset < LENGTH) next[index + offset] = digit;
      });
      publish(next);
      focusAt(Math.min(LENGTH - 1, index + cleaned.length));
      return;
    }

    const next = [...digits];
    next[index] = cleaned;
    publish(next);
    if (index < LENGTH - 1) focusAt(index + 1);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (disabled) return;
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = "";
        publish(next);
        return;
      }
      if (index > 0) {
        next[index - 1] = "";
        publish(next);
        focusAt(index - 1);
      }
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const pasted = onlyDigits(event.clipboardData.getData("text"));
    if (!pasted) return;
    event.preventDefault();
    const next = Array.from(
      { length: LENGTH },
      (_, index) => pasted[index] ?? "",
    );
    publish(next);
    focusAt(Math.min(LENGTH - 1, pasted.length));
  };

  return (
    <div className="flex flex-col gap-2">
      <p id={labelId} className="text-sm font-medium text-ink-2">
        Verification code
      </p>
      <div
        role="group"
        aria-labelledby={labelId}
        className="flex flex-wrap justify-between gap-2 sm:gap-2.5"
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              inputsRef.current[index] = node;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${LENGTH}`}
            aria-invalid={invalid || undefined}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={(event) => event.currentTarget.select()}
            className={cn(
              "h-12 w-[2.65rem] rounded-md border bg-paper text-center font-mono text-xl font-semibold text-ink tabular-nums transition-[border-color,box-shadow] duration-150 sm:h-14 sm:w-12",
              "hover:border-ink-3 focus:border-indigo focus:outline-none focus:shadow-[0_0_0_3px_rgba(67,56,202,0.16)]",
              "disabled:cursor-not-allowed disabled:opacity-60",
              invalid ? "border-alert" : "border-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}
