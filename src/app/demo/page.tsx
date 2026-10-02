import Link from "next/link";
import { Icon } from "./_components/icon";

const kpis = [
  {
    label: "Alunos matriculados",
    value: "218",
    description: "estudantes ativos",
    icon: "users" as const,
    tone: "blue" as const,
  },
  {
    label: "Turmas em andamento",
    value: "12",
    description: "turmas acompanhadas",
    icon: "grid" as const,
    tone: "red" as const,
  },
  {
    label: "Frequência média",
    value: "94,2%",
    description: "no período letivo",
    icon: "attendance" as const,
    tone: "green" as const,
  },
  {
    label: "Lançamentos pendentes",
    value: "7",
    description: "revisões necessárias",
    icon: "clock" as const,
    tone: "amber" as const,
  },
];

const classes = [
  { name: "1º A", value: 97.4 },
  { name: "1º B", value: 96.1 },
  { name: "2º A", value: 94.8 },
  { name: "2º B", value: 93.9 },
  { name: "3º A", value: 92.7 },
  { name: "3º B", value: 91.5 },
  { name: "4º A", value: 90.6 },
  { name: "4º B", value: 89.8 },
  { name: "5º A", value: 95.2 },
  { name: "5º B", value: 94.3 },
  { name: "6º A", value: 92.1 },
  { name: "6º B", value: 90.4 },
];

const alertItems = [
  {
    title: "Frequência abaixo do esperado",
    description: "3 turmas precisam de acompanhamento",
    label: "Faltas",
    icon: "alert" as const,
    tone: "red" as const,
    href: "/demo/diario",
  },
  {
    title: "Lançamentos aguardando revisão",
    description: "7 registros no diário de classe",
    label: "Notas pendentes",
    icon: "clock" as const,
    tone: "amber" as const,
    href: "/demo/diario",
  },
  {
    title: "Matrículas para conferir",
    description: "5 solicitações no fluxo de análise",
    label: "Matrícula",
    icon: "users" as const,
    tone: "blue" as const,
    href: "/demo/alunos",
  },
];

const kpiToneClasses = {
  blue: {
    icon: "bg-brand/10 text-brand",
    value: "text-brand",
  },
  red: {
    icon: "bg-danger/10 text-danger",
    value: "text-brand",
  },
  green: {
    icon: "bg-success/10 text-success",
    value: "text-success",
  },
  amber: {
    icon: "bg-warning/10 text-warning",
    value: "text-warning",
  },
} as const;

const alertToneClasses = {
  red: "bg-danger/10 text-danger",
  amber: "bg-warning/10 text-warning",
  blue: "bg-brand/10 text-brand",
} as const;

export default function DemoPage() {
  return (
    <>
      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-brand-red">Visão executiva · dados fictícios</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[28px]">Bom dia, Marina.</h1>
          <p className="mt-2 max-w-xl text-sm leading-[1.5] text-muted">Um resumo claro para orientar as próximas decisões da Radar — Unidade Centro.</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink">
          <Icon name="calendar" className="h-[18px] w-[18px] text-brand" />
          Ano letivo 2026
        </div>
      </header>

      <section className="mt-6" aria-labelledby="kpi-title">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted">Resumo executivo</p>
            <h2 id="kpi-title" className="mt-1 text-lg font-semibold text-ink">Indicadores principais</h2>
          </div>
          <span className="hidden rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-muted sm:inline-flex">Dados fictícios</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => {
            const tone = kpiToneClasses[kpi.tone];

            return (
              <article className="demo-card" key={kpi.label}>
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone.icon}`}>
                    <Icon name={kpi.icon} className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-canvas px-2 py-1 text-xs font-semibold text-muted">Demo</span>
                </div>
                <p className="mt-5 text-sm font-semibold text-muted">{kpi.label}</p>
                <p className={`mt-1 text-[32px] font-semibold leading-none tabular-nums ${tone.value}`}>{kpi.value}</p>
                <p className="mt-2 text-[13px] text-muted">{kpi.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
        <section className="demo-card" aria-labelledby="attendance-title">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 id="attendance-title" className="text-lg font-semibold text-ink">Frequência por turma</h2>
                <span className="rounded-full bg-canvas px-2 py-1 text-xs font-semibold text-muted">Fictício</span>
              </div>
              <p className="mt-1 text-[13px] text-muted">Acompanhamento ilustrativo da semana atual.</p>
            </div>
            <div className="flex gap-3 text-xs font-semibold text-muted" aria-label="Legenda das barras de frequência">
              <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />No ritmo</span>
              <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-danger" aria-hidden="true" />Atenção</span>
            </div>
          </div>
          <ul className="mt-6 grid gap-x-7 gap-y-5 md:grid-cols-2">
            {classes.map((item) => (
              <li className="min-w-0" key={item.name}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-ink">{item.name}</span>
                  <span className="font-semibold text-brand">{item.value.toFixed(1).replace(".", ",")}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-label={`Frequência fictícia da turma ${item.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.value}>
                  <span className={`block h-full rounded-full ${item.value >= 90 ? "bg-brand" : "bg-danger"}`} style={{ width: `${item.value}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[13px]">
            <span className="text-muted">12 turmas · dados de demonstração</span>
            <Link className="inline-flex items-center gap-1 font-semibold text-brand hover:text-ink" href="/demo/diario">Ver diário <Icon name="arrow" className="h-3.5 w-3.5" /></Link>
          </div>
        </section>

        <section className="demo-card" aria-labelledby="alerts-title">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="alerts-title" className="text-lg font-semibold text-ink">Alertas para acompanhar</h2>
              <p className="mt-1 text-[13px] text-muted">Ações sugeridas para esta demonstração.</p>
            </div>
            <span className="rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">3 alertas</span>
          </div>
          <ul className="mt-5 divide-y divide-line">
            {alertItems.map((item) => (
              <li key={item.title}>
                <Link className="group flex gap-3 py-4 first:pt-0 last:pb-0" href={item.href}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${alertToneClasses[item.tone]}`}>
                    <Icon name={item.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold leading-5 text-ink group-hover:text-brand">{item.title}</span>
                      <Icon name="arrow" className="mt-0.5 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                    </span>
                    <span className="mt-1 block text-[13px] leading-5 text-muted">{item.description}</span>
                    <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${alertToneClasses[item.tone]}`}>{item.label} · fictício</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="demo-card" aria-labelledby="agenda-title">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="agenda-title" className="text-lg font-semibold text-ink">Agenda da unidade</h2>
              <p className="mt-1 text-[13px] text-muted">Próximas atividades · dados fictícios.</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand"><Icon name="calendar" className="h-[18px] w-[18px]" /></span>
          </div>
          <ol className="mt-6 space-y-4">
            <li className="flex gap-4">
              <time className="w-12 shrink-0 pt-0.5 text-sm font-semibold text-brand" dateTime="2026-05-18T08:00">08:00</time>
              <div className="border-l border-line pl-4">
                <p className="text-sm font-semibold text-ink">Reunião pedagógica</p>
                <p className="mt-1 text-[13px] text-muted">Sala 2 · hoje · demonstração</p>
              </div>
            </li>
            <li className="flex gap-4">
              <time className="w-12 shrink-0 pt-0.5 text-sm font-semibold text-brand" dateTime="2026-05-18T10:30">10:30</time>
              <div className="border-l border-line pl-4">
                <p className="text-sm font-semibold text-ink">Conselho de classe</p>
                <p className="mt-1 text-[13px] text-muted">Auditório · hoje · demonstração</p>
              </div>
            </li>
            <li className="flex gap-4">
              <time className="w-12 shrink-0 pt-0.5 text-sm font-semibold text-brand" dateTime="2026-05-19T14:00">14:00</time>
              <div className="border-l border-line pl-4">
                <p className="text-sm font-semibold text-ink">Plantão com famílias</p>
                <p className="mt-1 text-[13px] text-muted">Sala multiuso · amanhã · demonstração</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="demo-card" aria-labelledby="activity-title">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="activity-title" className="text-lg font-semibold text-ink">Atividade recente</h2>
              <p className="mt-1 text-[13px] text-muted">Movimentações ilustrativas do ambiente.</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success"><Icon name="activity" className="h-[18px] w-[18px]" /></span>
          </div>
          <ul className="mt-5 space-y-1">
            <li className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-canvas">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success"><Icon name="attendance" className="h-4 w-4" /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">Diário de classe atualizado</p>
                <p className="mt-1 text-[13px] text-muted">8º A · há 12 min · fictício</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-canvas">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"><Icon name="activity" className="h-4 w-4" /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">Frequência consolidada</p>
                <p className="mt-1 text-[13px] text-muted">Semana 18 · há 35 min · fictício</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-canvas">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning"><Icon name="users" className="h-4 w-4" /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">Nova matrícula registrada</p>
                <p className="mt-1 text-[13px] text-muted">Transferência · ontem · fictício</p>
              </div>
            </li>
          </ul>
        </section>
      </div>

    </>
  );
}
