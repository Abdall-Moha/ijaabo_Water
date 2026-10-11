import { useState } from "react";
import { api } from "../../services/api.js";
import { useAdminAuth } from "../useAdminAuth.js";
import { buttonClass, fieldClass, Notice, PageHeader } from "../AdminUI.jsx";

export default function AdminSettings() {
  const { admin } = useAdminAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  async function submit(event) {
    event.preventDefault();
    setNotice(null);
    if (form.newPassword.length < 8) {
      setNotice({
        type: "error",
        text: "Use a password with at least 8 characters.",
      });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setNotice({ type: "error", text: "The new passwords do not match." });
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.put("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setNotice({
        type: "success",
        text: data.message || "Password changed successfully.",
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setNotice({
        type: "error",
        text: error.response?.data?.message || "Could not change password.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Review your admin profile and manage your account password."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold">Admin profile</h2>
          <dl className="mt-5 space-y-4">
            <ProfileField label="Name" value={admin?.name} />
            <ProfileField label="Email" value={admin?.email} />
            <ProfileField label="Role" value={admin?.role} />
          </dl>
          <p className="mt-5 text-xs leading-5 text-slate-500">
            Profile fields are read-only because the backend currently supports
            password changes only.
          </p>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold">Change password</h2>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block text-sm font-semibold">
              Current password
              <input
                className={fieldClass}
                type="password"
                autoComplete="current-password"
                value={form.currentPassword}
                onChange={(event) =>
                  setForm({ ...form, currentPassword: event.target.value })
                }
                required
              />
            </label>
            <label className="block text-sm font-semibold">
              New password
              <input
                className={fieldClass}
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={form.newPassword}
                onChange={(event) =>
                  setForm({ ...form, newPassword: event.target.value })
                }
                required
              />
            </label>
            <label className="block text-sm font-semibold">
              Confirm new password
              <input
                className={fieldClass}
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm({ ...form, confirmPassword: event.target.value })
                }
                required
              />
            </label>
            {notice && (
              <Notice tone={notice.type === "success" ? "success" : "error"}>
                {notice.text}
              </Notice>
            )}
            <button className={buttonClass} disabled={busy}>
              {busy ? "Updating password…" : "Update password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">
        {value || "—"}
      </dd>
    </div>
  );
}
