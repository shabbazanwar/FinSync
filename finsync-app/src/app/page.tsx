import Link from "next/link";
import { redirect } from "next/navigation";
import {
  HiOutlineChartBar,
  HiOutlineChartPie,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineFlag,
  HiOutlineSwitchHorizontal,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import { auth } from "@/auth";
import { Logo } from "@/components/Logo";
import { HeroPreviewPanel } from "@/components/marketing/HeroPreviewPanel";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import {
  BudgetSpotlightMockup,
  ForecastSpotlightMockup,
} from "@/components/marketing/SpotlightMockups";

const features = [
  {
    icon: HiOutlineSwitchHorizontal,
    title: "Track income & expenses",
    description:
      "Log transactions by category, add notes, and search your history in seconds.",
  },
  {
    icon: HiOutlineChartPie,
    title: "Set monthly budgets",
    description:
      "Cap spending per category and see exactly how much you have left, in real time.",
  },
  {
    icon: HiOutlineFlag,
    title: "Hit savings goals",
    description:
      "Set a target and deadline, then track your progress with every contribution.",
  },
  {
    icon: HiOutlineCreditCard,
    title: "Stay on top of subscriptions",
    description:
      "See every recurring cost in one place, with your true monthly total.",
  },
  {
    icon: HiOutlineTrendingUp,
    title: "Track your net worth",
    description:
      "Cash plus investments, gain/loss and allocation, all in one view.",
  },
  {
    icon: HiOutlineChartBar,
    title: "See where you're headed",
    description:
      "A 12-month forecast and automatic insights, built from your real data.",
  },
];

const steps = [
  {
    number: "1",
    title: "Create your account",
    description: "Sign up in seconds — no card required.",
  },
  {
    number: "2",
    title: "Log your money",
    description: "Add transactions, budgets, subscriptions and goals.",
  },
  {
    number: "3",
    title: "Watch it work",
    description:
      "Your dashboard, forecast and insights update automatically.",
  },
];

const techStack = [
  "Next.js 16",
  "PostgreSQL",
  "Prisma 7",
  "Auth.js",
  "Tailwind CSS",
  "Recharts",
];

const roadmap = [
  "Recurring transactions — auto-log rent, salary and other regulars",
  "CSV / PDF export of reports",
  "Receipt scanning with OCR",
  "LLM-generated insights, replacing the current rule-based ones",
  "Dark mode",
];

const highlights = [
  "Full-stack Next.js 16 App Router — Server Components for data, Route Handlers for a REST API",
  "Auth.js authentication — bcrypt-hashed passwords, JWT sessions, protected routes",
  "PostgreSQL + Prisma 7 — a fully typed data layer over a real relational schema",
  "Zod-validated API routes for every resource: transactions, budgets, goals, subscriptions, investments",
  "Custom data visualization — Recharts with an accessible, colorblind-safe palette",
  "Animated, responsive UI built with Tailwind CSS v4 and Motion",
];

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero band */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-600 to-teal-700 pb-32">
        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <Link href="/">
            <Logo textClassName="text-xl font-bold text-white" inverse />
          </Link>
          <div className="flex items-center gap-8">
            <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
              <a href="#features" className="hover:text-white">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-white">
                How it works
              </a>
              <a href="#faq" className="hover:text-white">
                FAQ
              </a>
            </nav>
            <nav className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                Sign up
              </Link>
            </nav>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-6 pb-16 sm:px-10 lg:grid-cols-2 lg:pt-10">
          <div>
            <h1 className="animate-fade-up text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Bad with money?
              <br />
              FinSync can help.
            </h1>
            <p
              className="animate-fade-up mt-4 max-w-md text-lg text-emerald-50"
              style={{ animationDelay: "120ms" }}
            >
              Track every naira in and out, set budgets that stick, and watch
              your savings goals go from wishful to real.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/signup"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                Create a free account
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </div>

          <HeroPreviewPanel />
        </div>

        {/* Wave divider */}
        <svg
          className="absolute right-0 bottom-0 left-0 h-16 w-full text-gray-50"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,40 C240,100 480,0 720,30 C960,60 1200,100 1440,50 L1440,100 L0,100 Z"
          />
        </svg>
      </section>

      {/* Tech stack strip */}
      <div className="border-b border-gray-200 bg-gray-50 py-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 sm:flex-row sm:justify-center sm:gap-6">
          <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
            Built with
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <main
        id="features"
        className="flex flex-1 scroll-mt-16 flex-col items-center px-6 py-20 text-center"
      >
        <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
          Everything in one place
        </p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          One dashboard for your entire financial life
        </h2>

        <div className="mt-10 grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="animate-fade-up rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Product spotlight */}
      <section className="bg-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl space-y-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="animate-fade-up text-center lg:text-left">
              <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
                Budgets
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Budgets that keep you honest
              </h2>
              <p className="mt-3 text-gray-500">
                Set a limit per category and watch it fill up as you spend.
                Go over, and it turns red — no surprises at the end of the
                month.
              </p>
            </div>
            <div
              className="animate-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              <BudgetSpotlightMockup />
            </div>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <ForecastSpotlightMockup />
            </div>
            <div className="order-1 text-center lg:order-2 lg:text-left">
              <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
                Forecast
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                See where you&apos;re headed
              </h2>
              <p className="mt-3 text-gray-500">
                FinSync projects your balance 12 months out from your real
                spending average and active subscriptions — not a guess.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-16 bg-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Up and running in under two minutes
          </h2>

          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="animate-fade-up relative"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {i < steps.length - 1 && (
                  <div
                    className="absolute top-6 left-[calc(50%+28px)] hidden h-px w-[calc(100%-56px)] bg-gray-200 sm:block"
                    aria-hidden="true"
                  />
                )}
                <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                  {step.number}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for developers */}
      <section className="bg-gray-900 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              Under the hood
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Built to be a real portfolio piece
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-400">
              FinSync isn&apos;t just a UI mockup — every feature on this page
              is backed by a working API and a real database.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {highlights.map((item, i) => (
              <li
                key={item}
                className="animate-fade-up flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-sm text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
            Roadmap
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            What&apos;s next
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Everything above is live today. Here&apos;s what&apos;s planned
            next — not built yet, but on the list.
          </p>

          <ul className="mt-10 grid gap-3 text-left sm:grid-cols-2">
            {roadmap.map((item, i) => (
              <li
                key={item}
                className="animate-fade-up flex items-start gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <HiOutlineClock className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                <span className="text-sm text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-16 bg-gray-50 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
            FAQ
          </p>
          <h2 className="mt-2 mb-10 text-2xl font-bold text-gray-900 sm:text-3xl">
            Questions, answered
          </h2>
          <FaqAccordion />
        </div>
      </section>

      {/* Closing CTA band */}
      <section className="bg-gray-900 px-6 py-16 text-center sm:px-10">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Get on top of your money today.
        </h2>
        <p className="mt-3 text-gray-400">
          It&apos;s free, it takes two minutes, and no card is required.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400"
        >
          Create a free account
        </Link>
      </section>

      <footer className="border-t border-gray-200 bg-white px-6 py-12 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
          <div>
            <Logo
              iconClassName="h-7 w-7"
              textClassName="text-lg font-bold text-emerald-700"
            />
            <p className="mt-2 max-w-xs text-sm text-gray-500">
              A personal finance dashboard for tracking spending, budgets,
              goals, subscriptions and net worth — built as a full-stack
              portfolio project.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#features" className="text-gray-600 hover:text-emerald-700">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 hover:text-emerald-700">
                  How it works
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-600 hover:text-emerald-700">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Account
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-gray-600 hover:text-emerald-700">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-600 hover:text-emerald-700">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} FinSync. Built as a portfolio project.
        </div>
      </footer>
    </div>
  );
}
