'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Post, Status } from '@/lib/types';
import { STATUS_LABEL } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import type { CurrentUser } from '@/lib/user';

interface Action {
  to: Status;
  label: string;
  className: string;
  needsReason?: boolean;
}

const ACTIONS_BY_ROLE: Record<CurrentUser['role'], Action[]> = {
  agencia: [
    { to: 'pending_approval', label: 'Enviar a aprobación', className: 'bg-blue-600 hover:bg-blue-700 text-white' },
    { to: 'published', label: 'Marcar publicado', className: 'bg-violet-600 hover:bg-violet-700 text-white' },
  ],
  cliente: [
    { to: 'approved', label: '✓ Aprobar', className: 'bg-green-600 hover:bg-green-700 text-white' },
    { to: 'changes_requested', label: 'Pedir cambios', className: 'bg-amber-500 hover:bg-amber-600 text-white', needsReason: true },
    { to: 'rejected', label: 'Rechazar', className: 'bg-red-600 hover:bg-red-700 text-white', needsReason: true },
  ],
  director: [
    { to: 'approved', label: '✓ Aprobar', className: 'bg-green-600 hover:bg-green-700 text-white' },
    { to: 'changes_requested', label: 'Pedir cambios', className: 'bg-amber-500 hover:bg-amber-600 text-white', needsReason: true },
    { to: 'rejected', label: 'Rechazar', className: 'bg-red-600 hover:bg-red-700 text-white', needsReason: true },
    { to: 'pending_approval', label: 'Enviar a aprobación', className: 'bg-blue-600 hover:bg-blue-700 text-white' },
    { to: 'published', label: 'Marcar publicado', className: 'bg-violet-600 hover:bg-violet-700 text-white' },
  ],
};

export function ApprovalActions({
  post,
  user,
  onChange,
}: {
  post: Post;
  user: CurrentUser;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState<Status | null>(null);
  const actions = ACTIONS_BY_ROLE[user.role];

  async function changeStatus(to: Status, needsReason?: boolean) {
    let reason: string | null = null;
    if (needsReason) {
      const r = prompt('Motivo del cambio (opcional pero recomendado):');
      if (r === null) return;
      reason = r.trim() || null;
    }
    setBusy(to);
    await supabase.from('posts').update({ status: to }).eq('id', post.id);
    await supabase.from('approval_history').insert({
      post_id: post.id,
      from_status: post.status,
      to_status: to,
      actor_name: user.name,
      reason,
    });
    setBusy(null);
    onChange();
  }

  return (
    <div className="card">
      <h3 className="text-lg font-black text-navy">Decisión</h3>

      <div className="mt-3 rounded-lg border border-navy/10 bg-navy-50/50 px-3 py-2">
        <div className="text-[10px] font-bold uppercase tracking-wider text-navy/50">Estado actual</div>
        <div className="mt-1"><StatusBadge status={post.status} /></div>
      </div>

      <p className="mt-3 text-xs text-navy/50">
        Entraste como <span className="font-bold capitalize text-navy">{user.name} · {user.role}</span>. Puedes:
      </p>

      <div className="mt-3 grid gap-2">
        {actions.map((a) => {
          const alreadyHere = post.status === a.to;
          return (
            <div key={a.to}>
              <button
                disabled={busy !== null || alreadyHere}
                onClick={() => changeStatus(a.to, a.needsReason)}
                className={`w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${a.className}`}
              >
                {busy === a.to ? 'Procesando...' : a.label}
              </button>
              {alreadyHere && (
                <p className="mt-1 text-center text-[11px] font-medium text-navy/50">
                  ✓ La pieza ya está en «{STATUS_LABEL[a.to]}» — no hace falta volver a marcarla.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {user.role === 'agencia' && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-900">
          Estás como <strong>agencia</strong>. Para aprobar o pedir cambios tienes que entrar con el rol <strong>cliente</strong> o <strong>director</strong> (botón «Salir» arriba y vuelve a entrar).
        </p>
      )}
    </div>
  );
}
