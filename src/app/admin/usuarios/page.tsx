import { Suspense } from "react";
import { AdminGate } from "@/components/admin/admin-gate";
import { UserControls } from "@/components/admin/taxonomy-forms";
import { listUsers } from "@/server/queries/admin";
import { Skeleton, buttonClass } from "@/components/ui/primitives";
import { inputClass } from "@/components/forms/fields";

type SP = Promise<Record<string, string | string[] | undefined>>;
const dt = new Intl.DateTimeFormat("es", { dateStyle: "short", timeZone: "UTC" });

export default function UsersAdmin({ searchParams }: { searchParams: SP }) {
  return (
    <>
      <h1 className="font-display text-4xl font-semibold">Usuarios</h1>
      <Suspense fallback={<Skeleton className="mt-6 h-96" />}>
        <AdminGate permission="user:manage" next="/admin/usuarios">
          {async (me) => {
            const q = (await searchParams).q;
            const rows = await listUsers(typeof q === "string" ? q.slice(0, 100) : undefined);
            return (
              <div className="mt-6">
                <form className="mb-4 flex gap-2" action="/admin/usuarios">
                  <input name="q" defaultValue={typeof q === "string" ? q : ""} placeholder="Buscar por nombre o correo" aria-label="Buscar usuarios" className={`${inputClass} max-w-sm`} />
                  <button className={buttonClass("secondary", "sm")}>Buscar</button>
                </form>
                <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-2 text-left text-xs uppercase tracking-wider text-muted">
                      <tr><th className="px-4 py-2.5">Usuario</th><th className="px-4 py-2.5">Alta</th><th className="px-4 py-2.5">Último acceso</th><th className="px-4 py-2.5">Rol y estado</th></tr>
                    </thead>
                    <tbody className="divide-y divide-line bg-surface">
                      {rows.map((u) => (
                        <tr key={u.id} className={u.disabledAt ? "opacity-60" : ""}>
                          <td className="px-4 py-2.5"><span className="font-medium">{u.displayName}</span><span className="block text-xs text-muted">{u.email}{u.disabledAt && " · desactivada"}</span></td>
                          <td className="px-4 py-2.5 text-xs">{dt.format(u.createdAt)}</td>
                          <td className="px-4 py-2.5 text-xs">{u.lastLoginAt ? dt.format(u.lastLoginAt) : "—"}</td>
                          <td className="px-4 py-2.5"><UserControls id={u.id} role={u.role} disabled={Boolean(u.disabledAt)} isSelf={u.id === me.id} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }}
        </AdminGate>
      </Suspense>
    </>
  );
}
