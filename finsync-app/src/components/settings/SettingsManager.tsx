"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { PasswordInput } from "@/components/PasswordInput";

export function SettingsManager({
  initialName,
  initialUsername,
  email,
  initialCurrency,
  initialConvertCurrency,
}: {
  initialName: string | null;
  initialUsername: string;
  email: string;
  initialCurrency: string;
  initialConvertCurrency: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName ?? "");
  const [username, setUsername] = useState(initialUsername);
  const [currency, setCurrency] = useState(initialCurrency);
  const [convertCurrency, setConvertCurrency] = useState(initialConvertCurrency);
  const [pending, setPending] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordPending, setPasswordPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, currency, convertCurrency }),
    });
    setPending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Could not save settings");
      return;
    }

    toast.success("Settings saved");
    router.refresh();
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordPending(true);

    const res = await fetch("/api/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setPasswordPending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Could not change password");
      return;
    }

    toast.success("Password changed");
    setCurrentPassword("");
    setNewPassword("");
  }

  return (
    <div className="max-w-md space-y-6">
      <form
        onSubmit={handleSubmit}
        className="animate-fade-up space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-sm font-semibold">Profile</h2>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]+"
            title="Letters, numbers, and underscores only"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Email
          </label>
          <input
            value={email}
            disabled
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={convertCurrency}
              onChange={(e) => setConvertCurrency(e.target.checked)}
              className="mt-0.5"
            />
            Convert amounts using live exchange rates
          </label>
          <p className="mt-1.5 text-xs text-gray-400">
            FinSync assumes amounts were entered in Nigerian Naira. Turn this
            on to view them converted to your selected currency at today&apos;s
            rate — turn it off to just change the currency symbol.
          </p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="animate-fade-up space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-sm font-semibold">Change password</h2>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Current password
          </label>
          <PasswordInput
            id="currentPassword"
            required
            value={currentPassword}
            onChange={setCurrentPassword}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            New password
          </label>
          <PasswordInput
            id="newPassword"
            required
            minLength={8}
            value={newPassword}
            onChange={setNewPassword}
          />
          <p className="mt-1 text-xs text-gray-400">
            At least 8 characters, with a letter and a number.
          </p>
        </div>

        <button
          type="submit"
          disabled={passwordPending}
          className="w-full rounded-lg bg-gray-900 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-gray-800 disabled:opacity-60"
        >
          {passwordPending ? "Changing…" : "Change password"}
        </button>
      </form>
    </div>
  );
}
