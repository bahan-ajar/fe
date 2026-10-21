import { LoginHeader } from "./components/LoginHeader";
import { LoginForm } from "./components/LoginForm";
import { LoginFooter } from "./components/LoginFooter";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-50/70">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <LoginHeader />
          <LoginForm />
        </div>
        <LoginFooter />
      </div>
    </main>
  );
}
