import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiUserCheck, FiUserX } from "react-icons/fi";
import { api } from "../../services/api.js";
import {
  buttonClass,
  EmptyState,
  fieldClass,
  Loading,
  Notice,
  PageHeader,
  StatusTag,
} from "../AdminUI.jsx";
import { useAdminAuth } from "../useAdminAuth.js";

const blankForm = { name: "", email: "", password: "" };

export default function AdminUsers() {
  const { admin: currentAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);
  const [editor, setEditor] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [busy, setBusy] = useState(false);

  const loadAdmins = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/admins");
      setAdmins(Array.isArray(data) ? data : []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load admin users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAdmins(); }, [loadAdmins]);

  function startCreate() {
    setForm(blankForm);
    setNotice(null);
    setEditor("new");
  }

  function startEdit(user) {
    setForm({ name: user.name, email: user.email, password: "" });
    setNotice(null);
    setEditor(user);
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    const payload = { name: form.name.trim(), email: form.email.trim() };
    if (editor === "new" || form.password) payload.password = form.password;
    try {
      const { data } = editor === "new"
        ? await api.post("/auth/admins", payload)
        : await api.put(`/auth/admins/${editor._id}`, payload);
      setEditor(null);
      setNotice({ type: "success", text: data.message || "Admin user saved." });
      await loadAdmins();
    } catch (saveError) {
      setNotice({ type: "error", text: saveError.response?.data?.message || "Could not save admin user." });
    } finally {
      setBusy(false);
    }
  }

  async function toggleStatus(user) {
    const nextActive = !user.isActive;
    const action = nextActive ? "activate" : "deactivate";
    setNotice(null);
    try {
      const { data } = await api.put(`/auth/admin/${user._id}/status`, { isActive: nextActive });
      setNotice({ type: "success", text: data.message || `Admin ${action}d.` });
      await loadAdmins();
    } catch (statusError) {
      setNotice({ type: "error", text: statusError.response?.data?.message || `Could not ${action} admin.` });
    }
  }

  if (loading) return <Loading label="Loading admin users…" />;

  return (
    <div>
      <PageHeader
        title="Users"
        description="Create and manage administrator accounts for the dashboard."
        action={<button className={buttonClass} onClick={startCreate}><FiPlus /> Add admin</button>}
      />
      {notice && <div className="mb-4"><Notice tone={notice.type === "success" ? "success" : "error"}>{notice.text}</Notice></div>}
      {error && <div className="mb-4"><Notice>{error}</Notice></div>}
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        {error ? null : admins.length === 0 ? <EmptyState>No admin accounts found.</EmptyState> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-3 py-3">Admin</th><th className="px-3 py-3">Email</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Actions</th></tr>
              </thead>
              <tbody>
                {admins.map((user) => {
                  const isCurrentAdmin = String(user._id) === String(currentAdmin?.id || currentAdmin?._id);
                  return (
                    <tr key={user._id} className="border-b border-slate-100 last:border-0">
                      <td className="px-3 py-4 font-semibold text-slate-900">{user.name}{isCurrentAdmin && <span className="ml-2 text-xs font-medium text-slate-500">You</span>}</td>
                      <td className="px-3 py-4 text-slate-600">{user.email}</td>
                      <td className="px-3 py-4"><StatusTag value={user.isActive ? "ACTIVE" : "INACTIVE"} /></td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1">
                          <button type="button" aria-label={`Edit ${user.name}`} title={isCurrentAdmin ? "Edit your own account in Settings" : "Edit admin"} disabled={isCurrentAdmin} onClick={() => startEdit(user)} className="grid size-9 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"><FiEdit2 /></button>
                          <button type="button" aria-label={`${user.isActive ? "Deactivate" : "Activate"} ${user.name}`} title={isCurrentAdmin ? "You cannot deactivate your own account" : user.isActive ? "Deactivate admin" : "Activate admin"} disabled={isCurrentAdmin} onClick={() => toggleStatus(user)} className="grid size-9 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">{user.isActive ? <FiUserX /> : <FiUserCheck />}</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editor && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="admin-user-form-title" className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 id="admin-user-form-title" className="text-xl font-bold">{editor === "new" ? "Create admin" : "Edit admin"}</h2>
              <button type="button" className="rounded px-3 py-1 text-sm text-slate-600 hover:bg-slate-100" onClick={() => !busy && setEditor(null)}>Close</button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <label className="block text-sm font-semibold">Full name<input className={fieldClass} autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
              <label className="block text-sm font-semibold">Email address<input className={fieldClass} type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
              <label className="block text-sm font-semibold">{editor === "new" ? "Password" : "New password (optional)"}<input className={fieldClass} type="password" autoComplete="new-password" minLength={editor === "new" || form.password ? 8 : undefined} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required={editor === "new"} /></label>
              {editor !== "new" && <p className="-mt-2 text-xs leading-5 text-slate-500">Leave the password blank to keep the current password.</p>}
              {notice && <Notice>{notice.text}</Notice>}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="min-h-10 rounded-lg border border-slate-300 px-4 text-sm" onClick={() => !busy && setEditor(null)} disabled={busy}>Cancel</button>
                <button className={buttonClass} disabled={busy}>{busy ? "Saving…" : editor === "new" ? "Create admin" : "Save changes"}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {statusTarget && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/50 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-status-title"
            aria-describedby="admin-status-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-7"
          >
            <h2 id="admin-status-title" className="text-xl font-bold text-slate-900">
              {statusTarget.isActive ? "Deactivate admin?" : "Reactivate admin?"}
            </h2>
            <p id="admin-status-description" className="mt-3 text-sm leading-6 text-slate-600">
              {statusTarget.isActive
                ? `${statusTarget.name} will no longer be able to sign in to the admin dashboard. You can reactivate the account later.`
                : `${statusTarget.name} will be able to sign in to the admin dashboard again.`}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStatusTarget(null)}
                className="min-h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const user = statusTarget;
                  setStatusTarget(null);
                  await toggleStatus(user);
                }}
                className={statusTarget.isActive
                  ? "min-h-10 rounded-lg bg-rose-700 px-4 text-sm font-semibold text-white hover:bg-rose-800"
                  : buttonClass}
              >
                {statusTarget.isActive ? "Deactivate admin" : "Reactivate admin"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
