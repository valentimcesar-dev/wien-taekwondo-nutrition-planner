'use strict';

const { LIMITS, MIN_KG, MAX_KG, MAX_DAYS_AHEAD, TIMEZONE, TRAINING, PROGRESS, CYCLE } = require('./config');
const { ALLERGENS, INGREDIENTS, SLOTS, DISHES } = require('./foods');

const DIETS = ['omnivore', 'pescatarian', 'vegetarian', 'vegan', 'halal'];
const EXCLUDED_CLASSES = {
  omnivore: [],
  pescatarian: ['meat', 'pork', 'poultry'],
  vegetarian: ['meat', 'pork', 'poultry', 'fish'],
  vegan: ['meat', 'pork', 'poultry', 'fish', 'dairy', 'egg', 'honey'],
  halal: ['pork'],
};

/* ---------- Messages (server side, DE/EN) ---------- */
const MSG = {
  invalid: {
    de: 'Bitte überprüfe deine Eingaben.',
    en: 'Please check your input.',
  },
  pastDate: {
    de: 'Das Wettkampfdatum liegt in der Vergangenheit.',
    en: 'The competition date is in the past.',
  },
  tooFar: {
    de: 'Das Wettkampfdatum liegt zu weit in der Zukunft (maximal 400 Tage).',
    en: 'The competition date is too far ahead (maximum 400 days).',
  },
  blockedTotal: {
    de: 'Für dieses Zielgewicht wird kein Plan erstellt: Der nötige Gewichtsverlust ist zu groß, um ihn sicher zu erreichen. Sprich bitte mit deinem Trainer, ob eine andere Gewichtsklasse besser zu dir passt.',
    en: 'No plan is created for this target weight: the weight loss needed is too large to reach safely. Please talk to your coach about whether another weight category suits you better.',
  },
  blockedTime: {
    de: 'Für dieses Zielgewicht wird kein Plan erstellt: In der verbleibenden Zeit ist der nötige Gewichtsverlust nicht sicher möglich. Sprich bitte mit deinem Trainer über eine andere Gewichtsklasse oder einen späteren Wettkampf.',
    en: 'No plan is created for this target weight: the weight loss needed cannot be reached safely in the time left. Please talk to your coach about another weight category or a later competition.',
  },
  maintain: {
    de: 'Dein Zielgewicht liegt auf oder über deinem aktuellen Gewicht. Du brauchst keinen Gewichtsverlust – der Plan unterstützt dich mit ausgewogener Sporternährung.',
    en: 'Your target weight is at or above your current weight. You do not need to lose weight – the plan supports you with balanced sports nutrition.',
  },
  ok: {
    de: 'Dein Ziel liegt in einem vorsichtigen Bereich. Der Plan ist eine allgemeine Vorlage ohne Hungern oder Flüssigkeitsentzug.',
    en: 'Your goal is within a cautious range. The plan is a general template with no fasting or fluid restriction.',
  },
  warn: {
    highLossHighLoad: {
      de: 'Achtung: Viel Training und ein Gewichtsverlust nahe am Limit gleichzeitig erhöhen das Risiko, zu wenig Energie aufzunehmen. Iss rund ums Training ausreichend und sprich mit deinem Trainer, ob das Ziel realistisch ist.',
      en: 'Caution: a lot of training together with a weight loss close to the limit raises the risk of eating too little for your energy needs. Eat enough around training and talk to your coach about whether the goal is realistic.',
    },
    cycleWeighIn: {
      de: 'Zyklus: Dein Wiegen oder Wettkampf fällt voraussichtlich in eine Phase, in der dein Gewicht durch Wassereinlagerung etwas höher sein kann. Das ist normal und kein Grund, weniger zu essen oder zu trinken. Besprich es früh mit deinem Trainer (z. B. Gewichtsklasse und Zeitpunkt). Die Vorhersage ist nur eine Schätzung.',
      en: 'Cycle: your weigh-in or competition probably falls in a phase when your weight can be a little higher because of water retention. This is normal and no reason to eat or drink less. Talk to your coach early (e.g. about weight category and timing). The prediction is only an estimate.',
    },
    cycleFar: {
      de: 'Zyklus: Wiegen und Wettkampf liegen zu weit entfernt, um deinen Zyklus sinnvoll vorherzusagen. Erstelle den Plan neu, wenn der Termin näher rückt und du eine neue Periode eingetragen hast.',
      en: 'Cycle: the weigh-in and competition are too far away to predict your cycle sensibly. Create the plan again when the date is closer and you have entered a newer period.',
    },
    taper: {
      de: 'Wettkampfwoche: Wir gehen davon aus, dass du dein Training zurückfährst. Deine Trainingsstunden zählen deshalb nur teilweise.',
      en: 'Competition week: we assume you taper your training, so your reported training hours only count partly.',
    },
  },
  progress: {
    tooEarly: {
      de: 'Zu früh für einen Fortschritts-Check. Wiege dich frühestens ein paar Tage nach dem Startdatum erneut.',
      en: 'Too early for a progress check. Weigh yourself again at least a few days after the start date.',
    },
    reached: {
      de: 'Du hast dein Zielgewicht erreicht. Halte es jetzt mit ausgewogener Ernährung – nicht weiter abnehmen.',
      en: 'You have reached your target weight. Keep it with balanced eating – do not lose more.',
    },
    tooFast: {
      de: 'Du nimmst schneller ab, als sicher ist. Iss mehr, besonders rund ums Training, und nimm nicht weiter ab, bis du dich mit deinem Trainer besprochen hast.',
      en: 'You are losing weight faster than is safe. Eat more, especially around training, and do not lose more until you have talked to your coach.',
    },
    notReachable: {
      de: 'Das Zielgewicht ist in der verbleibenden Zeit nicht mehr sicher erreichbar. Sprich bitte mit deinem Trainer über eine andere Gewichtsklasse oder einen späteren Wettkampf.',
      en: 'The target weight can no longer be reached safely in the time left. Please talk to your coach about another weight category or a later competition.',
    },
    cycleHigh: {
      de: 'Zyklus: Dein heutiges Gewicht ist vermutlich durch Wassereinlagerung etwas höher. Vergleiche lieber mit einem Wert aus einer ähnlichen Zyklusphase, bevor du etwas änderst – und iss deshalb nicht weniger.',
      en: 'Cycle: today\'s weight is probably a little higher because of water retention. Compare with a value from a similar cycle phase before changing anything – and do not eat less because of it.',
    },
    cycleLow: {
      de: 'Zyklus: Dein Startgewicht lag vermutlich in einer Phase mit mehr Wasser im Körper. Ein Teil des Verlusts kann Wasser sein, der echte Fortschritt ist wohl kleiner.',
      en: 'Cycle: your starting weight was probably taken in a phase with more water in the body. Part of the loss may be water, so the real progress is probably smaller.',
    },
    behind: {
      de: 'Du liegst etwas hinter dem Plan. Das ist in Ordnung: Reduziere nicht das Essen, sondern bleibe bei den Mahlzeiten und prüfe nächste Woche erneut.',
      en: 'You are a bit behind the plan. That is fine: do not cut your food, keep to the meals and check again next week.',
    },
    onTrack: {
      de: 'Du liegst im Plan und im sicheren Bereich. Weiter so.',
      en: 'You are on track and within the safe range. Keep going.',
    },
  },
  noOption: {
    de: 'Für diese Mahlzeit gibt es mit deinen Angaben keine passende Vorlage. Bitte hole dir eine individuelle Beratung bei einer Ernährungsfachkraft.',
    en: 'There is no suitable template for this meal with your selections. Please get individual advice from a nutrition professional.',
  },
};

/* ---------- Helpers ---------- */
function todayVienna() {
  return new Date().toLocaleDateString('en-CA', { timeZone: TIMEZONE }); // YYYY-MM-DD
}

function daysBetween(fromIso, toIso) {
  const a = Date.parse(fromIso + 'T00:00:00Z');
  const b = Date.parse(toIso + 'T00:00:00Z');
  return Math.round((b - a) / 86400000);
}

function addDays(iso, n) {
  const d = new Date(Date.parse(iso + 'T00:00:00Z') + n * 86400000);
  return d.toISOString().slice(0, 10);
}

function isRealDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/**
 * Expected cycle position of a date, from the entered period start and cycle length.
 * Returns { known:false } when the date is too far from the entered start to predict.
 */
function cyclePhase(iso, cyc) {
  if (!cyc) return null;
  const d = daysBetween(cyc.lastStart, iso);
  if (Math.abs(d) > CYCLE.MAX_PROJECT_DAYS) return { known: false };
  const L = cyc.length;
  const idx = ((d % L) + L) % L;
  const day = idx + 1;
  return {
    known: true,
    day,
    period: day <= CYCLE.PERIOD_DAYS,
    water: day <= CYCLE.WATER_EARLY_DAYS || day > L - CYCLE.WATER_LATE_DAYS,
  };
}

function cleanList(str, maxItems, maxLen) {
  if (typeof str !== 'string') return [];
  return str
    .split(/[,;\n]/)
    .map((x) => x.trim().toLowerCase())
    .filter((x) => x.length >= 2 && x.length <= maxLen)
    .slice(0, maxItems);
}

/* ---------- Training input ---------- */
function cleanTraining(raw) {
  const out = {};
  let total = 0;
  const src = raw && typeof raw === 'object' ? raw : {};
  for (const key of Object.keys(TRAINING.CATEGORIES)) {
    const e = src[key] && typeof src[key] === 'object' ? src[key] : {};
    let hours = Number(e.hours);
    if (!Number.isFinite(hours) || hours < 0) hours = 0;
    hours = Math.min(TRAINING.MAX_HOURS_PER_CATEGORY, Math.round(hours * 2) / 2);
    let rpe = Math.round(Number(e.rpe));
    if (!Number.isFinite(rpe)) rpe = 5;
    rpe = Math.min(10, Math.max(1, rpe));
    out[key] = { hours, rpe };
    total += hours;
  }
  return { value: out, total };
}

/**
 * Net training energy (kcal per week above resting) from hours + reported effort.
 * MET moves inside the band of the category's intensity class with the effort (1-10).
 * Internal only: the app never shows calorie numbers.
 */
function trainingLoad(training, kg, ageGroup, factor = 1) {
  const cats = [];
  let netKcalWeek = 0;
  let totalHours = 0;
  for (const key of Object.keys(TRAINING.CATEGORIES)) {
    const { hours, rpe } = training[key];
    const band = TRAINING.CATEGORIES[key];
    const [lo, hi] = TRAINING.MET_BANDS[band];
    const met = lo + ((hi - lo) * (rpe - 1)) / 9;
    const net = hours > 0 ? (met - 1) * kg * hours * factor : 0;
    netKcalWeek += net;
    totalHours += hours;
    cats.push({ key, band, hours, rpe, met: Math.round(met * 10) / 10 });
  }
  const kcalPerKgDay = netKcalWeek / 7 / kg;
  let tier = 'none';
  if (netKcalWeek > 0) {
    tier = TRAINING.TIERS.find((t) => t.key !== 'none' && kcalPerKgDay < t.maxKcalPerKgDay).key;
  }
  const b = TRAINING.BONUS[ageGroup];
  const rawExtraPct = ((netKcalWeek * b.share) / TRAINING.KCAL_PER_KG / kg) * 100;
  const extraPct = Math.min(b.maxExtraPct, Math.round(rawExtraPct * 100) / 100);
  return {
    categories: cats,
    totalHours: Math.round(totalHours * 10) / 10,
    tier,
    extraWeeklyPct: extraPct,
    capped: rawExtraPct > b.maxExtraPct,
    tapered: factor < 1,
  };
}

/* ---------- Validation ---------- */
function validate(body) {
  const errors = [];
  const b = body && typeof body === 'object' ? body : {};
  const lang = b.lang === 'en' ? 'en' : 'de';
  const ageGroup = b.ageGroup === 'teen' ? 'teen' : b.ageGroup === 'adult' ? 'adult' : null;
  const currentKg = Number(b.currentKg);
  const targetKg = Number(b.targetKg);
  const diet = DIETS.includes(b.diet) ? b.diet : 'omnivore';
  const allergens = Array.isArray(b.allergens) ? b.allergens.filter((a) => Object.prototype.hasOwnProperty.call(ALLERGENS, a)) : [];

  const sex = b.sex === 'female' ? 'female' : b.sex === 'male' ? 'male' : 'unspecified';
  let cycle = null;
  if (sex === 'female' && typeof b.lastPeriodStart === 'string' && b.lastPeriodStart !== '') {
    const today = todayVienna();
    const back = isRealDate(b.lastPeriodStart) ? daysBetween(b.lastPeriodStart, today) : NaN;
    let len = CYCLE.DEFAULT_LENGTH;
    if (b.cycleLength !== undefined && b.cycleLength !== null && b.cycleLength !== '') len = Number(b.cycleLength);
    if (!(back >= 0 && back <= CYCLE.MAX_LOOKBACK_DAYS)) errors.push('lastPeriodStart');
    if (!Number.isInteger(len) || len < CYCLE.MIN_LENGTH || len > CYCLE.MAX_LENGTH) errors.push('cycleLength');
    else if (back >= 0 && back <= CYCLE.MAX_LOOKBACK_DAYS) cycle = { lastStart: b.lastPeriodStart, length: len };
  }

  if (!ageGroup) errors.push('ageGroup');
  if (!Number.isFinite(currentKg) || currentKg < MIN_KG || currentKg > MAX_KG) errors.push('currentKg');
  if (!Number.isFinite(targetKg) || targetKg < MIN_KG || targetKg > MAX_KG) errors.push('targetKg');
  if (!isRealDate(b.date)) errors.push('date');
  let trainingDays = Math.round(Number(b.trainingDays));
  if (!Number.isFinite(trainingDays)) trainingDays = 4;
  trainingDays = Math.min(7, Math.max(1, trainingDays));
  const tr = cleanTraining(b.training);
  if (tr.total > TRAINING.MAX_HOURS_TOTAL) errors.push('training');

  return {
    errors,
    value: {
      lang,
      ageGroup,
      sex,
      cycle,
      currentKg,
      targetKg,
      date: b.date,
      diet,
      allergens: [...new Set(allergens)],
      lactose: b.lactose === true,
      otherAllergy: cleanList(b.otherAllergy, 8, 40),
      dislikes: cleanList(b.dislikes, 10, 40),
      training: tr.value,
      trainingDays,
      weighIn: b.weighIn === 'sameDay' ? 'sameDay' : 'dayBefore',
    },
  };
}

/* ---------- Safety assessment ---------- */
function assess(v) {
  const days = daysBetween(todayVienna(), v.date);
  if (days < 0) return { status: 'error', code: 'pastDate', daysLeft: days };
  if (days > MAX_DAYS_AHEAD) return { status: 'error', code: 'tooFar', daysLeft: days };

  const baseLim = LIMITS[v.ageGroup];
  const fightWeek = days <= TRAINING.FIGHT_WEEK_DAYS;
  const load = trainingLoad(v.training, v.currentKg, v.ageGroup, fightWeek ? TRAINING.TAPER_FACTOR : 1);
  // Training raises only the weekly rate; the total-loss ceiling is unchanged
  const lim = { maxWeeklyPct: Math.round((baseLim.maxWeeklyPct + load.extraWeeklyPct) * 100) / 100, maxTotalPct: baseLim.maxTotalPct };
  const lossKg = Math.round((v.currentKg - v.targetKg) * 10) / 10;
  const lossPct = (lossKg / v.currentKg) * 100;
  const kgPerWeek = (pct) => Math.round(((pct / 100) * v.currentKg) * 100) / 100;
  const base = {
    daysLeft: days, fightWeek, lossKg, lossPct: Math.round(lossPct * 10) / 10, limits: lim, training: load,
    weekly: { baseKg: kgPerWeek(baseLim.maxWeeklyPct), maxKg: kgPerWeek(lim.maxWeeklyPct), basePct: baseLim.maxWeeklyPct, maxPct: lim.maxWeeklyPct },
  };

  const warnings = [];
  if (fightWeek && load.tier !== 'none') warnings.push('taper');
  if (lossKg <= 0) return { ...base, status: 'maintain', code: 'maintain', warnings };

  if (lossPct > lim.maxTotalPct) return { ...base, status: 'blocked', code: 'blockedTotal' };

  const allowedByTimePct = lim.maxWeeklyPct * (days / 7);
  if (lossPct > allowedByTimePct) {
    const earliestDays = Math.ceil((lossPct / lim.maxWeeklyPct) * 7);
    return { ...base, status: 'blocked', code: 'blockedTime', earliestDays };
  }
  const share = TRAINING.WARN_SHARE[load.tier];
  const ratePct = lossPct / Math.max(days / 7, 1 / 7);
  if (share && ratePct >= share * lim.maxWeeklyPct) warnings.push('highLossHighLoad');
  return { ...base, status: 'ok', code: 'ok', warnings };
}

/* ---------- Plan generation ---------- */
function matchesTerm(text, terms) {
  const t = text.toLowerCase();
  return terms.some((term) => t.includes(term));
}

function dishAllowed(d, v) {
  const excluded = EXCLUDED_CLASSES[v.diet];
  for (const it of d.items) {
    const id = Array.isArray(it) ? it[0] : it;
    const ing = INGREDIENTS[id];
    if (ing.cls.some((c) => excluded.includes(c))) return false;
    if (ing.allergens.some((a) => v.allergens.includes(a))) return false;
    if (v.lactose && ing.lactose) return false;
    const names = `${ing.de} ${ing.en} ${ing.kw || ''}`;
    if (v.otherAllergy.length && matchesTerm(names, v.otherAllergy)) return false;
    if (v.dislikes.length && matchesTerm(names, v.dislikes)) return false;
  }
  const dn = `${d.name.de} ${d.name.en}`;
  if (v.otherAllergy.length && matchesTerm(dn, v.otherAllergy)) return false;
  if (v.dislikes.length && matchesTerm(dn, v.dislikes)) return false;
  return true;
}

function renderDish(d, lang) {
  const allergenSet = new Set();
  const items = d.items.map((it) => {
    const id = Array.isArray(it) ? it[0] : it;
    const ing = INGREDIENTS[id];
    ing.allergens.forEach((a) => allergenSet.add(a));
    const amount = Array.isArray(it) ? (lang === 'en' ? it[2] : it[1]) : ing.amt[lang];
    return { name: ing[lang], amount };
  });
  return {
    id: d.id,
    name: d.name[lang],
    iron: d.iron === true,
    items,
    allergens: [...allergenSet].map((a) => ALLERGENS[a][lang]),
  };
}

function buildPlan(v, tier) {
  const lang = v.lang;
  const pool = {};
  for (const slotKey of ['breakfast', 'snack', 'lunch', 'dinner', 'training']) {
    pool[slotKey] = DISHES.filter((d) => d.slot === slotKey && dishAllowed(d, v));
  }
  // On expected period days lunch and dinner prefer iron-rich dishes (only if an allowed one exists)
  const ironPool = { lunch: pool.lunch.filter((d) => d.iron), dinner: pool.dinner.filter((d) => d.iron) };
  const slotOrder = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];
  const poolFor = { breakfast: 'breakfast', snack1: 'snack', snack2: 'snack', lunch: 'lunch', dinner: 'dinner', training: 'training' };
  const offset = { breakfast: 0, snack1: 0, snack2: 3, lunch: 0, dinner: 1, training: 0 };
  // Extra training-day snack from a moderate training load upwards (only if a safe option exists)
  if (['moderate', 'high', 'veryHigh'].includes(tier) && pool.training.length) {
    slotOrder.splice(4, 0, 'training'); // after the afternoon snack, before dinner
  }
  // Training days are spread evenly over the 7 plan days (day 1 is always a training day)
  const nTrain = tier === 'none' ? 0 : Math.min(7, Math.max(1, v.trainingDays));
  const trainingFlags = Array(7).fill(false);
  for (let i = 0; i < nTrain; i++) trainingFlags[Math.floor((i * 7) / nTrain)] = true;

  // One menu for every day from today until the day before the competition, grouped in weeks
  // (week 1 starts today). The dish rotation runs through all days, so weeks differ from each other.
  const today = todayVienna();
  const totalDays = Math.max(1, Math.min(v.daysToMenu || 7, MAX_DAYS_AHEAD));
  const weeks = [];
  let limitedChoice = false;
  for (let g = 0; g < totalDays; g++) {
    const w = Math.floor(g / 7);
    const day = g % 7;
    if (!weeks[w]) weeks[w] = { start: addDays(today, 7 * w), days: [], trainingDays: nTrain ? trainingFlags : null, cycleDays: v.cycle ? [] : null };
    const cyc = v.cycle ? cyclePhase(addDays(today, g), v.cycle) : null;
    if (v.cycle) weeks[w].cycleDays.push(cyc && cyc.known ? { day: cyc.day, period: cyc.period, water: cyc.water } : null);
    const meals = {};
    for (const slot of slotOrder) {
      if (slot === 'training' && !trainingFlags[day]) {
        meals[slot] = null; // rest day
        continue;
      }
      let list = pool[poolFor[slot]];
      if (cyc && cyc.known && cyc.period && ironPool[slot] && ironPool[slot].length) list = ironPool[slot];
      if (!list.length) {
        meals[slot] = null;
        continue;
      }
      if (slot !== 'training' && list.length < 7) limitedChoice = true;
      // Second snack is shifted by half the pool so both snacks differ on the same day
      const shift = slot === 'snack2' ? Math.floor(list.length / 2) : offset[slot];
      meals[slot] = renderDish(list[(g + shift) % list.length], lang);
    }
    weeks[w].days.push(meals);
  }
  weeks.forEach((wk) => { wk.end = addDays(wk.start, wk.days.length - 1); });

  const missing = slotOrder.filter((s) => !pool[poolFor[s]].length);
  return {
    slots: slotOrder.map((s) => ({ key: s, label: SLOTS[s][lang] })),
    weeks,
    days: weeks[0].days, // first week (used for the example day)
    trainingDays: nTrain ? trainingFlags : null,
    cycleActive: !!v.cycle,
    missingSlots: missing,
    limitedChoice,
    noOptionMessage: MSG.noOption[lang],
  };
}

/* ---------- Public entry ---------- */
function run(body) {
  const { errors, value } = validate(body);
  const lang = value.lang;
  if (errors.length) return { ok: false, status: 'invalid', errors, message: MSG.invalid[lang] };

  const a = assess(value);
  if (a.status === 'error') return { ok: false, status: 'invalid', errors: ['date'], message: MSG[a.code][lang] };
  if (a.status === 'blocked') {
    return { ok: false, status: 'blocked', assessment: a, message: MSG[a.code][lang] };
  }
  const today = todayVienna();
  const cycleInfo = buildCycleInfo(value);
  const warningCodes = a.warnings.slice();
  if (cycleInfo) {
    if (cycleInfo.weighIn.known === false && cycleInfo.competition.known === false) warningCodes.push('cycleFar');
    else if (cycleInfo.weighIn.water || cycleInfo.competition.water) warningCodes.push('cycleWeighIn');
  }
  return {
    ok: true,
    status: a.status,
    assessment: a,
    message: MSG[a.code][lang],
    warnings: warningCodes.map((code) => ({ code, text: MSG.warn[code][lang] })),
    cycle: cycleInfo,
    input: value,
    plan: buildPlan({ ...value, daysToMenu: Math.max(1, a.daysLeft) }, a.training.tier),
    checkpoints: buildCheckpoints(value, a, today),
    countdown: buildCountdown(value, today),
  };
}

/* ---------- Cycle information for weigh-in and competition ---------- */
function buildCycleInfo(v) {
  if (!v.cycle) return null;
  const weighDate = v.weighIn === 'sameDay' ? v.date : addDays(v.date, -1);
  return {
    lastStart: v.cycle.lastStart,
    length: v.cycle.length,
    weighInDate: weighDate,
    weighIn: cyclePhase(weighDate, v.cycle),
    competition: cyclePhase(v.date, v.cycle),
  };
}

/* ---------- Weekly checkpoints (paper version of the progress check) ---------- */
function buildCheckpoints(v, a, today) {
  if (a.lossKg <= 0 || a.daysLeft < 7) return [];
  const rows = [];
  const weeks = Math.min(PROGRESS.MAX_CHECKPOINTS, Math.floor(a.daysLeft / 7));
  for (let k = 1; k <= weeks; k++) {
    const planned = v.currentKg - a.lossKg * ((7 * k) / a.daysLeft);
    const floor = v.currentKg - a.weekly.maxKg * k;
    rows.push({
      date: addDays(today, 7 * k),
      plannedKg: Math.round(planned * 10) / 10,
      notBelowKg: Math.round(Math.max(floor, v.targetKg) * 10) / 10,
    });
  }
  return rows;
}

/* ---------- Countdown to weigh-in and competition ---------- */
function buildCountdown(v, today) {
  const comp = v.date;
  const weighDate = v.weighIn === 'sameDay' ? comp : addDays(comp, -1);
  const entries = [
    { key: 'normal', date: addDays(weighDate, -3) },
    { key: 'normal', date: addDays(weighDate, -2) },
    { key: 'dayBefore', date: addDays(weighDate, -1) },
  ];
  if (v.weighIn === 'sameDay') entries.push({ key: 'weighInAndCompetition', date: comp });
  else {
    entries.push({ key: 'weighInDay', date: weighDate });
    entries.push({ key: 'competition', date: comp });
  }
  return entries.filter((e) => e.date >= today);
}

/* ---------- Progress check (stateless: start values are re-entered) ---------- */
function runProgress(body) {
  const b = body && typeof body === 'object' ? body : {};
  const { errors, value } = validate(b);
  const lang = value.lang;
  const startKg = Number(b.startKg);
  const today = todayVienna();
  if (!Number.isFinite(startKg) || startKg < MIN_KG || startKg > MAX_KG) errors.push('startKg');
  if (!isRealDate(b.startDate)) errors.push('startDate');
  else {
    const back = daysBetween(b.startDate, today);
    if (back < 0 || back > PROGRESS.MAX_LOOKBACK_DAYS) errors.push('startDate');
  }
  if (errors.length) return { ok: false, status: 'invalid', errors, message: MSG.invalid[lang] };

  const a = assess(value);
  if (a.status === 'error') return { ok: false, status: 'invalid', errors: ['date'], message: MSG[a.code][lang] };

  const elapsedDays = daysBetween(b.startDate, today);
  const lostKg = Math.round((startKg - value.currentKg) * 10) / 10;
  const out = { ok: true, lostKg, elapsedDays, maxKgPerWeek: a.weekly.maxKg };
  // Cycle: weight today may be raised (or the start weight may have been raised) by water retention.
  // Only the "behind plan" tolerance is widened; the "too fast" check stays strict.
  let extraTolerance = 0;
  if (value.cycle) {
    const startPh = cyclePhase(b.startDate, value.cycle);
    const nowPh = cyclePhase(today, value.cycle);
    const startWater = !!(startPh && startPh.known && startPh.water);
    const nowWater = !!(nowPh && nowPh.known && nowPh.water);
    if (nowWater && !startWater) { extraTolerance = CYCLE.PROGRESS_EXTRA_TOLERANCE_KG; out.cycleNote = MSG.progress.cycleHigh[lang]; }
    else if (startWater && !nowWater) out.cycleNote = MSG.progress.cycleLow[lang];
    out.cycle = { startWater, nowWater, extraToleranceKg: extraTolerance };
  }
  const respond = (status) => ({ ...out, status, message: MSG.progress[status][lang] });

  if (elapsedDays < PROGRESS.MIN_DAYS) return respond('tooEarly');
  const actualRate = lostKg / (elapsedDays / 7);
  out.actualKgPerWeek = Math.round(actualRate * 100) / 100;
  if (value.currentKg <= value.targetKg) return respond('reached');
  if (actualRate > a.weekly.maxKg) return respond('tooFast');
  if (a.status === 'blocked') return respond('notReachable');

  const totalDays = daysBetween(b.startDate, value.date);
  if (totalDays > 0) {
    const planned = (startKg - value.targetKg) * (elapsedDays / totalDays);
    out.plannedLostKg = Math.round(planned * 10) / 10;
    if (lostKg < planned - PROGRESS.TOLERANCE_KG - extraTolerance) return respond('behind');
  }
  return respond('onTrack');
}

module.exports = { run, runProgress, validate, assess, buildPlan, trainingLoad, cyclePhase, DIETS, EXCLUDED_CLASSES };
