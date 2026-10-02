"use client";

import { type FormEvent, useRef, useState } from "react";
import { Icon } from "../_components/icon";

type ClassName = "8º A" | "9º A";
type Subject = "Matemática" | "Português";
type DiaryTab = "attendance" | "grades";
type AttendanceStatus = "Presente" | "Falta" | "Justificada";

type Student = {
  id: string;
  name: string;
};

type AttendanceRecord = Record<string, AttendanceStatus>;
type GradeRecord = Record<string, string>;

const students: Student[] = [
  { id: "ana", name: "Ana Beatriz Lima" },
  { id: "bruno", name: "Bruno Henrique Souza" },
  { id: "caio", name: "Caio Mendes" },
  { id: "diana", name: "Diana Alves" },
  { id: "enzo", name: "Enzo Rocha" },
  { id: "fernanda", name: "Fernanda Oliveira" },
  { id: "gabriel", name: "Gabriel Santos" },
  { id: "helena", name: "Helena Martins" },
];

const attendanceByClass: Record<ClassName, AttendanceRecord> = {
  "8º A": {
    ana: "Presente",
    bruno: "Presente",
    caio: "Falta",
    diana: "Presente",
    enzo: "Justificada",
    fernanda: "Presente",
    gabriel: "Presente",
    helena: "Presente",
  },
  "9º A": {
    ana: "Presente",
    bruno: "Falta",
    caio: "Presente",
    diana: "Presente",
    enzo: "Presente",
    fernanda: "Justificada",
    gabriel: "Presente",
    helena: "Falta",
  },
};

const gradesByClass: Record<ClassName, GradeRecord> = {
  "8º A": {
    ana: "8.5",
    bruno: "7.5",
    caio: "6.0",
    diana: "9.0",
    enzo: "8.0",
    fernanda: "7.0",
    gabriel: "9.5",
    helena: "8.5",
  },
  "9º A": {
    ana: "9.0",
    bruno: "8.0",
    caio: "7.5",
    diana: "8.5",
    enzo: "9.5",
    fernanda: "6.5",
    gabriel: "8.0",
    helena: "7.0",
  },
};

const professors: Record<ClassName, Record<Subject, string>> = {
  "8º A": {
    Matemática: "Rafael Almeida",
    Português: "Camila Nunes",
  },
  "9º A": {
    Matemática: "Lucas Martins",
    Português: "Juliana Rocha",
  },
};

const attendanceStatuses: AttendanceStatus[] = [
  "Presente",
  "Falta",
  "Justificada",
];

const assessments = [
  "Avaliação bimestral 1",
  "Trabalho em grupo",
  "Atividade de revisão",
];

const controlClassName = "demo-control mt-2";
const buttonClassName = "demo-button inline-flex items-center justify-center gap-2 bg-brand text-white hover:bg-ink";

function parseGrade(value: string): number | null {
  const normalized = value.trim().replace(",", ".");

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 10
    ? parsed
    : null;
}

function getGradeError(value: string): string {
  if (!value.trim()) {
    return "Informe uma nota.";
  }

  return parseGrade(value) === null ? "Use uma nota entre 0 e 10." : "";
}

function formatAverage(values: Array<number | null>): string | null {
  if (values.some((value) => value === null)) {
    return null;
  }

  const total = values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  return (total / values.length).toFixed(1).replace(".", ",");
}

function AttendancePanel({
  attendance,
  date,
  onDateChange,
  onStatusChange,
  onSubmit,
  confirmation,
  error,
}: {
  attendance: AttendanceRecord;
  date: string;
  onDateChange: (value: string) => void;
  onStatusChange: (studentId: string, value: AttendanceStatus) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  confirmation: string;
  error: string;
}) {
  const counts = attendanceStatuses.reduce(
    (result, status) => ({ ...result, [status]: 0 }),
    {} as Record<AttendanceStatus, number>,
  );

  Object.values(attendance).forEach((status) => {
    counts[status] += 1;
  });

  return (
    <section
      id="attendance-panel"
      role="tabpanel"
      aria-labelledby="attendance-tab"
      tabIndex={0}
      className="demo-card mt-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold text-brand-red">Registro local</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">Frequência</h2>
          <p className="mt-1 max-w-xl text-sm leading-[1.5] text-muted">
            Marque a situação de cada aluno para simular a chamada da turma.
          </p>
        </div>

        <div
          className="grid grid-cols-3 gap-2 sm:min-w-[360px]"
          aria-label="Contadores da frequência"
          aria-live="polite"
        >
          <div className="rounded-lg bg-success/10 px-3 py-3 text-center">
            <p className="text-2xl font-semibold tabular-nums text-success">{counts.Presente}</p>
            <p className="mt-1 text-xs font-semibold text-success">
              Presentes
            </p>
          </div>
          <div className="rounded-lg bg-danger/10 px-3 py-3 text-center">
            <p className="text-2xl font-semibold tabular-nums text-danger">{counts.Falta}</p>
            <p className="mt-1 text-xs font-semibold text-danger">
              Faltas
            </p>
          </div>
          <div className="rounded-lg bg-warning/10 px-3 py-3 text-center">
            <p className="text-2xl font-semibold tabular-nums text-warning">{counts.Justificada}</p>
            <p className="mt-1 text-xs font-semibold text-warning">
              Justificadas
            </p>
          </div>
        </div>
      </div>

      <form className="mt-6" onSubmit={onSubmit} noValidate>
        <div className="max-w-xs">
          <label htmlFor="attendance-date" className="text-xs font-semibold text-ink">
            Data da chamada
          </label>
          <input
            id="attendance-date"
            name="attendance-date"
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
            required
            aria-describedby="attendance-date-help"
            className={controlClassName}
          />
          <p id="attendance-date-help" className="mt-1.5 text-[13px] text-muted">
            Data inicial fictícia; você pode selecioná-la.
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-line">
          <div className="overflow-x-auto">
            <table className="min-w-[560px] w-full border-collapse text-left text-sm leading-[1.5]">
              <caption className="sr-only">
                Lista com os oito alunos fictícios e seus status de frequência.
              </caption>
              <thead className="bg-canvas text-xs font-semibold text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Aluno fictício</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Status da frequência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {students.map((student) => {
                  const inputId = `attendance-${student.id}`;

                  return (
                    <tr key={student.id} className="text-muted">
                      <td className="px-4 py-3.5 font-semibold text-ink">{student.name}</td>
                      <td className="px-4 py-3.5">
                        <label htmlFor={inputId} className="sr-only">
                          Status de frequência de {student.name}
                        </label>
                        <select
                          id={inputId}
                          name={inputId}
                          value={attendance[student.id]}
                          onChange={(event) =>
                            onStatusChange(student.id, event.target.value as AttendanceStatus)
                          }
                          className="demo-control"
                        >
                          {attendanceStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button type="submit" className={buttonClassName}>
              <Icon name="attendance" className="h-4 w-4" />
              Salvar chamada demonstrativa
            </button>
            <p className="mt-2 text-[13px] text-muted">
              A chamada fica apenas nesta tela. Esta demonstração não persiste alterações.
            </p>
          </div>
          <p
            className={`min-h-6 text-sm font-semibold sm:max-w-sm sm:text-right ${error ? "text-danger" : "text-success"}`}
            role={error ? "alert" : "status"}
            aria-live="polite"
          >
            {error || confirmation}
          </p>
        </div>
      </form>
    </section>
  );
}

function GradesPanel({
  grades,
  assessment,
  onAssessmentChange,
  onGradeChange,
  onSubmit,
  confirmation,
  attempted,
}: {
  grades: GradeRecord;
  assessment: string;
  onAssessmentChange: (value: string) => void;
  onGradeChange: (studentId: string, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  confirmation: string;
  attempted: boolean;
}) {
  const average = formatAverage(students.map((student) => parseGrade(grades[student.id])));
  const invalidStudentCount = students.filter(
    (student) => getGradeError(grades[student.id]) !== "",
  ).length;

  return (
    <section
      id="grades-panel"
      role="tabpanel"
      aria-labelledby="grades-tab"
      tabIndex={0}
      className="demo-card mt-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold text-brand-red">Registro local</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">Notas</h2>
          <p className="mt-1 max-w-xl text-sm leading-[1.5] text-muted">
            Lance notas de 0 a 10 para os alunos e acompanhe a média da avaliação.
          </p>
        </div>

        <div className="rounded-lg bg-brand/10 px-5 py-3 text-left lg:min-w-[180px] lg:text-center">
          <p className="text-xs font-semibold text-muted">
            Média da turma
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-brand" aria-live="polite">
            {average ?? "—"}
          </p>
          <p className="text-[13px] text-muted">escala de 0 a 10</p>
        </div>
      </div>

      <form className="mt-6" onSubmit={onSubmit} noValidate>
        <div className="max-w-sm">
          <label htmlFor="assessment" className="text-xs font-semibold text-ink">
            Avaliação
          </label>
          <select
            id="assessment"
            name="assessment"
            value={assessment}
            onChange={(event) => onAssessmentChange(event.target.value)}
            className={controlClassName}
          >
            {assessments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {attempted && invalidStudentCount > 0 ? (
          <p id="grades-error" className="mt-4 text-sm font-semibold text-danger" role="alert">
            Revise as notas destacadas. Informe valores entre 0 e 10 para salvar a simulação.
          </p>
        ) : null}

        <div className="mt-5 overflow-hidden rounded-lg border border-line">
          <div className="overflow-x-auto">
            <table className="min-w-[560px] w-full border-collapse text-left text-sm leading-[1.5]">
              <caption className="sr-only">
                Lista com os oito alunos fictícios e suas notas na avaliação selecionada.
              </caption>
              <thead className="bg-canvas text-xs font-semibold text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Aluno fictício</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Nota (0 a 10)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {students.map((student) => {
                  const inputId = `grade-${student.id}`;
                  const error = getGradeError(grades[student.id]);
                  const describedBy = attempted && error ? "grades-error" : undefined;

                  return (
                    <tr key={student.id} className="text-muted">
                      <td className="px-4 py-3.5 font-semibold text-ink">{student.name}</td>
                      <td className="px-4 py-3.5">
                        <label htmlFor={inputId} className="sr-only">
                          Nota de {student.name}
                        </label>
                        <input
                          id={inputId}
                          name={inputId}
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          inputMode="decimal"
                          value={grades[student.id]}
                          onChange={(event) => onGradeChange(student.id, event.target.value)}
                          aria-invalid={attempted && Boolean(error)}
                          aria-describedby={describedBy}
                          className={`demo-control max-w-[180px] ${attempted && error ? "border-danger focus:border-danger" : ""}`}
                        />
                        {attempted && error ? (
                          <p className="mt-1 text-[13px] font-semibold text-danger">{error}</p>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button type="submit" className={buttonClassName}>
              <Icon name="document" className="h-4 w-4" />
              Salvar notas demonstrativas
            </button>
            <p className="mt-2 text-[13px] text-muted">
              Os valores são fictícios e ficam somente nesta sessão demonstrativa.
            </p>
          </div>
          <p
            className="min-h-6 text-sm font-semibold text-success sm:max-w-sm sm:text-right"
            role="status"
            aria-live="polite"
          >
            {confirmation}
          </p>
        </div>
      </form>
    </section>
  );
}

export default function DiarioPage() {
  const [className, setClassName] = useState<ClassName>("8º A");
  const [subject, setSubject] = useState<Subject>("Matemática");
  const [activeTab, setActiveTab] = useState<DiaryTab>("attendance");
  const [date, setDate] = useState("2026-05-18");
  const [attendance, setAttendance] = useState<AttendanceRecord>(() => ({
    ...attendanceByClass["8º A"],
  }));
  const [assessment, setAssessment] = useState(assessments[0]);
  const [grades, setGrades] = useState<GradeRecord>(() => ({
    ...gradesByClass["8º A"],
  }));
  const [attendanceConfirmation, setAttendanceConfirmation] = useState("");
  const [attendanceError, setAttendanceError] = useState("");
  const [gradesConfirmation, setGradesConfirmation] = useState("");
  const [gradesAttempted, setGradesAttempted] = useState(false);
  const attendanceTabRef = useRef<HTMLButtonElement>(null);
  const gradesTabRef = useRef<HTMLButtonElement>(null);

  const professor = professors[className][subject];

  function clearMessages() {
    setAttendanceConfirmation("");
    setAttendanceError("");
    setGradesConfirmation("");
    setGradesAttempted(false);
  }

  function handleClassChange(value: ClassName) {
    setClassName(value);
    setAttendance({ ...attendanceByClass[value] });
    setGrades({ ...gradesByClass[value] });
    clearMessages();
  }

  function handleSubjectChange(value: Subject) {
    setSubject(value);
    clearMessages();
  }

  function handleAttendanceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!date) {
      setAttendanceConfirmation("");
      setAttendanceError("Selecione uma data para salvar a chamada demonstrativa.");
      return;
    }

    setAttendanceError("");
    setAttendanceConfirmation(
      `Chamada demonstrativa de ${className} salva nesta tela. Nenhuma alteração foi persistida.`,
    );
  }

  function handleGradesSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const hasInvalidGrade = students.some(
      (student) => getGradeError(grades[student.id]) !== "",
    );

    if (hasInvalidGrade) {
      setGradesAttempted(true);
      setGradesConfirmation("");
      return;
    }

    setGradesAttempted(false);
    setGradesConfirmation(
      `Notas demonstrativas de ${assessment} salvas nesta tela. Nenhuma alteração foi persistida.`,
    );
  }

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, currentTab: DiaryTab) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();
    const nextTab: DiaryTab =
      currentTab === "attendance" ? "grades" : "attendance";
    setActiveTab(nextTab);
    (nextTab === "attendance" ? attendanceTabRef : gradesTabRef).current?.focus();
  }

  return (
    <>
      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-brand-red">Professor · diário de classe · dados fictícios</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[28px]">Diário de classe</h1>
          <p className="mt-2 max-w-2xl text-sm leading-[1.5] text-muted">
            Faça uma chamada ou lance notas para explorar o fluxo do professor sem alterar dados reais.
          </p>
        </div>
        <div className="w-fit rounded-lg border border-line bg-surface px-4 py-2.5">
          <p className="text-xs font-semibold text-muted">Professor fictício</p>
          <p className="mt-1 text-sm font-semibold text-ink">{professor}</p>
          <p className="mt-0.5 text-[13px] text-muted">{className} · {subject}</p>
        </div>
      </header>

      <section
        className="demo-card mt-6"
        aria-labelledby="diary-context-title"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-muted">Contexto da aula</p>
            <h2 id="diary-context-title" className="mt-1 text-lg font-semibold text-ink">Selecione turma e disciplina</h2>
          </div>
          <span className="w-fit rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-muted">Sessão local</span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="class-select" className="text-xs font-semibold text-ink">Turma</label>
            <select
              id="class-select"
              name="class"
              value={className}
              onChange={(event) => handleClassChange(event.target.value as ClassName)}
              className={controlClassName}
            >
              <option value="8º A">8º A</option>
              <option value="9º A">9º A</option>
            </select>
          </div>
          <div>
            <label htmlFor="subject-select" className="text-xs font-semibold text-ink">Disciplina</label>
            <select
              id="subject-select"
              name="subject"
              value={subject}
              onChange={(event) => handleSubjectChange(event.target.value as Subject)}
              className={controlClassName}
            >
              <option value="Matemática">Matemática</option>
              <option value="Português">Português</option>
            </select>
          </div>
          <div className="rounded-lg border border-line bg-canvas px-4 py-3">
            <p className="text-xs font-semibold text-ink">Professor fictício</p>
            <p className="mt-1 text-sm font-semibold text-ink">{professor}</p>
            <p className="mt-0.5 text-[13px] text-muted">Responsável pela aula selecionada</p>
          </div>
        </div>
      </section>

      <section className="mt-6" aria-labelledby="diary-section-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-muted">Lançamentos</p>
            <h2 id="diary-section-title" className="mt-1 text-lg font-semibold text-ink">Acompanhamento da turma</h2>
          </div>
          <div role="tablist" aria-label="Tipo de lançamento do diário" className="grid grid-cols-2 rounded-lg bg-brand/10 p-1 sm:w-fit">
            <button
              ref={attendanceTabRef}
              id="attendance-tab"
              type="button"
              role="tab"
              aria-selected={activeTab === "attendance"}
              aria-controls="attendance-panel"
              tabIndex={activeTab === "attendance" ? 0 : -1}
              onClick={() => setActiveTab("attendance")}
              onKeyDown={(event) => handleTabKeyDown(event, "attendance")}
              className={`rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${activeTab === "attendance" ? "bg-surface text-brand shadow-sm" : "text-muted hover:text-brand"}`}
            >
              Frequência
            </button>
            <button
              ref={gradesTabRef}
              id="grades-tab"
              type="button"
              role="tab"
              aria-selected={activeTab === "grades"}
              aria-controls="grades-panel"
              tabIndex={activeTab === "grades" ? 0 : -1}
              onClick={() => setActiveTab("grades")}
              onKeyDown={(event) => handleTabKeyDown(event, "grades")}
              className={`rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${activeTab === "grades" ? "bg-surface text-brand shadow-sm" : "text-muted hover:text-brand"}`}
            >
              Notas
            </button>
          </div>
        </div>

        {activeTab === "attendance" ? (
          <AttendancePanel
            attendance={attendance}
            date={date}
            onDateChange={(value) => {
              setDate(value);
              setAttendanceConfirmation("");
              setAttendanceError("");
            }}
            onStatusChange={(studentId, value) => {
              setAttendance((current) => ({ ...current, [studentId]: value }));
              setAttendanceConfirmation("");
              setAttendanceError("");
            }}
            onSubmit={handleAttendanceSubmit}
            confirmation={attendanceConfirmation}
            error={attendanceError}
          />
        ) : (
          <GradesPanel
            grades={grades}
            assessment={assessment}
            onAssessmentChange={(value) => {
              setAssessment(value);
              setGradesConfirmation("");
            }}
            onGradeChange={(studentId, value) => {
              setGrades((current) => ({ ...current, [studentId]: value }));
              setGradesConfirmation("");
              setGradesAttempted(false);
            }}
            onSubmit={handleGradesSubmit}
            confirmation={gradesConfirmation}
            attempted={gradesAttempted}
          />
        )}
      </section>
    </>
  );
}
