'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { setUser, getUser } from '@/lib/user';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [role, setRole] = useState<'cliente' | 'agencia' | 'director'>('cliente');

  useEffect(() => {
    if (getUser()) router.replace('/calendario');
  }, [router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setUser({ name: name.trim(), role });
    router.push('/calendario');
  }

  return (
    <div className="min-h-screen bg-conkreta-navy">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="mb-10 flex justify-center">
          <Logo size="lg" invert />
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-navy">Grilla de contenido</h1>
          <p className="mt-1 text-sm text-navy/60">Identifícate para revisar y aprobar el calendario.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Tu nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Walter Peña"
                className="input"
                autoFocus
              />
            </div>
            <div>
              <label className="label">Rol</label>
              <div className="grid grid-cols-3 gap-2">
                {(['cliente', 'agencia', 'director'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition ${
                      role === r ? 'border-navy bg-navy text-white' : 'border-navy/15 text-navy/70 hover:bg-navy/5'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-3">Entrar al calendario →</button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-white/50">CONKRETA GROUP · Sistema de aprobación de contenido</p>
      </div>
    </div>
  );
}
