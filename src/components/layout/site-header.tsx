import Link from "next/link";
import { Suspense } from "react";
import { getTopCategories } from "@/server/queries/content";
import { Logo } from "@/components/ui/logo";
import { HeaderSearch } from "@/components/search/header-search";
import { MainNav, MobileNav } from "./main-nav";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu, UserMenuMobile } from "./user-menu";

export async function SiteHeader() {
  const categories = (await getTopCategories()).map((c) => ({
    name: c.name,
    path: c.path,
    icon: c.icon,
    articleCount: c.articleCount,
  }));
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
      >
        Saltar al contenido
      </a>
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-fg" aria-label="ALEXANDRIA, ir al inicio">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="ml-4 flex-1">
          <MainNav categories={categories} />
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <HeaderSearch />
          <ThemeToggle />
          <div className="hidden xl:block">
            <Suspense fallback={<span className="inline-block h-9 w-24 rounded-full bg-surface-2" />}>
              <UserMenu />
            </Suspense>
          </div>
          <MobileNav
            categories={categories}
            userSlot={
              <Suspense fallback={null}>
                <UserMenuMobile />
              </Suspense>
            }
          />
        </div>
      </div>
    </header>
  );
}

