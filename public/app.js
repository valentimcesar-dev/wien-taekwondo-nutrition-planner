'use strict';

(function () {
  var STR = {
    de: {
      title: 'Wettkampf-Ernährungsplaner',
      intro: 'Gib dein Gewicht, das Wettkampfdatum und dein Zielgewicht ein. Du bekommst eine allgemeine, ausgewogene Ernährungsvorlage als PDF – ohne Hungern, ohne Flüssigkeitsentzug und ohne Extremdiäten.',
      privacy: 'Deine Eingaben werden nicht gespeichert.',
      hBasics: 'Deine Angaben',
      age: 'Altersgruppe', ageEmpty: 'Bitte wählen', teen: 'Jugendlich (unter 18)', adult: 'Erwachsen (ab 18)',
      date: 'Wettkampfdatum', current: 'Gewicht heute (kg)', target: 'Zielgewicht / Gewichtsklasse (kg)',
      hTraining: 'Dein Training',
      hintTraining: 'Wie viele Stunden pro Woche trainierst du, und wie anstrengend ist es im Schnitt? Mehr Training verbraucht mehr Energie – dein Plan wird daran angepasst.',
      cats: { taekwondo: 'Taekwondo', cardio: 'Ausdauer / Cardio', strength: 'Krafttraining', other: 'Sonstiges (z. B. Radfahren, Dehnen)' },
      classes: { high: 'Hohe Intensität', mid: 'Mittlere Intensität', low: 'Niedrige Intensität' },
      hours: 'Stunden / Woche', effort: 'Anstrengung', hUnit: ' h',
      efforts: ['', 'sehr leicht', 'sehr leicht', 'leicht', 'leicht', 'mittel', 'mittel', 'hart', 'hart', 'sehr hart', 'maximal'],
      trainingTotal: function (h) { return 'Training gesamt: ' + h + ' Stunden pro Woche'; },
      tiers: { none: 'kein Training angegeben', light: 'leicht', moderate: 'mittel', high: 'hoch', veryHigh: 'sehr hoch' },
      tierLabel: 'Trainingsbelastung',
      rateLabel: 'Maximaler Gewichtsverlust pro Woche',
      rateText: function (w, t) { var f = function (n) { return String(n).replace('.', ','); }; return t.extraWeeklyPct > 0 ? 'bis ca. ' + f(w.maxKg) + ' kg (ohne dein Training: ' + f(w.baseKg) + ' kg)' : 'bis ca. ' + f(w.maxKg) + ' kg'; },
      errTraining: 'Bitte prüfe die Trainingsstunden (maximal 40 Stunden pro Woche gesamt).',
      hFood: 'Ernährung',
      diet: 'Ernährungsform',
      diets: { omnivore: 'Alles', pescatarian: 'Pescetarisch (Fisch, kein Fleisch)', vegetarian: 'Vegetarisch', vegan: 'Vegan', halal: 'Ohne Schweinefleisch (halal-orientiert)' },
      allergens: 'Allergien (EU-Allergene)',
      hintAllergens: 'Erdnüsse und Schalenfrüchte (Nüsse) sind getrennte Gruppen. Kreuze beide an, wenn du auf beide achten musst.',
      lactose: 'Laktoseintoleranz',
      other: 'Weitere Allergien / Unverträglichkeiten (mit Komma trennen)',
      dislikes: 'Das mag ich nicht (mit Komma trennen)',
      submit: 'Plan erstellen',
      working: 'Bitte warten …',
      daysLeft: 'Tage bis Wettkampf', toGo: 'Differenz zum Ziel', kgUnit: 'kg',
      previewTitle: 'Vorschau: Beispieltag',
      pdf: 'PDF herunterladen',
      contains: 'Enthält:',
      noOption: 'Für diese Mahlzeit gibt es mit deinen Angaben keine passende Vorlage. Bitte hole dir eine individuelle Beratung.',
      errAge: 'Bitte Altersgruppe wählen.', errNum: 'Bitte gültige Gewichte eingeben (30–200 kg).', errDate: 'Bitte ein gültiges Datum wählen.',
      errNet: 'Verbindung fehlgeschlagen. Bitte versuche es erneut.',
      foot: 'Allgemeine Vorlage, keine medizinische oder individuelle Ernährungsberatung. Bei Erkrankungen, schweren Allergien oder Fragen zu deinem Gewicht frage bitte Ärztin/Arzt oder eine Diätologin/einen Diätologen. Allergenangaben gelten allgemein für die Zutat; lies bei Fertigprodukten immer die Zutatenliste.',
    },
    en: {
      title: 'Competition Nutrition Planner',
      intro: 'Enter your weight, the competition date and your target weight. You get a general, balanced nutrition template as a PDF – no fasting, no fluid restriction and no extreme diets.',
      privacy: 'Your input is not stored.',
      hBasics: 'Your details',
      age: 'Age group', ageEmpty: 'Please choose', teen: 'Teenager (under 18)', adult: 'Adult (18 and over)',
      date: 'Competition date', current: 'Weight today (kg)', target: 'Target weight / weight category (kg)',
      hTraining: 'Your training',
      hintTraining: 'How many hours per week do you train, and how hard is it on average? More training uses more energy – your plan is adjusted to it.',
      cats: { taekwondo: 'Taekwondo', cardio: 'Endurance / cardio', strength: 'Strength training', other: 'Other (e.g. cycling, stretching)' },
      classes: { high: 'High intensity', mid: 'Medium intensity', low: 'Low intensity' },
      hours: 'Hours / week', effort: 'Effort', hUnit: ' h',
      efforts: ['', 'very easy', 'very easy', 'easy', 'easy', 'moderate', 'moderate', 'hard', 'hard', 'very hard', 'maximal'],
      trainingTotal: function (h) { return 'Total training: ' + h + ' hours per week'; },
      tiers: { none: 'no training entered', light: 'light', moderate: 'moderate', high: 'high', veryHigh: 'very high' },
      tierLabel: 'Training load',
      rateLabel: 'Maximum weight loss per week',
      rateText: function (w, t) { return t.extraWeeklyPct > 0 ? 'up to approx. ' + w.maxKg + ' kg (without your training: ' + w.baseKg + ' kg)' : 'up to approx. ' + w.maxKg + ' kg'; },
      errTraining: 'Please check your training hours (maximum 40 hours per week in total).',
      hFood: 'Nutrition',
      diet: 'Diet',
      diets: { omnivore: 'Everything', pescatarian: 'Pescatarian (fish, no meat)', vegetarian: 'Vegetarian', vegan: 'Vegan', halal: 'No pork (halal-oriented)' },
      allergens: 'Allergies (EU allergens)',
      hintAllergens: 'Peanuts and tree nuts are separate groups. Tick both if you need to avoid both.',
      lactose: 'Lactose intolerance',
      other: 'Other allergies / intolerances (separate with commas)',
      dislikes: 'Foods I dislike (separate with commas)',
      submit: 'Create plan',
      working: 'Please wait …',
      daysLeft: 'Days to competition', toGo: 'Difference to target', kgUnit: 'kg',
      previewTitle: 'Preview: example day',
      pdf: 'Download PDF',
      contains: 'Contains:',
      noOption: 'There is no suitable template for this meal with your selections. Please get individual advice.',
      errAge: 'Please choose an age group.', errNum: 'Please enter valid weights (30–200 kg).', errDate: 'Please choose a valid date.',
      errNet: 'Connection failed. Please try again.',
      foot: 'General template, not medical or individual nutrition advice. If you have a medical condition, severe allergies or questions about your weight, please ask a doctor or a registered dietitian. Allergen information is generic for the ingredient; always read the ingredient list on packaged products.',
    },
  };

  var ALLERGENS = [
    ['gluten', 'Gluten (Getreide)', 'Gluten (cereals)'],
    ['crustaceans', 'Krebstiere', 'Crustaceans'],
    ['eggs', 'Eier', 'Eggs'],
    ['fish', 'Fisch', 'Fish'],
    ['peanuts', 'Erdnüsse', 'Peanuts'],
    ['soy', 'Soja', 'Soy'],
    ['milk', 'Milch', 'Milk'],
    ['nuts', 'Schalenfrüchte (Nüsse)', 'Tree nuts'],
    ['celery', 'Sellerie', 'Celery'],
    ['mustard', 'Senf', 'Mustard'],
    ['sesame', 'Sesam', 'Sesame'],
    ['sulphites', 'Sulfite', 'Sulphites'],
    ['lupin', 'Lupine', 'Lupin'],
    ['molluscs', 'Weichtiere', 'Molluscs'],
  ];

  var CATS = [['taekwondo', 'high'], ['cardio', 'mid'], ['strength', 'mid'], ['other', 'low']];
  var trainingState = {};
  CATS.forEach(function (c) { trainingState[c[0]] = { hours: 0, rpe: 5 }; });

  var lang = (navigator.language || '').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  var $ = function (id) { return document.getElementById(id); };
  var lastBody = null;

  function setText(id, txt) { var el = $(id); if (el) el.textContent = txt; }

  function applyLang() {
    var s = STR[lang];
    document.documentElement.lang = lang;
    document.title = 'Wien Taekwondo – ' + s.title;
    setText('t-title', s.title); setText('t-intro', s.intro); setText('t-privacy', s.privacy);
    setText('t-h-basics', s.hBasics); setText('t-l-age', s.age);
    setText('opt-age-empty', s.ageEmpty); setText('opt-teen', s.teen); setText('opt-adult', s.adult);
    setText('t-l-date', s.date); setText('t-l-current', s.current); setText('t-l-target', s.target);
    setText('t-h-food', s.hFood); setText('t-l-diet', s.diet); setText('t-l-allergens', s.allergens); setText('t-hint-allergens', s.hintAllergens);
    setText('t-l-lactose', s.lactose); setText('t-l-other', s.other); setText('t-l-dislikes', s.dislikes);
    setText('t-submit', s.submit); setText('t-foot', s.foot);
    setText('t-h-training', s.hTraining); setText('t-hint-training', s.hintTraining);
    buildTraining();

    var diet = $('diet'); var keep = diet.value || 'omnivore';
    diet.textContent = '';
    Object.keys(s.diets).forEach(function (k) {
      var o = document.createElement('option'); o.value = k; o.textContent = s.diets[k]; diet.appendChild(o);
    });
    diet.value = keep;

    var box = $('allergens');
    var checked = {};
    Array.prototype.forEach.call(box.querySelectorAll('input'), function (i) { checked[i.value] = i.checked; });
    box.textContent = '';
    ALLERGENS.forEach(function (a) {
      var l = document.createElement('label');
      var i = document.createElement('input'); i.type = 'checkbox'; i.value = a[0]; i.checked = !!checked[a[0]];
      l.appendChild(i); l.appendChild(document.createTextNode(' ' + (lang === 'de' ? a[1] : a[2])));
      box.appendChild(l);
    });

    $('lang-de').classList.toggle('active', lang === 'de');
    $('lang-en').classList.toggle('active', lang === 'en');
    $('result').textContent = '';
  }

  function buildTraining() {
    var s = STR[lang]; var box = $('training'); box.textContent = '';
    CATS.forEach(function (c) {
      var key = c[0]; var st = trainingState[key];
      var row = document.createElement('div'); row.className = 'trow';
      var head = document.createElement('div'); head.className = 'trow-head';
      var nm = document.createElement('span'); nm.className = 'trow-name'; nm.textContent = s.cats[key];
      var bd = document.createElement('span'); bd.className = 'badge ' + c[1]; bd.textContent = s.classes[c[1]];
      head.appendChild(nm); head.appendChild(bd); row.appendChild(head);

      function slider(label, id, min, max, step, value, fmt) {
        var w = document.createElement('div'); w.className = 'slider';
        var l = document.createElement('span'); l.className = 'lbl'; l.textContent = label;
        var inp = document.createElement('input'); inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step; inp.value = value; inp.id = id;
        inp.setAttribute('aria-label', s.cats[key] + ' – ' + label);
        var out = document.createElement('output'); out.textContent = fmt(value);
        w.appendChild(l); w.appendChild(inp); w.appendChild(out);
        return { wrap: w, input: inp, out: out };
      }
      var h = slider(s.hours, 'h-' + key, 0, 20, 0.5, st.hours, function (v) { return v + s.hUnit; });
      var e = slider(s.effort, 'e-' + key, 1, 10, 1, st.rpe, function (v) { return v + ' – ' + s.efforts[v]; });
      function sync() { e.wrap.classList.toggle('off', Number(st.hours) === 0); updateTotal(); }
      h.input.addEventListener('input', function () { st.hours = parseFloat(h.input.value); h.out.textContent = st.hours + s.hUnit; sync(); });
      e.input.addEventListener('input', function () { st.rpe = parseInt(e.input.value, 10); e.out.textContent = st.rpe + ' – ' + s.efforts[st.rpe]; });
      row.appendChild(h.wrap); row.appendChild(e.wrap); box.appendChild(row);
      e.wrap.classList.toggle('off', Number(st.hours) === 0);
    });
    updateTotal();
  }

  function updateTotal() {
    var t = 0; CATS.forEach(function (c) { t += Number(trainingState[c[0]].hours); });
    setText('t-training-total', STR[lang].trainingTotal(Math.round(t * 10) / 10));
  }

  function notice(cls, msg) {
    var d = document.createElement('div'); d.className = 'notice ' + cls; d.textContent = msg; return d;
  }

  function stat(label, value) {
    var d = document.createElement('div'); var b = document.createElement('b'); b.textContent = value;
    d.appendChild(b); d.appendChild(document.createTextNode(label)); return d;
  }

  function collect() {
    var allergens = Array.prototype.filter.call($('allergens').querySelectorAll('input'), function (i) { return i.checked; })
      .map(function (i) { return i.value; });
    return {
      lang: lang,
      ageGroup: $('ageGroup').value,
      date: $('date').value,
      currentKg: parseFloat($('currentKg').value.replace(',', '.')),
      targetKg: parseFloat($('targetKg').value.replace(',', '.')),
      diet: $('diet').value,
      allergens: allergens,
      lactose: $('lactose').checked,
      otherAllergy: $('otherAllergy').value,
      dislikes: $('dislikes').value,
      training: JSON.parse(JSON.stringify(trainingState)),
    };
  }

  function renderResult(r) {
    var s = STR[lang]; var out = $('result'); out.textContent = '';
    if (!r.ok) { out.appendChild(notice(r.status === 'blocked' ? 'bad' : 'warn', r.message)); return; }

    var n = notice(r.status === 'maintain' ? 'ok' : 'ok', r.message);
    var st = document.createElement('div'); st.className = 'stats';
    st.appendChild(stat(s.daysLeft, String(r.assessment.daysLeft)));
    st.appendChild(stat(s.toGo, (r.assessment.lossKg > 0 ? r.assessment.lossKg : 0) + ' ' + s.kgUnit));
    n.appendChild(st);
    var a = r.assessment;
    if (a.lossKg > 0) {
      var rate = document.createElement('div'); rate.className = 'rate';
      var rb = document.createElement('b'); rb.textContent = s.rateLabel + ': ';
      rate.appendChild(rb); rate.appendChild(document.createTextNode(s.rateText(a.weekly, a.training)));
      n.appendChild(rate);
    }
    var tl = document.createElement('div'); tl.className = 'rate';
    var tb = document.createElement('b'); tb.textContent = s.tierLabel + ': ';
    tl.appendChild(tb); tl.appendChild(document.createTextNode(s.tiers[a.training.tier]));
    n.appendChild(tl);
    out.appendChild(n);

    var pv = document.createElement('div'); pv.className = 'preview';
    var h = document.createElement('h3'); h.textContent = s.previewTitle; pv.appendChild(h);
    r.plan.slots.forEach(function (slot) {
      var dish = r.plan.days[0][slot.key];
      var m = document.createElement('div'); m.className = 'meal';
      var sl = document.createElement('div'); sl.className = 'slot'; sl.textContent = slot.label; m.appendChild(sl);
      var nm = document.createElement('div'); nm.className = 'name'; nm.textContent = dish ? dish.name : s.noOption; m.appendChild(nm);
      if (dish) {
        var ul = document.createElement('ul');
        dish.items.forEach(function (it) { var li = document.createElement('li'); li.textContent = it.amount + '  ' + it.name; ul.appendChild(li); });
        m.appendChild(ul);
        if (dish.allergens.length) { var al = document.createElement('div'); al.className = 'allergens'; al.textContent = s.contains + ' ' + dish.allergens.join(', '); m.appendChild(al); }
      }
      pv.appendChild(m);
    });
    out.appendChild(pv);

    var dl = document.createElement('div'); dl.className = 'dl';
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'primary'; btn.textContent = s.pdf;
    btn.addEventListener('click', downloadPdf);
    dl.appendChild(btn); out.appendChild(dl);
  }

  function post(url, body) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store', credentials: 'omit' });
  }

  function downloadPdf() {
    var s = STR[lang];
    post('/api/pdf', lastBody).then(function (res) {
      if (!res.ok) return res.json().then(function (j) { $('result').insertBefore(notice('warn', j.message || s.errNet), $('result').firstChild); });
      return res.blob().then(function (blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = lang === 'de' ? 'Ernaehrungsplan.pdf' : 'Nutrition-Plan.pdf';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      });
    }).catch(function () { $('result').insertBefore(notice('warn', s.errNet), $('result').firstChild); });
  }

  $('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var s = STR[lang]; var out = $('result'); out.textContent = '';
    var body = collect();
    if (!body.ageGroup) { out.appendChild(notice('warn', s.errAge)); return; }
    if (!isFinite(body.currentKg) || !isFinite(body.targetKg) || body.currentKg < 30 || body.currentKg > 200 || body.targetKg < 30 || body.targetKg > 200) { out.appendChild(notice('warn', s.errNum)); return; }
    if (!body.date) { out.appendChild(notice('warn', s.errDate)); return; }
    var totalH = 0; CATS.forEach(function (c) { totalH += Number(body.training[c[0]].hours); });
    if (totalH > 40) { out.appendChild(notice('warn', s.errTraining)); return; }
    var btn = $('t-submit'); btn.disabled = true; btn.textContent = s.working;
    lastBody = body;
    post('/api/plan', body).then(function (r) { return r.json(); }).then(renderResult)
      .catch(function () { out.appendChild(notice('warn', s.errNet)); })
      .then(function () { btn.disabled = false; btn.textContent = s.submit; });
  });

  $('lang-de').addEventListener('click', function () { lang = 'de'; applyLang(); });
  $('lang-en').addEventListener('click', function () { lang = 'en'; applyLang(); });

  var today = new Date().toISOString().slice(0, 10);
  $('date').min = today;
  applyLang();
})();
