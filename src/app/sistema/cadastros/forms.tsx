"use client";

import { useActionState } from "react";
import {
  createAcademicYear,
  createClassGroup,
  enrollStudent,
} from "./actions";
import type { ActionState } from "@/lib/school-rules";

export type AcademicYearOption = {
  id: string;
  name: string;
};

export type ClassGroupOption = {
  id: string;
  name: string;
  academicYear: AcademicYearOption;
};

type SchoolFormsProps = {
  unitId: string;
  academicYears: AcademicYearOption[];
  classGroups: ClassGroupOption[];
  canManageYearsClasses: boolean;
  canEnroll: boolean;
};

const initialState: ActionState = { status: "idle", message: "" };
const controlClassName = "demo-control mt-2";
const buttonClassName =
  "demo-button inline-flex items-center justify-center bg-brand text-white hover:bg-ink";

function Feedback({ state }: { state: ActionState }) {
  return (
    <p
      aria-live="polite"
      className={`mt-4 text-sm font-semibold ${
        state.status === "error" ? "text-danger" : "text-success"
      }`}
      role={state.status === "error" ? "alert" : "status"}
    >
      {state.message}
    </p>
  );
}

function AcademicYearForm({ unitId }: { unitId: string }) {
  const [state, formAction, pending] = useActionState(
    createAcademicYear,
    initialState,
  );

  return (
    <article className="demo-card">
      <h3 className="text-lg font-semibold">Novo ano letivo</h3>
      <p className="mt-1 text-sm text-muted">
        Informe o nome e o período do ano escolar.
      </p>
      <form
        action={formAction}
        className="mt-5 space-y-4"
        aria-busy={pending}
      >
        <input type="hidden" name="unitId" value={unitId} />
        <div>
          <label htmlFor="academic-year-name" className="text-sm font-semibold">
            Nome
          </label>
          <input
            id="academic-year-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={120}
            autoComplete="off"
            className={controlClassName}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="academic-year-start" className="text-sm font-semibold">
              Data inicial
            </label>
            <input
              id="academic-year-start"
              name="startDate"
              type="date"
              required
              className={controlClassName}
            />
          </div>
          <div>
            <label htmlFor="academic-year-end" className="text-sm font-semibold">
              Data final
            </label>
            <input
              id="academic-year-end"
              name="endDate"
              type="date"
              required
              className={controlClassName}
            />
          </div>
        </div>
        <button type="submit" disabled={pending} className={buttonClassName}>
          {pending ? "Salvando..." : "Criar ano letivo"}
        </button>
        <Feedback state={state} />
      </form>
    </article>
  );
}

function ClassGroupForm({
  unitId,
  academicYears,
}: {
  unitId: string;
  academicYears: AcademicYearOption[];
}) {
  const [state, formAction, pending] = useActionState(
    createClassGroup,
    initialState,
  );
  const hasAcademicYears = academicYears.length > 0;

  return (
    <article className="demo-card">
      <h3 className="text-lg font-semibold">Nova turma</h3>
      <p className="mt-1 text-sm text-muted">
        Vincule a turma a um ano letivo existente.
      </p>
      {!hasAcademicYears ? (
        <p className="mt-4 text-sm text-muted">
          Crie um ano letivo antes de criar uma turma.
        </p>
      ) : null}
      <form
        action={formAction}
        className="mt-5 space-y-4"
        aria-busy={pending}
      >
        <input type="hidden" name="unitId" value={unitId} />
        <div>
          <label htmlFor="class-academic-year" className="text-sm font-semibold">
            Ano letivo
          </label>
          <select
            id="class-academic-year"
            name="academicYearId"
            required
            disabled={!hasAcademicYears || pending}
            className={controlClassName}
          >
            {academicYears.map((academicYear) => (
              <option key={academicYear.id} value={academicYear.id}>
                {academicYear.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="class-name" className="text-sm font-semibold">
            Nome da turma
          </label>
          <input
            id="class-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={120}
            autoComplete="off"
            className={controlClassName}
          />
        </div>
        <button
          type="submit"
          disabled={!hasAcademicYears || pending}
          className={buttonClassName}
        >
          {pending ? "Salvando..." : "Criar turma"}
        </button>
        <Feedback state={state} />
      </form>
    </article>
  );
}

function EnrollmentForm({
  unitId,
  classGroups,
}: {
  unitId: string;
  classGroups: ClassGroupOption[];
}) {
  const [state, formAction, pending] = useActionState(
    enrollStudent,
    initialState,
  );
  const hasClassGroups = classGroups.length > 0;

  return (
    <article className="demo-card">
      <h3 className="text-lg font-semibold">Matricular aluno</h3>
      <p className="mt-1 text-sm text-muted">
        Cadastre o aluno e vincule a matrícula a uma turma.
      </p>
      {!hasClassGroups ? (
        <p className="mt-4 text-sm text-muted">
          Crie um ano letivo e uma turma antes de matricular um aluno.
        </p>
      ) : null}
      <form
        action={formAction}
        className="mt-5 space-y-4"
        aria-busy={pending}
      >
        <input type="hidden" name="unitId" value={unitId} />
        <div>
          <label htmlFor="student-name" className="text-sm font-semibold">
            Nome
          </label>
          <input
            id="student-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            className={controlClassName}
          />
        </div>
        <div>
          <label htmlFor="student-registration" className="text-sm font-semibold">
            Matrícula
          </label>
          <input
            id="student-registration"
            name="registrationNumber"
            type="text"
            required
            minLength={1}
            maxLength={32}
            pattern={"[A-Za-z0-9.\\-]+"}
            autoComplete="off"
            className={controlClassName}
          />
        </div>
        <div>
          <label htmlFor="student-class" className="text-sm font-semibold">
            Turma e ano letivo
          </label>
          <select
            id="student-class"
            name="classGroupId"
            required
            disabled={!hasClassGroups || pending}
            className={controlClassName}
          >
            {classGroups.map((classGroup) => (
              <option key={classGroup.id} value={classGroup.id}>
                {classGroup.name} — {classGroup.academicYear.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={!hasClassGroups || pending}
          className={buttonClassName}
        >
          {pending ? "Salvando..." : "Matricular aluno"}
        </button>
        <Feedback state={state} />
      </form>
    </article>
  );
}

export function SchoolForms({
  unitId,
  academicYears,
  classGroups,
  canManageYearsClasses,
  canEnroll,
}: SchoolFormsProps) {
  if (!canManageYearsClasses && !canEnroll) {
    return (
      <section className="demo-card" aria-labelledby="read-only-title">
        <h2 id="read-only-title" className="text-lg font-semibold">
          Acesso somente para consulta
        </h2>
        <p className="mt-2 text-sm text-muted">
          Seu perfil pode consultar os cadastros, mas não pode criar registros.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="forms-title">
      <div>
        <p className="text-sm font-semibold text-muted">Operações</p>
        <h2 id="forms-title" className="mt-1 text-xl font-semibold">
          Novos cadastros
        </h2>
        <p className="mt-2 text-sm text-muted">
          Fluxo recomendado: ano letivo → turma → aluno.
        </p>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {canManageYearsClasses ? (
          <AcademicYearForm unitId={unitId} />
        ) : null}
        {canManageYearsClasses ? (
          <ClassGroupForm unitId={unitId} academicYears={academicYears} />
        ) : null}
        {canEnroll ? (
          <EnrollmentForm unitId={unitId} classGroups={classGroups} />
        ) : null}
      </div>
    </section>
  );
}
