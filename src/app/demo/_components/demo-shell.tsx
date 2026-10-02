import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { DemoBadge } from "./demo-badge";
import { DemoNavigation } from "./demo-navigation";
import { Icon } from "./icon";

export function DemoShell({ children }: { children: ReactNode }) {
  return (
    <div className="demo-app min-h-screen bg-canvas text-ink">
      <a
        href="#demo-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo principal
      </a>

      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden min-h-screen border-r border-line bg-surface lg:flex lg:flex-col">
          <div className="px-5 pb-6 pt-6">
            <Link href="/" aria-label="Voltar para a página inicial do Radar">
              <Image
                src="/radar-logo.png"
                alt="Sistema Educacional Radar"
                width={400}
                height={164}
                priority
                className="h-auto w-[180px]"
              />
            </Link>
            <div className="mt-7 flex items-start gap-3 border-t border-line pt-5">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-muted">Unidade</p>
                <p className="mt-1 text-sm font-semibold text-ink">Radar — Unidade Centro</p>
              </div>
            </div>
          </div>

          <nav className="px-3" aria-label="Navegação principal">
            <p className="px-3 pb-2 text-xs font-semibold text-muted">Gestão escolar</p>
            <DemoNavigation />
          </nav>

          <div className="mt-auto px-5 pb-5">
            <div className="border-t border-line pt-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand" aria-hidden="true">DE</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">Visão de demonstração</p>
                  <p className="mt-0.5 text-xs text-muted">Todos os perfis</p>
                </div>
              </div>
              <Link className="mt-4 flex items-center gap-2 px-1 text-xs font-semibold text-muted transition-colors hover:text-brand" href="/">
                <Icon name="logout" className="h-4 w-4" />
                Sair da demonstração
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="flex min-h-[64px] items-center justify-between gap-4 border-b border-line bg-surface px-4 sm:px-6 lg:hidden">
            <Link href="/" aria-label="Voltar para a página inicial do Radar">
              <Image src="/radar-logo.png" alt="Sistema Educacional Radar" width={400} height={164} priority className="h-auto w-[160px]" />
            </Link>
            <span className="text-xs font-semibold text-muted">Todos os perfis</span>
          </header>

          <header className="hidden min-h-[64px] items-center justify-between gap-4 border-b border-line bg-surface px-8 lg:flex">
            <div>
              <p className="text-xs text-muted">Unidade</p>
              <p className="text-sm font-semibold text-ink">Radar — Unidade Centro</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-ink">Ano letivo 2026</span>
              <span className="rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">Demonstração</span>
            </div>
          </header>

          <nav className="sticky top-0 z-20 max-w-full overflow-x-auto border-b border-line bg-surface px-3 py-2.5 lg:hidden" aria-label="Navegação da demonstração">
            <DemoNavigation mobile />
          </nav>

          <main id="demo-main" className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            <section className="flex flex-col gap-3 rounded-xl border border-brand/20 bg-brand/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5" aria-label="Aviso de demonstração">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-brand" aria-hidden="true">
                  <Icon name="activity" className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Você está em uma demonstração pública.</p>
                  <p className="mt-0.5 text-[13px] leading-5 text-muted">Os dados exibidos são fictícios e nenhuma alteração é persistida.</p>
                </div>
              </div>
              <DemoBadge>Dados fictícios</DemoBadge>
            </section>

            {children}

            <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between lg:hidden">
              <span>Visão de demonstração · todos os perfis</span>
              <Link className="inline-flex items-center gap-2 font-semibold text-brand hover:text-ink" href="/">
                <Icon name="logout" className="h-4 w-4" />
                Sair da demonstração
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
