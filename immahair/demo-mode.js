/* Modalità demo: nessun dato viene inviato. Le prenotazioni restituiscono un codice fittizio. */
(function () {
  var realFetch = window.fetch.bind(window);
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/[^/]*$/, '');
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.indexOf('/api/') !== -1) {
      var method = ((init && init.method) || 'GET').toUpperCase();
      if (method === 'POST') {
        var code = 'DEMO-' + Math.random().toString(36).slice(2, 7).toUpperCase();
        return Promise.resolve(new Response(JSON.stringify({ ok: true, code: code, demo: true }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      // GET: dati di esempio statici in demo-api/<percorso>.json (se esistono), altrimenti 404
      var path = url.split('/api/')[1].split('?')[0];
      return realFetch(BASE + 'demo-api/' + path + '.json').then(function (r) {
        if (!r.ok) throw new Error();
        return r.text();
      }).then(function (t) {
        var d = new Date(), today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(d);
        t = t.replace(/__DAY\+(\d+)__/g, function (_, n) {
          var x = new Date(today + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + Number(n)); return x.toISOString().slice(0, 10);
        });
        t = t.split('__TODAY__').join(today).split('__NOW__').join(new Date(d.getTime() - 3 * 3600e3).toISOString());
        return new Response(t, { status: 200, headers: { 'Content-Type': 'application/json' } });
      }).catch(function () {
        return new Response('{}', { status: 404, headers: { 'Content-Type': 'application/json' } });
      });
    }
    return realFetch(input, init);
  };
  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.createElement('div');
    bar.textContent = 'Anteprima dimostrativa · non è il sito ufficiale · le prenotazioni non vengono inviate';
    bar.style.cssText = 'position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:2147483647;background:rgba(17,17,17,.88);color:#fff;font:500 12px/1.3 system-ui,sans-serif;padding:7px 14px;border-radius:999px;box-shadow:0 4px 16px rgba(0,0,0,.25);pointer-events:none;max-width:calc(100vw - 32px);text-align:center';
    document.body.appendChild(bar);
  });
})();
