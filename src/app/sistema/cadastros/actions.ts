"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { getSchoolAccess } from "@/lib/access";
import { getPrisma } from "@/lib/db";
import {
  ENROLL_ROLES,
  hasUnitRole,
  isValidName,
  isValidRegistration,
  parseSchoolDate,
  type ActionState,
  YEAR_CLASS_ROLES,
} from "@/lib/school-rules";

const UNAUTHORIZED_MESSAGE = "Acesso não autorizado.";
const INVALID_ID_MESSAGE = "Identificador inválido.";
const INVALID_NAME_MESSAGE = "Nome inválido. Use entre 2 e 120 caracteres.";
const INVALID_DATE_MESSAGE = "Data inválida. Use o formato AAAA-MM-DD.";
const INVALID_REGISTRATION_MESSAGE = "Número de matrícula inválido.";
const DUPLICATE_MESSAGE = "Já existe um cadastro com esses dados.";
const RETRY_MESSAGE = "A operação precisa ser repetida. Tente novamente.";
const DATABASE_MESSAGE = "Não foi possível concluir o cadastro. Tente novamente.";

class ActionFailure extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionFailure";
  }
}

function errorState(message: string): ActionState {
  return { status: "error", message };
}

function successState(message: string): ActionState {
  return { status: "success", message };
}

function formString(formData: FormData, field: string): string | null {
  const value = formData.get(field);
  return typeof value === "string" ? value : null;
}

function formId(formData: FormData, field: string): string | null {
  const value = formString(formData, field);

  if (value === null || value.length === 0 || value.length > 64 || value.trim() !== value) {
    return null;
  }

  return value;
}

function formName(formData: FormData, field: string): string | null {
  const value = formString(formData, field)?.trim();

  return value && isValidName(value) ? value : null;
}

function formRegistration(formData: FormData, field: string): string | null {
  const value = formString(formData, field);

  return value && isValidRegistration(value) ? value : null;
}

function databaseErrorCode(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return null;
  }

  const code = error.code;
  return typeof code === "string" ? code : null;
}

function databaseErrorState(error: unknown): ActionState {
  if (error instanceof ActionFailure) {
    return errorState(error.message);
  }

  switch (databaseErrorCode(error)) {
    case "P2002":
      return errorState(DUPLICATE_MESSAGE);
    case "P2034":
      return errorState(RETRY_MESSAGE);
    default:
      return errorState(DATABASE_MESSAGE);
  }
}

export async function createAcademicYear(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const access = await getSchoolAccess();
  void previousState;

  if (access.status !== "authorized") {
    return errorState(UNAUTHORIZED_MESSAGE);
  }

  const unitId = formId(formData, "unitId");
  const name = formName(formData, "name");
  const startDateValue = formString(formData, "startDate");
  const endDateValue = formString(formData, "endDate");

  if (!unitId) {
    return errorState(INVALID_ID_MESSAGE);
  }

  if (!hasUnitRole(access.memberships, unitId, YEAR_CLASS_ROLES)) {
    return errorState(UNAUTHORIZED_MESSAGE);
  }

  if (!name) {
    return errorState(INVALID_NAME_MESSAGE);
  }

  const startDate = startDateValue ? parseSchoolDate(startDateValue) : null;
  const endDate = endDateValue ? parseSchoolDate(endDateValue) : null;

  if (!startDate || !endDate) {
    return errorState(INVALID_DATE_MESSAGE);
  }

  if (startDate.getTime() > endDate.getTime()) {
    return errorState("A data inicial deve ser anterior ou igual à data final.");
  }

  try {
    await getPrisma().$transaction(
      async (tx) => {
        const membership = await tx.membership.findFirst({
          where: {
            userId: access.user.id,
            unitId,
            role: { in: [...YEAR_CLASS_ROLES] },
          },
          select: { id: true },
        });

        if (!membership) {
          throw new ActionFailure(UNAUTHORIZED_MESSAGE);
        }

        const academicYear = await tx.academicYear.create({
          data: { unitId, name, startDate, endDate },
        });

        await tx.auditLog.create({
          data: {
            actorId: access.user.id,
            unitId,
            action: "CREATE",
            entity: "AcademicYear",
            entityId: academicYear.id,
            details: {},
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error: unknown) {
    return databaseErrorState(error);
  }

  revalidatePath("/sistema/cadastros");
  revalidatePath("/sistema");
  return successState("Ano letivo criado.");
}

export async function createClassGroup(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const access = await getSchoolAccess();
  void previousState;

  if (access.status !== "authorized") {
    return errorState(UNAUTHORIZED_MESSAGE);
  }

  const unitId = formId(formData, "unitId");
  const academicYearId = formId(formData, "academicYearId");
  const name = formName(formData, "name");

  if (!unitId || !academicYearId) {
    return errorState(INVALID_ID_MESSAGE);
  }

  if (!hasUnitRole(access.memberships, unitId, YEAR_CLASS_ROLES)) {
    return errorState(UNAUTHORIZED_MESSAGE);
  }

  if (!name) {
    return errorState(INVALID_NAME_MESSAGE);
  }

  try {
    await getPrisma().$transaction(
      async (tx) => {
        const membership = await tx.membership.findFirst({
          where: {
            userId: access.user.id,
            unitId,
            role: { in: [...YEAR_CLASS_ROLES] },
          },
          select: { id: true },
        });

        if (!membership) {
          throw new ActionFailure(UNAUTHORIZED_MESSAGE);
        }

        const academicYear = await tx.academicYear.findFirst({
          where: { id: academicYearId, unitId },
          select: { id: true },
        });

        if (!academicYear) {
          throw new ActionFailure("Ano letivo não encontrado.");
        }

        const classGroup = await tx.classGroup.create({
          data: { unitId, academicYearId: academicYear.id, name },
        });

        await tx.auditLog.create({
          data: {
            actorId: access.user.id,
            unitId,
            action: "CREATE",
            entity: "ClassGroup",
            entityId: classGroup.id,
            details: {},
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error: unknown) {
    return databaseErrorState(error);
  }

  revalidatePath("/sistema/cadastros");
  revalidatePath("/sistema");
  return successState("Turma criada.");
}

export async function enrollStudent(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const access = await getSchoolAccess();
  void previousState;

  if (access.status !== "authorized") {
    return errorState(UNAUTHORIZED_MESSAGE);
  }

  const unitId = formId(formData, "unitId");
  const classGroupId = formId(formData, "classGroupId");
  const name = formName(formData, "name");
  const registrationNumber = formRegistration(formData, "registrationNumber");

  if (!unitId || !classGroupId) {
    return errorState(INVALID_ID_MESSAGE);
  }

  if (!hasUnitRole(access.memberships, unitId, ENROLL_ROLES)) {
    return errorState(UNAUTHORIZED_MESSAGE);
  }

  if (!name) {
    return errorState(INVALID_NAME_MESSAGE);
  }

  if (!registrationNumber) {
    return errorState(INVALID_REGISTRATION_MESSAGE);
  }

  try {
    await getPrisma().$transaction(
      async (tx) => {
        const membership = await tx.membership.findFirst({
          where: {
            userId: access.user.id,
            unitId,
            role: { in: [...ENROLL_ROLES] },
          },
          select: { id: true },
        });

        if (!membership) {
          throw new ActionFailure(UNAUTHORIZED_MESSAGE);
        }

        const classGroup = await tx.classGroup.findFirst({
          where: { id: classGroupId, unitId },
          select: {
            id: true,
            unitId: true,
            academicYearId: true,
            academicYear: {
              select: { id: true, unitId: true },
            },
          },
        });

        if (
          !classGroup ||
          classGroup.unitId !== unitId ||
          classGroup.academicYear.unitId !== unitId ||
          classGroup.academicYear.id !== classGroup.academicYearId
        ) {
          throw new ActionFailure("Turma não encontrada.");
        }

        const existingStudent = await tx.student.findUnique({
          where: {
            unitId_registrationNumber: { unitId, registrationNumber },
          },
          select: { id: true, name: true },
        });

        let studentId: string;
        let createdStudent = false;

        if (existingStudent) {
          if (existingStudent.name !== name) {
            throw new ActionFailure(
              "O número de matrícula já pertence a outro aluno.",
            );
          }
          studentId = existingStudent.id;
        } else {
          const student = await tx.student.create({
            data: { unitId, name, registrationNumber },
            select: { id: true },
          });
          studentId = student.id;
          createdStudent = true;
        }

        if (createdStudent) {
          await tx.auditLog.create({
            data: {
              actorId: access.user.id,
              unitId,
              action: "CREATE",
              entity: "Student",
              entityId: studentId,
              details: {},
            },
          });
        }

        const enrollment = await tx.enrollment.create({
          data: {
            studentId,
            academicYearId: classGroup.academicYearId,
            classGroupId: classGroup.id,
          },
          select: { id: true },
        });

        await tx.auditLog.create({
          data: {
            actorId: access.user.id,
            unitId,
            action: "CREATE",
            entity: "Enrollment",
            entityId: enrollment.id,
            details: {},
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error: unknown) {
    return databaseErrorState(error);
  }

  revalidatePath("/sistema/cadastros");
  revalidatePath("/sistema");
  return successState("Matrícula realizada.");
}
