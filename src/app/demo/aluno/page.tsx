"use client";

import { useState } from "react";
import { Icon } from "../_components/icon";

type Bimestre = "1" | "2";

type Grade = {
  disciplina: string;
  avaliacao1: string;
  avaliacao2: string;
  media: string;
  situacao: "Aprovada" | "Em acompanhamento";
};

type BimestreReport = {
  label: string;
  mediaGeral: string;
  frequencia: string;
  faltas: string;
  aulasPrevistas: string;
  presencas: string;
  notas: Grade[];
};

const bimestres: Array<{ value: Bimestre; label: string }> = [
  { value: "1", label: "1º bimestre" },
  { value: "2", label: "2º bimestre" },
];

const reports: Record<Bimestre, BimestreReport> = {
  "1": {
    label: "1º bimestre",
    mediaGeral: "8,2",
    frequencia: "95,8%",
    faltas: "2",
    aulasPrevistas: "48",
    presencas: "46",
    notas: [
      { disciplina: "Matemática", avaliacao1: "8,5", avaliacao2: "7,8", media: "8,2", situacao: "Aprovada" },
      { disciplina: "Língua Portuguesa", avaliacao1: "8,8", avaliacao2: "9,1", media: "9,0", situacao: "Aprovada" },
      { disciplina: "Ciências", avaliacao1: "7,2", avaliacao2: "8,0", media: "7,6", situacao: "Aprovada" },
      { disciplina: "História", avaliacao1: "8,0", avaliacao2: "7,5", media: "7,8", situacao: "Aprovada" },
      { disciplina: "Geografia", avaliacao1: "9,0", avaliacao2: "8,6", media: "8,8", situacao: "Aprovada" },
      { disciplina: "Língua Inglesa", avaliacao1: "7,5", avaliacao2: "8,2", media: "7,9", situacao: "Aprovada" },
    ],
  },
  "2": {
    label: "2º bimestre",
    mediaGeral: "8,7",
    frequencia: "97,9%",
    faltas: "1",
    aulasPrevistas: "48",
    presencas: "47",
    notas: [
      { disciplina: "Matemática", avaliacao1: "9,0", avaliacao2: "8,7", media: "8,9", situacao: "Aprovada" },
      { disciplina: "Língua Portuguesa", avaliacao1: "8,5", avaliacao2: "9,3", media: "8,9", situacao: "Aprovada" },
      { disciplina: "Ciências", avaliacao1: "8,0", avaliacao2: "8,4", media: "8,2", situacao: "Aprovada" },
      { disciplina: "História", avaliacao1: "8,7", avaliacao2: "8,1", media: "8,4", situacao: "Aprovada" },
      { disciplina: "Geografia", avaliacao1: "9,2", avaliacao2: "9,0", media: "9,1", situacao: "Aprovada" },
      { disciplina: "Língua Inglesa", avaliacao1: "8,5", avaliacao2: "8,8", media: "8,7", situacao: "Aprovada" },
    ],
  },
};

const occurrences = [
  {
    date: "12/03/2026",
    title: "Falta justificada",
    reason: "Consulta médica · motivo fictício",
    detail: "1º bimestre · 1 aula",
  },
  {
    date: "08/04/2026",
    title: "Atraso",
    reason: "Transporte escolar · motivo fictício",
    detail: "1º bimestre · 20 minutos",
  },
  {
    date: "19/05/2026",
    title: "Saída antecipada",
    reason: "Atendimento familiar · motivo fictício",
    detail: "2º bimestre · 2 aulas",
  },
];

const events = [
  {
    date: "26/05",
    time: "08:00",
    title: "Avaliação de Ciências",
    detail: "Sala 8 · evento fictício",
  },
  {
    date: "29/05",
    time: "10:30",
    title: "Entrega do trabalho de História",
    detail: "Na aula · evento fictício",
  },
  {
    date: "03/06",
    time: "14:00",
    title: "Reunião com responsáveis",
    detail: "Auditório · evento fictício",
  },
];

const notices = [
  {
    title: "Semana de avaliações",
    description: "Confira o calendário das próximas atividades da turma.",
  },
  {
    title: "Material de apoio disponível",
    description: "Apostila de Matemática para revisão do 2º bimestre.",
  },
  {
    title: "Lembrete da turma",
    description: "Trazer o caderno de Ciências na próxima aula.",
  },
];

const cardClassName =
  "demo-card";

const controlClassName = "demo-control mt-2";

export default function StudentPortalPage() {
  const [bimestre, setBimestre] = useState<Bimestre>("1");
  const report = reports[bimestre];

  return (
    <>
      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-brand-red">Aluna · portal acadêmico · demonstração</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[28px]">Olá, Ana Beatriz.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-[1.5] text-muted">
            Consulte seu desempenho e os próximos compromissos da turma 8º A em um ambiente seguro e fictício.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink">
          <Icon name="calendar" className="h-[18px] w-[18px] text-brand" />
          Ano letivo 2026 · fictício
        </div>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <section className={cardClassName} aria-labelledby="student-profile-title">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand text-xl font-semibold text-white"
                aria-hidden="true"
              >
                AB
              </span>
              <div>
                <p className="text-xs font-semibold text-muted">Perfil fictício</p>
                <h2 id="student-profile-title" className="mt-1 text-lg font-semibold text-ink">Ana Beatriz Lima</h2>
                <p className="mt-1 text-sm text-muted">Turma 8º A · Ensino Fundamental II</p>
              </div>
            </div>
            <span className="w-fit rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
              Consulta somente
            </span>
          </div>
          <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold text-muted">Matrícula fictícia</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">2026-001</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-muted">Turno fictício</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">Matutino</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-muted">Unidade fictícia</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">Radar · Centro</dd>
            </div>
          </dl>
        </section>

        <section className={cardClassName} aria-labelledby="period-title">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-muted">Período letivo</p>
              <h2 id="period-title" className="mt-1 text-lg font-semibold text-ink">Escolha o bimestre</h2>
            </div>
            <span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-muted">Dados fictícios</span>
          </div>
          <label htmlFor="bimestre-select" className="mt-5 block text-xs font-semibold text-ink">
            Bimestre para consulta
          </label>
          <select
            id="bimestre-select"
            name="bimestre"
            value={bimestre}
            onChange={(event) => setBimestre(event.target.value as Bimestre)}
            aria-describedby="bimestre-help"
            className={controlClassName}
          >
            {bimestres.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <p id="bimestre-help" className="mt-2 text-[13px] leading-5 text-muted">
            O seletor apenas troca a visualização local das informações demonstrativas.
          </p>
        </section>
      </div>

      <section className="mt-6" aria-labelledby="summary-title">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-muted">Resumo do período</p>
            <h2 id="summary-title" className="mt-1 text-lg font-semibold text-ink">Seu acompanhamento acadêmico</h2>
          </div>
          <p className="text-[13px] font-semibold text-muted" aria-live="polite">
            Exibindo: {report.label} · dados fictícios
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className={cardClassName}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-muted">Média geral</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand" aria-hidden="true">
                <Icon name="document" className="h-[18px] w-[18px]" />
              </span>
            </div>
            <p className="mt-4 text-[32px] font-semibold leading-none tabular-nums text-brand">{report.mediaGeral}</p>
            <p className="mt-2 text-[13px] text-muted">escala de 0 a 10 · fictício</p>
          </article>
          <article className={cardClassName}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-muted">Frequência</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success" aria-hidden="true">
                <Icon name="attendance" className="h-[18px] w-[18px]" />
              </span>
            </div>
            <p className="mt-4 text-[32px] font-semibold leading-none tabular-nums text-success">{report.frequencia}</p>
            <p className="mt-2 text-[13px] text-muted">presença no período · fictícia</p>
          </article>
          <article className={cardClassName}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-muted">Faltas</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10 text-warning" aria-hidden="true">
                <Icon name="calendar" className="h-[18px] w-[18px]" />
              </span>
            </div>
            <p className="mt-4 text-[32px] font-semibold leading-none tabular-nums text-warning">{report.faltas}</p>
            <p className="mt-2 text-[13px] text-muted">aulas no período · fictício</p>
          </article>
          <article className={cardClassName}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-muted">Situação</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand" aria-hidden="true">
                <Icon name="activity" className="h-[18px] w-[18px]" />
              </span>
            </div>
            <p className="mt-4 text-xl font-semibold text-brand">Acompanhamento em dia</p>
            <p className="mt-2 text-[13px] text-muted">status demonstrativo · consulta</p>
          </article>
        </div>
      </section>

      <section className={`${cardClassName} mt-6`} aria-labelledby="grades-title">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-muted">Boletim demonstrativo · {report.label}</p>
            <h2 id="grades-title" className="mt-1 text-lg font-semibold text-ink">Quadro de notas</h2>
            <p className="mt-1 max-w-2xl text-sm leading-[1.5] text-muted">
              Consulte as avaliações de Ana Beatriz. Os valores são fictícios e não podem ser alterados nesta demonstração.
            </p>
          </div>
          <span className="w-fit rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            Somente leitura
          </span>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-line">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm leading-[1.5]">
              <caption className="sr-only">
                Notas fictícias de Ana Beatriz Lima no {report.label}, com duas avaliações, média e situação.
              </caption>
              <thead className="bg-canvas text-xs font-semibold text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Disciplina</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Avaliação 1</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Avaliação 2</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Média</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {report.notas.map((grade) => (
                  <tr key={grade.disciplina} className="text-muted">
                    <th scope="row" className="px-4 py-4 font-semibold text-ink">{grade.disciplina}</th>
                    <td className="px-4 py-4">{grade.avaliacao1}</td>
                    <td className="px-4 py-4">{grade.avaliacao2}</td>
                    <td className="px-4 py-4 font-semibold text-brand">{grade.media}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                        {grade.situacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-[13px] text-muted">
          Escala fictícia de 0 a 10 · atualização ilustrativa do {report.label} · nenhuma nota real é consultada ou modificada.
        </p>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section className={cardClassName} aria-labelledby="attendance-title">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-muted">Frequência · {report.label}</p>
              <h2 id="attendance-title" className="mt-1 text-lg font-semibold text-ink">Acompanhamento de presença</h2>
              <p className="mt-1 text-sm leading-[1.5] text-muted">
                Resumo do período e histórico de ocorrências fictícias para consulta.
              </p>
            </div>
            <span className="w-fit rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
              3 ocorrências fictícias
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-2 sm:gap-3" aria-label={`Totais fictícios de frequência do ${report.label}`}>
            <div className="rounded-lg bg-canvas px-3 py-3 text-center">
              <dt className="text-xs font-semibold text-muted">Aulas previstas</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums text-brand">{report.aulasPrevistas}</dd>
            </div>
            <div className="rounded-lg bg-success/10 px-3 py-3 text-center">
              <dt className="text-xs font-semibold text-success">Presenças</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums text-success">{report.presencas}</dd>
            </div>
            <div className="rounded-lg bg-danger/10 px-3 py-3 text-center">
              <dt className="text-xs font-semibold text-danger">Faltas</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums text-danger">{report.faltas}</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-line pt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">Ocorrências registradas</h3>
              <span className="text-[13px] text-muted">3 registros · fictícios</span>
            </div>
            <ul className="mt-3 divide-y divide-line">
              {occurrences.map((occurrence) => (
                <li key={occurrence.date} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <time dateTime={occurrence.date.split("/").reverse().join("-")} className="w-[4.5rem] shrink-0 pt-0.5 text-sm font-semibold text-brand">
                    {occurrence.date}
                  </time>
                  <div className="min-w-0 border-l border-line pl-3">
                    <p className="text-sm font-semibold text-ink">{occurrence.title}</p>
                    <p className="mt-1 text-[13px] leading-5 text-muted">{occurrence.reason}</p>
                    <p className="mt-1 text-[13px] text-muted">{occurrence.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="grid gap-6">
          <section className={cardClassName} aria-labelledby="events-title">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-muted">Agenda</p>
                <h2 id="events-title" className="mt-1 text-lg font-semibold text-ink">Próximos eventos</h2>
                <p className="mt-1 text-[13px] text-muted">Compromissos ilustrativos da turma 8º A.</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand" aria-hidden="true">
                <Icon name="calendar" className="h-[18px] w-[18px]" />
              </span>
            </div>
            <ol className="mt-5 space-y-4">
              {events.map((event) => (
                <li key={event.title} className="flex gap-3">
                  <time className="w-12 shrink-0 pt-0.5 text-sm font-semibold text-brand">{event.date}</time>
                  <div className="min-w-0 border-l border-line pl-3">
                    <p className="text-sm font-semibold text-ink">{event.title}</p>
                    <p className="mt-1 text-[13px] text-muted">{event.time} · {event.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className={cardClassName} aria-labelledby="notices-title">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-muted">Comunicação</p>
                <h2 id="notices-title" className="mt-1 text-lg font-semibold text-ink">Avisos da escola</h2>
                <p className="mt-1 text-[13px] text-muted">Mensagens fictícias para esta demonstração.</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10 text-warning" aria-hidden="true">
                <Icon name="alert" className="h-[18px] w-[18px]" />
              </span>
            </div>
            <ul className="mt-4 divide-y divide-line">
              {notices.map((notice) => (
                <li key={notice.title} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-sm font-semibold text-ink">{notice.title}</p>
                  <p className="mt-1 text-[13px] leading-5 text-muted">{notice.description}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <p className="mt-6 text-center text-[13px] text-muted">
        Portal do aluno demonstrativo · dados fictícios · somente consulta · nenhuma alteração é permitida ou persistida.
      </p>
    </>
  );
}
