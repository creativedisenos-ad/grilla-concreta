# Grilla CONKRETA GROUP

Sistema de aprobación de contenido con calendario para redes sociales de CONKRETA GROUP.

## Stack
- Next.js 14 (App Router, TS)
- Supabase Postgres (proyecto `grilla-conkreta`)
- Tailwind CSS — paleta navy CONKRETA
- Deploy: Vercel

## Variables de entorno
Copiar `.env.local.example` → `.env.local` (ya están seteadas en Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=https://xmpwmvusogvsrcpignuh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_UJ7JMXFRHAxW-MgxwbU11g_BNW74lvB
```

## Flujo
1. Entra y escribe tu nombre + rol (cliente / agencia / director).
2. La agencia crea posts en estado `Borrador`.
3. Envía a `Por aprobar` cuando esté listo.
4. El cliente revisa, comenta y decide: Aprobar / Pedir cambios / Rechazar.
5. La agencia ajusta hasta tener aprobación y luego marca como `Publicado`.

Todo queda guardado en Supabase: posts, comentarios, e historial de aprobación con motivo.
