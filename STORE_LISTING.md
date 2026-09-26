# Kyklos — store submission kit

Everything the App Store and Google Play forms ask for, answered to match what the code actually does.
The code makes no network requests and has no analytics, ads, accounts, or third-party SDKs.
All data is local SQLite.

## 0. Before you submit (5 minutes)

1. Open `lib/legal.ts` and fill in:
   - `publisher`: your name or company, exactly as in App Store Connect / Play Console
   - `contactEmail`: an address you read (both stores require a contact)
2. Run `npm run legal`. This regenerates `docs/index.html`, `docs/privacy.html`, `docs/terms.html`, `PRIVACY.md` and `TERMS.md` from the same text the app shows.
3. Publish the pages by committing and pushing. GitHub Pages serves `docs/` from **github.com/tsvms/kyklos**, the same repo as the app, and it's separate from any website.
   - Privacy Policy URL: **https://tsvms.github.io/kyklos/privacy.html**
   - Terms: https://tsvms.github.io/kyklos/terms.html
4. Rebuild the app so the in-app policy shows the same details.

> These texts are carefully written templates that match the app's real behaviour. They are not legal advice. If you publish commercially or under a company, have a lawyer review them.

---

## 1. App Store Connect

**App Privacy (the "nutrition label")**
- Go to *App Privacy → Get Started*. When asked "Do you or your third-party partners collect data from this app?", answer **No, we do not collect data from this app**.
- The result is **"Data Not Collected"**.

**Privacy manifest.** This is already configured in `app.json` → `ios.privacyManifests`. Tracking is false, no data types are collected, and the required-reason APIs (UserDefaults, FileTimestamp, SystemBootTime, DiskSpace) are aggregated from the Expo/React Native packages actually in the app.

**Age rating.** Answer "None" to every question. The result is **4+**.

**Export compliance.** Already answered in `app.json` (`ITSAppUsesNonExemptEncryption = false`).

**Category.** Primary: Health & Fitness, or Productivity.

**URLs.** Privacy Policy URL: `https://tsvms.github.io/kyklos/privacy.html`. Support URL: `https://tsvms.github.io/kyklos/`.

**EULA.** Leave the default. The terms reference Apple's Standard EULA.

---

## 2. Google Play Console

**Data safety**
- Does your app collect or share any of the required user data types? **No**
- Is all of the user data collected by your app encrypted in transit? *(not applicable: nothing is transmitted)*
- Do you provide a way for users to request that their data is deleted? **Yes**. Settings → Delete all data, or uninstalling the app.

**Content rating (IARC questionnaire).** Category: *Utility, Productivity, Communication or other*. Answer "No" to everything. The result is **Everyone / PEGI 3**.

**Target audience.** 13+ recommended. The app isn't designed for children; choosing 13+ avoids the Families policy requirements.

**Ads.** No.

**Permissions declarations.**
- `SCHEDULE_EXACT_ALARM`: Google may ask for justification. The honest one: *"User-scheduled habit reminders at a time the user picks."* `USE_EXACT_ALARM` (alarm and calendar apps only) is blocked in `app.json`, so no declaration is needed for it.

---

## 3. Listing text

### Ελληνικά

**Όνομα:** Kyklos
**Υπότιτλος (30):** Ήσυχες συνήθειες, κάθε μέρα
**Σύντομη περιγραφή (80):** Ένα ήρεμο εργαλείο για συνήθειες. Χωρίς λογαριασμούς, χωρίς παρακολούθηση.

**Περιγραφή:**
Το Kyklos σε βοηθά να χτίζεις μικρές συνήθειες χωρίς πίεση.

• Σήμερα: οι συνήθειες της μέρας, ένα άγγιγμα για ολοκλήρωση, απαλή δόνηση και δακτύλιος προόδου
• Η φωτιά του σερί: ανάβει όσο συνεχίζεις, σβήνει γκρι όταν σταματάς
• 10 βαθμίδες, από Σπίθα μέχρι Ολύμπια Φλόγα, ανάλογα με το σερί σου
• Ευέλικτο πρόγραμμα: κάθε μέρα, Χ φορές την εβδομάδα, συγκεκριμένες μέρες ή κάθε Ν μέρες
• Χ φορές την ημέρα: π.χ. 6 ποτήρια νερό, με μετρητή που γεμίζει
• Ξέχασες χθες; Συμπλήρωσε οποιαδήποτε από τις τελευταίες 7 μέρες
• Ιστορικό 17 εβδομάδων, εβδομαδιαία στατιστικά, ποσοστό 30 ημερών
• Μία ήσυχη υπενθύμιση ανά συνήθεια
• Φωτεινό και σκοτεινό θέμα, ελληνικά και αγγλικά
• Εξαγωγή και επαναφορά αντιγράφου (JSON)

Χωρίς λογαριασμούς, διαφημίσεις ή analytics. Όλα μένουν στο κινητό σου.

**Λέξεις-κλειδιά (iOS, 100):** συνήθειες,σερί,ρουτίνα,στόχοι,υπενθύμιση,habit,tracker,streak,routine,minimal

### English

**Subtitle (30):** Quiet habits, every day
**Short description (80):** A calm habit tracker. No accounts, no tracking. Your data stays on your phone.

**Description:**
Kyklos helps you build small habits without pressure.

• Today: your habits for the day, one tap to complete, gentle haptics and a progress ring
• The streak fire: it burns while you keep going and turns to grey ash when you stop
• 10 ranks, from Spark to Olympian, depending on your streak
• Flexible schedules: every day, X times a week, specific weekdays or every N days
• X times a day: e.g. 6 glasses of water, with a counter that fills up
• Forgot yesterday? Fill in any of the last 7 days
• 17-week history, weekly stats, 30-day completion rate
• One quiet reminder per habit
• Light and dark theme, Greek and English
• Export and restore a backup (JSON)

No accounts, ads or analytics. Everything stays on your phone.

**Keywords (iOS, 100):** habit,tracker,streak,routine,goals,reminder,minimal,daily,calm,privacy

---

## 4. Screenshots

The stores need phone screenshots (iPhone 6.9" 1320×2868 or 6.5" 1284×2778; Android at least 1080 px on the short side). Take them from a TestFlight or APK install: Today (light), Habit detail (dark), Add habit, Stats. Don't use mockups with devices that aren't yours.
