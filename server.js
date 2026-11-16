'use strict';

/**
 * Wien Taekwondo – Competition Nutrition Planner
 *
 * STATELESS BY DESIGN
 *  - no database, no files written, no sessions, no cookies
 *  - no request logging (no morgan / access-log middleware); user input is never logged
 *  - responses are marked Cache-Control: no-store
 *  - the PDF is streamed straight to the client and never touches the disk
 * Note: the hosting provider's own infrastructure may keep standard server logs
 * outside of this app's control (all user data is sent in POST bodies, never in URLs).
 */

const path = require('path');
const express = require('express');
const { run } = require('./lib/engine');
const { generatePdf } = require('./lib/pdf');
const { TIMEZONE } = require('./lib/config');

const app = express();
app.disable('x-powered-by');
app.set('etag', false);

app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    // Allow embedding on the club site only
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; " +
      "frame-ancestors 'self' https://wientaekwondo.com https://www.wientaekwondo.com; base-uri 'none'; form-action 'self'",
  });
  next();
});

app.use(express.json({ limit: '10kb' }));

app.get('/healthz', (req, res) => res.type('text/plain').send('ok'));

app.post('/api/plan', (req, res) => {
  const result = run(req.body);
  if (result.status === 'invalid') return res.status(400).json(result);
  // Blocked requests are a valid answer (HTTP 200) with ok:false
  res.json(result);
});

app.post('/api/pdf', (req, res) => {
  const result = run(req.body);
  if (!result.ok) return res.status(result.status === 'invalid' ? 400 : 422).json(result);
  const todayIso = new Date().toLocaleDateString('en-CA', { timeZone: TIMEZONE });
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${result.input.lang === 'de' ? 'Ernaehrungsplan' : 'Nutrition-Plan'}.pdf"`,
  });
  generatePdf(result, res, todayIso);
});

app.use(express.static(path.join(__dirname, 'public'), { etag: false, lastModified: false }));

// Generic error handler: never echoes request content
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err && err.status && err.status < 500 ? err.status : 500;
  res.status(status).json({ ok: false, status: 'error', message: 'Request could not be processed.' });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Planner listening on port ${PORT}`));
}
module.exports = app;
