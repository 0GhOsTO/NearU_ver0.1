import Link from 'next/link';
import {
  ShoppingBag, BookOpen, Briefcase, Package,
  Car, Users, MessageCircle, MapPin, ArrowRight,
  Shield, Star, Zap,
} from 'lucide-react';

const features = [
  {
    icon: ShoppingBag, title: 'Marketplace',  href: '/marketplace',
    description: 'Buy and sell textbooks, furniture, and gear — all within walking distance.',
    iconBg: 'bg-amber-100',   iconColor: 'text-amber-600',  hoverBorder: 'hover:border-amber-300',  hoverBg: 'group-hover:bg-amber-600',
  },
  {
    icon: BookOpen,    title: 'Borrow & Lend', href: '/borrow',
    description: 'Need a drill for an afternoon? Borrow from a neighbor instead of buying.',
    iconBg: 'bg-violet-100',  iconColor: 'text-violet-600', hoverBorder: 'hover:border-violet-300', hoverBg: 'group-hover:bg-violet-600',
  },
  {
    icon: Briefcase,   title: 'Small Gigs',   href: '/gigs',
    description: 'Post or pick up micro-tasks: grocery runs, moving help, airport pickups.',
    iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',hoverBorder: 'hover:border-emerald-300',hoverBg: 'group-hover:bg-emerald-600',
  },
  {
    icon: Package,     title: 'SafeDrop',      href: '/safedrop',
    description: "Have a neighbor hold your package while you're away. Safe and local.",
    iconBg: 'bg-orange-100',  iconColor: 'text-orange-600', hoverBorder: 'hover:border-orange-300', hoverBg: 'group-hover:bg-orange-600',
  },
  {
    icon: Car,         title: 'Group Ride',   href: '/group-ride',
    description: 'Split ride costs for Costco runs, IKEA trips, or airport drop-offs.',
    iconBg: 'bg-cyan-100',    iconColor: 'text-cyan-600',   hoverBorder: 'hover:border-cyan-300',   hoverBg: 'group-hover:bg-cyan-600',
  },
  {
    icon: Users,       title: 'Group Hangout',href: '/hangout',
    description: 'Organize boba runs, study groups, and game nights with nearby students.',
    iconBg: 'bg-pink-100',    iconColor: 'text-pink-600',   hoverBorder: 'hover:border-pink-300',   hoverBg: 'group-hover:bg-pink-600',
  },
  {
    icon: MessageCircle, title: 'Messages',   href: '/messages',
    description: 'Chat with neighbors to agree on details and arrange a safe meetup.',
    iconBg: 'bg-blue-100',    iconColor: 'text-nu-blue',    hoverBorder: 'hover:border-blue-300',   hoverBg: 'group-hover:bg-nu-blue',
  },
];

const trust = [
  { icon: Shield, title: 'Verified Members',  description: 'University email verification keeps the community trusted and accountable.', color: 'bg-blue-50 text-nu-blue' },
  { icon: Star,   title: 'Reputation System', description: 'Ratings after every exchange build a track record you can rely on.',           color: 'bg-amber-50 text-amber-600' },
  { icon: Zap,    title: 'Meet On Campus',    description: 'Neighbors are a walk away. Agree in chat, meet in person, settle it yourselves.', color: 'bg-emerald-50 text-emerald-600' },
];

const stats = [
  { value: '2.4k+', label: 'Active members',    color: 'text-nu-blue' },
  { value: '900+',  label: 'Items traded',       color: 'text-amber-500' },
  { value: '4.9',   label: 'Avg. trust rating',  color: 'text-emerald-500' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-nu-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-nu-blue" strokeWidth={2.5} />
            <span
              className="font-display text-xl font-bold"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              NearU
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-nu-muted hover:text-nu-text transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="rounded-lg bg-nu-blue px-4 py-2 text-sm font-semibold text-white hover:bg-nu-blue-dark transition-colors shadow-sm">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — rainbow color strip at bottom */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-nu-blue/25 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-nu-blue mb-7 tracking-wide uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-nu-blue animate-pulse" />
            Built for students
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[1.08] tracking-tight text-nu-text sm:text-6xl lg:text-7xl">
            Your neighbors are here,<br />
            <span className="text-nu-blue">ready to help.</span>
          </h1>

          <p className="mt-6 text-lg text-nu-muted max-w-xl mx-auto leading-relaxed">
            Students helping students — borrow, trade, pick up gigs, and look out for one another,
            all just a short walk away.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-xl bg-nu-blue px-8 py-3.5 text-base font-bold text-white hover:bg-nu-blue-dark transition-all shadow-blue"
            >
              Meet your neighbors
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-nu-border bg-white px-8 py-3.5 text-base font-semibold text-nu-muted hover:border-nu-blue/40 hover:text-nu-text transition-colors"
            >
              Log in
            </Link>
          </div>

          {/* Stats — each a different color */}
          <div className="mt-14 flex items-center justify-center gap-12 pt-10 border-t border-nu-border">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs text-nu-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rainbow category strip */}
        <div className="flex h-1.5 w-full">
          {['bg-nu-blue','bg-violet-500','bg-emerald-500','bg-amber-500','bg-cyan-500','bg-pink-500','bg-orange-500'].map((c) => (
            <div key={c} className={`flex-1 ${c}`} />
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-nu-border bg-nu-bg">
        <div className="mx-auto max-w-5xl px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {trust.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="flex items-start gap-4">
              <div className={`flex-shrink-0 rounded-xl p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-nu-text text-sm">{title}</p>
                <p className="mt-0.5 text-xs text-nu-muted leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-bold text-nu-text mb-3">
            Seven ways to help each other
          </h2>
          <p className="text-nu-muted">Everything your community needs, in one place.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const isLast = i === features.length - 1;
            return (
              <Link key={feature.title} href={feature.href} className={isLast ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <div className={`group h-full rounded-2xl border border-nu-border bg-white p-6 transition-all ${feature.hoverBorder} hover:shadow-card-md`}>
                  <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.iconBg} ${feature.iconColor} transition-all ${feature.hoverBg} group-hover:text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-nu-text mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-nu-muted leading-relaxed">{feature.description}</p>
                  <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${feature.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-28">
        <div className="rounded-3xl bg-nu-blue p-12 text-center shadow-blue">
          <MapPin className="mx-auto h-8 w-8 text-white/70 mb-4" />
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Ready to meet your neighbors?
          </h2>
          <p className="text-blue-200 mb-8 max-w-md mx-auto">
            Sign up in 30 seconds. No catch, no ads — just your community.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-nu-blue hover:bg-blue-50 transition-colors"
          >
            Create free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-nu-border py-8 text-center text-sm text-nu-dim">
        © 2026 NearU · Built for students, by students.
      </footer>
    </div>
  );
}
