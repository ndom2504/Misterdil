import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto flex max-w-md flex-col px-6 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Créer un compte</h1>
          <p className="mt-2 text-sm text-slate-600">
            Recevez votre adresse de transit au Canada et expédiez vos colis partout dans le monde.
          </p>

          <form className="mt-8 space-y-4" action="#" method="post">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
                  Prénom
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="John"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
                  Nom
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="votre@email.com"
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                Téléphone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+237 6XX XXX XXX"
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-slate-700">
                Pays de destination
              </label>
              <input
                id="country"
                name="country"
                placeholder="Cameroun"
                defaultValue="Cameroun"
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="Minimum 6 caractères"
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-teal-700 py-3 text-sm font-semibold text-white transition hover:bg-teal-800">
              Créer mon compte
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-800">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
