"use client";

export function PhoneVerificationStatus({
  phone,
  verified,
  masked,
}: {
  phone?: string | null;
  verified: boolean;
  masked?: string;
}) {
  if (!phone) {
    return (
      <p className="text-sm text-ink-3" role="status">
        No phone number on file.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm" role="status">
      <span className="font-medium text-ink">{masked ?? phone}</span>
      {verified ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-verified/35 bg-verified-soft px-2 py-0.5 text-xs font-semibold text-ink">
          <span aria-hidden>✓</span> Verified
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full border border-border bg-paper-sunk px-2 py-0.5 text-xs font-semibold text-ink-3">
          Not verified
        </span>
      )}
    </div>
  );
}
