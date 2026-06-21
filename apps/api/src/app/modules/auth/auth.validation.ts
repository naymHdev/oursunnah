import { registerSchema, loginSchema, socialLoginSchema } from "@our-sunnah/validation";

// Schemas live in the shared @our-sunnah/validation package so the
// frontend (forms) and backend validate against the exact same rules.
// This file just exposes them under the module's conventional naming.
export const AuthValidation = {
  createAccountSchema: registerSchema,
  loginSchema,
  socialLoginSchema,
};
