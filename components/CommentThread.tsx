'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Comment } from '@/lib/types';
import type { CurrentUser } from '@/lib/user';

export function CommentThread({
  postId,
  comments,
  user,
  onChange,
}: {
  postId: string;
  comments: Comment[];
  user: CurrentUser;
  onChange: () => void;
}) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    await supabase.from('comments').insert({
      post_id: postId,
      author_name: user.name,
      author_role: user.role,
      body: body.trim(),
    });
    setBody('');
    setSubmitting(false);
    onChange();
  }

  async function toggleResolve(c: Comment) {
    await supabase.from('comments').update({ resolved: !c.resolved }).eq('id', c.id);
    onChange();
  }

  async function remove(c: Comment) {
    if (!confirm('¿Eliminar comentario?')) return;
    await supabase.from('comments').delete().eq('id', c.id);
    onChange();
  }

  return (
    <div className="card">
      <h3 className="text-lg font-black text-navy">Comentarios</h3>
      <p className="mt-0.5 text-xs text-navy/50">{comments.length} mensaje{comments.length === 1 ? '' : 's'}</p>

      <div className="mt-5 space-y-3">
        {comments.length === 0 && (
          <div className="rounded-lg border border-dashed border-navy/15 px-4 py-6 text-center text-sm text-navy/50">
            Sé el primero en comentar.
          </div>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className={`rounded-xl border p-3 ${
              c.resolved ? 'border-green-200 bg-green-50/50' : 'border-navy/10 bg-navy-50/30'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                  {c.author_name.charAt(0).toUpperCase()}
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-bold text-navy">{c.author_name}</div>
                  <div className="text-[10px] uppercase tracking-wider text-navy/50">
                    {c.author_role} · {new Date(c.created_at).toLocaleString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleResolve(c)}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition ${
                    c.resolved ? 'bg-green-200 text-green-800' : 'bg-navy/10 text-navy/60 hover:bg-navy/20'
                  }`}
                >
                  {c.resolved ? '✓ Resuelto' : 'Marcar resuelto'}
                </button>
                {c.author_name === user.name && (
                  <button onClick={() => remove(c)} className="rounded-md px-2 py-0.5 text-[10px] font-bold text-red-500 hover:bg-red-50">
                    ×
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-navy/80">{c.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 border-t border-navy/10 pt-4">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Escribe un comentario como ${user.name}...`}
          rows={3}
          className="input resize-none"
        />
        <div className="mt-2 flex justify-end">
          <button type="submit" disabled={submitting || !body.trim()} className="btn-primary">
            {submitting ? 'Enviando...' : 'Comentar'}
          </button>
        </div>
      </form>
    </div>
  );
}
