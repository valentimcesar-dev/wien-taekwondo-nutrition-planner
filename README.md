# Wien Taekwondo – Competition Nutrition Planner

Stateless Node.js app (Express + PDFKit). An athlete enters weight today, competition date,
target weight and food restrictions, and gets a general weekly nutrition template as a PDF
(German or English). Nothing is stored.

## Run locally

    npm install
    npm start          # http://localhost:3000  (uses process.env.PORT if set)

## What it does / does not do

- Refuses to create a plan when the target weight is too far away for the time left
  (it explains why and points to the coach instead).
- No calorie or macro numbers; portions are household measures only.
- No fasting, fluid restriction or "cut" options. The PDF lists them as NOT recommended.
- Filters meals by diet (omnivore, pescatarian, vegetarian, vegan, no pork), the 14 EU allergens,
  lactose intolerance, free-text allergies and dislikes.
- Stateless: no database, no files written, no cookies, no request logging, `Cache-Control: no-store`.

## Training load (new)

The athlete reports hours per week and a perceived effort (1-10) for four categories:
Taekwondo (high-intensity class), cardio and strength (medium class), other such as cycling or stretching (low class).
`lib/engine.js` turns this into an internal estimate of net training energy
(MET inside the class band, moved by the effort slider; `(MET-1) x kg x hours`). Nothing is shown in calories.

- **Weekly loss limit:** a share of that training energy (adult 50 %, teen 25 %) is added to the base weekly limit,
  capped (adult +0.5 %, teen +0.25 % of body weight per week). The total-loss ceiling is unchanged.
  With no training entered, behaviour is identical to before.
- **Plan:** from a "moderate" load upwards the plan gets an extra carbohydrate-focused snack for training days;
  "high" and above add guidance for an extra carbohydrate portion at lunch and dinner. The PDF lists the
  training input, load tier, weekly rate and warning signs of too little energy.
- **Menus until the competition:** the plan contains a menu for every day from today until the day before the
  competition, grouped in weeks (one landscape A4 page per week in the PDF, a week selector in the web app). The dish
  rotation continues across weeks, so weeks differ. Up to 400 days ahead are allowed, so the PDF can be long.
- **Branding:** the Wien Taekwondo Centre logo (`public/wtc-logo.jpg`, `lib/wtc-logo-pdf.jpg`) and the domain
  wientaekwondo.com appear in the web header/footer and on every PDF page.
- **Training days per week:** the extra snack appears only on training days (spread evenly over the 7 plan days);
  rest days are marked in the weekly table.
- **Competition week** (7 days or fewer left): training hours count at `TAPER_FACTOR` (0.6) because training is
  assumed to taper; the PDF says so.
- **Warning:** high or very high training load together with a planned loss close to the weekly limit shows a caution
  on screen and in the PDF.
- **Weigh-in countdown:** the PDF has a page for the last days before weigh-in and competition (dates depend on
  "weigh-in day before / same day"): no new foods, no fasting, normal fluids.
- **Progress check:** `POST /api/progress`. Stateless: the athlete re-enters starting weight and start date.
  The PDF also lists weekly checkpoints (planned weight and a "not below" limit).
- All pages of the PDF are A4 (portrait; the weekly plan is A4 landscape).
- All values live in `TRAINING` and `PROGRESS` in `lib/config.js`. The countdown and warning texts were not separately reviewed by the dietitian as far as we know.

## Sex and menstrual cycle (new, PENDING DIETITIAN REVIEW)

The form has an optional "sex" field (male / female / prefer not to say). For **female** a second optional card appears:
first day of the last period and cycle length (21-40 days, default 28). Without those two values the female option only adds
a general note on weight fluctuation to the PDF. **The safe weight-loss limits are identical for everyone. The cycle never changes them.**

With cycle input (all numbers in `CYCLE` in `lib/config.js`, all placeholders):

- **Weekly plan:** expected period days (cycle days 1-5) and days with possible water retention (first 2 days of the period
  and the last 5 days before the next one) are marked on screen and in the PDF.
- **Weigh-in warning:** if the weigh-in day or the competition day is predicted in a water-retention window, the plan shows a
  note ("normal, no reason to eat or drink less, talk to your coach"). If both dates are too far away to predict
  (more than 90 days from the entered period start) a "predict later" note is shown instead.
- **Progress check:** when today's weight is probably raised by water retention and the starting weight was not, the "behind plan"
  tolerance is widened by 1.0 kg and a note explains why. The "too fast" check is **not** relaxed. If the start weight was probably
  raised instead, a note says part of the loss may be water.
- **Iron:** on expected period days lunch and dinner use iron-rich dishes (tagged `iron: true` in `lib/foods.js`: lentils, chickpeas,
  beans, lean beef, tofu, spinach) if the athlete's diet, allergies and dislikes allow it; otherwise the normal dish is used. The PDF
  marks them "(Fe)" and recommends a vitamin C source and asking a doctor about heavy periods or suspected iron deficiency
  (no supplements on their own).
- Nothing is stored. Cycle data is health data and is processed only for the request (same as weight and allergies).

To be reviewed by the dietitian before this goes live: the window definitions, the 1.0 kg tolerance, the list of iron-rich dishes,
the PDF and screen wording (DE/EN), and whether a general female note without cycle input is enough.

## BEFORE GOING LIVE (required)

1. **Safety limits.** `lib/config.js` holds the maximum weekly and total weight
   loss (adult 1.0 % per week / 5 % total, teen 0.5 % per week / 3 % total). The club's dietitian
   confirmed the rules as OK (16 Nov 2026). Any later change to these numbers should be reviewed again.
1b. **Training numbers.** MET bands, the 50 % / 25 % shares, the caps and the load tiers in
   `TRAINING` (`lib/config.js`) are estimates. The dietitian confirmed the rules as OK and agreed to a teen cap of
   +0.25 % per week (16 Nov 2026). Review again after any change.
2. **Meal templates are unreviewed.** `lib/foods.js` has 40 dishes and 55 ingredients.
   A dietitian should review portions, combinations and the allergen data.
3. **Allergen data is generic per ingredient.** Packaged products can differ; cross-contamination is
   not modelled. The PDF says so, but the content must be accurate.
4. **Data protection (GDPR).** Allergies and diet are health-related data and teens are involved.
   Nothing is stored by this app, but the hosting provider may keep its own server logs.
   Check with a lawyer / data protection contact and add a privacy notice.
5. The "seasonal tips" in the PDF are general statements for Central Europe, not stock lists.

## Caching note (GoDaddy)

GoDaddy serves `app.js` and `style.css` with `Cache-Control: max-age=2678400` (31 days), overriding the app's
`no-store`. `server.js` therefore serves `index.html` with content-hashed URLs (`app.js?v=<hash>`), so browsers
load new files after every update. Do not link `app.js` / `style.css` by a fixed URL.

## Files

    server.js          Express server: /api/plan, /api/pdf, static files, security headers
    lib/config.js      Safety limits, training and cycle settings
    lib/foods.js       Ingredients (allergens, diet classes) and meal templates
    lib/engine.js      Validation, safety check, plan generation
    lib/pdf.js         PDF layout and German/English texts
    public/            Web page (index.html, app.js, style.css)

## Deploying on GoDaddy Node.js hosting

GoDaddy's Node.js hosting page says you can upload a zip or connect a GitHub repository.
The details (required start command, port handling, Node version) were NOT verified – check them in
GoDaddy's setup flow. This app: entry point `server.js`, start command `npm start`, listens on
`process.env.PORT`, needs Node 18 or newer, and runs `npm install` for its two dependencies.

To show it on wientaekwondo.com, either link to it (e.g. a subdomain such as `ernaehrung.wientaekwondo.com`)
or embed it with an iframe. The Content-Security-Policy in `server.js` already allows embedding
from wientaekwondo.com and www.wientaekwondo.com.

## License

GNU General Public License v3.0 (see LICENSE).
