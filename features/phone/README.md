# Phone verification (dormant)

This module implements FabStitch phone OTP UI against:

- `POST /api/v1/auth/phone/send-otp`
- `POST /api/v1/auth/phone/verify-otp`

It is **intentionally disconnected** from Account and Inquiry flows for a
temporary frontend-only review period.

Do not import these components into active user journeys until phone
verification is re-enabled. The backend Twilio Verify integration remains
unchanged and ready for re-integration.
