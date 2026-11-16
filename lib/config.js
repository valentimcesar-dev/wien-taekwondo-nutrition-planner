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

/**
 * TRAINING LOAD (all numbers are PLACEHOLDERS, not validated by a dietitian)
 * -------------------------------------------------------------------------
 * Four training categories, each with a base intensity class:
 *   taekwondo -> high,  cardio -> mid,  strength -> mid,  other (cycling, stretching ...) -> low
 * The athlete reports hours per week and a perceived effort (1-10) per category.
 * The effort moves the MET value inside the class band (1 = bottom, 10 = top).
 * MET values are rough values in the spirit of the Compendium of Physical Activities.
 * Net training energy = (MET - 1) * body weight * hours  (the "-1" removes resting energy).
 *
 * The extra weekly loss allowed = share of that training energy that may count towards
 * weight loss, converted to % of body weight, and capped by maxExtraPct.
 * Without training the plain LIMITS apply.
 */
const TRAINING = {
  CATEGORIES: { taekwondo: 'high', cardio: 'mid', strength: 'mid', other: 'low' },
  MET_BANDS: { low: [2.5, 4.5], mid: [4.0, 7.5], high: [6.5, 11.0] },
  MAX_HOURS_PER_CATEGORY: 20,
  MAX_HOURS_TOTAL: 40,
  KCAL_PER_KG: 7700,
  // Share of net training energy that may count towards planned weight loss, and the cap on the extra %/week
  BONUS: {
    adult: { share: 0.5, maxExtraPct: 0.5 },
    teen: { share: 0.25, maxExtraPct: 0.25 },
  },
  // Competition week (<= FIGHT_WEEK_DAYS days left): training is assumed to taper, so reported hours count only partly
  FIGHT_WEEK_DAYS: 7,
  TAPER_FACTOR: 0.6,
  // Warn when the planned weekly loss reaches this share of the weekly limit while the training load is this high
  WARN_SHARE: { high: 0.75, veryHigh: 0.5 },
  // Average net training energy per kg body weight per day -> load tier (upper bounds)
  TIERS: [
    { key: 'none', maxKcalPerKgDay: 0 },
    { key: 'light', maxKcalPerKgDay: 3 },
    { key: 'moderate', maxKcalPerKgDay: 6 },
    { key: 'high', maxKcalPerKgDay: 10 },
    { key: 'veryHigh', maxKcalPerKgDay: Infinity },
  ],
};

const PROGRESS = {
  MIN_DAYS: 3,            // earliest check after the start date
  MAX_LOOKBACK_DAYS: 120, // start date may not be older than this
  TOLERANCE_KG: 0.3,      // allowed gap to the planned straight-line loss
  MAX_CHECKPOINTS: 12,
};

module.exports = {
  TRAINING,
  PROGRESS,
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
