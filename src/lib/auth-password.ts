export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const PASSWORD_REQUIREMENTS = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "At least 1 uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "At least 1 lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "At least 1 number",
    test: (password: string) => /\d/.test(password),
  },
  {
    id: "special",
    label: "At least 1 special character",
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
] as const;

export function isStrongPassword(password: string) {
  return PASSWORD_PATTERN.test(password);
}
