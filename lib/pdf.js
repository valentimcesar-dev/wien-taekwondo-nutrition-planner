'use strict';

const PDFDocument = require('pdfkit');
const { ALLERGENS } = require('./foods');
const { CLUB_NAME } = require('./config');

const DARK = '#1f2937';
const ACCENT = '#b91c1c';
const LIGHT = '#f3f4f6';
const MID = '#6b7280';
const M = 40; // page margin

const T = {
  de: {
    title: 'Wettkampf-Ernährungsplan',
    subtitle: 'Allgemeine Vorlage für Sporternährung',
    summary: 'Deine Angaben',
    competition: 'Wettkampf',
    inDays: (n) => (n === 0 ? 'heute' : n === 1 ? 'in 1 Tag' : `in ${n} Tagen`),
    weightToday: 'Gewicht heute',
    targetWeight: 'Zielgewicht',
    diet: 'Ernährungsform',
    dietNames: { omnivore: 'Alles', pescatarian: 'Pescetarisch', vegetarian: 'Vegetarisch', vegan: 'Vegan', halal: 'Ohne Schweinefleisch (halal-orientiert)' },
    allergies: 'Allergien / Unverträglichkeiten',
    lactose: 'Laktoseintoleranz',
    dislikes: 'Mag ich nicht',
    none: 'keine angegeben',
    howTitle: 'So funktioniert der Plan',
    how: [
      'Teller-Prinzip: etwa die Hälfte Gemüse oder Obst, ein Viertel Kohlenhydrate (z. B. Vollkorn, Erdäpfel, Reis, Hirse), ein Viertel Eiweiß.',
      '3 Hauptmahlzeiten und 2 Zwischenmahlzeiten. Keine Mahlzeit auslassen.',
      'Trinke über den Tag verteilt Wasser oder ungesüßten Tee. Schränke Flüssigkeit nicht ein.',
      'Rund ums Training: eine leichte, kohlenhydratreiche Zwischenmahlzeit (z. B. Banane, Reiswaffeln) etwa 1–2 Stunden davor, danach Eiweiß und Kohlenhydrate.',
      'Probiere in der Wettkampfwoche keine neuen Lebensmittel aus.',
      'Mengenangaben sind Haushaltsmaße und Richtwerte, keine individuellen Vorgaben.',
    ],
    dayPlan: 'Tagesplan – Beispieltag',
    contains: 'Enthält:',
    weekPlan: 'Wochenplan',
    day: (n) => `Tag ${n}`,
    slotsShort: ['Frühstück', 'Snack vormittags', 'Mittagessen', 'Snack nachmittags', 'Abendessen'],
    limited: 'Mit deinen Angaben stehen weniger Varianten zur Verfügung, daher wiederholen sich Gerichte.',
    notRecommendedTitle: 'Nicht empfohlen',
    notRecommended: 'Fasten, Flüssigkeitsentzug, Sauna oder Schwitzanzüge, Abführ- oder Entwässerungsmittel, Diätpillen und Extremdiäten. Sie sind gefährlich und können deine Leistung und Gesundheit schädigen.',
    teenTitle: 'Für Jugendliche',
    teen: 'Du bist noch im Wachstum und brauchst ausreichend Energie. Besprich Ernährung und Gewichtsklasse bitte mit deinen Eltern bzw. Erziehungsberechtigten und mit deinem Trainer.',
    seasonTitle: 'Saisonale Tipps',
    season: {
      winter: 'Im Winter gibt es häufig Kraut, Karotten, Rote Rüben, Sellerie, Kürbis und gelagerte Äpfel.',
      spring: 'Im Frühling gibt es häufig Spinat, Radieschen und erste regionale Salate.',
      summer: 'Im Sommer gibt es häufig Paradeiser, Paprika, Zucchini, Gurken und Beeren.',
      autumn: 'Im Herbst gibt es häufig Kürbis, Äpfel, Birnen, Kraut, Rote Rüben und Pilze.',
    },
    seasonNote: 'Was verfügbar ist, kann je nach Geschäft oder Markt variieren.',
    importantTitle: 'Wichtige Hinweise',
    important: [
      'Dieser Plan ist eine allgemeine Vorlage und keine medizinische oder individuelle Ernährungsberatung.',
      'Bei Erkrankungen, schweren allergischen Reaktionen, Essstörungen, Medikamenteneinnahme oder Fragen zu deinem Gewicht frage bitte Ärztin/Arzt oder eine Diätologin/einen Diätologen.',
      'Allergenangaben gelten allgemein für die Zutat. Fertigprodukte können abweichen: Lies immer die Zutatenliste. Kreuzkontamination wird nicht berücksichtigt.',
      'Erdnüsse und Schalenfrüchte (Nüsse) sind getrennte Allergengruppen. Nur angekreuzte Gruppen wurden ausgeschlossen.',
      'Frei eingegebene Allergien und Abneigungen wurden nur anhand der Zutatennamen berücksichtigt.',
      'Die App speichert keine Eingaben.',
    ],
    missing: 'Für diese Mahlzeit gibt es mit deinen Angaben keine passende Vorlage. Bitte hole dir eine individuelle Beratung.',
    adult: 'Erwachsen',
    teenLabel: 'Jugendlich',
  },
  en: {
    title: 'Competition Nutrition Plan',
    subtitle: 'General template for sports nutrition',
    summary: 'Your details',
    competition: 'Competition',
    inDays: (n) => (n === 0 ? 'today' : n === 1 ? 'in 1 day' : `in ${n} days`),
    weightToday: 'Weight today',
    targetWeight: 'Target weight',
    diet: 'Diet',
    dietNames: { omnivore: 'Everything', pescatarian: 'Pescatarian', vegetarian: 'Vegetarian', vegan: 'Vegan', halal: 'No pork (halal-oriented)' },
    allergies: 'Allergies / intolerances',
    lactose: 'Lactose intolerance',
    dislikes: 'Dislikes',
    none: 'none given',
    howTitle: 'How the plan works',
    how: [
      'Plate method: about half vegetables or fruit, a quarter carbohydrates (e.g. wholegrain, potatoes, rice, millet), a quarter protein.',
      '3 main meals and 2 snacks. Do not skip meals.',
      'Drink water or unsweetened tea throughout the day. Do not restrict fluids.',
      'Around training: a light, carbohydrate-rich snack (e.g. banana, rice cakes) about 1–2 hours before, then protein and carbohydrates afterwards.',
      'Do not try new foods in competition week.',
      'Amounts are household measures and rough guides, not individual targets.',
    ],
    dayPlan: 'Daily plan – example day',
    contains: 'Contains:',
    weekPlan: 'Weekly plan',
    day: (n) => `Day ${n}`,
    slotsShort: ['Breakfast', 'Mid-morning snack', 'Lunch', 'Afternoon snack', 'Dinner'],
    limited: 'With your selections fewer variants are available, so dishes repeat.',
    notRecommendedTitle: 'Not recommended',
    notRecommended: 'Fasting, fluid restriction, sauna or sweat suits, laxatives or diuretics, diet pills and extreme diets. They are dangerous and can harm your performance and health.',
    teenTitle: 'For teenagers',
    teen: 'You are still growing and need enough energy. Please discuss nutrition and weight category with your parents or guardians and with your coach.',
    seasonTitle: 'Seasonal tips',
    season: {
      winter: 'In winter there is often cabbage, carrots, beetroot, celeriac, pumpkin and stored apples.',
      spring: 'In spring there is often spinach, radishes and the first regional salads.',
      summer: 'In summer there are often tomatoes, bell peppers, zucchini, cucumbers and berries.',
      autumn: 'In autumn there is often pumpkin, apples, pears, cabbage, beetroot and mushrooms.',
    },
    seasonNote: 'What is available can vary by shop or market.',
    importantTitle: 'Important notes',
    important: [
      'This plan is a general template and not medical or individual nutrition advice.',
      'If you have a medical condition, severe allergic reactions, an eating disorder, take medication, or have questions about your weight, please ask a doctor or a registered dietitian.',
      'Allergen information is generic for the ingredient. Packaged products can differ: always read the ingredient list. Cross-contamination is not considered.',
      'Peanuts and tree nuts are separate allergen groups. Only the groups you ticked were excluded.',
      'Allergies and dislikes entered as free text were only matched against ingredient names.',
      'The app does not store your input.',
    ],
    missing: 'There is no suitable template for this meal with your selections. Please get individual advice.',
    adult: 'Adult',
    teenLabel: 'Teenager',
  },
};

function seasonOf(isoDate) {
  const m = Number(isoDate.slice(5, 7));
  if (m === 12 || m <= 2) return 'winter';
  if (m <= 5) return 'spring';
  if (m <= 8) return 'summer';
  return 'autumn';
}

function fmtDate(iso, lang) {
  const [y, m, d] = iso.split('-');
  return lang === 'de' ? `${d}.${m}.${y}` : `${y}-${m}-${d}`;
}

function generatePdf(result, out, todayIso) {
  const v = result.input;
  const lang = v.lang;
  const t = T[lang];
  const doc = new PDFDocument({
    size: 'A4',
    margin: M,
    info: { Title: `${CLUB_NAME} – ${t.title}`, Author: CLUB_NAME, Creator: CLUB_NAME },
  });
  doc.pipe(out);

  const W = () => doc.page.width - 2 * M;
  const bottom = () => doc.page.height - M - 20;
  const ensure = (h) => {
    if (doc.y + h > bottom()) doc.addPage();
  };
  const heading = (txt, size = 13) => {
    ensure(40);
    doc.moveDown(0.6);
    doc.font('Helvetica-Bold').fontSize(size).fillColor(DARK).text(txt, M, doc.y, { width: W() });
    doc.moveDown(0.3);
  };
  const body = (txt, opts = {}) => {
    doc.font('Helvetica').fontSize(opts.size || 9.5).fillColor(opts.color || DARK).text(txt, M, doc.y, { width: W(), ...opts.extra });
  };
  const bullets = (arr, size = 9.5) => {
    doc.font('Helvetica').fontSize(size).fillColor(DARK);
    for (const b of arr) {
      const h = doc.heightOfString(b, { width: W() - 14 });
      ensure(h + 4);
      const y = doc.y;
      doc.text('•', M, y, { width: 10 });
      doc.text(b, M + 14, y, { width: W() - 14 });
      doc.moveDown(0.15);
    }
  };
  const banner = () => {
    doc.rect(0, 0, doc.page.width, 64).fill(DARK);
    doc.rect(0, 64, doc.page.width, 4).fill(ACCENT);
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#ffffff').text(CLUB_NAME, M, 18, { width: doc.page.width - 2 * M });
    doc.font('Helvetica').fontSize(10).fillColor('#e5e7eb').text(t.subtitle, M, 41, { width: doc.page.width - 2 * M });
    doc.y = 84;
  };

  /* ---------- Page 1: summary + how it works ---------- */
  banner();
  doc.font('Helvetica-Bold').fontSize(20).fillColor(DARK).text(t.title, M, doc.y, { width: W() });
  doc.moveDown(0.5);

  const a = result.assessment;
  const allergyNames = v.allergens.map((k) => ALLERGENS[k][lang]).concat(v.otherAllergy);
  const rows = [
    [t.competition, `${fmtDate(v.date, lang)} (${t.inDays(a.daysLeft)})`],
    [t.weightToday, `${v.currentKg} kg`],
    [t.targetWeight, `${v.targetKg} kg`],
    [t.diet, t.dietNames[v.diet] + (v.ageGroup === 'teen' ? `, ${t.teenLabel}` : `, ${t.adult}`)],
    [t.allergies, allergyNames.length ? allergyNames.join(', ') : t.none],
  ];
  if (v.lactose) rows.push([t.lactose, '–']);
  rows.push([t.dislikes, v.dislikes.length ? v.dislikes.join(', ') : t.none]);

  const boxTop = doc.y;
  const labelW = 150;
  let rowY = boxTop + 8;
  doc.font('Helvetica').fontSize(9.5);
  const rowHeights = rows.map(([, val]) => Math.max(14, doc.heightOfString(val, { width: W() - labelW - 20 }) + 4));
  const boxH = rowHeights.reduce((s, h) => s + h, 0) + 16;
  doc.roundedRect(M, boxTop, W(), boxH, 6).fill(LIGHT);
  rows.forEach(([label, val], i) => {
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor(MID).text(label, M + 10, rowY, { width: labelW });
    doc.font('Helvetica').fontSize(9.5).fillColor(DARK).text(val, M + 10 + labelW, rowY, { width: W() - labelW - 20 });
    rowY += rowHeights[i];
  });
  doc.y = boxTop + boxH + 6;

  heading(t.howTitle);
  bullets(t.how);

  heading(t.notRecommendedTitle);
  body(t.notRecommended);

  if (v.ageGroup === 'teen') {
    heading(t.teenTitle);
    body(t.teen);
  }

  heading(t.seasonTitle);
  body(t.season[seasonOf(todayIso)]);
  body(t.seasonNote, { color: MID, size: 8.5 });

  if (result.plan.limitedChoice) {
    doc.moveDown(0.5);
    body(t.limited, { color: MID, size: 8.5 });
  }

  /* ---------- Daily plan (example day) ---------- */
  doc.addPage();
  doc.font('Helvetica-Bold').fontSize(16).fillColor(DARK).text(t.dayPlan, M, M, { width: W() });
  doc.moveDown(0.5);
  const day1 = result.plan.days[0];
  result.plan.slots.forEach((slot) => {
    const dish = day1[slot.key];
    const itemsH = dish ? dish.items.length * 13 + 14 + (dish.allergens.length ? 14 : 0) : 30;
    ensure(26 + itemsH);
    const y = doc.y;
    doc.rect(M, y, W(), 18).fill(DARK);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#ffffff').text(slot.label, M + 8, y + 4, { width: W() - 16 });
    doc.y = y + 24;
    if (!dish) {
      body(t.missing, { color: MID });
    } else {
      doc.font('Helvetica-Bold').fontSize(10.5).fillColor(ACCENT).text(dish.name, M, doc.y, { width: W() });
      doc.moveDown(0.2);
      dish.items.forEach((it) => {
        const yy = doc.y;
        doc.font('Helvetica').fontSize(9.5).fillColor(DARK).text('•', M + 4, yy, { width: 10 });
        doc.text(`${it.amount}  ${it.name}`, M + 18, yy, { width: W() - 18 });
      });
      if (dish.allergens.length) {
        doc.moveDown(0.15);
        doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(MID).text(`${t.contains} ${dish.allergens.join(', ')}`, M + 4, doc.y, { width: W() - 4 });
      }
    }
    doc.moveDown(0.8);
  });

  /* ---------- Weekly plan (landscape) ---------- */
  doc.addPage({ size: 'A4', layout: 'landscape', margin: M });
  doc.font('Helvetica-Bold').fontSize(16).fillColor(DARK).text(t.weekPlan, M, M, { width: W() });
  let y = doc.y + 8;
  const dayW = 58;
  const colW = (W() - dayW) / 5;
  const pad = 5;

  const cell = (txt, x, yy, w, h, opts) => {
    if (opts.fill) doc.rect(x, yy, w, h).fill(opts.fill);
    doc.rect(x, yy, w, h).lineWidth(0.5).strokeColor('#d1d5db').stroke();
    doc.font(opts.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(opts.size || 8.5).fillColor(opts.color || DARK).text(txt, x + pad, yy + pad, { width: w - 2 * pad });
  };
  const rowH = (texts, bold) => {
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.5);
    return Math.max(...texts.map((tx) => doc.heightOfString(tx, { width: colW - 2 * pad }))) + 2 * pad;
  };

  const headH = rowH(t.slotsShort, true);
  cell('', M, y, dayW, headH, { fill: DARK });
  t.slotsShort.forEach((s, i) => cell(s, M + dayW + i * colW, y, colW, headH, { fill: DARK, bold: true, color: '#ffffff' }));
  y += headH;

  result.plan.days.forEach((d, di) => {
    const texts = result.plan.slots.map((s) => (d[s.key] ? d[s.key].name : '–'));
    const h = rowH(texts, false);
    const fill = di % 2 ? '#ffffff' : LIGHT;
    cell(t.day(di + 1), M, y, dayW, h, { fill, bold: true });
    texts.forEach((tx, i) => cell(tx, M + dayW + i * colW, y, colW, h, { fill }));
    y += h;
  });
  doc.y = y + 10;

  /* ---------- Notes ---------- */
  heading(t.importantTitle, 12);
  bullets(t.important, 9);

  doc.end();
}

module.exports = { generatePdf };
