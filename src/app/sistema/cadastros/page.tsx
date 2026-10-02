import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import type { Prisma } from "@/generated/prisma/client";
import { getSchoolAccess } from "@/lib/access";
import { getPrisma } from "@/lib/db";
import {
  ENROLL_ROLES,
  hasUnitRole,
  READ_ROLES,
  YEAR_CLASS_ROLES,
} from "@/lib/school-rules";
import {
  SchoolForms,
  type AcademicYearOption,
  type ClassGroupOption,
} from "./forms";

const PAGE_SIZE = 25;
const MAX_PAGE = 100_000;

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

function firstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | undefined) {
  if (!value || !/^\d+$/.test(value)) {
    return 1;
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed)) {
    return parsed === Number.POSITIVE_INFINITY ? MAX_PAGE : 1;
  }

  return Math.min(Math.max(parsed, 1), MAX_PAGE);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
}

function PageHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex min-h-20 w-full max-w-[1180px] items-center justify-between gap-4 px-3 sm:px-6">
        <Link href="/sistema" aria-label="Voltar para o sistema escolar">
          <Image
            src="/radar-logo.png"
            alt="Sistema Educacional Radar"
            width={200}
            height={82}
            priority
            className="h-auto w-44"
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/sistema"
            className="text-sm font-semibold text-brand hover:text-ink"
          >
            Voltar para o sistema
          </Link>
          <UserButton />
        </div>
      </div>
    </header>
  );
}

function StatePage({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <PageHeader />
      <main className="mx-auto w-full max-w-[1180px] px-3 py-12 sm:px-6">
        <section className="demo-card max-w-2xl">
          <h1 className="text-[28px] font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm text-muted">{message}</p>
          <Link
            href="/sistema"
            className="demo-button mt-6 inline-flex items-center justify-center bg-brand text-white hover:bg-ink"
          >
            Voltar para o sistema
          </Link>
        </section>
      </main>
    </div>
  );
}

export default async function CadastrosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const access = await getSchoolAccess();

  if (access.status !== "authorized") {
    return (
      <StatePage
        title="Cadastros escolares"
        message="Não foi possível autorizar o acesso aos cadastros escolares."
      />
    );
  }

  const params = await searchParams;
  const requestedUnitId = firstSearchParam(params.unitId);
  const query = (firstSearchParam(params.q) ?? "").trim().slice(0, 100);
  const page = parsePage(firstSearchParam(params.page));
  const readableUnits = [
    ...new Map(
      access.memberships
        .filter((membership) =>
          hasUnitRole(access.memberships, membership.unitId, READ_ROLES),
        )
        .map((membership) => [
          membership.unit.id,
          { id: membership.unit.id, name: membership.unit.name },
        ] as const),
    ).values(),
  ];
  const selectedUnit =
    requestedUnitId === undefined
      ? readableUnits[0]
      : readableUnits.find((unit) => unit.id === requestedUnitId);

  if (!selectedUnit) {
    return (
      <StatePage
        title="Acesso não autorizado"
        message="Sua conta não possui acesso de leitura a esta unidade escolar."
      />
    );
  }

  const unitId = selectedUnit.id;
  const studentWhere: Prisma.StudentWhereInput = {
    unitId,
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            {
              registrationNumber: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  let academicYears: Array<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
  }>;
  let classGroups: Array<{
    id: string;
    name: string;
    academicYear: { id: string; name: string };
  }>;
  let students: Array<{
    id: string;
    name: string;
    registrationNumber: string;
    enrollments: Array<{
      academicYear: { id: string; name: string };
      classGroup: { id: string; name: string };
    }>;
  }>;
  let studentCount: number;
  let classCount: number;
  let academicYearCount: number;
  let matchingStudentCount: number;

  try {
    const prisma = getPrisma();
    const allStudentCount = prisma.student.count({
      where: { unitId },
    });
    const filteredStudentCount = query
      ? prisma.student.count({ where: studentWhere })
      : allStudentCount;

    [
      academicYears,
      classGroups,
      students,
      studentCount,
      classCount,
      academicYearCount,
      matchingStudentCount,
    ] = await Promise.all([
      prisma.academicYear.findMany({
        where: { unitId },
        orderBy: [{ startDate: "desc" }, { name: "asc" }],
        take: 100,
        select: { id: true, name: true, startDate: true, endDate: true },
      }),
      prisma.classGroup.findMany({
        where: { unitId },
        orderBy: [{ name: "asc" }, { academicYearId: "asc" }],
        take: 100,
        select: {
          id: true,
          name: true,
          academicYear: { select: { id: true, name: true } },
        },
      }),
      prisma.student.findMany({
        where: studentWhere,
        orderBy: [{ name: "asc" }, { registrationNumber: "asc" }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          name: true,
          registrationNumber: true,
          enrollments: {
            take: 1,
            orderBy: { enrolledAt: "desc" },
            where: {
              academicYear: { unitId },
              classGroup: { unitId },
            },
            select: {
              academicYear: { select: { id: true, name: true } },
              classGroup: { select: { id: true, name: true } },
            },
          },
        },
      }),
      allStudentCount,
      prisma.classGroup.count({ where: { unitId } }),
      prisma.academicYear.count({ where: { unitId } }),
      filteredStudentCount,
    ]);
  } catch {
    return (
      <StatePage
        title="Cadastros indisponíveis"
        message="Não foi possível consultar os cadastros agora. Tente novamente mais tarde."
      />
    );
  }

  const formAcademicYears: AcademicYearOption[] = academicYears.map(
    ({ id, name }) => ({ id, name }),
  );
  const formClassGroups: ClassGroupOption[] = classGroups.map(
    ({ id, name, academicYear }) => ({ id, name, academicYear }),
  );
  const totalPages = Math.max(1, Math.ceil(matchingStudentCount / PAGE_SIZE));
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;
  const canManageYearsClasses = hasUnitRole(
    access.memberships,
    unitId,
    YEAR_CLASS_ROLES,
  );
  const canEnroll = hasUnitRole(
    access.memberships,
    unitId,
    ENROLL_ROLES,
  );

  function pageHref(targetPage: number, includeQuery = true) {
    const nextParams = new URLSearchParams({
      unitId,
      page: String(targetPage),
    });

    if (includeQuery && query) {
      nextParams.set("q", query);
    }

    return `/sistema/cadastros?${nextParams.toString()}`;
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <PageHeader />
      <main className="mx-auto w-full max-w-[1180px] px-3 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-red">
              Gestão escolar
            </p>
            <h1 className="mt-2 text-[28px] font-semibold tracking-tight">
              Cadastros escolares
            </h1>
            <p className="mt-2 text-sm text-muted">
              Unidade: <span className="font-semibold text-ink">{selectedUnit.name}</span>
            </p>
          </div>
          {readableUnits.length > 1 ? (
            <form method="get" className="flex items-end gap-3">
              <div>
                <label htmlFor="unit-selector" className="text-sm font-semibold">
                  Unidade
                </label>
                <select
                  id="unit-selector"
                  name="unitId"
                  defaultValue={unitId}
                  className="demo-control mt-2 min-w-52"
                >
                  {readableUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
              {query ? <input type="hidden" name="q" value={query} /> : null}
              <button
                type="submit"
                className="demo-button bg-brand text-white hover:bg-ink"
              >
                Trocar unidade
              </button>
            </form>
          ) : null}
        </div>

        <section className="mt-6" aria-labelledby="indicators-title">
          <h2 id="indicators-title" className="text-xl font-semibold">
            Resumo
          </h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <article className="demo-card">
              <p className="text-sm font-semibold text-muted">Alunos</p>
              <p className="mt-2 text-[32px] font-semibold leading-none tabular-nums text-brand">
                {studentCount}
              </p>
            </article>
            <article className="demo-card">
              <p className="text-sm font-semibold text-muted">Turmas</p>
              <p className="mt-2 text-[32px] font-semibold leading-none tabular-nums text-brand">
                {classCount}
              </p>
            </article>
            <article className="demo-card">
              <p className="text-sm font-semibold text-muted">Anos letivos</p>
              <p className="mt-2 text-[32px] font-semibold leading-none tabular-nums text-brand">
                {academicYearCount}
              </p>
            </article>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2" aria-label="Cadastros existentes">
          <article className="demo-card">
            <h2 className="text-lg font-semibold">Anos letivos existentes</h2>
            {academicYears.length > 0 ? (
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {academicYears.map((academicYear) => (
                  <li
                    key={academicYear.id}
                    className="flex flex-wrap items-baseline justify-between gap-3 py-3"
                  >
                    <span className="font-semibold">{academicYear.name}</span>
                    <span className="text-sm text-muted">
                      {formatDate(academicYear.startDate)} — {formatDate(academicYear.endDate)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">Nenhum ano letivo cadastrado.</p>
            )}
          </article>
          <article className="demo-card">
            <h2 className="text-lg font-semibold">Turmas existentes</h2>
            {classGroups.length > 0 ? (
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {classGroups.map((classGroup) => (
                  <li
                    key={classGroup.id}
                    className="flex flex-wrap items-baseline justify-between gap-3 py-3"
                  >
                    <span className="font-semibold">{classGroup.name}</span>
                    <span className="text-sm text-muted">{classGroup.academicYear.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">Nenhuma turma cadastrada.</p>
            )}
          </article>
        </section>

        <section className="demo-card mt-6" aria-labelledby="students-title">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 id="students-title" className="text-lg font-semibold">
                Alunos
              </h2>
              <p className="mt-1 text-sm text-muted">
                Consulte por nome ou matrícula.
              </p>
            </div>
            <span className="w-fit rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand" aria-live="polite">
              {matchingStudentCount} {matchingStudentCount === 1 ? "resultado" : "resultados"}
            </span>
          </div>

          <form method="get" className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label htmlFor="student-search" className="text-sm font-semibold">
                Buscar por nome ou matrícula
              </label>
              <input
                id="student-search"
                name="q"
                type="search"
                defaultValue={query}
                maxLength={100}
                placeholder="Nome ou matrícula"
                className={"demo-control mt-2"}
              />
            </div>
            <input type="hidden" name="unitId" value={unitId} />
            <button
              type="submit"
              className="demo-button bg-brand text-white hover:bg-ink"
            >
              Buscar
            </button>
            {query ? (
              <Link
                href={pageHref(1, false)}
                className="demo-button inline-flex items-center justify-center border border-line bg-surface text-brand hover:bg-canvas"
              >
                Limpar
              </Link>
            ) : null}
          </form>

          <div className="mt-6 overflow-hidden rounded-lg border border-line">
            <div className="overflow-x-auto">
              <table className="min-w-[640px] w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  Lista de alunos da unidade {selectedUnit.name}.
                </caption>
                <thead className="bg-canvas text-sm font-semibold text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Nome</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Matrícula</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Turma</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Ano letivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {students.length > 0 ? (
                    students.map((student) => {
                      const enrollment = student.enrollments[0];

                      return (
                        <tr key={student.id}>
                          <td className="px-4 py-3 font-semibold">{student.name}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-muted">
                            {student.registrationNumber}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-muted">
                            {enrollment?.classGroup.name ?? "—"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-muted">
                            {enrollment?.academicYear.name ?? "—"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center">
                        <p className="font-semibold">
                          {studentCount === 0 ? "Nenhum aluno cadastrado" : "Nenhum resultado"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <nav
            className="mt-5 flex flex-wrap items-center justify-between gap-3"
            aria-label="Paginação de alunos"
          >
            <p className="text-sm text-muted">
              Página {page} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              {hasPreviousPage ? (
                <Link
                  href={pageHref(page - 1)}
                  className="demo-button inline-flex items-center justify-center border border-line bg-surface text-brand hover:bg-canvas"
                >
                  Anterior
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="demo-button inline-flex items-center justify-center border border-line bg-canvas text-muted"
                >
                  Anterior
                </span>
              )}
              {hasNextPage ? (
                <Link
                  href={pageHref(page + 1)}
                  className="demo-button inline-flex items-center justify-center border border-line bg-surface text-brand hover:bg-canvas"
                >
                  Próxima
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="demo-button inline-flex items-center justify-center border border-line bg-canvas text-muted"
                >
                  Próxima
                </span>
              )}
            </div>
          </nav>
        </section>

        <div className="mt-6">
          <SchoolForms
            unitId={unitId}
            academicYears={formAcademicYears}
            classGroups={formClassGroups}
            canManageYearsClasses={canManageYearsClasses}
            canEnroll={canEnroll}
          />
        </div>
      </main>
    </div>
  );
}
