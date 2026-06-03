'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { getUser, type CurrentUser } from '@/lib/user';
import type { Network, Format, MediaType } from '@/lib/types';

const NETWORKS: Network[] = ['instagram', 'facebook', 'tiktok', 'linkedin', 'x', 'youtube', 'threads'];
const FORMATS: Format[] = ['post', 'reel', 'story', 'carousel', 'video', 'live'];

export default function NuevoPostPage() {
  const router = useRouter();
  const [user, setUserState] = useState<CurrentUser | null>(null);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    scheduled_date: today,
    scheduled_time: '',
    network: 'instagram' as Network,
    format: 'post' as Format,
    title: '',
    caption: '',
    hashtags: '',
    media_url: '',
    media_type: 'image' as MediaType,
    notes: '',
    assigned_to: '',
  });

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace('/'); return; }
    setUserState(u);
  }, [router]);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!form.title.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('posts')
      .insert({
        scheduled_date: form.scheduled_date,
        scheduled_time: form.scheduled_time || null,
        network: form.network,
        format: form.format,
        title: form.title.trim(),
        caption: form.caption.trim() || null,
        hashtags: form.hashtags.trim() || null,
        media_url: form.media_url.trim() || null,
        media_type: form.media_url.trim() ? form.media_type : null,
        notes: form.notes.trim() || null,
        assigned_to: form.assigned_to.trim() || null,
        created_by: user.name,
        status: 'draft',
      })
      .select()
      .single();
    setSaving(false);
    if (error) { alert('Error: ' + error.message); return; }
    if (data) router.push(`/post/${data.id}`);
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-8">
        <Link href="/calendario" className="text-sm font-semibold text-navy/60 hover:text-navy">← Calendario</Link>
        <h1 className="mt-3 text-3xl font-black text-navy">Nuevo post</h1>
        <p className="mt-1 text-sm text-navy/60">Crea una pieza nueva y enviála a aprobación cuando esté lista.</p>

        <form onSubmit={submit} className="mt-6 space-y-5">
          <div className="card space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Fecha programada</label>
                <input
                  type="date"
                  value={form.scheduled_date}
                  onChange={(e) => set('scheduled_date', e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Hora (opcional)</label>
                <input
                  type="time"
                  value={form.scheduled_time}
                  onChange={(e) => set('scheduled_time', e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Red social</label>
                <select value={form.network} onChange={(e) => set('network', e.target.value as Network)} className="input capitalize">
                  {NETWORKS.map((n) => <option key={n} value={n} className="capitalize">{n}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Formato</label>
                <select value={form.format} onChange={(e) => set('format', e.target.value as Format)} className="input capitalize">
                  {FORMATS.map((f) => <option key={f} value={f} className="capitalize">{f}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Título interno *</label>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Ej: Lanzamiento Torre Conkreta Las Mercedes"
                className="input"
                required
              />
            </div>
          </div>

          <div className="card space-y-4">
            <div>
              <label className="label">Copy / Caption</label>
              <textarea
                value={form.caption}
                onChange={(e) => set('caption', e.target.value)}
                rows={6}
                className="input resize-none"
                placeholder="Texto que se publicará en la red social..."
              />
            </div>
            <div>
              <label className="label">Hashtags</label>
              <input
                value={form.hashtags}
                onChange={(e) => set('hashtags', e.target.value)}
                placeholder="#ConkretaGroup #Caracas #BienesRaices"
                className="input"
              />
            </div>
          </div>

          <div className="card space-y-4">
            <div>
              <label className="label">URL del media (imagen o video)</label>
              <input
                value={form.media_url}
                onChange={(e) => set('media_url', e.target.value)}
                placeholder="https://..."
                className="input"
              />
              <p className="mt-1 text-xs text-navy/40">Pega aquí el enlace de Drive, Dropbox o cualquier CDN. (Adjuntar archivos llega en V2.)</p>
            </div>
            {form.media_url && (
              <div>
                <label className="label">Tipo de media</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['image', 'video', 'carousel'] as MediaType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set('media_type', t)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize ${
                        form.media_type === t ? 'border-navy bg-navy text-white' : 'border-navy/15 text-navy/70 hover:bg-navy/5'
                      }`}
                    >{t}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card space-y-4">
            <div>
              <label className="label">Asignado a</label>
              <input
                value={form.assigned_to}
                onChange={(e) => set('assigned_to', e.target.value)}
                placeholder="Nombre del responsable"
                className="input"
              />
            </div>
            <div>
              <label className="label">Notas internas</label>
              <textarea
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                rows={3}
                className="input resize-none"
                placeholder="Contexto para el equipo (no se publica)"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link href="/calendario" className="btn-secondary">Cancelar</Link>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Guardando...' : 'Crear post'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
