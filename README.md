# Linguafly

Web pública de Linguafly construida con Next.js 16 y OpenNext para Cloudflare Workers.

## Desarrollo
```bash
npm install
npm run dev
```

## Cloudflare
- Worker: `linguaflyapp1`
- Blog D1: binding `DB`, base `blog`
- Cursos D1: binding `COURSE_DB`, base `linguafly-learning`
- El blog consulta artículos publicados directamente en D1; la app no modifica registros del CMS.
- Build: `npm run build`
- Preview: `npm run preview`
- Deploy: `npm run deploy`
