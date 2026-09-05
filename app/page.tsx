import { LinkButton } from "@/components/ui";

const features = [
  {
    title: "Top up",
    description: "Deposit funds into your wallet balance in seconds.",
  },
  {
    title: "Transfer",
    description: "Send money to any wallet in the system by its UUID.",
  },
  {
    title: "Track",
    description: "Every deposit and transfer is recorded and visible.",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="mx-auto max-w-3xl py-16 text-center">
        <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          Mock e-wallet demo
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Send and receive money, instantly.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-zinc-500">
          A simple mock wallet to top up your balance and transfer funds to
          other wallets. Built as a take-home frontend test.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <LinkButton href="/register">Create account</LinkButton>
          <LinkButton href="/login" variant="secondary">
            Sign in
          </LinkButton>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-sm font-semibold text-zinc-900">
                {feature.title}
              </h2>
              <p className="mt-1.5 text-sm text-zinc-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}