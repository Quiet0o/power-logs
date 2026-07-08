import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { useState, type FormEvent } from 'react'
import { Mail, Lock, Loader2, Sparkles, LogIn } from 'lucide-react'

export const Route = createFileRoute('/login')({ component: Login })

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Wprowadź adres e-mail oraz hasło.')
      return
    }

    setIsLoading(true)

    try {
      const response = await authClient.signIn.email({
        email: email.trim(),
        password,
      })

      if (response.error) {
        setError(response.error.message || 'Błędny e-mail lub hasło.')
      } else {
        // Successful login, redirect to homepage
        navigate({ to: '/' })
      }
    } catch (err: any) {
      setError(err.message || 'Nie udało się zalogować.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-wrap py-20 px-4 min-h-screen flex items-center justify-center">
      <div className="island-shell p-6 md:p-8 rounded-2xl w-full max-w-md relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="island-kicker mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Better Auth</span>
          </div>
          <h1 className="text-3xl font-extrabold display-title tracking-tight text-slate-900 dark:text-white">
            Witaj Ponownie
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Zaloguj się, aby zarządzać bazą danych.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Adres E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="email"
                type="email"
                placeholder="np. jan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-slate-100 text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Hasło
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="password"
                type="password"
                placeholder="Wprowadź swoje hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-slate-100 text-sm"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 animate-fadeIn">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/60 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 cursor-pointer active:scale-98 transition-all text-sm mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logowanie...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Zaloguj się</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>Nie masz jeszcze konta? </span>
          <Link
            to="/register"
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Zarejestruj się
          </Link>
        </div>
      </div>
    </div>
  )
}
