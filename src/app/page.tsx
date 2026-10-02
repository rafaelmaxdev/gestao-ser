import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const profiles = [
  {
    name: "Direção",
    description: "Acompanhe indicadores e decisões estratégicas da escola.",
  },
  {
    name: "Coordenação",
    description: "Organize rotinas pedagógicas e acompanhe as turmas.",
  },
  {
    name: "Secretaria",
    description: "Centralize registros e torne o atendimento mais ágil.",
  },
  {
    name: "Professor",
    description: "Planeje aulas e consulte as informações da sua turma.",
  },
  {
    name: "Aluno",
    description: "Acompanhe sua jornada e mantenha as atividades em dia.",
  },
];

const previewMetrics = [
  { value: "218", label: "alunos" },
  { value: "94,2%", label: "frequência" },
  { value: "7", label: "pendências" },
];

const demoFeatures = [
  "Indicadores e frequência por turma",
  "Alunos e matrículas",
  "Diário de classe com chamada e notas",
  "Portal do aluno e auditoria",
];

export default function Home() {
  return (
    <div className={styles.page} id="inicio">
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerInner}`}>
          <Link href="#inicio" aria-label="Voltar ao início">
            <Image
              className={styles.logo}
              src="/radar-logo.png"
              alt="Sistema Educacional Radar"
              width={400}
              height={164}
              priority
            />
            </Link>
            <nav className={styles.headerActions} aria-label="Acesso">
             <Link className={styles.headerSecondary} href="/demo">
               Ver demonstração
             </Link>
             <Link className={styles.headerCta} href="/sistema">
               Acessar sistema
             </Link>
           </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={`${styles.container} ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>Sistema educacional</p>
              <h1 id="hero-title">
                Gestão escolar simples, conectada e transparente
              </h1>
              <p className={styles.heroText}>
                O Radar aproxima pessoas, rotinas e decisões para que toda a
                comunidade escolar avance na mesma direção.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} href="/sistema">
                  Acessar sistema
                </Link>
                <Link className={styles.textLink} href="/demo">
                  Ver demonstração <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <article className={styles.heroCard} aria-labelledby="preview-title">
                <div className={styles.previewHeader}>
                  <span className={styles.previewEyebrow}>Prévia da demonstração</span>
                  <span className={styles.previewStatus}>Dados fictícios</span>
                </div>

                <div className={styles.previewContent}>
                  <p className={styles.previewKicker}>Radar · visão acadêmica</p>
                  <h2 id="preview-title" className={styles.previewTitle}>
                    A escola inteira em uma visão clara.
                  </h2>
                  <p className={styles.previewText}>
                    Indicadores, registros e acompanhamento reunidos para orientar
                    as próximas decisões.
                  </p>
                </div>

                <dl className={styles.previewMetrics}>
                  {previewMetrics.map((metric) => (
                    <div className={styles.previewMetric} key={metric.label}>
                      <dt className={styles.previewMetricLabel}>{metric.label}</dt>
                      <dd className={styles.previewMetricValue}>{metric.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className={styles.previewFeatures}>
                  <p className={styles.previewFeaturesLabel}>Na demonstração</p>
                  <ul className={styles.featureList}>
                    {demoFeatures.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          className={styles.profilesSection}
          id="perfis"
          aria-labelledby="profiles-title"
        >
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.kicker}>Para toda a comunidade escolar</p>
              <h2 id="profiles-title">Uma visão para cada perfil.</h2>
              <p>
                Cada pessoa encontra no Radar uma forma mais clara de cuidar
                da sua parte na jornada escolar.
              </p>
            </div>

            <div className={styles.profileGrid}>
              {profiles.map((profile, index) => (
                <article className={styles.profileCard} key={profile.name}>
                  <span className={styles.profileNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{profile.name}</h3>
                  <p>{profile.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.accessSection} id="acesso" aria-labelledby="access-title">
          <div className={`${styles.container} ${styles.accessLayout}`}>
            <div>
              <p className={styles.kicker}>Próximo passo</p>
              <h2 id="access-title">
                Acesse o sistema com suas credenciais.
              </h2>
            </div>
            <div className={styles.accessNote}>
              <p>
                Faça login para consultar as unidades e os perfis autorizados para
                sua conta. Cadastros e diário serão habilitados na próxima etapa.
              </p>
              <Link className={styles.secondaryButton} href="/sistema">
                Acessar sistema
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>Protótipo Sistema Educacional Radar</p>
        </div>
      </footer>
    </div>
  );
}
