import { useState } from "react";
import { Lock } from "lucide-react";
import { useAdminLogin } from "../../queries/admin";
import { Spinner } from "../ui-kit";

export function AdminLogin({ onLogin }: { onLogin: (token: string, name: string) => void }) {
  const login = useAdminLogin();
  const [name, setName] = useState(() => localStorage.getItem("lk_admin_name") ?? "");
  const [password, setPassword] = useState("");

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-6">
      <img src="/images/gallery-lobby.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login.mutate({ name, password }, { onSuccess: (r) => onLogin(r.token, r.name) });
        }}
        className="panel-gradient grain relative w-full max-w-sm overflow-hidden rounded-[16px] p-8"
      >
        <div className="relative">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10">
            <Lock size={18} />
          </span>
          <p className="eyebrow mt-6">Lūana Kai · Staff</p>
          <h1 className="mt-2 font-display text-3xl font-light">Guest inbox</h1>
          <p className="mt-2 text-[13px] text-mist">Sign in to answer live chats, review booking requests and enquiries.</p>
          <div className="mt-8 space-y-5">
            <input className="field" aria-label="Your first name (shown to guests)" placeholder="Your first name (shown to guests)" required maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />
            <input className="field" type="password" aria-label="Staff password" placeholder="Staff password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {login.error && <p className="mt-4 text-[12px] text-red-300">{login.error.message}</p>}
          <button disabled={login.isPending} className="mt-8 flex w-full items-center justify-center gap-2 rounded-[10px] bg-bone py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink hover:bg-white disabled:opacity-60">
            {login.isPending && <Spinner />} Sign in
          </button>
          <a href="/" className="mt-6 block text-center text-[12px] text-mist hover:text-bone">← Back to website</a>
        </div>
      </form>
    </div>
  );
}
