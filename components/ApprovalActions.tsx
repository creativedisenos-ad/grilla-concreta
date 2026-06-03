'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Post, Status } from '@/lib/types';
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
      <p className="mt-0.5 text-xs text-navy/50">Como <span className="font-bold capitalize">{user.role}</span>, puedes:</p>
      <div className="mt-4 grid gap-2">
        {actions.map((a) => (
          <button
            key={a.to}
            disabled={busy !== null || post.status === a.to}
            onClick={() => changeStatus(a.to, a.needsReason)}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold shadow-sm transition disabled:opacity-50 ${a.className}`}
          >
            {busy === a.to ? 'Procesando...' : a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
