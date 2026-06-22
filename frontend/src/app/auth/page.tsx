"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Mail, Lock, User, Calendar, Phone, Eye, EyeOff, LogIn, UserPlus } from "lucide-react"
import { registerUser, loginUser } from "@/lib/api"
import { cn } from "@/lib/utils"

type Tab = "login" | "register"

export default function AuthPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    birthday: "",
    phone: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await loginUser(loginForm.email, loginForm.password)
    setLoading(false)
    if (result.user) {
      localStorage.setItem("acervo-user", JSON.stringify(result.user))
      router.push("/")
    } else {
      setError(result.error || result.message || "Erro ao fazer login")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const emailRegex = /^[^\s@]+@grupoilla\.com\.br$/;
    if (!emailRegex.test(registerForm.email)) {
      setError("Apenas emails institucionais @grupoilla.com.br são permitidos!")
      return
    }

    setLoading(true)
    const result = await registerUser(registerForm)
    setLoading(false)
    if (result.user) {
      setSuccess("Conta criada com sucesso! Faça login.")
      setTab("login")
      setLoginForm({ email: registerForm.email, password: "" })
      setRegisterForm({ username: "", email: "", password: "", birthday: "", phone: "" })
    } else {
      setError(result.error || result.message || "Erro ao criar conta")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="size-5" />
            </span>
            <div className="leading-none">
              <p className="font-mono text-sm font-semibold tracking-tight">Acervo</p>
              <p className="hidden text-[11px] text-muted-foreground sm:block">Biblioteca interna</p>
            </div>
          </a>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-up">
          {/* Tabs */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {tab === "login" ? "Bem-vindo de volta" : "Criar conta"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "login"
                ? "Entre com seu email e senha para acessar o acervo"
                : "Preencha os dados para se cadastrar na biblioteca"}
            </p>
          </div>

          <div className="mb-6 flex rounded-xl border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => { setTab("login"); setError(""); setSuccess("") }}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                tab === "login"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LogIn className="size-4" />
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setTab("register"); setError(""); setSuccess("") }}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                tab === "register"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <UserPlus className="size-4" />
              Cadastrar
            </button>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
              {success}
            </div>
          )}

          {/* Login Form */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="seu@grupoilla.com.br"
                    className="h-11 w-full rounded-xl border border-border bg-secondary/60 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="Sua senha"
                    className="h-11 w-full rounded-xl border border-border bg-secondary/60 pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Nome de usuário
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm((p) => ({ ...p, username: e.target.value }))}
                    placeholder="Seu nome"
                    className="h-11 w-full rounded-xl border border-border bg-secondary/60 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="seu@grupoilla.com.br"
                    className="h-11 w-full rounded-xl border border-border bg-secondary/60 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-xl border border-border bg-secondary/60 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Data de nasc.
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="date"
                      required
                      value={registerForm.birthday}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, birthday: e.target.value }))}
                      className="h-11 w-full rounded-xl border border-border bg-secondary/60 pl-10 pr-4 text-sm outline-none transition-colors [color-scheme:inherit] focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Telefone <span className="font-normal lowercase text-muted-foreground/60">(opcional)</span>
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="h-11 w-full rounded-xl border border-border bg-secondary/60 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Criando conta..." : "Criar conta"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <a href="/" className="underline underline-offset-4 hover:text-foreground transition-colors">
              Voltar para o acervo
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
