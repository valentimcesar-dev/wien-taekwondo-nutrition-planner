'use strict';

/**
 * SAFETY LIMITS
 * -------------
 * These numbers are PLACEHOLDERS chosen to be conservative. They have NOT been
 * validated by a sports dietitian or physician. Have them reviewed (and change
 * them here) before the app goes live. The app never creates a plan for a
 * weight loss above these limits.
 *
 *  maxWeeklyPct : max planned body-weight loss per week, in % of current weight
 *  maxTotalPct  : max planned total loss, in % of current weight, whatever the time
 */
module.exports = {
  LIMITS: {
    adult: { maxWeeklyPct: 1.0, maxTotalPct: 5.0 },
    teen: { maxWeeklyPct: 0.5, maxTotalPct: 3.0 },
  },
  MIN_KG: 30,
  MAX_KG: 200,
  MAX_DAYS_AHEAD: 400,
  TIMEZONE: 'Europe/Vienna',
  CLUB_NAME: 'Wien Taekwondo',
};
