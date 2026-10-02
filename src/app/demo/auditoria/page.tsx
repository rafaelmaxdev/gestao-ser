"use client";

import { type FormEvent, useState } from "react";
import { Icon } from "../_components/icon";

type RequestStatus = "Pendente" | "Aprovada" | "Rejeitada";
type RequestKind = "Correção de nota" | "Correção de frequência";
type AuditAction = "Solicitação criada" | "Aprovação" | "Rejeição";

type CorrectionRequest = {
  id: string;
  kind: RequestKind;
  professor: string;
  className: string;
  student: string;
  previousValue: string;
  newValue: string;
  reason: string;
  status: RequestStatus;
};

type AuditEntry = {
  id: string;
  dateTime: string;
  actor: string;
  action: AuditAction;
  record: string;
  justification: string;
};

const initialRequests: CorrectionRequest[] = [
  {
    id: "request-001",
    kind: "Correção de nota",
    professor: "Rafael Almeida",
    className: "8º A",
    student: "Ana Beatriz Lima",
    previousValue: "6,5",
    newValue: "7,5",
    reason: "Nota da avaliação bimestral lançada antes da revisão da prova.",
    status: "Pendente",
  },
  {
    id: "request-002",
    kind: "Correção de frequência",
    professor: "Camila Nunes",
    className: "9º A",
    student: "Bruno Henrique Souza",
    previousValue: "Falta",
    newValue: "Presente",
    reason: "Declaração de participação em atividade escolar não refletida na chamada.",
    status: "Pendente",
  },
  {
    id: "request-003",
    kind: "Correção de nota",
    professor: "Lucas Martins",
    className: "7º B",
    student: "Helena Martins",
    previousValue: "8,0",
    newValue: "8,5",
    reason: "Pontuação do trabalho em grupo conferida após recurso do aluno.",
    status: "Pendente",
  },
];

const initialHistory: AuditEntry[] = [
  {
    id: "history-001",
    dateTime: "18/05/2026 · 09:42",
    actor: "Marina Costa",
    action: "Aprovação",
    record: "Correção de nota · Isabela Costa · 6º A",
    justification: "Evidência acadêmica revisada pela Coordenação.",
  },
  {
    id: "history-002",
    dateTime: "18/05/2026 · 09:10",
    actor: "Camila Nunes",
    action: "Solicitação criada",
    record: "Correção de frequência · Bruno Henrique Souza · 9º A",
    justification: "Declaração escolar anexada à solicitação demonstrativa.",
  },
  {
    id: "history-003",
    dateTime: "17/05/2026 · 16:35",
    actor: "Marina Costa",
    action: "Rejeição",
    record: "Correção de nota · Miguel Santos · 7º B",
    justification: "Não foi encontrada evidência suficiente para a alteração.",
  },
  {
    id: "history-004",
    dateTime: "17/05/2026 · 15:20",
    actor: "Rafael Almeida",
    action: "Solicitação criada",
    record: "Correção de nota · Ana Beatriz Lima · 8º A",
    justification: "Revisão do lançamento solicitada pelo professor fictício.",
  },
];

const auditActions: AuditAction[] = [
  "Solicitação criada",
  "Aprovação",
  "Rejeição",
];

const kpis = [
  {
    label: "Pendências",
    value: "7",
    detail: "aguardando análise · fictício",
    valueClassName: "text-warning",
  },
  {
    label: "Alterações hoje",
    value: "24",
    detail: "registros revisados · fictício",
    valueClassName: "text-brand",
  },
  {
    label: "Rastreabilidade",
    value: "100%",
    detail: "ações com histórico · fictício",
    valueClassName: "text-success",
  },
];

const requestStatusStyles: Record<RequestStatus, string> = {
  Pendente: "bg-warning/10 text-warning",
  Aprovada: "bg-success/10 text-success",
  Rejeitada: "bg-danger/10 text-danger",
};

const actionStyles: Record<AuditAction, string> = {
  "Solicitação criada": "bg-brand/10 text-brand",
  Aprovação: "bg-success/10 text-success",
  Rejeição: "bg-danger/10 text-danger",
};

const controlClassName = "demo-control mt-2";

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function AuditPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequestId, setSelectedRequestId] = useState(initialRequests[0].id);
  const [justification, setJustification] = useState("");
  const [decisionError, setDecisionError] = useState("");
  const [decisionConfirmation, setDecisionConfirmation] = useState("");
  const [history, setHistory] = useState(initialHistory);
  const [historyQuery, setHistoryQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<"Todas" | AuditAction>("Todas");

  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) ?? requests[0];
  const normalizedQuery = normalize(historyQuery.trim());
  const filteredHistory = history.filter((entry) => {
    const matchesQuery =
      !normalizedQuery ||
      normalize(`${entry.actor} ${entry.record}`).includes(normalizedQuery);
    const matchesAction = actionFilter === "Todas" || entry.action === actionFilter;

    return matchesQuery && matchesAction;
  });

  function selectRequest(id: string) {
    setSelectedRequestId(id);
    setJustification("");
    setDecisionError("");
    setDecisionConfirmation("");
  }

  function handleDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const decision = submitter instanceof HTMLButtonElement ? submitter.value : null;
    const trimmedJustification = justification.trim();

    if (decision !== "Aprovação" && decision !== "Rejeição") {
      return;
    }

    if (!trimmedJustification) {
      setDecisionError("Escreva uma justificativa antes de aprovar ou rejeitar.");
      setDecisionConfirmation("");
      return;
    }

    if (selectedRequest.status !== "Pendente") {
      setDecisionError("Esta solicitação já recebeu uma decisão nesta sessão.");
      setDecisionConfirmation("");
      return;
    }

    const nextStatus: RequestStatus =
      decision === "Aprovação" ? "Aprovada" : "Rejeitada";
    const dateTime = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date());

    setRequests((current) =>
      current.map((request) =>
        request.id === selectedRequest.id
          ? { ...request, status: nextStatus }
          : request,
      ),
    );
    setHistory((current) => [
      {
        id: `local-${Date.now()}`,
        dateTime,
        actor: "Marina Costa",
        action: decision,
        record: `${selectedRequest.kind} · ${selectedRequest.student} · ${selectedRequest.className}`,
        justification: trimmedJustification,
      },
      ...current,
    ]);
    setJustification("");
    setDecisionError("");
    setDecisionConfirmation(
      `${decision} simulada para ${selectedRequest.student}. O histórico foi atualizado nesta tela; nada foi persistido.`,
    );
  }

  return (
    <>
      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-brand-red">Coordenação · auditoria · dados fictícios</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[28px]">Auditoria</h1>
          <p className="mt-2 max-w-2xl text-sm leading-[1.5] text-muted">
            Revise pedidos de correção acadêmica e simule decisões com rastreabilidade, sem alterar dados reais.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink">
          Sessão local · não persistente
        </span>
      </header>

      <section className="mt-6" aria-labelledby="audit-kpis-title">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted">Visão da unidade</p>
            <h2 id="audit-kpis-title" className="mt-1 text-lg font-semibold text-ink">Indicadores de auditoria</h2>
          </div>
          <span className="hidden rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-muted sm:inline-flex">Fictício</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {kpis.map((kpi) => (
            <article
              key={kpi.label}
              className="demo-card"
            >
              <p className="text-sm font-semibold text-muted">{kpi.label}</p>
              <p className={`mt-2 text-[32px] font-semibold leading-none tabular-nums ${kpi.valueClassName}`}>
                {kpi.value}
              </p>
              <p className="mt-2 text-[13px] text-muted">{kpi.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="demo-card mt-6"
        aria-labelledby="requests-title"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-muted">Fila de revisão · dados fictícios</p>
            <h2 id="requests-title" className="mt-1 text-lg font-semibold text-ink">Solicitações de correção</h2>
            <p className="mt-1 max-w-2xl text-sm leading-[1.5] text-muted">
              Selecione uma das três solicitações fictícias para consultar os detalhes e registrar uma decisão local.
            </p>
          </div>
          <span className="w-fit rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
            {requests.length} solicitações fictícias
          </span>
        </div>

        <fieldset className="mt-5 space-y-3">
          <legend className="sr-only">Selecione uma solicitação de correção fictícia</legend>
          {requests.map((request) => {
            const isSelected = request.id === selectedRequest.id;

            return (
              <label key={request.id} className="block cursor-pointer">
                <input
                  className="peer sr-only"
                  type="radio"
                  name="audit-request"
                  value={request.id}
                  checked={isSelected}
                  onChange={() => selectRequest(request.id)}
                />
                  <div
                    className={`demo-choice rounded-lg border p-4 transition-colors sm:p-5 ${
                      isSelected
                        ? "border-brand bg-brand/10"
                        : "border-line bg-surface hover:border-brand/40"
                    }`}
                  >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink">{request.kind}</p>
                      <p className="mt-1 text-[13px] text-muted">Solicitação fictícia · {request.id}</p>
                    </div>
                    <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${requestStatusStyles[request.status]}`}>
                      {request.status}
                    </span>
                  </div>

                    <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      <div>
                       <dt className="text-xs font-semibold text-muted">Professor fictício</dt>
                       <dd className="mt-1 text-sm font-semibold text-ink">{request.professor}</dd>
                      </div>
                      <div>
                       <dt className="text-xs font-semibold text-muted">Turma fictícia</dt>
                       <dd className="mt-1 text-sm font-semibold text-ink">{request.className}</dd>
                      </div>
                      <div>
                       <dt className="text-xs font-semibold text-muted">Aluno fictício</dt>
                       <dd className="mt-1 text-sm font-semibold text-ink">{request.student}</dd>
                      </div>
                      <div>
                       <dt className="text-xs font-semibold text-muted">Valor anterior</dt>
                       <dd className="mt-1 text-sm font-semibold text-danger">{request.previousValue}</dd>
                      </div>
                      <div>
                       <dt className="text-xs font-semibold text-muted">Valor novo</dt>
                       <dd className="mt-1 text-sm font-semibold text-success">{request.newValue}</dd>
                      </div>
                      <div className="sm:col-span-2 lg:col-span-5">
                       <dt className="text-xs font-semibold text-muted">Motivo informado</dt>
                       <dd className="mt-1 text-sm leading-[1.5] text-muted">{request.reason}</dd>
                      </div>
                  </dl>
                </div>
              </label>
            );
          })}
        </fieldset>

        <div className="mt-6 grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
          <div className="rounded-lg border border-line bg-canvas p-4 sm:p-5">
            <p className="text-xs font-semibold text-muted">Solicitação selecionada</p>
            <h3 className="mt-1 text-lg font-semibold text-ink">{selectedRequest.student}</h3>
            <p className="mt-1 text-sm text-muted">
              {selectedRequest.kind} · {selectedRequest.className} · professor fictício {selectedRequest.professor}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-ink">{selectedRequest.previousValue}</span>
              <span className="text-muted" aria-hidden="true">→</span>
              <span className="font-semibold text-success">{selectedRequest.newValue}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${requestStatusStyles[selectedRequest.status]}`}>
                {selectedRequest.status}
              </span>
            </div>
          </div>

          <form className="rounded-lg border border-line p-4 sm:p-5" onSubmit={handleDecision} noValidate>
            <fieldset>
              <legend className="text-base font-semibold text-ink">Decisão da Coordenação</legend>
              <p id="decision-help" className="mt-1 text-[13px] leading-5 text-muted">
                A justificativa é obrigatória para qualquer decisão fictícia.
              </p>
              <label htmlFor="decision-justification" className="mt-4 block text-xs font-semibold text-ink">
                Justificativa obrigatória
              </label>
              <textarea
                id="decision-justification"
                name="justification"
                value={justification}
                onChange={(event) => {
                  setJustification(event.target.value);
                  setDecisionError("");
                }}
                required
                rows={4}
                aria-invalid={Boolean(decisionError)}
                aria-describedby={decisionError ? "decision-help decision-error" : "decision-help"}
                placeholder="Ex.: Evidência conferida pela Coordenação..."
                className={`demo-control mt-2 ${decisionError ? "border-danger focus:border-danger" : ""}`}
              />
              {decisionError ? (
                <p id="decision-error" className="mt-2 text-sm font-semibold text-danger" role="status" aria-live="polite">
                  {decisionError}
                </p>
              ) : null}
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="submit"
                  name="decision"
                  value="Aprovação"
                  disabled={selectedRequest.status !== "Pendente"}
                  className="demo-button inline-flex items-center justify-center gap-2 bg-success text-white hover:bg-success/90"
                >
                  <Icon name="attendance" className="h-4 w-4" />
                  Aprovar
                </button>
                <button
                  type="submit"
                  name="decision"
                  value="Rejeição"
                  disabled={selectedRequest.status !== "Pendente"}
                  className="demo-button inline-flex items-center justify-center gap-2 bg-danger text-white hover:bg-danger/90"
                >
                  <Icon name="alert" className="h-4 w-4" />
                  Rejeitar
                </button>
              </div>
              <p className="mt-3 min-h-10 text-sm font-semibold text-success" role="status" aria-live="polite">
                {decisionConfirmation}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-muted">
                A decisão altera somente o estado local desta sessão demonstrativa e adiciona um log fictício no histórico.
              </p>
            </fieldset>
          </form>
        </div>
      </section>

      <section
        className="demo-card mt-6"
        aria-labelledby="history-title"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-muted">Rastreabilidade · dados fictícios</p>
            <h2 id="history-title" className="mt-1 text-lg font-semibold text-ink">Histórico de auditoria</h2>
            <p className="mt-1 max-w-2xl text-sm leading-[1.5] text-muted">
              Consulte os eventos demonstrativos por ator ou entidade e filtre pela ação registrada.
            </p>
          </div>
          <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand" aria-live="polite">
            {filteredHistory.length} {filteredHistory.length === 1 ? "registro" : "registros"}
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(190px,0.7fr)]">
          <div>
            <label htmlFor="history-search" className="text-xs font-semibold text-ink">
              Buscar por ator ou entidade
            </label>
            <input
              id="history-search"
              type="search"
              value={historyQuery}
              onChange={(event) => setHistoryQuery(event.target.value)}
              placeholder="Ex.: Marina ou correção de nota"
              className={controlClassName}
            />
          </div>
          <div>
            <label htmlFor="history-action" className="text-xs font-semibold text-ink">Filtrar por ação</label>
            <select
              id="history-action"
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value as "Todas" | AuditAction)}
              className={controlClassName}
            >
              <option value="Todas">Todas as ações</option>
              {auditActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-line">
          <div className="overflow-x-auto">
            <table className="min-w-[820px] w-full border-collapse text-left text-sm leading-[1.5]">
              <caption className="sr-only">
                Histórico de auditoria fictício com data e hora, ator, ação, registro e justificativa.
              </caption>
              <thead className="bg-canvas text-xs font-semibold text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Data e hora</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Ator (fictício)</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Ação</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Registro (entidade fictícia)</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Justificativa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((entry) => (
                    <tr key={entry.id} className="align-top text-muted">
                      <td className="whitespace-nowrap px-4 py-4 text-[13px] text-muted">{entry.dateTime}</td>
                      <td className="px-4 py-4 font-semibold text-ink">{entry.actor}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${actionStyles[entry.action]}`}>
                          {entry.action}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-ink">{entry.record}</td>
                      <td className="max-w-sm px-4 py-4 leading-6">{entry.justification}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <p className="font-semibold text-ink">Nenhum registro fictício encontrado.</p>
                      <p className="mt-1 text-[13px] text-muted">
                        Ajuste a busca ou selecione outra ação para consultar o histórico demonstrativo.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-[13px] text-muted">
          Histórico local da demonstração · recarregar a página descarta decisões e filtros.
        </p>
      </section>
    </>
  );
}
