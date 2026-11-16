# Wien Taekwondo Planner – mobile app (Android + iOS)

A thin Capacitor wrapper around the web app in `../public`. The planning engine and the PDF still run on the server
(`https://food.wientaekwondo.com`); the app bundles the UI and adds what a plain website cannot do well:

- **Guest mode (default):** nothing is saved. The PDF is written to the app cache and opened in the system share sheet
  (save, send, print).
- **On-device history (opt-in):** "Save plan on this device" stores the *input* (not the plan) in Capacitor Preferences.
  "Open" recalculates it on the server (internet needed). Delete one or all saved plans in the app.
  No accounts, no server-side storage. Android backup is switched off (`allowBackup="false"`).
- The server allows cross-origin `POST /api/*` only from the app's fixed origins (`https://localhost`, `capacitor://localhost`).

The UI code is shared with the website (`../public/app.js`); the native-only parts switch on `Capacitor.isNativePlatform()`.

## Build

    cd mobile
    npm install
    npx cap sync

Android (Android Studio, or command line with `ANDROID_HOME` set):

    cd android && ./gradlew assembleDebug          # debug APK: app/build/outputs/apk/debug/
    ./gradlew bundleRelease                        # release AAB for Google Play (needs a signing config, see below)

iOS (needs a Mac with Xcode; CocoaPods or Swift Package Manager as the Capacitor 8 template uses):

    npx cap open ios

## Before the Play Store / App Store (open items)

1. **Deploy the server first.** The app calls the live API, so `server.js` (CORS) and the engine must be deployed before
   the app works. Without it every request from the app fails with a network error.
2. **App id and name.** `com.wientaekwondo.planner` / "Wien Taekwondo Planner" are placeholders. The id cannot be changed
   after the first store release.
3. **Signing.** Create an upload keystore (keep it and its passwords safe, outside the repo) and enable Play App Signing.
   Not created here on purpose.
4. **Privacy policy URL (required by both stores).** Health-related input (weight, allergies, optional cycle) is sent to the
   server only to compute the plan and is not stored; saved plans stay on the device. Have a lawyer / data protection
   contact check the text, the Play "Data safety" answers and Apple's "App Privacy" answers (including how to describe
   data that is processed but not retained). Teens are users: check consent / age rules.
5. **Account deletion rules** do not apply (no accounts). In-app deletion of saved plans exists.
6. **Store listing:** icon (the current icon is Capacitor's default), splash screen, screenshots, descriptions DE/EN,
   content rating questionnaire, target audience (includes minors).
7. **Apple review (guideline 4.2, "minimum functionality")** may question a wrapped website. Native PDF sharing and on-device
   history help but do not guarantee approval.
8. **Not tested on a real device yet.** The Preferences / Filesystem / Share plugin calls and the PDF share sheet were only
   exercised against mocks in a desktop browser. Test on at least one Android phone and one iPhone.
9. **Dietitian review** of the new sex / cycle rules (see the main README) before release.

## Known limits

- Needs internet to create or reopen a plan (engine and PDF are server-side). Offline use would mean porting
  `lib/engine.js` and the PDF generation to the app.
- The PDF is left in the app cache folder until the OS clears it.
