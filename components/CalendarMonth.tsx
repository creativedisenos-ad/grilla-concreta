'use client';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { STATUS_DOT } from '@/lib/types';
import { NetworkBadge } from './NetworkBadge';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function startOfMonthGrid(year: number, month: number): Date {
  const first = new Date(year, month, 1);
  const dow = (first.getDay() + 6) % 7; // lunes = 0
  const start = new Date(first);
  start.setDate(first.getDate() - dow);
  return start;
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function CalendarMonth({
  year,
  month,
  posts,
  onPrev,
  onNext,
  onToday,
}: {
  year: number;
  month: number;
  posts: Post[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  const start = startOfMonthGrid(year, month);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  const today = fmtDate(new Date());
  const monthName = new Date(year, month).toLocaleDateString('es', { month: 'long', year: 'numeric' });

  const byDate = new Map<string, Post[]>();
  for (const p of posts) {
    const arr = byDate.get(p.scheduled_date) || [];
    arr.push(p);
    byDate.set(p.scheduled_date, arr);
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-navy/10 px-6 py-4">
        <div>
          <h2 className="text-xl font-black capitalize text-navy">{monthName}</h2>
          <p className="mt-0.5 text-xs text-navy/50">{posts.length} pieza{posts.length === 1 ? '' : 's'} en pantalla</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onPrev} className="btn-ghost">←</button>
          <button onClick={onToday} className="btn-ghost">Hoy</button>
          <button onClick={onNext} className="btn-ghost">→</button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-navy/10 bg-navy-50">
        {DAYS.map((d) => (
          <div key={d} className="px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-navy/60">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          const dateStr = fmtDate(d);
          const items = byDate.get(dateStr) || [];
          const inMonth = d.getMonth() === month;
          const isToday = dateStr === today;
          return (
            <div
              key={i}
              className={`min-h-[110px] border-b border-r border-navy/10 p-2 last:border-r-0 ${
                inMonth ? 'bg-white' : 'bg-slate-50/60'
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span
                  className={`text-xs font-semibold ${
                    isToday ? 'rounded-full bg-navy px-1.5 py-0.5 text-white' : inMonth ? 'text-navy' : 'text-navy/30'
                  }`}
                >
                  {d.getDate()}
                </span>
                {items.length > 0 && inMonth && (
                  <span className="text-[10px] font-bold text-navy/40">{items.length}</span>
                )}
              </div>
              <div className="space-y-1">
                {items.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    href={`/post/${p.id}`}
                    className="group flex items-center gap-1.5 rounded-md border border-navy/10 bg-white px-1.5 py-1 hover:border-navy/30 hover:shadow-sm"
                  >
                    <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${STATUS_DOT[p.status]}`} />
                    <NetworkBadge network={p.network} size="sm" />
                    <span className="truncate text-[11px] font-medium text-navy">{p.title}</span>
                  </Link>
                ))}
                {items.length > 3 && (
                  <div className="px-1 text-[10px] font-semibold text-navy/50">+{items.length - 3} más</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
