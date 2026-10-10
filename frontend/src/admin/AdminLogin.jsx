import { useState } from "react";
import { FiEye, FiEyeOff, FiDroplet } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth.js";
import { fieldClass, Notice } from "./AdminUI.jsx";

export default function AdminLogin() {
  const { admin, checking, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (checking)
    return (
      <div className="grid min-h-screen place-items-center text-sm text-slate-600">
        Checking admin session…
      </div>
    );
  if (admin) return <Navigate to="/admin" replace />;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (loginError) {
      setError(
        loginError.response?.data?.message ||
          loginError.message ||
          "Could not sign in. Check your details and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-7 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-50 text-2xl text-[#2B4593]">
            <FiDroplet />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Ijaabo Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to manage your website
          </p>
        </div>
        <form className="space-y-5" onSubmit={submit}>
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              className={fieldClass}
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <span className="relative mt-1.5 block">
              <input
                className={`${fieldClass} pr-12`}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-500"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </span>
          </label>
          {error && <Notice>{error}</Notice>}
          <button
            className="min-h-12 w-full rounded-lg bg-[#2B4593] px-4 font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
            type="submit"
            disabled={busy}
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
