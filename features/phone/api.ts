import { api } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

export type UserPublic = components["schemas"]["UserPublic"];

export type PhoneSendOtpRequest = {
  phone: string;
};

export type PhoneVerifyOtpRequest = {
  phone: string;
  code: string;
};

export type PhoneSendOtpResponse = {
  ok: boolean;
  verification_required: boolean;
  already_verified: boolean;
  phone: string;
  channel: string;
  message: string;
};

export type PhoneVerifyOtpResponse = {
  ok: boolean;
  phone: string;
  phone_verified: boolean;
  user: UserPublic;
};

export function isPhoneVerified(
  user: Pick<UserPublic, "phone" | "phone_verified"> | null | undefined,
): boolean {
  return Boolean(user?.phone && user.phone_verified === true);
}

export async function sendPhoneOtp(
  phone: string,
): Promise<PhoneSendOtpResponse> {
  return api.post<PhoneSendOtpResponse, PhoneSendOtpRequest>(
    "/auth/phone/send-otp",
    { body: { phone } },
  );
}

export async function verifyPhoneOtp(
  phone: string,
  code: string,
): Promise<PhoneVerifyOtpResponse> {
  return api.post<PhoneVerifyOtpResponse, PhoneVerifyOtpRequest>(
    "/auth/phone/verify-otp",
    { body: { phone, code } },
  );
}
