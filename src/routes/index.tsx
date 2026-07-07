import { createFileRoute } from '@tanstack/react-router'
import { useTRPC } from '#/integrations/trpc/react'
import { useState  } from 'react'
import type {FormEvent} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  User,
  Mail,
  Plus,
  Database,
  Users,
  Loader2,
  Sparkles,
  Clock,
  UserCheck,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  // Queries & Mutations
  const {
    data: userList,
    isLoading,
    error,
  } = useQuery(trpc.users.list.queryOptions())

  const addUserMutation = useMutation(
    trpc.users.add.mutationOptions({
      onSuccess: () => {
        // Invalidate users list query to reload it
        queryClient.invalidateQueries({
          queryKey: trpc.users.list.queryKey(),
        })
        setName('')
        setEmail('')
        setFormSuccess('Użytkownik został pomyślnie dodany!')
        setTimeout(() => setFormSuccess(null), 5000)
      },
      onError: (err: any) => {
        console.log(err)
        setFormError(
          err.message || 'Wystąpił błąd podczas dodawania użytkownika.',
        )
        setTimeout(() => setFormError(null), 5000)
      },
    }),
  )

  const updateUserMutation = useMutation(
    trpc.users.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.users.list.queryKey(),
        })
        setName('')
        setEmail('')
        setEditingUserId(null)
        setFormSuccess('Dane użytkownika zostały zaktualizowane!')
        setTimeout(() => setFormSuccess(null), 5000)
      },
      onError: (err: any) => {
        setFormError(
          err.message || 'Wystąpił błąd podczas aktualizacji użytkownika.',
        )
        setTimeout(() => setFormError(null), 5000)
      },
    }),
  )

  const deleteUserMutation = useMutation(
    trpc.users.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.users.list.queryKey(),
        })
        setFormSuccess('Użytkownik został pomyślnie usunięty!')
        setTimeout(() => setFormSuccess(null), 5000)
      },
      onError: (err: any) => {
        setFormError(
          err.message || 'Wystąpił błąd podczas usuwania użytkownika.',
        )
        setTimeout(() => setFormError(null), 5000)
      },
    }),
  )

  // Local Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)

    if (!name.trim()) {
      setFormError('Imię i nazwisko jest wymagane.')
      return
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setFormError('Wprowadź poprawny adres e-mail.')
      return
    }

    if (editingUserId !== null) {
      updateUserMutation.mutate({
        id: editingUserId,
        name: name.trim(),
        email: email.trim(),
      })
    } else {
      addUserMutation.mutate({
        name: name.trim(),
        email: email.trim(),
      })
    }
  }

  const handleEditClick = (user: {
    id: number
    name: string
    email: string
  }) => {
    setEditingUserId(user.id)
    setName(user.name)
    setEmail(user.email)
    setFormError(null)
    setFormSuccess(null)
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
    setName('')
    setEmail('')
    setFormError(null)
    setFormSuccess(null)
  }

  const handleDeleteClick = (id: number) => {
    if (confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      deleteUserMutation.mutate({ id })
    }
  }

  const isPending =
    addUserMutation.isPending ||
    updateUserMutation.isPending ||
    deleteUserMutation.isPending

  return (
    <div className="page-wrap py-12 px-4 md:py-20 min-h-screen flex flex-col justify-between">
      <div>
        {/* Header section */}
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="island-kicker mb-2 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Drizzle ORM + SQLite Demo</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold display-title tracking-tight text-slate-900 dark:text-white">
              Baza Użytkowników
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-lg">
              Wygodne dodawanie, odczytywanie, edycja oraz usuwanie rekordów w
              lokalnej bazie SQLite.
            </p>
          </div>

          {/* Connection status card */}
          <div className="self-center md:self-auto flex items-center gap-3 px-4 py-2.5 rounded-full island-shell text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>SQLite: Connected</span>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side - 5 columns */}
          <div className="lg:col-span-5">
            <div className="island-shell p-6 md:p-8 rounded-2xl relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="island-kicker mb-3">
                {editingUserId !== null ? 'EDYCJA PROFILU' : 'NOWY PROFIL'}
              </div>
              <h2 className="text-2xl font-bold display-title text-slate-800 dark:text-slate-100 mb-6">
                {editingUserId !== null
                  ? 'Edytuj Użytkownika'
                  : 'Dodaj Użytkownika'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Imię i Nazwisko
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="name"
                      type="text"
                      placeholder="np. Jan Kowalski"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isPending}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Adres E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="np. jan.kowalski@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isPending}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* Status Messages */}
                {formError && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2 animate-fadeIn">
                    <UserCheck className="w-4 h-4 shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                {/* Buttons wrapper */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {editingUserId !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isPending}
                      className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Anuluj</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isPending}
                    className={`py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-98 transition-all flex-1 ${
                      editingUserId !== null
                        ? 'bg-amber-600 hover:bg-amber-500 disabled:bg-amber-600/60 shadow-amber-600/10'
                        : 'bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/60 shadow-emerald-600/10'
                    }`}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Przetwarzanie...</span>
                      </>
                    ) : editingUserId !== null ? (
                      <>
                        <Pencil className="w-5 h-5" />
                        <span>Zapisz Zmiany</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Dodaj Użytkownika</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* List Side - 7 columns */}
          <div className="lg:col-span-7">
            <div className="island-shell p-6 md:p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="island-kicker mb-1">ZAPISANE REKORDY</div>
                  <h2 className="text-2xl font-bold display-title text-slate-800 dark:text-slate-100">
                    Zarejestrowani Użytkownicy
                  </h2>
                </div>
                {userList && userList.length > 0 && (
                  <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{userList.length}</span>
                  </div>
                )}
              </div>

              {/* Loader */}
              {isLoading && (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <p className="text-sm font-medium">
                    Wczytywanie użytkowników...
                  </p>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="p-6 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 text-center">
                  <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
                    Nie udało się pobrać danych
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {error.message ||
                      'Wystąpił nieoczekiwany problem z połączeniem.'}
                  </p>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !error && (!userList || userList.length === 0) && (
                <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Brak użytkowników
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Wypełnij formularz po lewej stronie, aby dodać swojego
                    pierwszego użytkownika do bazy danych SQLite.
                  </p>
                </div>
              )}

              {/* Users List Grid */}
              {!isLoading && !error && userList && userList.length > 0 && (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                  {userList.map(
                    (user: {
                      id: number
                      name: string
                      email: string
                      createdAt: Date | null
                    }) => (
                      <div
                        key={user.id}
                        className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 hover:bg-white/70 dark:hover:bg-slate-900/40 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 font-bold text-sm">
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                              {user.name}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </p>
                          </div>
                        </div>

                        {/* Actions & Timestamp wrapper */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800/60">
                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditClick(user)}
                              disabled={isPending}
                              title="Edytuj użytkownika"
                              className="p-2 rounded-lg hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 text-slate-400 dark:text-slate-500 transition-all cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user.id)}
                              disabled={isPending}
                              title="Usuń użytkownika"
                              className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-slate-400 dark:text-slate-500 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Timestamp */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString(
                                    'pl-PL',
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    },
                                  )
                                : 'Brak daty'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          © 2026 Antigravity IDE. Stworzono z użyciem TanStack Start + SQLite.
        </p>
        <div className="flex items-center gap-2">
          <span>Standard bazodanowy:</span>
          <code className="text-[10px]">Drizzle-ORM (better-sqlite3)</code>
        </div>
      </footer>
    </div>
  )
}
