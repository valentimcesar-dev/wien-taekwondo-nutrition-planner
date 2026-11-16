'use strict';

const PDFDocument = require('pdfkit');
const { ALLERGENS } = require('./foods');
const { CLUB_NAME } = require('./config');

const DARK = '#1f2937';
const ACCENT = '#b91c1c';
const LIGHT = '#f3f4f6';
const MID = '#6b7280';
const M = 40; // page margin
const DOMAIN = 'wientaekwondo.com';
const LOGO_PATH = require('path').join(__dirname, 'wtc-logo-pdf.jpg');

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
    weekTitle: (k, n, from, to) => `Wochenplan – Woche ${k} von ${n} (${from} – ${to})`,
    weekdays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    pageWord: 'Seite',
    slotsShort: { breakfast: 'Frühstück', snack1: 'Snack vormittags', lunch: 'Mittagessen', snack2: 'Snack nachmittags', training: 'Rund ums Training', dinner: 'Abendessen' },
    trainingDaysRow: 'Trainingstage pro Woche',
    weighInRow: 'Wiegen',
    weighIn: { dayBefore: 'am Vortag des Wettkampfs', sameDay: 'am Wettkampftag' },
    warnTitle: 'Hinweis',
    trainShort: 'Training',
    restShort: 'Ruhetag',
    restCell: 'Ruhetag – kein Extra-Snack',
    checkTitle: 'Wochen-Checkpoints',
    checkIntro: 'Wiege dich einmal pro Woche zur gleichen Zeit (z. B. morgens nach dem Aufstehen). Liegst du unter der Grenze „nicht unter“, nimmst du zu schnell ab: Iss mehr und sprich mit deinem Trainer. Online kannst du mit Startgewicht und Startdatum einen Fortschritts-Check machen.',
    checkCols: ['Datum', 'Plan-Gewicht', 'Nicht unter'],
    countTitle: 'Die letzten Tage vor Wiegen und Wettkampf',
    countIntro: 'Keine neuen Lebensmittel, kein Fasten, keine Flüssigkeitseinschränkung. Iss und trink so, wie du es aus dem Training kennst.',
    countTexts: {
      normal: 'Gewohnt essen: 3 Mahlzeiten und Zwischenmahlzeiten, Wasser oder ungesüßter Tee nach Durst. Nur Vertrautes essen, nichts Neues probieren.',
      dayBefore: 'Vertraute, gut verträgliche Mahlzeiten mit viel Kohlenhydraten (z. B. Reis, Nudeln, Erdäpfel, Brot), mäßig Eiweiß, nicht zu fettig. Normal trinken. Abends nicht zu spät und nicht zu schwer essen.',
      weighInDay: 'Vor dem Wiegen: gewohntes Frühstück, normal trinken. Nach dem Wiegen: sofort essen und trinken (Kohlenhydrate, etwas Eiweiß, Wasser) und über den Tag regelmäßig weiter.',
      competition: 'Gewohntes Frühstück etwa 3–4 Stunden vor dem ersten Kampf. Zwischen den Kämpfen kleine, leicht verdauliche Kohlenhydrat-Snacks (z. B. Banane, Reiswaffeln) und Wasser. Danach Eiweiß und Kohlenhydrate.',
      weighInAndCompetition: 'Gewohntes Frühstück rechtzeitig, normal trinken – du musst nichts weglassen. Nach dem Wiegen essen und trinken (Banane, Reiswaffeln, Wasser). Zwischen den Kämpfen kleine Kohlenhydrat-Snacks und Wasser, danach Eiweiß und Kohlenhydrate.',
    },
    countNames: { normal: 'Normaler Tag', dayBefore: 'Tag vor dem Wiegen', weighInDay: 'Wiegetag', competition: 'Wettkampftag', weighInAndCompetition: 'Wiege- und Wettkampftag' },
    fightWeekTitle: 'Wettkampfwoche',
    trainingRow: 'Training pro Woche',
    trainingCats: { taekwondo: 'Taekwondo', cardio: 'Ausdauer', strength: 'Kraft', other: 'Sonstiges' },
    effortShort: 'Anstrengung',
    hoursShort: 'h',
    loadRow: 'Trainingsbelastung',
    tiers: { none: 'kein Training angegeben', light: 'leicht', moderate: 'mittel', high: 'hoch', veryHigh: 'sehr hoch' },
    rateRow: 'Max. Gewichtsverlust pro Woche',
    rateText: (w, extra) => `bis ca. ${String(w.maxKg).replace('.', ',')} kg` + (extra ? ` (ohne Training: ${String(w.baseKg).replace('.', ',')} kg)` : ''),
    trainingTitle: 'Training und Ernährung',
    trainingTexts: {
      none: [],
      light: ['Dein Training ist eher leicht. Der Plan bleibt bei der Grundvorlage.'],
      moderate: ['Zusätzliche Zwischenmahlzeit an Trainingstagen: leicht und kohlenhydratreich, etwa 1–2 Stunden vor dem Training oder danach. An Ruhetagen kannst du sie weglassen.'],
      high: [
        'Zusätzliche Zwischenmahlzeit an Trainingstagen: kohlenhydratreich, vor oder nach dem Training. An Ruhetagen kannst du sie weglassen.',
        'Dein Training verbraucht viel Energie. Iss an Trainingstagen zu Mittag- und Abendessen eine zusätzliche Portion Kohlenhydrate (z. B. Reis, Erdäpfel, Vollkornbrot) und lass keine Mahlzeit aus.',
      ],
      veryHigh: [
        'Zusätzliche Zwischenmahlzeit an Trainingstagen: kohlenhydratreich, vor oder nach dem Training. An Ruhetagen kannst du sie weglassen.',
        'Dein Training verbraucht sehr viel Energie. Iss an Trainingstagen zu Mittag- und Abendessen eine zusätzliche Portion Kohlenhydrate und lass keine Mahlzeit aus. Bei diesem Umfang ist Gewichtsverlust nur mit Begleitung durch Trainer und Diätologin/Diätologen sinnvoll.',
      ],
    },
    trainingPace: 'Ein Teil deines Gewichtsverlusts kommt durch das Training. Deshalb ist eine etwas höhere Wochenrate möglich – das heißt nicht, dass du weniger essen sollst. Spare nicht an den Mahlzeiten rund ums Training.',
    trainingWarn: 'Warnzeichen für zu wenig Energie: ständige Müdigkeit, Leistungsabfall, häufige Infekte oder Verletzungen, Schwindel, Frieren, Konzentrationsprobleme, ausbleibende Periode. Dann bitte Trainer und Ärztin/Arzt ansprechen und nicht weiter abnehmen.',
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
    cycleRow: 'Zyklus (Schätzung)',
    cycleRowText: (date, len) => `Letzte Periode ab ${date}, Zykluslänge ${len} Tage`,
    cycleTitle: 'Zyklus und Gewicht',
    cycleGeneral: [
      'Dein Gewicht kann im Zyklus schwanken, vor allem durch Wassereinlagerung in den Tagen vor und zu Beginn der Periode. Das ist normal und hat nichts mit Fett zu tun.',
      'Wiege dich für Vergleiche möglichst in einer ähnlichen Zyklusphase. Steigt dein Gewicht kurzfristig, iss und trink deshalb nicht weniger.',
      'Der sichere Gewichtsverlust pro Woche ändert sich durch den Zyklus nicht.',
    ],
    cycleActive: [
      'Im Wochenplan sind die erwarteten Periodentage („Periode erw.“) und Tage mit möglicher Wassereinlagerung („Wasser mögl.“) markiert. Das sind Schätzungen: Stress, Training oder Krankheit können den Zyklus verschieben. Bei hormoneller Verhütung oder sehr unregelmäßigem Zyklus lässt du die Zyklusangabe besser weg.',
      'An erwarteten Periodentagen enthalten Mittag- und Abendessen, wenn mit deinen Angaben möglich, eisenreiche Gerichte (im Wochenplan mit „(Fe)“ markiert), z. B. mit Linsen, Kichererbsen, Bohnen, Tofu, Spinat oder magerem Rindfleisch. Kombiniere sie mit einer Vitamin-C-Quelle wie Paprika, Paradeisern oder Orangen: Das verbessert die Aufnahme von Eisen aus pflanzlichen Lebensmitteln.',
      'Bei starker oder sehr unregelmäßiger Periode, ständiger Müdigkeit oder Verdacht auf Eisenmangel frage bitte Ärztin/Arzt. Nimm Eisenpräparate nicht auf eigene Faust.',
    ],
    cyclePeriodShort: 'Periode erw.',
    cycleWaterShort: 'Wasser mögl.',
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
    weekTitle: (k, n, from, to) => `Weekly plan – week ${k} of ${n} (${from} – ${to})`,
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    pageWord: 'Page',
    slotsShort: { breakfast: 'Breakfast', snack1: 'Mid-morning snack', lunch: 'Lunch', snack2: 'Afternoon snack', training: 'Around training', dinner: 'Dinner' },
    trainingDaysRow: 'Training days per week',
    weighInRow: 'Weigh-in',
    weighIn: { dayBefore: 'day before the competition', sameDay: 'on competition day' },
    warnTitle: 'Note',
    trainShort: 'Training',
    restShort: 'Rest day',
    restCell: 'Rest day – no extra snack',
    checkTitle: 'Weekly checkpoints',
    checkIntro: 'Weigh yourself once a week at the same time (e.g. in the morning after getting up). If you are below the "not below" limit you are losing weight too fast: eat more and talk to your coach. Online you can do a progress check with your starting weight and start date.',
    checkCols: ['Date', 'Plan weight', 'Not below'],
    countTitle: 'The last days before weigh-in and competition',
    countIntro: 'No new foods, no fasting, no fluid restriction. Eat and drink the way you know from training.',
    countTexts: {
      normal: 'Eat as usual: 3 meals and snacks, water or unsweetened tea as thirst asks. Only familiar foods, do not try anything new.',
      dayBefore: 'Familiar, well-tolerated meals rich in carbohydrates (e.g. rice, pasta, potatoes, bread), moderate protein, not too fatty. Drink normally. Do not eat too late or too heavy in the evening.',
      weighInDay: 'Before the weigh-in: your usual breakfast, drink normally. After the weigh-in: eat and drink straight away (carbohydrates, some protein, water) and keep going regularly through the day.',
      competition: 'Your usual breakfast about 3–4 hours before the first fight. Between fights small, easily digestible carbohydrate snacks (e.g. banana, rice cakes) and water. Afterwards protein and carbohydrates.',
      weighInAndCompetition: 'Your usual breakfast in good time, drink normally – you do not need to leave anything out. After the weigh-in eat and drink (banana, rice cakes, water). Between fights small carbohydrate snacks and water, afterwards protein and carbohydrates.',
    },
    countNames: { normal: 'Normal day', dayBefore: 'Day before weigh-in', weighInDay: 'Weigh-in day', competition: 'Competition day', weighInAndCompetition: 'Weigh-in and competition day' },
    fightWeekTitle: 'Competition week',
    trainingRow: 'Training per week',
    trainingCats: { taekwondo: 'Taekwondo', cardio: 'Cardio', strength: 'Strength', other: 'Other' },
    effortShort: 'effort',
    hoursShort: 'h',
    loadRow: 'Training load',
    tiers: { none: 'no training entered', light: 'light', moderate: 'moderate', high: 'high', veryHigh: 'very high' },
    rateRow: 'Max. weight loss per week',
    rateText: (w, extra) => `up to approx. ${w.maxKg} kg` + (extra ? ` (without training: ${w.baseKg} kg)` : ''),
    trainingTitle: 'Training and nutrition',
    trainingTexts: {
      none: [],
      light: ['Your training is fairly light. The plan stays with the basic template.'],
      moderate: ['Extra snack on training days: light and carbohydrate-rich, about 1–2 hours before training or afterwards. You can skip it on rest days.'],
      high: [
        'Extra snack on training days: carbohydrate-rich, before or after training. You can skip it on rest days.',
        'Your training uses a lot of energy. On training days, add one extra portion of carbohydrates (e.g. rice, potatoes, wholegrain bread) at lunch and dinner, and do not skip any meal.',
      ],
      veryHigh: [
        'Extra snack on training days: carbohydrate-rich, before or after training. You can skip it on rest days.',
        'Your training uses a very large amount of energy. On training days, add one extra portion of carbohydrates at lunch and dinner, and do not skip any meal. At this volume, losing weight only makes sense with support from your coach and a registered dietitian.',
      ],
    },
    trainingPace: 'Part of your weight loss comes from training, which is why a slightly higher weekly rate is possible. It does not mean you should eat less. Do not cut back on meals around training.',
    trainingWarn: 'Warning signs of too little energy: constant tiredness, drop in performance, frequent infections or injuries, dizziness, feeling cold, trouble concentrating, missed periods. If you notice these, talk to your coach and a doctor and stop losing weight.',
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
    cycleRow: 'Cycle (estimate)',
    cycleRowText: (date, len) => `Last period from ${date}, cycle length ${len} days`,
    cycleTitle: 'Cycle and weight',
    cycleGeneral: [
      'Your weight can change across your cycle, mainly because of water retention in the days before and at the start of your period. This is normal and has nothing to do with body fat.',
      'For comparisons, weigh yourself in a similar cycle phase if you can. If your weight rises for a short time, do not eat or drink less because of it.',
      'Your safe weight loss per week does not change because of your cycle.',
    ],
    cycleActive: [
      'The weekly plan marks expected period days ("Period exp.") and days with possible water retention ("Water poss."). These are estimates: stress, training or illness can shift your cycle. With hormonal contraception or a very irregular cycle it is better to leave the cycle input out.',
      'On expected period days, lunch and dinner contain iron-rich dishes where your selections allow (marked "(Fe)" in the weekly plan), e.g. with lentils, chickpeas, beans, tofu, spinach or lean beef. Combine them with a vitamin C source such as bell pepper, tomatoes or oranges: this helps your body absorb iron from plant foods.',
      'If your period is heavy or very irregular, or you are constantly tired or suspect low iron, please ask a doctor. Do not start iron supplements on your own.',
    ],
    cyclePeriodShort: 'Period exp.',
    cycleWaterShort: 'Water poss.',
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

function shortDate(iso, lang) {
  const [, m, d] = iso.split('-');
  return lang === 'de' ? `${d}.${m}.` : `${m}-${d}`;
}
function weekdayIndex(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}
function addDaysIso(iso, n) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
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
  // Every page is explicitly A4
  const newPage = (layout) => doc.addPage({ size: 'A4', layout: layout || 'portrait', margin: M });
  let pageNo = 1;
  const footer = () => {
    const sx = doc.x, sy = doc.y, mb = doc.page.margins.bottom;
    doc.page.margins.bottom = 0; // allow drawing inside the bottom margin without starting a new page
    doc.font('Helvetica').fontSize(8).fillColor(MID)
      .text(`${DOMAIN}  ·  ${t.pageWord} ${pageNo}`, M, doc.page.height - 30, { width: doc.page.width - 2 * M, align: 'right', lineBreak: false });
    doc.page.margins.bottom = mb;
    doc.x = sx; doc.y = sy;
  };
  doc.on('pageAdded', () => { pageNo += 1; footer(); });
  const ensure = (h) => {
    if (doc.y + h > bottom()) newPage(doc.page.width > doc.page.height ? 'landscape' : 'portrait');
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
    doc.image(LOGO_PATH, M, 6, { height: 54 });
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#ffffff').text(CLUB_NAME, M + 66, 16, { width: doc.page.width - 2 * M - 66 });
    doc.font('Helvetica').fontSize(10).fillColor('#e5e7eb').text(t.subtitle, M + 66, 40, { width: doc.page.width - 2 * M - 66 });
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#ffffff').text(DOMAIN, M, 40, { width: doc.page.width - 2 * M, align: 'right', link: `https://${DOMAIN}` });
    doc.y = 84;
  };

  /* ---------- Page 1: summary + how it works ---------- */
  banner();
  footer();
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
  const tr = a.training;
  const trainingTxt = tr.categories.filter((c) => c.hours > 0)
    .map((c) => `${t.trainingCats[c.key]}: ${c.hours} ${t.hoursShort} (${t.effortShort} ${c.rpe}/10)`).join('; ');
  rows.push([t.trainingRow, trainingTxt || t.none]);
  rows.push([t.loadRow, t.tiers[tr.tier]]);
  if (tr.tier !== 'none') rows.push([t.trainingDaysRow, String(v.trainingDays)]);
  rows.push([t.weighInRow, t.weighIn[v.weighIn]]);
  if (v.cycle) rows.push([t.cycleRow, t.cycleRowText(fmtDate(v.cycle.lastStart, lang), v.cycle.length)]);
  if (a.lossKg > 0) rows.push([t.rateRow, t.rateText(a.weekly, tr.extraWeeklyPct > 0)]);
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

  (result.warnings || []).forEach((w) => {
    doc.font('Helvetica-Bold').fontSize(9.5);
    const h = doc.heightOfString(w.text, { width: W() - 20 }) + 14;
    ensure(h + 6);
    const wy = doc.y + 4;
    doc.roundedRect(M, wy, W(), h, 5).fill('#fef3c7');
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#92400e').text(w.text, M + 10, wy + 7, { width: W() - 20 });
    doc.y = wy + h + 2;
  });

  heading(t.howTitle);
  bullets(t.how);

  if (tr.tier !== 'none') {
    heading(t.trainingTitle);
    bullets(t.trainingTexts[tr.tier]);
    if (a.lossKg > 0 && tr.extraWeeklyPct > 0) { doc.moveDown(0.2); body(t.trainingPace); }
    doc.moveDown(0.3);
    body(t.trainingWarn, { color: MID, size: 8.5 });
  }

  if (v.sex === 'female') {
    heading(t.cycleTitle);
    bullets(t.cycleGeneral);
    if (v.cycle) { doc.moveDown(0.2); bullets(t.cycleActive); }
  }

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
  newPage('portrait');
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

  /* ---------- Weekly plans (landscape): one page per week until the competition ---------- */
  const weeksList = result.plan.weeks;
  const dayW = 80;
  const nSlots = result.plan.slots.length;
  let colW = 0;
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
  const shortLabels = result.plan.slots.map((s) => t.slotsShort[s.key]);
  weeksList.forEach((wk, wi) => {
    newPage('landscape');
    colW = (W() - dayW) / nSlots; // measured on the landscape page
    doc.font('Helvetica-Bold').fontSize(15).fillColor(DARK)
      .text(t.weekTitle(wi + 1, weeksList.length, fmtDate(wk.start, lang), fmtDate(wk.end, lang)), M, M, { width: W() });
    let y = doc.y + 8;
    const headH = rowH(shortLabels, true);
    cell('', M, y, dayW, headH, { fill: DARK });
    shortLabels.forEach((sl, i) => cell(sl, M + dayW + i * colW, y, colW, headH, { fill: DARK, bold: true, color: '#ffffff' }));
    y += headH;
    wk.days.forEach((d, di) => {
      const cd = wk.cycleDays ? wk.cycleDays[di] : null;
      const cycleLines = cd ? [cd.period ? t.cyclePeriodShort : null, cd.water ? t.cycleWaterShort : null].filter(Boolean) : [];
      const texts = result.plan.slots.map((sl) => {
        if (!d[sl.key]) return sl.key === 'training' ? t.restCell : '–';
        return d[sl.key].name + (cd && cd.period && d[sl.key].iron ? ' (Fe)' : '');
      });
      const date = addDaysIso(wk.start, di);
      const mark = (wk.trainingDays ? `\n${wk.trainingDays[di] ? t.trainShort : t.restShort}` : '') + cycleLines.map((l) => `\n${l}`).join('');
      const dayText = `${t.weekdays[weekdayIndex(date)]} ${shortDate(date, lang)}${mark}`;
      doc.font('Helvetica-Bold').fontSize(8.5);
      const dayH = doc.heightOfString(dayText, { width: dayW - 2 * pad }) + 2 * pad;
      const minH = wk.trainingDays ? 32 : 0;
      const h = Math.max(rowH(texts, false), dayH, minH);
      const fill = di % 2 ? '#ffffff' : LIGHT;
      cell(dayText, M, y, dayW, h, { fill, bold: true });
      texts.forEach((tx, i) => cell(tx, M + dayW + i * colW, y, colW, h, { fill }));
      y += h;
    });
    doc.y = y + 10;
  });

  /* ---------- Weekly checkpoints ---------- */
  if (result.checkpoints && result.checkpoints.length) {
    heading(t.checkTitle, 12);
    body(t.checkIntro, { size: 9 });
    doc.moveDown(0.4);
    const cw = [140, 120, 120];
    const rowsC = [t.checkCols].concat(result.checkpoints.map((c) => [fmtDate(c.date, lang), `${c.plannedKg} kg`, `${c.notBelowKg} kg`]));
    rowsC.forEach((r, i) => {
      ensure(18);
      const ry = doc.y;
      let rx = M;
      r.forEach((txt, j) => {
        cell(txt, rx, ry, cw[j], 16, i === 0 ? { fill: DARK, bold: true, color: '#ffffff' } : { fill: i % 2 ? '#ffffff' : LIGHT });
        rx += cw[j];
      });
      doc.y = ry + 16;
    });
  }

  /* ---------- Countdown (portrait A4) ---------- */
  newPage('portrait');
  if (a.fightWeek) {
    doc.moveDown(0.5);
    body(result.warnings.find((w) => w.code === 'taper') ? result.warnings.find((w) => w.code === 'taper').text : '', { size: 9 });
  }
  if (result.countdown && result.countdown.length) {
    heading(t.countTitle, 14);
    body(t.countIntro, { size: 9.5 });
    doc.moveDown(0.4);
    result.countdown.forEach((c) => {
      const txt = t.countTexts[c.key];
      const hh = doc.heightOfString(txt, { width: W() - 16 }) + 30;
      ensure(hh + 6);
      const cy = doc.y;
      doc.rect(M, cy, W(), 18).fill(DARK);
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#ffffff').text(`${fmtDate(c.date, lang)} – ${t.countNames[c.key]}`, M + 8, cy + 4, { width: W() - 16 });
      doc.font('Helvetica').fontSize(9.5).fillColor(DARK).text(txt, M + 8, cy + 24, { width: W() - 16 });
      doc.y = cy + hh + 4;
    });
  }

  /* ---------- Notes ---------- */
  heading(t.importantTitle, 12);
  bullets(t.important, 9);

  doc.end();
}

module.exports = { generatePdf };
