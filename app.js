(function () {
  'use strict';

  var WA_NUMBER = '4915568172903';
  var NIGHT_PRICE = 109;
  var MAX_QTY = 30;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var EXTRAS = [
    { id: 'waldzauber', name: 'Waldzauber für zwei', price: 89, max: MAX_QTY, meta: 'SPA, Frühstück, Willkommens-Tablett & Lagerfeuer', tag: 'Special' },
    { id: 'spaDeluxe', name: 'Wald SPA Deluxe', price: 49, max: MAX_QTY, meta: '2 Std. · mit Wellness-Box' },
    { id: 'spaExclusiv', name: 'Wald SPA Exclusiv', price: 69, max: MAX_QTY, meta: '2 Std. · Wellness-Box & Lagerfeuer' },
    { id: 'lagerfeuer', name: 'Lagerfeuer-Paket', price: 25, max: MAX_QTY, meta: 'Holz, Wein, Marshmallows & Spieße' },
    { id: 'fruehstueck', name: 'Frühstück für zwei', price: 19, max: MAX_QTY, meta: 'vor eure Apartmenttür gestellt' },
    { id: 'early', name: 'Early Check-in', price: 20, max: 1, meta: 'ab 13:00 Uhr · max. einmal' },
    { id: 'late', name: 'Late Check-out', price: 20, max: 1, meta: 'bis 13:00 Uhr · max. einmal' },
    { id: 'escape', name: 'Wald Escape Room', price: 35, max: MAX_QTY, meta: 'Der Waldkiller von Schneeren' }
  ];
  var qty = {};
  EXTRAS.forEach(function (e) { qty[e.id] = 0; });

  var euro = function (n) { return n.toLocaleString('de-DE') + ' €'; };
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Toast ---------- */
  var toastEl = $('toast');
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2800);
  }

  function scrollToEl(el, focusEl) {
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    if (focusEl) setTimeout(function () { focusEl.focus({ preventScroll: true }); }, reduceMotion ? 0 : 500);
  }

  /* ---------- Header & Menü ---------- */
  var header = $('header');
  var nav = $('main-nav');
  var toggle = document.querySelector('.menu-toggle');

  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 960) setMenu(false); });

  /* ---------- Galerie-Tabs ---------- */
  var TREE_SVG = '<svg aria-hidden="true"><use href="#tree"/></svg>';
  var TABS = [
    { kicker: 'Wohnen & Schlafen', title: 'Gemütlichkeit, die bleibt.', desc: 'Ein komfortables Bett, warmes Licht und kleine Details, die aus einer Übernachtung eine Auszeit machen.',
      list: ['Komfortabler Schlafbereich', 'Ambiente-Beleuchtung', 'Smart-TV und Streaming', 'Klimaanlage mit Heizfunktion'],
      img: 'assets/bedroom.webp', alt: 'Schlafbereich mit Holzlamellen-Wand, Efeu-Girlande, warmem Licht und gemütlichen Kissen' },
    { kicker: 'Küche & Badezimmer', title: 'Alles für eure kleine Auszeit.', desc: 'Kocht gemeinsam, startet entspannt in den Morgen und genießt euren ganz eigenen Rückzugsort.',
      list: ['Voll ausgestattete Küche', 'Eigenes Badezimmer', 'Dusche', 'Privates Apartment für zwei'],
      img: null },
    { kicker: 'Wald & Umgebung', title: 'Die schönste Pause ist draußen.', desc: 'Tür auf. Durchatmen. Und gemeinsam zwischen den Bäumen verschwinden.',
      list: ['Waldspaziergänge direkt ab Apartment', 'Natur vor der Haustür', 'Region Steinhuder Meer', 'Neustadt am Rübenberge'],
      img: 'assets/garden.webp', alt: 'Grüner Garten mit Trittsteinen, Lichterketten und der Saunahütte zwischen den Bäumen' },
    { kicker: 'Wellness & Erlebnisse', title: 'Ein Abend nur für euch.', desc: 'Macht aus eurem Aufenthalt eure persönliche Auszeit – mit optionalen, liebevoll vorbereiteten Erlebnissen.',
      list: ['Wald SPA Deluxe: 49 €', 'Wald SPA Exclusiv: 69 €', 'Lagerfeuer-Paket: 25 €', 'Frühstück für zwei: 19 €', 'Nutzung nach vorheriger Abstimmung'],
      img: 'assets/jacuzzi.webp', alt: 'Beleuchteter Jacuzzi unter dem Pavillon mit Lichterkette und Sichtschutz aus Holz' }
  ];
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panel = $('panel-gallery');
  var media = $('gallery-media');
  var textBox = document.querySelector('.gallery-text');

  // Bilder vorladen, damit der Wechsel ruhig wirkt
  var preloadDone = false;
  function preloadTabs() {
    if (preloadDone) return;
    preloadDone = true;
    TABS.forEach(function (t) { if (t.img) { var i = new Image(); i.src = t.img; } });
  }

  function renderTab(i) {
    var t = TABS[i];
    if (t.img) {
      media.innerHTML = '<img src="' + t.img + '" alt="' + t.alt + '" width="1100" height="1400">';
    } else {
      media.innerHTML = '<div class="placeholder" role="img" aria-label="Platzhalter: Originalfotos für diesen Bereich folgen.">' + TREE_SVG +
        '<p>Originalfotos für diesen Bereich folgen.</p><small>Küche &amp; Badezimmer</small></div>';
    }
    $('gallery-kicker').textContent = t.kicker;
    $('gallery-title').textContent = t.title;
    $('gallery-desc').textContent = t.desc;
    $('gallery-list').innerHTML = t.list.map(function (l) { return '<li>' + l + '</li>'; }).join('');
  }

  function selectTab(i, focus) {
    tabs.forEach(function (tab, j) {
      var sel = j === i;
      tab.setAttribute('aria-selected', String(sel));
      tab.tabIndex = sel ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tabs[i].id);
    if (focus) tabs[i].focus();
    tabs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (reduceMotion) { renderTab(i); return; }
    media.classList.add('is-swapping');
    textBox.classList.add('is-swapping');
    setTimeout(function () {
      renderTab(i);
      requestAnimationFrame(function () {
        media.classList.remove('is-swapping');
        textBox.classList.remove('is-swapping');
      });
    }, 180);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { if (tab.getAttribute('aria-selected') !== 'true') selectTab(i, false); });
    tab.addEventListener('pointerenter', preloadTabs, { once: true });
    tab.addEventListener('focus', preloadTabs, { once: true });
    tab.addEventListener('keydown', function (e) {
      var n = tabs.length, next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = n - 1;
      if (next !== null) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ---------- Extras im Formular ---------- */
  var list = $('extras-list');
  list.innerHTML = EXTRAS.map(function (e) {
    return '<li data-extra="' + e.id + '">' +
      '<div><span class="extra-name" id="name-' + e.id + '">' + e.name + (e.tag ? '<span class="extra-tag">' + e.tag + '</span>' : '') + '</span>' +
      '<span class="extra-meta">' + euro(e.price) + ' · ' + e.meta + '</span></div>' +
      '<div class="stepper" role="group" aria-labelledby="name-' + e.id + '">' +
        '<button type="button" data-step="-1" aria-label="' + e.name + ': eins weniger">−</button>' +
        '<input type="number" inputmode="numeric" min="0" max="' + e.max + '" value="0" id="qty-' + e.id + '" aria-label="Anzahl ' + e.name + '">' +
        '<button type="button" data-step="1" aria-label="' + e.name + ': eins mehr">+</button>' +
      '</div>' +
      '<p class="extra-sub" id="sub-' + e.id + '" hidden></p>' +
    '</li>';
  }).join('');

  function setQty(id, value) {
    var ex = EXTRAS.filter(function (e) { return e.id === id; })[0];
    var v = parseInt(value, 10);
    if (isNaN(v) || v < 0) v = 0;
    if (v > ex.max) v = ex.max;
    qty[id] = v;
    var li = list.querySelector('[data-extra="' + id + '"]');
    li.querySelector('input').value = v;
    li.querySelector('[data-step="-1"]').disabled = v <= 0;
    li.querySelector('[data-step="1"]').disabled = v >= ex.max;
    li.classList.toggle('is-active', v > 0);
    var sub = $('sub-' + id);
    sub.hidden = v === 0;
    sub.textContent = v + ' × ' + euro(ex.price) + ' = ' + euro(v * ex.price);
    update();
  }

  list.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-step]');
    if (!btn) return;
    var id = btn.closest('[data-extra]').getAttribute('data-extra');
    setQty(id, qty[id] + parseInt(btn.getAttribute('data-step'), 10));
  });
  list.addEventListener('input', function (e) {
    if (e.target.matches('input')) {
      var id = e.target.closest('[data-extra]').getAttribute('data-extra');
      if (e.target.value === '') return;
      setQty(id, e.target.value);
    }
  });
  list.addEventListener('change', function (e) {
    if (e.target.matches('input')) setQty(e.target.closest('[data-extra]').getAttribute('data-extra'), e.target.value);
  });

  /* Buttons „anfragen / hinzufügen“ */
  var requestSection = $('anfrage');
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add) {
      var id = add.getAttribute('data-add');
      var ex = EXTRAS.filter(function (x) { return x.id === id; })[0];
      if (qty[id] >= ex.max) {
        toast(ex.name + (ex.max === 1 ? ' ist bereits ausgewählt (max. einmal).' : ' – Maximum erreicht.'));
      } else {
        setQty(id, qty[id] + 1);
        toast(ex.name + ' hinzugefügt · jetzt ' + qty[id] + ' ×');
      }
      scrollToEl(list.closest('fieldset'), $('qty-' + id));
      return;
    }
    if (e.target.closest('[data-airbnb]')) {
      airbnb.checked = true;
      update();
      toast('„Bereits über Airbnb gebucht“ ist aktiviert – nur Extras werden berechnet.');
      scrollToEl(requestSection, airbnb);
    }
  });

  /* ---------- Datumslogik ---------- */
  var arrival = $('r-arrival');
  var departure = $('r-departure');
  var airbnb = $('r-airbnb');

  function iso(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  function parseISO(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function addDays(d, n) { var c = new Date(d); c.setDate(c.getDate() + n); return c; }
  function fmtDate(s) {
    var d = parseISO(s);
    return d ? d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }) : '–';
  }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  arrival.min = iso(today);
  departure.min = iso(addDays(today, 1));

  function nights() {
    var a = parseISO(arrival.value), d = parseISO(departure.value);
    if (!a || !d) return 0;
    var diff = Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);
    return diff > 0 ? diff : 0;
  }

  arrival.addEventListener('change', function () {
    var a = parseISO(arrival.value);
    if (a) {
      var minDep = addDays(a, 1);
      departure.min = iso(minDep);
      var d = parseISO(departure.value);
      if (!d || d < minDep) departure.value = iso(minDep);
    }
    update();
  });
  departure.addEventListener('change', update);
  airbnb.addEventListener('change', update);

  /* ---------- Zusammenfassung ---------- */
  var summaryBody = $('summary-body');

  function calc() {
    var n = nights();
    var isAirbnb = airbnb.checked;
    var stay = isAirbnb ? 0 : n * NIGHT_PRICE;
    var items = EXTRAS.filter(function (e) { return qty[e.id] > 0; }).map(function (e) {
      return { name: e.name, q: qty[e.id], price: e.price, sum: qty[e.id] * e.price };
    });
    var extras = items.reduce(function (s, i) { return s + i.sum; }, 0);
    return { n: n, airbnb: isAirbnb, stay: stay, items: items, extras: extras, total: stay + extras };
  }

  function line(label, value) {
    return '<div class="sum-line"><span>' + label + '</span><span>' + value + '</span></div>';
  }

  function update() {
    var c = calc();
    var html = '<p class="sum-group">Übernachtung</p>';
    if (c.airbnb) {
      html += '<p class="sum-airbnb">Übernachtung bereits über Airbnb gebucht – nicht erneut berechnen' + (c.n ? ' (' + c.n + ' ' + (c.n === 1 ? 'Nacht' : 'Nächte') + ')' : '') + '</p>';
    } else if (c.n) {
      html += line(c.n + ' ' + (c.n === 1 ? 'Nacht' : 'Nächte') + ' × ab ' + euro(NIGHT_PRICE), euro(c.stay));
    } else {
      html += '<p class="sum-muted">Bitte Anreise und Abreise wählen.</p>';
    }
    html += '<p class="sum-group">Erlebnisse &amp; Extras</p>';
    if (c.items.length) {
      c.items.forEach(function (i) { html += line(i.q + ' × ' + i.name + ' <small>(à ' + euro(i.price) + ')</small>', euro(i.sum)); });
      if (!c.airbnb) html += line('<strong>Extras gesamt</strong>', euro(c.extras));
    } else {
      html += '<p class="sum-muted">Noch keine Extras gewählt.</p>';
    }
    if ($('r-romantic').checked || $('r-deco').value.trim() || $('r-wishes').value.trim()) {
      html += '<p class="sum-muted">Dekoration &amp; Sonderwünsche: Preis wird separat bestätigt.</p>';
    }
    html += '<div class="sum-total"><span>' + (c.airbnb ? 'Extras gesamt' : 'Vorläufiger Gesamtpreis') + '</span><strong>' + (c.airbnb ? '' : (c.n ? 'ab ' : '')) + euro(c.total) + '</strong></div>';
    summaryBody.innerHTML = html;
    return c;
  }

  ['r-romantic', 'r-deco', 'r-wishes'].forEach(function (id) { $(id).addEventListener('input', update); $(id).addEventListener('change', update); });
  update();
  EXTRAS.forEach(function (e) { setQty(e.id, 0); });

  /* ---------- Hilfsfunktionen WhatsApp & Kopieren ---------- */
  function waUrl(text) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text); }

  function openWhatsApp(url, statusEl) {
    var w = null;
    try { w = window.open(url, '_blank'); } catch (err) { w = null; }
    if (w) {
      try { w.opener = null; } catch (err) { /* ignorieren */ }
      statusEl.textContent = 'WhatsApp wurde geöffnet. Prüft die Nachricht und tippt dort auf „Senden“.';
    } else {
      statusEl.textContent = 'WhatsApp konnte nicht automatisch geöffnet werden. Tippt auf „WhatsApp öffnen“ oder kopiert die Nachricht.';
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var src = $(btn.getAttribute('data-copy'));
    var status = $(btn.getAttribute('data-status'));
    copyText(src.value).then(function () {
      status.textContent = 'Kopiert! Ihr könnt den Text jetzt in WhatsApp einfügen.';
      toast('In die Zwischenablage kopiert');
    }, function () {
      src.focus(); src.select();
      status.textContent = 'Kopieren wurde blockiert – der Text ist markiert, bitte manuell kopieren.';
    });
  });

  function showError(el, fields, msg) {
    el.textContent = msg;
    el.hidden = false;
    if (fields[0]) fields[0].focus();
  }
  function markInvalid(input, bad) {
    if (bad) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return bad;
  }
  function orDefault(v, d) { v = (v || '').trim(); return v ? v : d; }

  /* ---------- Anfrageformular ---------- */
  var reqForm = $('request-form');
  var reqError = $('r-error');
  reqForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('r-name');
    var invalid = [];
    if (markInvalid(arrival, !arrival.value || parseISO(arrival.value) < today)) invalid.push(arrival);
    if (markInvalid(departure, !departure.value || nights() < 1)) invalid.push(departure);
    if (markInvalid(name, !name.value.trim())) invalid.push(name);
    if (invalid.length) {
      var msgs = [];
      if (invalid.indexOf(arrival) > -1) msgs.push('ein Anreisedatum ab heute');
      if (invalid.indexOf(departure) > -1) msgs.push('eine Abreise mindestens einen Tag nach der Anreise');
      if (invalid.indexOf(name) > -1) msgs.push('euren Namen');
      showError(reqError, invalid, 'Bitte ergänzt noch ' + msgs.join(', ') + '.');
      return;
    }
    reqError.hidden = true;

    var c = update();
    var deco = [];
    if ($('r-romantic').checked) deco.push('Romantische Dekoration');
    if ($('r-deco').value.trim()) deco.push('Besondere Dekoration / Anlass: ' + $('r-deco').value.trim());

    var L = [];
    L.push('Hallo liebes Wald-Team,', '');
    L.push('ich möchte gerne unverbindlich eine Auszeit im Waldapartment anfragen. 🌲', '');
    L.push('Name: ' + name.value.trim());
    L.push('Anreise: ' + fmtDate(arrival.value));
    L.push('Abreise: ' + fmtDate(departure.value));
    L.push('Nächte: ' + c.n);
    L.push('Gäste: ' + ($('r-guests').value === '1' ? '1 Person' : '2 Personen'));
    L.push('Hund: ' + ($('r-dog').checked ? 'Ja, wir möchten einen Hund mitbringen' : 'Nein'));
    L.push('Bestehende Airbnb-Buchung: ' + (c.airbnb ? 'Ja – Übernachtung bitte nicht erneut berechnen' : 'Nein'));
    L.push('');
    if (c.airbnb) {
      L.push('Übernachtung: bereits über Airbnb gebucht (0 €)');
    } else {
      L.push('Übernachtung (Mindestpreis): ' + c.n + ' × ' + euro(NIGHT_PRICE) + ' = ' + euro(c.stay));
    }
    L.push('');
    L.push('Gewünschte Erlebnisse & Extras:');
    if (c.items.length) {
      c.items.forEach(function (i) { L.push('• ' + i.q + ' × ' + i.name + ' à ' + euro(i.price) + ' = ' + euro(i.sum)); });
    } else {
      L.push('• Keine');
    }
    L.push('Extras gesamt: ' + euro(c.extras));
    if (c.airbnb) {
      L.push('Vorläufiger Gesamtpreis (nur Extras): ' + euro(c.total));
    } else {
      L.push('Vorläufiger Gesamtpreis: ab ' + euro(c.total) + ' (Übernachtung als Mindestpreis, je nach Saison und Wochentag)');
    }
    L.push('');
    L.push('Dekoration: ' + (deco.length ? deco.join('; ') + ' (Preis bitte separat bestätigen)' : 'Keine'));
    L.push('Sonderwünsche: ' + orDefault($('r-wishes').value, 'Keine'));
    L.push('Wunschzeiten & Fragen: ' + orDefault($('r-questions').value, 'Keine'));
    L.push('');
    L.push('Bitte bestätigt mir Verfügbarkeit, Wunschzeiten und den endgültigen Gesamtpreis. Vielen Dank!');
    var text = L.join('\n');

    var out = $('r-output');
    $('r-text').value = text;
    var url = waUrl(text);
    $('r-wa').href = url;
    out.hidden = false;
    $('r-status').textContent = '';
    openWhatsApp(url, $('r-status'));
    out.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    out.focus({ preventScroll: true });
  });

  /* ---------- Gutscheinformular ---------- */
  var vForm = $('voucher-form');
  var vWhat = $('v-what');
  var vCustomWrap = $('v-custom-wrap');
  var vCustom = $('v-custom');
  vWhat.addEventListener('change', function () {
    var custom = vWhat.value === 'custom';
    vCustomWrap.hidden = !custom;
    vCustom.required = custom;
  });

  vForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var vName = $('v-name');
    var invalid = [];
    if (markInvalid(vName, !vName.value.trim())) invalid.push(vName);
    if (markInvalid(vWhat, !vWhat.value)) invalid.push(vWhat);
    if (vWhat.value === 'custom' && markInvalid(vCustom, !vCustom.value.trim())) invalid.push(vCustom);
    else markInvalid(vCustom, false);
    if (invalid.length) {
      showError($('v-error'), invalid, 'Bitte gib deinen Namen an und wähle, was du verschenken möchtest.');
      return;
    }
    $('v-error').hidden = true;
    var what = vWhat.value === 'custom' ? vCustom.value.trim() : vWhat.value;
    var text = [
      'Hallo liebes Wald-Team,', '',
      'ich möchte einen Gutschein für das Waldapartment anfragen. 🌲', '',
      'Mein Name: ' + vName.value.trim(),
      'Gutschein für: ' + orDefault($('v-for').value, 'Noch offen'),
      'Von: ' + orDefault($('v-from').value, vName.value.trim()),
      'Gewünschter Inhalt / Wert: ' + what,
      'Zeitraum: ' + orDefault($('v-time').value, 'Noch offen'),
      'Persönliche Nachricht / Wünsche: ' + orDefault($('v-msg').value, 'Keine'), '',
      'Bitte bestätige den Preis und die Details zur Ausstellung. Vielen Dank!'
    ].join('\n');
    $('v-text').value = text;
    var url = waUrl(text);
    $('v-wa').href = url;
    $('v-output').hidden = false;
    $('v-status').textContent = '';
    openWhatsApp(url, $('v-status'));
  });

  ['r-name', 'r-arrival', 'r-departure', 'v-name', 'v-what', 'v-custom'].forEach(function (id) {
    $(id).addEventListener('input', function () { $(id).removeAttribute('aria-invalid'); });
  });

  /* ---------- Mobiler CTA ---------- */
  var cta = $('mobile-cta');
  var heroEl = document.querySelector('.hero');
  var reqVisible = false, heroVisible = true, footerVisible = false;
  function updateCta() { cta.classList.toggle('is-hidden', reqVisible || heroVisible || footerVisible); }
  if ('IntersectionObserver' in window) {
    var ctaIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.target === requestSection) reqVisible = en.isIntersecting;
        else if (en.target === heroEl) heroVisible = en.intersectionRatio > 0.35;
        else footerVisible = en.isIntersecting;
      });
      updateCta();
    }, { threshold: [0, 0.35] });
    ctaIo.observe(requestSection);
    ctaIo.observe(heroEl);
    ctaIo.observe(document.querySelector('.site-footer'));
  } else {
    heroVisible = false;
    updateCta();
  }

  /* ---------- Scroll-Einblendungen ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Jahr ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
