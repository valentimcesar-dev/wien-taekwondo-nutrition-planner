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

## BEFORE GOING LIVE (required)

1. **Safety limits are placeholders.** `lib/config.js` holds the maximum weekly and total weight
   loss (adult 1.0 % per week / 5 % total, teen 0.5 % per week / 3 % total). They were chosen to
   be conservative but are NOT validated. Have a sports dietitian or physician confirm or change them.
2. **Meal templates are unreviewed.** `lib/foods.js` has 40 dishes and 55 ingredients.
   A dietitian should review portions, combinations and the allergen data.
3. **Allergen data is generic per ingredient.** Packaged products can differ; cross-contamination is
   not modelled. The PDF says so, but the content must be accurate.
4. **Data protection (GDPR).** Allergies and diet are health-related data and teens are involved.
   Nothing is stored by this app, but the hosting provider may keep its own server logs.
   Check with a lawyer / data protection contact and add a privacy notice.
5. The "seasonal tips" in the PDF are general statements for Central Europe, not stock lists.

## Files

    server.js          Express server: /api/plan, /api/pdf, static files, security headers
    lib/config.js      Safety limits and settings
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
