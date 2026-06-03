'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { getUser, clearUser, type CurrentUser } from '@/lib/user';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
  const [user, setUserState] = useState<CurrentUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setUserState(getUser()); }, []);

  function signOut() {
    clearUser();
    router.push('/');
  }

  return (
    <header className="bg-conkreta-navy border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/calendario" className="flex items-center gap-3">
          <Logo size="md" invert />
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/calendario"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              pathname?.startsWith('/calendario') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Calendario
          </Link>
          <Link
            href="/post/nuevo"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              pathname === '/post/nuevo' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Nuevo post
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-right leading-tight">
                <div className="text-sm font-semibold text-white">{user.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/60">{user.role}</div>
              </div>
              <button onClick={signOut} className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10">
                Salir
              </button>
            </>
          ) : (
            <Link href="/" className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-navy">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
