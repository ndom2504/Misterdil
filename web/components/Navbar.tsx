import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-lg">
            📦
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900">Misterdil</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-teal-700">
            Fonctionnalités
          </a>
          <a href="#how-it-works" className="transition hover:text-teal-700">
            Comment ça marche
          </a>
          <a href="#cta" className="transition hover:text-teal-700">
            Commencer
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            Connexion
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800">
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </header>
  );
}
