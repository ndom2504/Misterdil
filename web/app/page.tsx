import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const features = [
  {
    icon: "📦",
    title: "Adresse au Canada",
    desc: "Recevez une adresse de livraison dédiée pour vos achats en ligne au Canada.",
  },
  {
    icon: "🚚",
    title: "Livraison mondiale",
    desc: "Expédiez vos colis vers l'Afrique, l'Europe, les Amériques et au-delà.",
  },
  {
    icon: "💰",
    title: "Prix optimisés",
    desc: "Regroupement de colis pour réduire significativement les frais d'expédition.",
  },
  {
    icon: "📸",
    title: "Suivi des colis",
    desc: "Photos à réception, poids réel et tracking en temps réel jusqu'à la livraison.",
  },
  {
    icon: "🔔",
    title: "Notifications",
    desc: "Alertes à chaque étape : réception, paiement, expédition, arrivée, livraison.",
  },
  {
    icon: "🛡️",
    title: "Sécurité",
    desc: "Assurance colis, stockage sécurisé et paiements protégés.",
  },
];

const steps = [
  { n: "01", title: "Créez votre compte", desc: "Inscription en quelques minutes." },
  { n: "02", title: "Recevez votre adresse", desc: "Adresse de transit au Canada avec ID client unique." },
  { n: "03", title: "Commandez en ligne", desc: "Utilisez votre adresse Misterdil sur Amazon.ca, Walmart…" },
  { n: "04", title: "Expédiez partout", desc: "Choisissez livraison domicile ou point relais, payez et suivez." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-16 lg:px-8 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-teal-100/40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-1 text-sm font-medium text-teal-800">
            Package Forwarding · Canada → Monde
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Vos colis du Canada,{" "}
            <span className="bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent">
              partout dans le monde
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Misterdil est une plateforme de réexpédition internationale : recevez une adresse au
            Canada, faites livrer vos achats en ligne, et expédiez vos produits en toute simplicité
            vers votre pays.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-xl bg-teal-700 px-8 text-sm font-semibold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800">
              Commencer gratuitement
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-xl border border-slate-200 bg-white px-8 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Voir comment ça marche
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            30 jours de stockage gratuit · Cameroun, Côte d&apos;Ivoire, Sénégal, France & plus
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-slate-100 bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mt-3 text-slate-600">
              Une expérience complète, de la réception au Canada jusqu&apos;à votre porte.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition hover:border-teal-100 hover:bg-white hover:shadow-lg hover:shadow-slate-100">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Comment ça marche</h2>
            <p className="mt-3 text-slate-600">Quatre étapes simples pour recevoir vos colis.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <span className="text-4xl font-bold text-teal-100">{s.n}</span>
                <h3 className="mt-2 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Auth */}
      <section id="cta" className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Rejoignez Misterdil aujourd&apos;hui
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Créez votre compte, obtenez votre adresse de transit au Canada et commencez à expédier
            vos colis partout dans le monde.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-xl bg-white px-8 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Créer un compte
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-xl border border-slate-600 px-8 text-sm font-semibold text-white transition hover:bg-slate-800">
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-10 text-center text-sm text-slate-500 lg:px-8">
        <p className="font-medium text-slate-700">Misterdil</p>
        <p className="mt-1">Vos colis du Canada, partout dans le monde.</p>
        <p className="mt-4">© {new Date().getFullYear()} Misterdil. Tous droits réservés.</p>
      </footer>
    </main>
  );
}
