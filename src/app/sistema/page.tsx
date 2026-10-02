import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { getSchoolAccess } from "@/lib/access";
import { hasUnitRole, READ_ROLES } from "@/lib/school-rules";

export default async function SistemaPage() {
  const access = await getSchoolAccess();
  const canAccessCadastros =
    access.status === "authorized" &&
    access.memberships.some((membership) =>
      hasUnitRole(access.memberships, membership.unitId, READ_ROLES),
    );

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex min-h-20 w-full max-w-[1180px] items-center justify-between gap-4 px-3 sm:px-6">
          <Image
            src="/radar-logo.png"
            alt="Sistema Educacional Radar"
            width={200}
            height={82}
            priority
            className="h-auto w-44"
          />
          <UserButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] px-3 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-red">
          Área autenticada
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Sistema escolar</h1>

        {access.status === "authorized" ? (
          <section className="mt-10 max-w-2xl rounded-xl border border-line bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Unidades e perfis autorizados</h2>
            {(access.user.name || access.user.email) && (
              <p className="mt-2 text-muted">
                Conta: {access.user.name ?? access.user.email}
              </p>
            )}
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {access.memberships.map((membership) => (
                <li
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                  key={membership.id}
                >
                  <span className="font-medium">{membership.unit.name}</span>
                  <span className="rounded-md bg-canvas px-2 py-1 text-xs font-semibold text-brand">
                    {membership.role}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {canAccessCadastros ? (
                <Link
                  href="/sistema/cadastros"
                  className="demo-button inline-flex items-center justify-center bg-brand text-white hover:bg-ink"
                >
                  Abrir cadastros
                </Link>
              ) : null}
              <p className="text-sm text-muted">Diário ainda indisponível nesta etapa.</p>
            </div>
          </section>
        ) : access.status === "setup-required" ? (
          <section className="mt-10 max-w-2xl rounded-xl border border-line bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Banco de dados não configurado</h2>
            <p className="mt-3 text-muted">
              O ambiente ainda não está configurado para consultar os acessos do sistema.
              Nenhum dado fictício será exibido.
            </p>
          </section>
        ) : access.status === "pending-access" ? (
          <section className="mt-10 max-w-2xl rounded-xl border border-line bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Acesso não autorizado</h2>
            <p className="mt-3 text-muted">
              Seu login foi autenticado, mas sua conta ainda não possui vínculo com uma
              unidade escolar. O login não concede permissões automaticamente.
            </p>
          </section>
        ) : (
          <section className="mt-10 max-w-2xl rounded-xl border border-line bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Sistema indisponível</h2>
            <p className="mt-3 text-muted">
              Não foi possível consultar seus acessos agora. Tente novamente mais tarde.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
