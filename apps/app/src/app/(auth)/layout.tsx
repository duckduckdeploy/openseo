import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <p className="mb-6 text-xl">
          <Logo />
        </p>
        {children}
      </div>
    </main>
  );
}
