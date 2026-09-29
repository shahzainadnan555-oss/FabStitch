"use client";

import { Dialog } from "@/components/ui/dialog";
import type { UserPublic } from "./api";
import { PhoneVerificationForm } from "./phone-verification-form";

export function PhoneVerificationModal({
  open,
  onClose,
  onVerified,
  initialPhone,
  preferredCountry,
  title = "Verify your phone number",
  description = "Confirm your phone number before continuing. Your inquiry details stay on this page.",
  dismissOnBackdrop = false,
}: {
  open: boolean;
  onClose: () => void;
  onVerified: (user: UserPublic) => void;
  initialPhone?: string | null;
  preferredCountry?: string | null;
  title?: string;
  description?: string;
  dismissOnBackdrop?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      label={title}
      dismissOnBackdrop={dismissOnBackdrop}
      className="w-[min(32rem,calc(100vw-1.5rem))] max-h-[min(90dvh,40rem)] overflow-y-auto rounded-md border border-rule-2 bg-paper p-5 sm:p-6"
    >
      <PhoneVerificationForm
        initialPhone={initialPhone}
        preferredCountry={preferredCountry}
        title={title}
        description={description}
        onVerified={(user) => {
          onVerified(user);
          onClose();
        }}
      />
    </Dialog>
  );
}
