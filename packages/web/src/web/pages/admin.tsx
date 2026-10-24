import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { ADMIN_TOKEN_KEY } from "../lib/api";
import { useAdminMe, useAdminStats } from "../queries/admin";
import { AdminLogin } from "../components/admin/login";
import { Inbox } from "../components/admin/inbox";
import { BookingsPanel, EnquiriesPanel } from "../components/admin/bookings";
import { Segmented } from "../components/admin/shared";
import { Spinner } from "../components/ui-kit";
import { useSeo } from "../hooks/use-seo";

type Tab = "inbox" | "bookings" | "enquiries";

const isUnauthorized = (e: unknown) => !!e && typeof e === "object" && "code" in e && (e as { code: string }).code === "UNAUTHORIZED";

function Dashboard({ name, onLogout }: { name: string; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("inbox");
  const stats = useAdminStats();
  const s = stats.data;

  useEffect(() => {
    if (isUnauthorized(stats.error)) onLogout();
  }, [stats.error, onLogout]);

  useEffect(() => {
    document.title = s?.waiting ? `(${s.waiting}) Guest inbox · Lūana Kai` : "Guest inbox · Lūana Kai";
  }, [s?.waiting]);

  return (
    <div className="min-h-screen bg-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-5 py-3">
          <a href="/" className="font-display text-xl tracking-wide">Lūana Kai</a>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-mist sm:inline">Staff console</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-[13px] text-mist md:inline">Signed in as <span className="text-bone">{name}</span></span>
            <button onClick={onLogout} className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12px] font-semibold hover:border-bone/50">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-6">
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Waiting for staff", value: s?.waiting, hot: !!s?.waiting },
            { label: "New booking requests", value: s?.newBookings, hot: !!s?.newBookings },
            { label: "Open enquiries", value: s?.openEnquiries },
            { label: "Total conversations", value: s?.conversations },
          ].map((k) => (
            <div key={k.label} className={`rounded-[12px] border p-4 ${k.hot ? "border-sand/50 bg-sand/[0.06]" : "border-line"}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mist">{k.label}</p>
              <p className="mt-2 font-display text-3xl">{k.value ?? "–"}</p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { value: "inbox", label: "Live inbox", badge: s?.waiting },
              { value: "bookings", label: "Booking requests", badge: s?.newBookings },
              { value: "enquiries", label: "Enquiries", badge: s?.openEnquiries },
            ]}
          />
        </div>

        {tab === "inbox" && <Inbox waiting={s?.waiting ?? 0} />}
        {tab === "bookings" && <BookingsPanel />}
        {tab === "enquiries" && <EnquiriesPanel />}
      </main>
    </div>
  );
}

export default function AdminPage() {
  useSeo("Staff console", "Lūana Kai staff console");
  const qc = useQueryClient();
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const me = useAdminMe(!!token);

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    qc.removeQueries();
  };

  useEffect(() => {
    if (me.error) logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.error]);

  if (!token) {
    return (
      <AdminLogin
        onLogin={(t, name) => {
          localStorage.setItem(ADMIN_TOKEN_KEY, t);
          localStorage.setItem("lk_admin_name", name);
          qc.removeQueries();
          setToken(t);
        }}
      />
    );
  }
  if (me.isLoading || !me.data) return <div className="grid min-h-screen place-items-center text-mist"><Spinner /></div>;
  return <Dashboard name={me.data.name} onLogout={logout} />;
}
