"use client";

import { useState, type ReactNode } from "react";
import { GitBranch, Globe, LogOut } from "lucide-react";
import { useGuestbookAuth } from "../../hooks/useGuestbookAuth";

type AuthGuardProps = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, signIn, signOut, user } =
    useGuestbookAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 border border-dashed border-amber-500/60 bg-black/80 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-amber-400">
        <span className="inline-block h-2 w-2 animate-ping rounded-full bg-amber-400" />
        <span>[ VERIFICANDO CREDENCIALES... ]</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber-500/80">
          [ INICIAR SESIÓN: ]
        </span>

        <button
          type="button"
          onClick={() =>
            void signIn("github").catch((error) =>
              setAuthError(
                error instanceof Error ? error.message : "Fallo de autenticación."
              )
            )
          }
          className="inline-flex items-center gap-2 border border-dashed border-amber-500/80 bg-black/90 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-amber-400 transition-all duration-200 hover:border-amber-400 hover:bg-amber-500 hover:text-black hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]"
        >
          <GitBranch className="h-3.5 w-3.5" />
          <span>[ GITHUB ]</span>
        </button>

        <button
          type="button"
          onClick={() =>
            void signIn("google").catch((error) =>
              setAuthError(
                error instanceof Error ? error.message : "Fallo de autenticación."
              )
            )
          }
          className="inline-flex items-center gap-2 border border-dashed border-amber-500/80 bg-black/90 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-amber-400 transition-all duration-200 hover:border-amber-400 hover:bg-amber-500 hover:text-black hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>[ GOOGLE ]</span>
        </button>

        {authError ? (
          <span className="font-mono text-xs text-red-400">
            [ ERROR: {authError} ]
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {children}

      <div className="flex items-center gap-2 border border-dashed border-amber-500/60 bg-black/80 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-amber-400">
        <span className="text-amber-500/60">&gt;</span>
        <span className="max-w-[150px] truncate sm:max-w-[200px]">
          OPERADOR: {user?.name ?? user?.email ?? "ACTIVO"}
        </span>
        <button
          type="button"
          onClick={() => void signOut()}
          className="ml-2 flex items-center gap-1 border border-amber-500/40 px-1.5 py-0.5 text-[10px] text-amber-500/80 transition hover:border-amber-400 hover:bg-amber-500 hover:text-black"
          title="Cerrar sesión"
        >
          <LogOut className="h-3 w-3" />
          <span className="hidden sm:inline">[ SALIR ]</span>
        </button>
      </div>
    </div>
  );
};
