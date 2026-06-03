'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { CalendarMonth } from '@/components/CalendarMonth';
import { StatusBadge } from '@/components/StatusBadge';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/user';
import type { Post, Status } from '@/lib/types';
import { STATUS_LABEL } from '@/lib/types';
import Link from 'next/link';

const STATUS_FILTERS: Array<Status | 'all'> = [
  'all', 'pending_approval', 'changes_requested', 'approved', 'draft', 'published', 'rejected',
];

export default function CalendarioPage() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | 'all'>('all');

  useEffect(() => {
    if (!getUser()) { router.replace('/'); return; }
  }, [router]);

  async function load() {
    setLoading(true);
    const first = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const last = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    const { data } = await supabase
      .from('posts')
      .select('*')
      .gte('scheduled_date', first)
      .lte('scheduled_date', last)
      .order('scheduled_date', { ascending: true });
    setPosts(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [year, month]);

  const visible = filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  const counts: Record<Status | 'all', number> = {
    all: posts.length,
    draft: 0, pending_approval: 0, approved: 0, changes_requested: 0, rejected: 0, published: 0,
  };
  for (const p of posts) counts[p.status]++;

  function prev() {
    if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1);
  }
  function next() {
    if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
  }
  function goToday() {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth());
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-navy">Grilla de contenido</h1>
            <p className="mt-1 text-sm text-navy/60">Calendario editorial — aprobaciones y comentarios en tiempo real</p>
          </div>
          <Link href="/post/nuevo" className="btn-primary">+ Nuevo post</Link>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filter === s ? 'border-navy bg-navy text-white' : 'border-navy/15 bg-white text-navy/70 hover:bg-navy/5'
              }`}
            >
              {s === 'all' ? 'Todos' : STATUS_LABEL[s]}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === s ? 'bg-white/20' : 'bg-navy/10'}`}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="card text-center text-navy/50">Cargando...</div>
        ) : (
          <CalendarMonth year={year} month={month} posts={visible} onPrev={prev} onNext={next} onToday={goToday} />
        )}

        {visible.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-navy/60">Lista del mes</h2>
            <div className="card p-0">
              <div className="divide-y divide-navy/10">
                {visible.map((p) => (
                  <Link key={p.id} href={`/post/${p.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-navy/5">
                    <div className="w-20 text-xs font-semibold text-navy/60">
                      {new Date(p.scheduled_date + 'T00:00:00').toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-navy">{p.title}</div>
                      <div className="mt-0.5 text-xs text-navy/50">{p.format} · {p.network}</div>
                    </div>
                    <StatusBadge status={p.status} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
