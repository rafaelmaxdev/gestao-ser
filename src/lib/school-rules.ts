export const READ_ROLES = [
  "ADMIN",
  "DIRECAO",
  "COORDENACAO",
  "SECRETARIA",
] as const;

export const YEAR_CLASS_ROLES = ["ADMIN", "COORDENACAO"] as const;

export const ENROLL_ROLES = ["ADMIN", "SECRETARIA"] as const;

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export function hasUnitRole(
  memberships: { unitId: string; role: string }[],
  unitId: string,
  allowed: readonly string[],
): boolean {
  return memberships.some(
    (membership) => membership.unitId === unitId && allowed.includes(membership.role),
  );
}

export function parseSchoolDate(value: string): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const date = new Date(0);

  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

export function isValidName(value: unknown): value is string {
  return typeof value === "string" && value.trim().length >= 2 && value.trim().length <= 120;
}

export function isValidRegistration(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9.-]{1,32}$/.test(value);
}
