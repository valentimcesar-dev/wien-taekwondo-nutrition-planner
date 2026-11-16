'use strict';

const { LIMITS, MIN_KG, MAX_KG, MAX_DAYS_AHEAD, TIMEZONE } = require('./config');
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

function isRealDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function cleanList(str, maxItems, maxLen) {
  if (typeof str !== 'string') return [];
  return str
    .split(/[,;\n]/)
    .map((x) => x.trim().toLowerCase())
    .filter((x) => x.length >= 2 && x.length <= maxLen)
    .slice(0, maxItems);
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

  if (!ageGroup) errors.push('ageGroup');
  if (!Number.isFinite(currentKg) || currentKg < MIN_KG || currentKg > MAX_KG) errors.push('currentKg');
  if (!Number.isFinite(targetKg) || targetKg < MIN_KG || targetKg > MAX_KG) errors.push('targetKg');
  if (!isRealDate(b.date)) errors.push('date');

  return {
    errors,
    value: {
      lang,
      ageGroup,
      currentKg,
      targetKg,
      date: b.date,
      diet,
      allergens: [...new Set(allergens)],
      lactose: b.lactose === true,
      otherAllergy: cleanList(b.otherAllergy, 8, 40),
      dislikes: cleanList(b.dislikes, 10, 40),
    },
  };
}

/* ---------- Safety assessment ---------- */
function assess(v) {
  const days = daysBetween(todayVienna(), v.date);
  if (days < 0) return { status: 'error', code: 'pastDate', daysLeft: days };
  if (days > MAX_DAYS_AHEAD) return { status: 'error', code: 'tooFar', daysLeft: days };

  const lim = LIMITS[v.ageGroup];
  const lossKg = Math.round((v.currentKg - v.targetKg) * 10) / 10;
  const lossPct = (lossKg / v.currentKg) * 100;
  const base = { daysLeft: days, lossKg, lossPct: Math.round(lossPct * 10) / 10, limits: lim };

  if (lossKg <= 0) return { ...base, status: 'maintain', code: 'maintain' };

  if (lossPct > lim.maxTotalPct) return { ...base, status: 'blocked', code: 'blockedTotal' };

  const allowedByTimePct = lim.maxWeeklyPct * (days / 7);
  if (lossPct > allowedByTimePct) {
    const earliestDays = Math.ceil((lossPct / lim.maxWeeklyPct) * 7);
    return { ...base, status: 'blocked', code: 'blockedTime', earliestDays };
  }
  return { ...base, status: 'ok', code: 'ok' };
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
    items,
    allergens: [...allergenSet].map((a) => ALLERGENS[a][lang]),
  };
}

function buildPlan(v) {
  const lang = v.lang;
  const pool = {};
  for (const slotKey of ['breakfast', 'snack', 'lunch', 'dinner']) {
    pool[slotKey] = DISHES.filter((d) => d.slot === slotKey && dishAllowed(d, v));
  }
  const slotOrder = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];
  const poolFor = { breakfast: 'breakfast', snack1: 'snack', snack2: 'snack', lunch: 'lunch', dinner: 'dinner' };
  const offset = { breakfast: 0, snack1: 0, snack2: 3, lunch: 0, dinner: 1 };

  const days = [];
  let limitedChoice = false;
  for (let day = 0; day < 7; day++) {
    const meals = {};
    for (const slot of slotOrder) {
      const list = pool[poolFor[slot]];
      if (!list.length) {
        meals[slot] = null;
        continue;
      }
      if (list.length < 7) limitedChoice = true;
      // Second snack is shifted by half the pool so both snacks differ on the same day
      const shift = slot === 'snack2' ? Math.floor(list.length / 2) : offset[slot];
      meals[slot] = renderDish(list[(day + shift) % list.length], lang);
    }
    days.push(meals);
  }

  const missing = slotOrder.filter((s) => !pool[poolFor[s]].length);
  return {
    slots: slotOrder.map((s) => ({ key: s, label: SLOTS[s][lang] })),
    days,
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
  return {
    ok: true,
    status: a.status,
    assessment: a,
    message: MSG[a.code][lang],
    input: value,
    plan: buildPlan(value),
  };
}

module.exports = { run, validate, assess, buildPlan, DIETS, EXCLUDED_CLASSES };
