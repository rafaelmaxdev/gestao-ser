import assert from "node:assert/strict";
import test from "node:test";

import {
  ENROLL_ROLES,
  READ_ROLES,
  YEAR_CLASS_ROLES,
  hasUnitRole,
  isValidName,
  isValidRegistration,
  parseSchoolDate,
} from "../src/lib/school-rules.ts";

const memberships = [
  { unitId: "unit-a", role: "SECRETARIA" },
  { unitId: "unit-b", role: "ALUNO" },
];

test("isolates memberships by unit and rejects student and professor roles", () => {
  assert.equal(hasUnitRole(memberships, "unit-a", READ_ROLES), true);
  assert.equal(hasUnitRole(memberships, "unit-b", READ_ROLES), false);
  assert.equal(hasUnitRole(memberships, "unit-b", ENROLL_ROLES), false);
  assert.equal(hasUnitRole([{ unitId: "unit-a", role: "PROFESSOR" }], "unit-a", READ_ROLES), false);
});

test("applies the permissions for each school action", () => {
  assert.equal(YEAR_CLASS_ROLES.includes("ADMIN"), true);
  assert.equal(YEAR_CLASS_ROLES.includes("COORDENACAO"), true);
  assert.equal(YEAR_CLASS_ROLES.includes("SECRETARIA"), false);
  assert.equal(ENROLL_ROLES.includes("ADMIN"), true);
  assert.equal(ENROLL_ROLES.includes("SECRETARIA"), true);
  assert.equal(ENROLL_ROLES.includes("COORDENACAO"), false);
});

test("preserves registration numbers with leading zeroes", () => {
  assert.equal(isValidRegistration("000042"), true);
  assert.equal(isValidRegistration("A-0.42"), true);
  assert.equal(isValidRegistration(""), false);
  assert.equal(isValidRegistration("A_42"), false);
  assert.equal(isValidRegistration("1".repeat(33)), false);
});

test("parses only real UTC calendar dates", () => {
  assert.equal(parseSchoolDate("2024-02-29")?.toISOString(), "2024-02-29T00:00:00.000Z");
  assert.equal(parseSchoolDate("2023-02-29"), null);
  assert.equal(parseSchoolDate("2024-02-30"), null);
  assert.equal(parseSchoolDate("2024-13-01"), null);
  assert.equal(parseSchoolDate("2024-2-01"), null);
});

test("limits school names to two through 120 characters", () => {
  assert.equal(isValidName("A"), false);
  assert.equal(isValidName("AB"), true);
  assert.equal(isValidName("A".repeat(120)), true);
  assert.equal(isValidName("A".repeat(121)), false);
  assert.equal(isValidName("  "), false);
});
