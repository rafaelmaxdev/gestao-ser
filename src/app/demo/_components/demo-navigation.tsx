"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./icon";

type NavItem = {
  label: string;
  href: string;
  icon: IconName;
};

const navigation: NavItem[] = [
  { label: "Visão geral", href: "/demo", icon: "grid" },
  { label: "Alunos", href: "/demo/alunos", icon: "users" },
  { label: "Portal do aluno", href: "/demo/aluno", icon: "users" },
  { label: "Diário de classe", href: "/demo/diario", icon: "document" },
  { label: "Auditoria", href: "/demo/auditoria", icon: "activity" },
];

export function DemoNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname() ?? "";

  return (
    <ul className={mobile ? "flex min-w-max gap-1" : "space-y-1"}>
      {navigation.map((item) => {
        const active =
          item.href === "/demo"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-10 items-center rounded-lg border-l-2 ${
                mobile ? "gap-2 px-3 py-2 text-sm" : "gap-3 px-3 py-2.5 text-sm"
              } ${
                active
                  ? "border-brand bg-brand/10 font-semibold text-brand"
                  : "border-transparent text-muted transition-colors hover:bg-canvas hover:text-brand"
              }`}
            >
              <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
