"use client";

import { type FormEvent, useState } from "react";

type StudentStatus = "Ativo" | "Em análise" | "Transferência";

type Student = {
  id: string;
  name: string;
  registration: string;
  className: string;
  responsible: string;
  status: StudentStatus;
};

const initialStudents: Student[] = [
  {
    id: "student-001",
    name: "Ana Beatriz Lima",
    registration: "2026-001",
    className: "1º A",
    responsible: "Juliana Lima",
    status: "Ativo",
  },
  {
    id: "student-014",
    name: "Bruno Henrique Souza",
    registration: "2026-014",
    className: "1º B",
    responsible: "Marcos Souza",
    status: "Ativo",
  },
  {
    id: "student-022",
    name: "Caio Mendes",
    registration: "2026-022",
    className: "2º A",
    responsible: "Renata Mendes",
    status: "Ativo",
  },
  {
    id: "student-031",
    name: "Diana Alves",
    registration: "2026-031",
    className: "2º B",
    responsible: "Paulo Alves",
    status: "Em análise",
  },
  {
    id: "student-044",
    name: "Enzo Rocha",
    registration: "2026-044",
    className: "3º A",
    responsible: "Camila Rocha",
    status: "Ativo",
  },
  {
    id: "student-052",
    name: "Fernanda Oliveira",
    registration: "2026-052",
    className: "3º B",
    responsible: "Luciana Oliveira",
    status: "Transferência",
  },
  {
    id: "student-067",
    name: "Gabriel Santos",
    registration: "2026-067",
    className: "4º A",
    responsible: "Rafael Santos",
    status: "Ativo",
  },
  {
    id: "student-073",
    name: "Helena Martins",
    registration: "2026-073",
    className: "4º B",
    responsible: "Patrícia Martins",
    status: "Em análise",
  },
  {
    id: "student-081",
    name: "Isabela Costa",
    registration: "2026-081",
    className: "5º A",
    responsible: "Eduardo Costa",
    status: "Transferência",
  },
];

const classOptions = Array.from(
  new Set(initialStudents.map((student) => student.className)),
);

const emptyForm = { name: "", registration: "", className: "" };

const statusStyles: Record<StudentStatus, string> = {
  Ativo: "bg-success/10 text-success",
  "Em análise": "bg-warning/10 text-warning",
  Transferência: "bg-danger/10 text-danger",
};

const controlClassName = "demo-control mt-2";

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState<"Todos" | StudentStatus>(
    "Todos",
  );
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const normalizedQuery = normalize(query.trim());
  const filteredStudents = students.filter((student) => {
    const matchesQuery =
      !normalizedQuery ||
      normalize(student.name).includes(normalizedQuery) ||
      normalize(student.registration).includes(normalizedQuery);
    const matchesClass =
      classFilter === "Todas" || student.className === classFilter;
    const matchesStatus =
      statusFilter === "Todos" || student.status === statusFilter;

    return matchesQuery && matchesClass && matchesStatus;
  });

  function updateForm(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const registration = form.registration.trim();
    const className = form.className.trim();

    if (!name || !registration || !className) {
      setFormError("Preencha nome, matrícula e turma para simular a matrícula.");
      setConfirmation("");
      return;
    }

    setStudents((current) => [
      {
        id: `simulated-${Date.now()}`,
        name,
        registration,
        className,
        responsible: "Responsável fictício",
        status: "Em análise",
      },
      ...current,
    ]);
    setForm(emptyForm);
    setFormError("");
    setConfirmation(
      `Matrícula fictícia de ${name} adicionada. Recarregar a página descarta alterações.`,
    );
  }

  return (
    <>
      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-brand-red">Secretaria · dados fictícios</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[28px]">
            Alunos e matrículas
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-[1.5] text-muted">
            Consulte a situação acadêmica da unidade e simule uma nova
            matrícula sem alterar nenhum dado real.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink">
          Ano letivo 2026 · Unidade Centro
        </span>
      </header>

      <section className="mt-6" aria-labelledby="student-indicators-title">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted">Resumo da secretaria</p>
            <h2 id="student-indicators-title" className="mt-1 text-lg font-semibold text-ink">Indicadores de matrículas</h2>
          </div>
          <span className="hidden rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-muted sm:inline-flex">Fictício</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="demo-card">
            <p className="text-sm font-semibold text-muted">Alunos ativos</p>
            <p className="mt-2 text-[32px] font-semibold leading-none tabular-nums text-brand">218</p>
            <p className="mt-2 text-[13px] text-muted">matrículas ativas · fictício</p>
          </article>
          <article className="demo-card">
            <p className="text-sm font-semibold text-muted">Matrículas em análise</p>
            <p className="mt-2 text-[32px] font-semibold leading-none tabular-nums text-warning">5</p>
            <p className="mt-2 text-[13px] text-muted">aguardando conferência · fictício</p>
          </article>
          <article className="demo-card">
            <p className="text-sm font-semibold text-muted">Transferências</p>
            <p className="mt-2 text-[32px] font-semibold leading-none tabular-nums text-danger">3</p>
            <p className="mt-2 text-[13px] text-muted">em movimentação · fictício</p>
          </article>
        </div>
      </section>

      <section
        className="demo-card mt-6"
        aria-labelledby="student-list-title"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="student-list-title" className="text-lg font-semibold text-ink">Lista de alunos</h2>
            <p className="mt-1 text-[13px] text-muted">
              9 registros iniciais · dados fictícios para demonstração.
            </p>
          </div>
          <span className="w-fit rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand" aria-live="polite">
            {filteredStudents.length} {filteredStudents.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(170px,0.8fr)_minmax(170px,0.8fr)]">
          <div>
            <label htmlFor="student-search" className="text-xs font-semibold text-ink">
              Buscar por nome ou matrícula
            </label>
            <input
              id="student-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: Ana ou 2026-001"
              className={controlClassName}
            />
          </div>
          <div>
            <label htmlFor="class-filter" className="text-xs font-semibold text-ink">Turma</label>
            <select
              id="class-filter"
              value={classFilter}
              onChange={(event) => setClassFilter(event.target.value)}
              className={controlClassName}
            >
              <option value="Todas">Todas as turmas</option>
              {classOptions.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status-filter" className="text-xs font-semibold text-ink">Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "Todos" | StudentStatus)
              }
              className={controlClassName}
            >
              <option value="Todos">Todos os status</option>
              <option value="Ativo">Ativo</option>
              <option value="Em análise">Em análise</option>
              <option value="Transferência">Transferência</option>
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-line">
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full border-collapse text-left text-sm leading-[1.5]">
              <caption className="sr-only">
                Tabela de alunos fictícios com nome, matrícula, turma, responsável e status.
              </caption>
              <thead className="bg-canvas text-xs font-semibold text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Nome</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Matrícula</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Turma</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Responsável (fictício)</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="text-muted">
                      <td className="px-4 py-4 font-semibold text-ink">{student.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{student.registration}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{student.className}</td>
                      <td className="px-4 py-4">{student.responsible}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[student.status]}`}>
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <p className="font-semibold text-ink">Nenhum aluno encontrado.</p>
                      <p className="mt-1 text-[13px] text-muted">
                        Ajuste a busca ou selecione outros filtros para ver os dados fictícios.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <details className="group mt-6 rounded-xl border border-line bg-surface shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
          <span>
            <span className="block text-lg font-semibold text-ink">Simular nova matrícula</span>
            <span className="mt-1 block text-[13px] text-muted">
              Adicione uma linha fictícia apenas nesta sessão do navegador.
            </span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-xl text-brand transition-transform group-open:rotate-180" aria-hidden="true">
            ↓
          </span>
        </summary>
        <div className="border-t border-line p-5 sm:p-6">
          <p id="enrollment-help" className="text-[13px] leading-5 text-muted">
            Informe somente os dados demonstrativos abaixo. Nenhum dado sensível é solicitado.
          </p>
          <form className="mt-5 grid gap-4 md:grid-cols-[1.3fr_0.8fr_0.8fr_auto] md:items-end" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="new-student-name" className="text-xs font-semibold text-ink">Nome</label>
              <input
                id="new-student-name"
                name="name"
                type="text"
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                required
                aria-describedby="enrollment-help"
                className={controlClassName}
                placeholder="Nome fictício"
              />
            </div>
            <div>
              <label htmlFor="new-student-registration" className="text-xs font-semibold text-ink">Matrícula</label>
              <input
                id="new-student-registration"
                name="registration"
                type="text"
                value={form.registration}
                onChange={(event) => updateForm("registration", event.target.value)}
                required
                aria-describedby="enrollment-help"
                className={controlClassName}
                placeholder="2026-090"
              />
            </div>
            <div>
              <label htmlFor="new-student-class" className="text-xs font-semibold text-ink">Turma</label>
              <select
                id="new-student-class"
                name="className"
                value={form.className}
                onChange={(event) => updateForm("className", event.target.value)}
                required
                aria-describedby="enrollment-help"
                className={controlClassName}
              >
                <option value="">Selecione</option>
                {classOptions.map((className) => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="demo-button bg-brand text-white hover:bg-ink">
              Adicionar matrícula
            </button>
          </form>
          {formError ? (
            <p id="enrollment-error" className="mt-4 text-sm font-semibold text-danger" role="alert">
              {formError}
            </p>
          ) : null}
          <p className="mt-4 text-[13px] text-success" aria-live="polite" role="status">
            {confirmation}
          </p>
        </div>
      </details>
    </>
  );
}
