'use strict';

/**
 * Ingredient and meal-template data.
 * - Only everyday ingredients that are normally on sale in Vienna supermarkets
 *   and markets (the app does not claim availability of any specific store).
 *   Regional staples come first, but common imported foods that are part of
 *   everyday eating in Austria (avocado, mango, quinoa, couscous, ...) are included.
 * - No calorie or macro numbers anywhere: portions are household measures.
 * - Allergens use the 14 EU allergen groups. Allergen data is GENERIC for the
 *   ingredient; packaged products can differ, so users must read labels.
 *
 * REVIEW these templates with a sports dietitian before publishing.
 */

const ALLERGENS = {
  gluten: { de: 'Gluten (Getreide)', en: 'Gluten (cereals)' },
  crustaceans: { de: 'Krebstiere', en: 'Crustaceans' },
  eggs: { de: 'Eier', en: 'Eggs' },
  fish: { de: 'Fisch', en: 'Fish' },
  peanuts: { de: 'Erdnüsse', en: 'Peanuts' },
  soy: { de: 'Soja', en: 'Soy' },
  milk: { de: 'Milch', en: 'Milk' },
  nuts: { de: 'Schalenfrüchte (Nüsse)', en: 'Tree nuts' },
  celery: { de: 'Sellerie', en: 'Celery' },
  mustard: { de: 'Senf', en: 'Mustard' },
  sesame: { de: 'Sesam', en: 'Sesame' },
  sulphites: { de: 'Sulfite', en: 'Sulphites' },
  lupin: { de: 'Lupine', en: 'Lupin' },
  molluscs: { de: 'Weichtiere', en: 'Molluscs' },
};

// cls: meat | pork | poultry | fish | dairy | egg | honey
// lactose: true when the ingredient contains relevant amounts of lactose
const I = (de, en, dAmt, eAmt, extra = {}) => ({ de, en, amt: { de: dAmt, en: eAmt }, allergens: [], cls: [], lactose: false, ...extra });

const INGREDIENTS = {
  oats: I('Haferflocken', 'Rolled oats', '50 g', '50 g', { allergens: ['gluten'] }),
  bread: I('Vollkornbrot', 'Wholegrain bread', '2 Scheiben', '2 slices', { allergens: ['gluten'] }),
  noodles: I('Vollkornnudeln', 'Wholegrain pasta', '80 g (Rohgewicht)', '80 g (dry weight)', { allergens: ['gluten'] }),
  rice: I('Reis', 'Rice', '70 g (Rohgewicht)', '70 g (dry weight)'),
  millet: I('Hirse', 'Millet', '60 g (Rohgewicht)', '60 g (dry weight)'),
  buckwheat: I('Buchweizen', 'Buckwheat', '60 g (Rohgewicht)', '60 g (dry weight)'),
  potato: I('Erdäpfel', 'Potatoes', '3 mittelgroße', '3 medium'),
  polenta: I('Polenta (Maisgrieß)', 'Polenta (cornmeal)', '60 g (Rohgewicht)', '60 g (dry weight)'),
  riceCakes: I('Reiswaffeln', 'Rice cakes', '3', '3'),
  quinoa: I('Quinoa', 'Quinoa', '60 g (Rohgewicht)', '60 g (dry weight)'),
  couscous: I('Vollkorn-Couscous', 'Wholegrain couscous', '70 g (Rohgewicht)', '70 g (dry weight)', { allergens: ['gluten'] }),
  bulgur: I('Bulgur', 'Bulgur', '70 g (Rohgewicht)', '70 g (dry weight)', { allergens: ['gluten'] }),
  sweetPotato: I('Süßkartoffel', 'Sweet potato', '1 mittelgroße', '1 medium'),
  wrap: I('Vollkorn-Wrap', 'Wholegrain wrap (tortilla)', '1 großer', '1 large', { allergens: ['gluten'] }),

  milk: I('Milch', 'Milk', '200 ml', '200 ml', { allergens: ['milk'], cls: ['dairy'], lactose: true }),
  skyr: I('Skyr', 'Skyr', '150 g', '150 g', { allergens: ['milk'], cls: ['dairy'], lactose: true }),
  yoghurt: I('Naturjoghurt', 'Plain yoghurt', '150 g', '150 g', { allergens: ['milk'], cls: ['dairy'], lactose: true }),
  topfen: I('Magertopfen', 'Low-fat quark (Topfen)', '100 g', '100 g', { allergens: ['milk'], cls: ['dairy'], lactose: true }),
  hardCheese: I('Bergkäse (Hartkäse)', 'Hard cheese (e.g. Bergkäse)', '2 Scheiben (ca. 30 g)', '2 slices (approx. 30 g)', { allergens: ['milk'], cls: ['dairy'] }),
  oatMilk: I('Haferdrink', 'Oat drink', '200 ml', '200 ml', { allergens: ['gluten'] }),
  soyYoghurt: I('Sojajoghurt (ungesüßt)', 'Soy yoghurt (unsweetened)', '150 g', '150 g', { allergens: ['soy'] }),
  tofu: I('Tofu', 'Tofu', '120 g', '120 g', { allergens: ['soy'] }),
  mozzarella: I('Mozzarella', 'Mozzarella', '½ Kugel (ca. 60 g)', '½ ball (approx. 60 g)', { allergens: ['milk'], cls: ['dairy'], lactose: true }),
  feta: I('Feta', 'Feta', '50 g', '50 g', { allergens: ['milk'], cls: ['dairy'], lactose: true }),
  egg: I('Eier', 'Eggs', '2', '2', { allergens: ['eggs'], cls: ['egg'] }),

  chicken: I('Hühnerbrust', 'Chicken breast', '1 Portion (handtellergroß, ca. 120 g)', '1 portion (palm-sized, approx. 120 g)', { cls: ['poultry'] }),
  turkey: I('Putenbrust', 'Turkey breast', '1 Portion (handtellergroß, ca. 120 g)', '1 portion (palm-sized, approx. 120 g)', { cls: ['poultry'] }),
  beef: I('Rindfleisch (mager)', 'Lean beef', '1 Portion (handtellergroß, ca. 120 g)', '1 portion (palm-sized, approx. 120 g)', { cls: ['meat'] }),
  ham: I('Beinschinken', 'Ham', '3 Scheiben', '3 slices', { cls: ['pork'] }),
  salmon: I('Lachs', 'Salmon', '1 Filet (ca. 120 g)', '1 fillet (approx. 120 g)', { allergens: ['fish'], cls: ['fish'] }),
  trout: I('Forelle', 'Trout', '1 Filet (ca. 120 g)', '1 fillet (approx. 120 g)', { allergens: ['fish'], cls: ['fish'] }),
  cod: I('Kabeljau', 'Cod', '1 Filet (ca. 120 g)', '1 fillet (approx. 120 g)', { allergens: ['fish'], cls: ['fish'] }),
  tuna: I('Thunfisch (Dose, im eigenen Saft)', 'Tuna (canned, in water)', '1 kleine Dose (ca. 80 g)', '1 small can (approx. 80 g)', { allergens: ['fish'], cls: ['fish'] }),

  lentils: I('Linsen', 'Lentils', '70 g (Rohgewicht)', '70 g (dry weight)'),
  chickpeas: I('Kichererbsen', 'Chickpeas', '100 g (gekocht)', '100 g (cooked)'),
  kidney: I('Kidneybohnen', 'Kidney beans', '80 g (gekocht)', '80 g (cooked)'),
  blackBeans: I('Schwarze Bohnen', 'Black beans', '80 g (gekocht)', '80 g (cooked)'),
  peas: I('Erbsen', 'Green peas', '100 g', '100 g'),
  hummus: I('Hummus', 'Hummus', '3 EL', '3 tbsp', { allergens: ['sesame'] }),
  peanutButter: I('Erdnussmus', 'Peanut butter', '1 EL', '1 tbsp', { allergens: ['peanuts'] }),
  walnuts: I('Walnüsse', 'Walnuts', '1 kleine Handvoll', '1 small handful', { allergens: ['nuts'] }),
  almonds: I('Mandeln', 'Almonds', '1 kleine Handvoll', '1 small handful', { allergens: ['nuts'] }),
  cashews: I('Cashewkerne', 'Cashew nuts', '1 kleine Handvoll', '1 small handful', { allergens: ['nuts'] }),
  pumpkinSeeds: I('Kürbiskerne', 'Pumpkin seeds', '1 EL', '1 tbsp'),

  apple: I('Apfel', 'Apple', '1 ganzer', '1 whole'),
  pear: I('Birne', 'Pear', '1 ganze', '1 whole'),
  banana: I('Banane', 'Banana', '1 ganze', '1 whole'),
  orange: I('Orange', 'Orange', '1 ganze', '1 whole'),
  kiwi: I('Kiwi', 'Kiwi', '2', '2'),
  mango: I('Mango', 'Mango', '150 g', '150 g'),
  dates: I('Datteln', 'Dates', '4', '4'),
  berries: I('Beeren (frisch oder tiefgekühlt)', 'Berries (fresh or frozen)', '1 große Handvoll', '1 large handful'),

  carrot: I('Karotten', 'Carrots', '2', '2'),
  pumpkin: I('Hokkaido-Kürbis', 'Hokkaido pumpkin', '200 g', '200 g'),
  cabbage: I('Kraut', 'Cabbage', '2 Fäuste', '2 fists'),
  spinach: I('Spinat', 'Spinach', '1 große Handvoll', '1 large handful'),
  broccoli: I('Brokkoli', 'Broccoli', '2 Fäuste', '2 fists'),
  tomato: I('Paradeiser', 'Tomatoes', '2', '2'),
  avocado: I('Avocado', 'Avocado', '½', '½'),
  eggplant: I('Melanzani (Aubergine)', 'Aubergine (eggplant)', '1 kleine', '1 small'),
  olives: I('Oliven', 'Olives', '1 kleine Handvoll', '1 small handful'),
  cucumber: I('Gurke', 'Cucumber', '½', '½'),
  pepper: I('Paprika', 'Bell pepper', '1 ganze', '1 whole'),
  zucchini: I('Zucchini', 'Zucchini', '1 kleine', '1 small'),
  mushrooms: I('Champignons', 'Mushrooms', '150 g', '150 g'),
  beetroot: I('Rote Rübe', 'Beetroot', '2 kleine', '2 small'),
  salad: I('Blattsalat', 'Leaf salad', '1 große Portion', '1 large portion'),
  celeriac: I('Sellerie', 'Celeriac', '100 g', '100 g', { allergens: ['celery'] }),

  rapeseedOil: I('Rapsöl', 'Rapeseed oil', '1 EL', '1 tbsp'),
  oliveOil: I('Olivenöl', 'Olive oil', '1 EL', '1 tbsp'),
  pumpkinOil: I('Steirisches Kürbiskernöl', 'Styrian pumpkin seed oil', '1 TL', '1 tsp'),
  honey: I('Honig', 'Honey', '1 TL', '1 tsp', { cls: ['honey'] }),
};

// Extra search words so that free-text dislikes / allergies match common synonyms
// (German and English). Used only for matching, never shown to the user.
const KEYWORDS = {
  avocado: 'avocado',
  kiwi: 'kiwi',
  mango: 'mango',
  dates: 'dattel datteln dates',
  cashews: 'nuss nüsse nuesse nut nuts cashew',
  eggplant: 'melanzani aubergine eggplant',
  olives: 'olive oliven',
  quinoa: 'quinoa',
  couscous: 'couscous',
  bulgur: 'bulgur',
  sweetPotato: 'kartoffel süßkartoffel batate potato',
  wrap: 'wrap tortilla brot',
  mozzarella: 'käse kaese cheese mozzarella milchprodukt',
  feta: 'käse kaese cheese feta schafkäse milchprodukt',
  cod: 'fisch fish kabeljau',
  blackBeans: 'bohne bohnen beans',
  peas: 'erbse erbsen',
  mushrooms: 'pilz pilze schwammerl schwammerln mushroom',
  potato: 'kartoffel kartoffeln potato',
  tomato: 'tomate tomaten paradeis',
  cabbage: 'kohl weißkraut weisskraut krautsalat',
  pumpkin: 'kürbis kuerbis',
  walnuts: 'nuss nüsse nuesse nut nuts walnuss',
  almonds: 'nuss nüsse nuesse nut nuts mandel',
  peanutButter: 'erdnuss erdnüsse peanut nuss',
  hummus: 'sesam tahini',
  chicken: 'huhn hähnchen hendl geflügel poultry',
  turkey: 'pute truthahn geflügel poultry',
  beef: 'rind fleisch meat',
  ham: 'schinken schwein pork fleisch',
  salmon: 'fisch fish',
  trout: 'fisch fish',
  tuna: 'fisch fish thunfisch',
  oats: 'hafer oat oatmeal',
  oatMilk: 'hafer oat',
  bread: 'brot',
  noodles: 'nudel nudeln pasta',
  egg: 'ei eier',
  skyr: 'milchprodukt',
  yoghurt: 'joghurt milchprodukt',
  topfen: 'quark milchprodukt',
  hardCheese: 'käse kaese cheese milchprodukt',
  banana: 'bananen',
  berries: 'beere himbeere heidelbeere erdbeere blaubeere',
  spinach: 'spinat',
  broccoli: 'brokkoli',
  zucchini: 'zucchini',
  pepper: 'paprika',
  tofu: 'soja soy',
  soyYoghurt: 'soja soy',
};
Object.keys(KEYWORDS).forEach((id) => { INGREDIENTS[id].kw = KEYWORDS[id]; });

const SLOTS = {
  breakfast: { de: 'Frühstück', en: 'Breakfast' },
  snack1: { de: 'Zwischenmahlzeit (Vormittag)', en: 'Mid-morning snack' },
  lunch: { de: 'Mittagessen', en: 'Lunch' },
  snack2: { de: 'Zwischenmahlzeit (Nachmittag / rund ums Training)', en: 'Afternoon snack (around training)' },
  dinner: { de: 'Abendessen', en: 'Dinner' },
  training: { de: 'Rund ums Training (an Trainingstagen)', en: 'Around training (on training days)' },
};

// items: ingredient id, or [id, germanAmount, englishAmount] to override the default amount
// iron: true marks lunch/dinner dishes built around iron-rich foods (pulses, lean beef, tofu, spinach, pumpkin seeds,
// whole grains). Used only on expected period days. Pending dietitian review.
const IRON_DISHES = new Set(['l2', 'l5', 'l8', 'l10', 'l11', 'l16', 'd6', 'd9', 'd11', 'd15']);
const dish = (id, slot, de, en, items) => ({ id, slot, name: { de, en }, items, iron: IRON_DISHES.has(id) });

const DISHES = [
  // ---- Breakfast ----
  dish('b1', 'breakfast', 'Porridge mit Milch, Apfel und Walnüssen', 'Porridge with milk, apple and walnuts', ['oats', 'milk', 'apple', 'walnuts']),
  dish('b2', 'breakfast', 'Hafer-Porridge mit Haferdrink, Banane und Kürbiskernen', 'Oat porridge with oat drink, banana and pumpkin seeds', ['oats', 'oatMilk', 'banana', 'pumpkinSeeds']),
  dish('b3', 'breakfast', 'Skyr-Bowl mit Beeren, Kürbiskernen und Honig', 'Skyr bowl with berries, pumpkin seeds and honey', ['skyr', 'berries', 'pumpkinSeeds', 'honey']),
  dish('b4', 'breakfast', 'Vollkornbrot mit Ei, Paradeiser und Gurke', 'Wholegrain bread with egg, tomato and cucumber', ['bread', 'egg', 'tomato', 'cucumber']),
  dish('b5', 'breakfast', 'Vollkornbrot mit Topfen, Paprika und Gurke', 'Wholegrain bread with quark, bell pepper and cucumber', ['bread', 'topfen', 'pepper', 'cucumber']),
  dish('b6', 'breakfast', 'Hirsebrei mit Birne und Kürbiskernen', 'Millet porridge with pear and pumpkin seeds', ['millet', 'pear', 'pumpkinSeeds']),
  dish('b7', 'breakfast', 'Sojajoghurt mit Banane, Beeren und Kürbiskernen', 'Soy yoghurt with banana, berries and pumpkin seeds', ['soyYoghurt', 'banana', 'berries', 'pumpkinSeeds']),
  dish('b8', 'breakfast', 'Rührei mit Paprika und Röstkartoffeln', 'Scrambled eggs with bell pepper and pan-fried potatoes', ['egg', 'pepper', 'potato', 'rapeseedOil']),
  dish('b9', 'breakfast', 'Hirsebrei mit Mandeln und Apfel', 'Millet porridge with almonds and apple', ['millet', 'almonds', 'apple']),
  dish('b10', 'breakfast', 'Skyr mit Mango, Kiwi und Haferflocken', 'Skyr with mango, kiwi and oats', ['skyr', 'mango', 'kiwi', ['oats', '30 g', '30 g']]),
  dish('b11', 'breakfast', 'Vollkornbrot mit Avocado und Ei', 'Wholegrain bread with avocado and egg', ['bread', 'avocado', 'egg', 'tomato']),
  dish('b12', 'breakfast', 'Hafer-Porridge mit Mango und Cashewkernen', 'Oat porridge with mango and cashew nuts', ['oats', 'oatMilk', 'mango', 'cashews']),
  dish('b13', 'breakfast', 'Quinoa-Porridge mit Haferdrink, Kiwi und Mandeln', 'Quinoa porridge with oat drink, kiwi and almonds', ['quinoa', 'oatMilk', 'kiwi', 'almonds']),

  // ---- Snacks ----
  dish('s1', 'snack', 'Apfel mit Walnüssen', 'Apple with walnuts', ['apple', 'walnuts']),
  dish('s2', 'snack', 'Vollkornbrot mit Erdnussmus und Banane', 'Wholegrain bread with peanut butter and banana', [['bread', '1 Scheibe', '1 slice'], 'peanutButter', ['banana', '½', '½']]),
  dish('s3', 'snack', 'Naturjoghurt mit Beeren', 'Plain yoghurt with berries', ['yoghurt', 'berries']),
  dish('s4', 'snack', 'Karotten- und Gurkensticks mit Hummus', 'Carrot and cucumber sticks with hummus', ['carrot', 'cucumber', 'hummus']),
  dish('s5', 'snack', 'Birne mit Kürbiskernen', 'Pear with pumpkin seeds', ['pear', 'pumpkinSeeds']),
  dish('s6', 'snack', 'Magertopfen mit Beeren und Honig', 'Low-fat quark with berries and honey', ['topfen', 'berries', 'honey']),
  dish('s7', 'snack', 'Reiswaffeln mit Banane', 'Rice cakes with banana', ['riceCakes', 'banana']),
  dish('s8', 'snack', 'Hartgekochte Eier mit Paradeisern', 'Hard-boiled eggs with tomatoes', ['egg', 'tomato']),
  dish('s9', 'snack', 'Orange mit Mandeln', 'Orange with almonds', ['orange', 'almonds']),
  dish('s10', 'snack', 'Sojajoghurt mit Banane', 'Soy yoghurt with banana', ['soyYoghurt', 'banana']),
  dish('s11', 'snack', 'Apfel mit Kürbiskernen', 'Apple with pumpkin seeds', ['apple', 'pumpkinSeeds']),
  dish('s12', 'snack', 'Skyr mit Mango', 'Skyr with mango', ['skyr', 'mango']),
  dish('s13', 'snack', 'Datteln mit Mandeln', 'Dates with almonds', ['dates', 'almonds']),
  dish('s14', 'snack', 'Mozzarella mit Paradeisern', 'Mozzarella with tomatoes', ['mozzarella', 'tomato']),
  dish('s15', 'snack', 'Vollkornbrot mit Avocado', 'Wholegrain bread with avocado', [['bread', '1 Scheibe', '1 slice'], 'avocado']),
  dish('s16', 'snack', 'Mango mit Cashewkernen', 'Mango with cashew nuts', ['mango', 'cashews']),
  dish('s17', 'snack', 'Kiwi mit Naturjoghurt', 'Kiwi with plain yoghurt', ['kiwi', 'yoghurt']),

  // ---- Training-day snacks (carbohydrate-focused, used from "moderate" training load) ----
  dish('t1', 'training', 'Reiswaffeln mit Honig und Banane', 'Rice cakes with honey and banana', ['riceCakes', 'honey', 'banana']),
  dish('t2', 'training', 'Skyr mit Haferflocken und Beeren', 'Skyr with oats and berries', ['skyr', [ 'oats', '30 g', '30 g'], 'berries']),
  dish('t3', 'training', 'Vollkornbrot mit Topfen und Banane', 'Wholegrain bread with quark and banana', ['bread', 'topfen', 'banana']),
  dish('t4', 'training', 'Reiswaffeln mit Erdnussmus und Banane', 'Rice cakes with peanut butter and banana', ['riceCakes', 'peanutButter', 'banana']),
  dish('t5', 'training', 'Sojajoghurt mit Haferflocken und Banane', 'Soy yoghurt with oats and banana', ['soyYoghurt', ['oats', '30 g', '30 g'], 'banana']),
  dish('t6', 'training', 'Hirsebrei mit Banane', 'Millet porridge with banana', ['millet', 'banana']),
  dish('t7', 'training', 'Reis-Obst-Schale mit Beeren und Banane', 'Rice and fruit bowl with berries and banana', [['rice', '50 g (Rohgewicht)', '50 g (dry weight)'], 'banana', 'berries']),
  dish('t8', 'training', 'Naturjoghurt mit Haferflocken und Apfel', 'Plain yoghurt with oats and apple', ['yoghurt', ['oats', '30 g', '30 g'], 'apple']),
  dish('t9', 'training', 'Datteln mit Banane und Mandeln', 'Dates with banana and almonds', ['dates', 'banana', 'almonds']),
  dish('t10', 'training', 'Vollkorn-Wrap mit Erdnussmus und Banane', 'Wholegrain wrap with peanut butter and banana', [['wrap', '1 kleiner', '1 small'], 'peanutButter', 'banana']),

  // ---- Lunch ----
  dish('l1', 'lunch', 'Hühnerbrust mit Reis und Brokkoli', 'Chicken breast with rice and broccoli', ['chicken', 'rice', 'broccoli', 'rapeseedOil']),
  dish('l2', 'lunch', 'Linseneintopf mit Karotten, Erdäpfeln und Sellerie', 'Lentil stew with carrots, potatoes and celeriac', ['lentils', 'carrot', 'potato', 'celeriac', 'rapeseedOil']),
  dish('l3', 'lunch', 'Lachs mit Petersilienerdäpfeln und Spinat', 'Salmon with parsley potatoes and spinach', ['salmon', 'potato', 'spinach', 'oliveOil']),
  dish('l4', 'lunch', 'Vollkornnudeln mit Tomatensauce und Putenstreifen', 'Wholegrain pasta with tomato sauce and turkey strips', ['noodles', 'tomato', 'turkey', 'oliveOil']),
  dish('l5', 'lunch', 'Kichererbsen-Gemüsepfanne mit Hirse', 'Chickpea and vegetable pan with millet', ['chickpeas', 'millet', 'zucchini', 'pepper', 'oliveOil']),
  dish('l6', 'lunch', 'Tofu-Gemüsepfanne mit Reis', 'Tofu and vegetable stir-fry with rice', ['tofu', 'rice', 'broccoli', 'carrot', 'rapeseedOil']),
  dish('l7', 'lunch', 'Forelle mit Erdäpfeln und Krautsalat', 'Trout with potatoes and cabbage salad', ['trout', 'potato', 'cabbage', 'rapeseedOil']),
  dish('l8', 'lunch', 'Mageres Rindfleisch mit Buchweizen und Gemüse', 'Lean beef with buckwheat and vegetables', ['beef', 'buckwheat', 'pepper', 'zucchini', 'rapeseedOil']),
  dish('l9', 'lunch', 'Gemüse-Omelett mit Salat und Vollkornbrot', 'Vegetable omelette with salad and wholegrain bread', [['egg', '3', '3'], 'mushrooms', 'pepper', 'salad', 'bread']),
  dish('l10', 'lunch', 'Thunfisch-Bohnen-Salat mit Vollkornbrot', 'Tuna and bean salad with wholegrain bread', ['tuna', 'kidney', 'tomato', 'cucumber', 'bread', 'oliveOil']),
  dish('l11', 'lunch', 'Quinoa-Bowl mit Avocado, Kichererbsen und Paradeisern', 'Quinoa bowl with avocado, chickpeas and tomatoes', ['quinoa', 'avocado', 'chickpeas', 'tomato', 'oliveOil']),
  dish('l12', 'lunch', 'Hühnerbrust mit Couscous und Melanzani-Paprika-Gemüse', 'Chicken breast with couscous and aubergine-pepper vegetables', ['chicken', 'couscous', 'eggplant', 'pepper', 'oliveOil']),
  dish('l13', 'lunch', 'Kabeljau mit Süßkartoffel und Brokkoli', 'Cod with sweet potato and broccoli', ['cod', 'sweetPotato', 'broccoli', 'oliveOil']),
  dish('l14', 'lunch', 'Vollkorn-Wrap mit Putenbrust, Salat und Avocado', 'Wholegrain wrap with turkey breast, salad and avocado', ['wrap', 'turkey', 'salad', 'avocado', 'tomato']),
  dish('l15', 'lunch', 'Griechischer Salat mit Feta, Oliven und Vollkornbrot', 'Greek salad with feta, olives and wholegrain bread', ['feta', 'olives', 'tomato', 'cucumber', 'pepper', 'bread', 'oliveOil']),
  dish('l16', 'lunch', 'Reis mit schwarzen Bohnen, Paprika und Avocado', 'Rice with black beans, bell pepper and avocado', ['rice', 'blackBeans', 'pepper', 'avocado']),

  // ---- Dinner ----
  dish('d1', 'dinner', 'Hokkaido-Kürbissuppe mit Kürbiskernöl und Vollkornbrot', 'Hokkaido pumpkin soup with pumpkin seed oil and wholegrain bread', ['pumpkin', 'potato', 'pumpkinOil', 'bread']),
  dish('d2', 'dinner', 'Gemüsepfanne mit Ei und Erdäpfeln', 'Vegetable pan with egg and potatoes', ['egg', 'potato', 'zucchini', 'mushrooms', 'rapeseedOil']),
  dish('d3', 'dinner', 'Hühnerbrust mit Ofengemüse und Erdäpfeln', 'Chicken breast with oven vegetables and potatoes', ['chicken', 'carrot', 'potato', 'beetroot', 'rapeseedOil']),
  dish('d4', 'dinner', 'Vollkornnudeln mit Spinat und Topfen', 'Wholegrain pasta with spinach and quark', ['noodles', 'spinach', 'topfen', 'oliveOil']),
  dish('d5', 'dinner', 'Lachs-Gemüse-Reispfanne', 'Salmon, vegetable and rice pan', ['salmon', 'rice', 'broccoli', 'carrot']),
  dish('d6', 'dinner', 'Tofu-Kürbis-Curry mit Reis', 'Tofu and pumpkin curry with rice', ['tofu', 'pumpkin', 'rice', 'oliveOil']),
  dish('d7', 'dinner', 'Erdäpfelsalat mit Ei, Gurke und Blattsalat', 'Potato salad with egg, cucumber and leaf salad', ['potato', 'egg', 'cucumber', 'salad', 'rapeseedOil']),
  dish('d8', 'dinner', 'Vollkornbrot mit Schinken, Käse und Salat', 'Wholegrain bread with ham, cheese and salad', ['bread', 'ham', 'hardCheese', 'salad']),
  dish('d9', 'dinner', 'Kichererbsen-Spinat-Eintopf mit Reis', 'Chickpea and spinach stew with rice', ['chickpeas', 'spinach', 'rice', 'tomato', 'oliveOil']),
  dish('d10', 'dinner', 'Putenbrust mit Polenta und Gemüse', 'Turkey breast with polenta and vegetables', ['turkey', 'polenta', 'tomato', 'zucchini', 'oliveOil']),  dish('d11', 'dinner', 'Süßkartoffel-Linsen-Curry mit Spinat', 'Sweet potato and lentil curry with spinach', ['lentils', 'sweetPotato', 'spinach', 'oliveOil']),
  dish('d12', 'dinner', 'Vollkornnudeln mit Melanzani, Paradeisern und Mozzarella', 'Wholegrain pasta with aubergine, tomatoes and mozzarella', ['noodles', 'eggplant', 'tomato', 'mozzarella', 'oliveOil']),
  dish('d13', 'dinner', 'Lachs mit Quinoa und grünen Erbsen', 'Salmon with quinoa and green peas', ['salmon', 'quinoa', 'peas', 'oliveOil']),
  dish('d14', 'dinner', 'Bulgur-Gemüse-Pfanne mit Ei', 'Bulgur and vegetable pan with egg', ['bulgur', 'egg', 'zucchini', 'pepper', 'rapeseedOil']),
  dish('d15', 'dinner', 'Tofu-Reis-Schale mit Avocado und Karotten', 'Tofu and rice bowl with avocado and carrots', ['tofu', 'rice', 'avocado', 'carrot', 'oliveOil']),

];

module.exports = { ALLERGENS, INGREDIENTS, SLOTS, DISHES };
