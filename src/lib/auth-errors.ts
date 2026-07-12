import "server-only";

type AuthErrorLike = {
  code?: string;
  message: string;
  status?: number;
};

export function friendlyAuthError(error: AuthErrorLike) {
  const code = error.code?.toLowerCase() ?? "";
  const message = error.message.toLowerCase();

  if (code === "invalid_credentials" || message.includes("invalid login")) {
    return "Email or password is incorrect.";
  }
  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Confirm your email address before logging in.";
  }
  if (code === "user_already_exists" || message.includes("already registered")) {
    return "An account already exists for this email.";
  }
  if (code === "weak_password" || message.includes("password should")) {
    return "Choose a stronger password that meets every requirement.";
  }
  if (code.includes("rate_limit") || message.includes("rate limit")) {
    return "Too many attempts. Wait a moment, then try again.";
  }
  if (code === "signup_disabled" || message.includes("signups not allowed")) {
    return "New account creation is temporarily unavailable.";
  }

  return "We could not complete that request. Please try again.";
}

export function logAuthError(operation: string, error: AuthErrorLike) {
  console.error("[Webbly Auth]", {
    operation,
    code: error.code ?? "AUTH_REQUEST_FAILED",
    status: error.status,
  });
}
