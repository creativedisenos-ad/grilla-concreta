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
    <header className="border-b border-navy/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/calendario" className="flex items-center gap-3">
          <Logo size="md" />
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/calendario"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              pathname?.startsWith('/calendario') ? 'bg-navy text-white' : 'text-navy/70 hover:bg-navy/5 hover:text-navy'
            }`}
          >
            Calendario
          </Link>
          <Link
            href="/post/nuevo"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              pathname === '/post/nuevo' ? 'bg-navy text-white' : 'text-navy/70 hover:bg-navy/5 hover:text-navy'
            }`}
          >
            Nuevo post
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-right leading-tight">
                <div className="text-sm font-semibold text-navy">{user.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-navy/60">{user.role}</div>
              </div>
              <button onClick={signOut} className="rounded-md border border-navy/20 px-3 py-1.5 text-xs font-semibold text-navy/70 hover:bg-navy/5">
                Salir
              </button>
            </>
          ) : (
            <Link href="/" className="rounded-md bg-navy px-3 py-1.5 text-xs font-semibold text-white">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
