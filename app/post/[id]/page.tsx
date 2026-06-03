'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { StatusBadge } from '@/components/StatusBadge';
import { NetworkBadge } from '@/components/NetworkBadge';
import { CommentThread } from '@/components/CommentThread';
import { ApprovalActions } from '@/components/ApprovalActions';
import { supabase } from '@/lib/supabase';
import { getUser, type CurrentUser } from '@/lib/user';
import type { Post, Comment, ApprovalHistory } from '@/lib/types';
import { STATUS_LABEL, NETWORK_LABEL } from '@/lib/types';

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const [user, setUserState] = useState<CurrentUser | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [history, setHistory] = useState<ApprovalHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace('/'); return; }
    setUserState(u);
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, c, h] = await Promise.all([
      supabase.from('posts').select('*').eq('id', id).single(),
      supabase.from('comments').select('*').eq('post_id', id).order('created_at', { ascending: true }),
      supabase.from('approval_history').select('*').eq('post_id', id).order('created_at', { ascending: false }),
    ]);
    setPost(p.data);
    setComments(c.data || []);
    setHistory(h.data || []);
    setLoading(false);
  }, [id]);

  useEffect(() => { if (id) load(); }, [id, load]);

  async function deletePost() {
    if (!confirm('¿Eliminar este post? No se puede deshacer.')) return;
    await supabase.from('posts').delete().eq('id', id);
    router.push('/calendario');
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto max-w-5xl px-6 py-12 text-center text-navy/50">Cargando...</main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto max-w-5xl px-6 py-12">
          <div className="card text-center text-navy/60">
            <p>Post no encontrado.</p>
            <Link href="/calendario" className="btn-secondary mt-4">← Volver al calendario</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Link href="/calendario" className="text-sm font-semibold text-navy/60 hover:text-navy">← Calendario</Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <NetworkBadge network={post.network} />
                    <span className="text-xs font-bold uppercase tracking-wider text-navy/50">
                      {NETWORK_LABEL[post.network]} · {post.format}
                    </span>
                  </div>
                  <h1 className="mt-3 text-3xl font-black text-navy">{post.title}</h1>
                  <p className="mt-2 text-sm text-navy/60">
                    Programado para el{' '}
                    <span className="font-semibold text-navy">
                      {new Date(post.scheduled_date + 'T00:00:00').toLocaleDateString('es', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                    {post.scheduled_time && <> a las <span className="font-semibold">{post.scheduled_time.slice(0, 5)}</span></>}
                  </p>
                </div>
                <StatusBadge status={post.status} />
              </div>

              {post.resources_url && (
                <div className="mt-5">
                  <a
                    href={post.resources_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-xl border-2 border-navy/15 bg-gradient-to-br from-navy-50 to-white p-5 transition hover:border-navy hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                          <path d="M12 2L2 8.5l4.5 2.5L12 7l5.5 4 4.5-2.5L12 2z" fill="currentColor" opacity="0.85" />
                          <path d="M2 15.5L12 22l10-6.5V8.5L12 15 2 8.5v7z" fill="currentColor" />
                        </svg>
                      </div>
                      <div className="leading-tight">
                        <div className="text-sm font-bold text-navy">Recursos del post</div>
                        <div className="text-xs text-navy/60">Abrir en Google Drive — material listo para publicar</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-navy group-hover:translate-x-1 transition-transform">
                      Abrir
                      <span aria-hidden>→</span>
                    </div>
                  </a>
                </div>
              )}

              {post.media_url && (
                <div className="mt-5 overflow-hidden rounded-xl border border-navy/10 bg-navy-50">
                  {post.media_type === 'video' ? (
                    <video src={post.media_url} controls className="w-full" />
                  ) : (
                    <img src={post.media_url} alt={post.title} className="w-full" />
                  )}
                </div>
              )}

              {post.caption && (
                <div className="mt-5">
                  <div className="label">Copy</div>
                  <p className="whitespace-pre-wrap rounded-lg bg-navy-50/50 p-4 text-sm text-navy/90">{post.caption}</p>
                </div>
              )}

              {post.hashtags && (
                <div className="mt-4">
                  <div className="label">Hashtags</div>
                  <p className="text-sm font-medium text-navy/70">{post.hashtags}</p>
                </div>
              )}

              {post.notes && (
                <div className="mt-4">
                  <div className="label">Notas internas</div>
                  <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{post.notes}</p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-navy/10 pt-4 text-xs text-navy/50">
                {post.created_by && <span>Creado por <span className="font-semibold text-navy/70">{post.created_by}</span></span>}
                {post.assigned_to && <span>Asignado a <span className="font-semibold text-navy/70">{post.assigned_to}</span></span>}
                <span>Última actualización {new Date(post.updated_at).toLocaleString('es')}</span>
              </div>

              <div className="mt-4 flex justify-end">
                <button onClick={deletePost} className="text-xs font-semibold text-red-500 hover:underline">Eliminar post</button>
              </div>
            </div>

            <CommentThread postId={post.id} comments={comments} user={user} onChange={load} />
          </div>

          <div className="space-y-6">
            <ApprovalActions post={post} user={user} onChange={load} />

            <div className="card">
              <h3 className="text-lg font-black text-navy">Historial</h3>
              {history.length === 0 ? (
                <p className="mt-2 text-sm text-navy/50">Sin cambios todavía.</p>
              ) : (
                <ol className="mt-3 space-y-3">
                  {history.map((h) => (
                    <li key={h.id} className="border-l-2 border-navy/20 pl-3">
                      <div className="text-xs text-navy/50">
                        {new Date(h.created_at).toLocaleString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-sm font-semibold text-navy">
                        <span className="capitalize">{h.actor_name}</span> →{' '}
                        <span>{STATUS_LABEL[h.to_status]}</span>
                      </div>
                      {h.reason && <p className="mt-1 text-xs italic text-navy/60">"{h.reason}"</p>}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
