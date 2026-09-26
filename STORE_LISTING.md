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

## 2. Google Play Console — όλες οι υποχρεωτικές ενότητες

Όλα τα αρχεία για ανέβασμα βρίσκονται στον φάκελο `store/`. Η σειρά είναι αυτή του Dashboard → **Set up your app**.

### 2.1 Create app
| Πεδίο | Τιμή |
| --- | --- |
| App name | **Kyklos** |
| Default language | **English (United States) – en-US** (η εφαρμογή είναι μόνο στα αγγλικά) |
| App or game | **App** |
| Free or paid | **Free** (δεν αλλάζει μετά σε paid) |
| Declarations | ✔ Developer Program Policies · ✔ US export laws |

### 2.2 App content (Policy → App content)

**Privacy policy** → `https://tsvms.github.io/kyklos/privacy.html`

**App access** → **All functionality in my app is available without any access restrictions** (δεν υπάρχει login).

**Ads** → **No, my app does not contain ads**.

**Content rating** → Start questionnaire
- Email: `lumenateam@gmail.com`
- Category: **All other app types**
- Violence / Sexuality / Language / Controlled substances / Gambling: **No** σε όλα
- Does the app allow users to interact or exchange content? **No**
- Does the app share the user's current physical location? **No**
- Does the app allow users to purchase digital goods? **No**
- Is the app a web browser or search engine? **No**
- Αποτέλεσμα: **PEGI 3 / Everyone / USK 0**

**Target audience and content**
- Target age groups: **13–15, 16–17, 18 and over** (όχι κάτω των 13 → δεν μπαίνει στο Families policy)
- Could the store listing unintentionally appeal to children? **No**

**News apps** → **No**.

**Data safety**
1. Does your app collect or share any of the required user data types? → **No**
   (Όλα μένουν σε SQLite στο κινητό, δεν υπάρχει καμία κλήση δικτύου. Η εξαγωγή JSON γίνεται μόνο όταν ο χρήστης πατήσει «Εξαγωγή» και πάει όπου διαλέξει ο ίδιος — για τη Google αυτό δεν είναι «collection».)
2. Αποτέλεσμα στη σελίδα: **No data collected · No data shared**.
3. Αν ζητήσει data-deletion URL: `https://tsvms.github.io/kyklos/privacy.html` (εξηγεί Ρυθμίσεις → Διαγραφή όλων / απεγκατάσταση).

**Government apps** → **No**.

**Financial features** → **My app doesn't provide any financial features**.

**Health** → **My app does not have any health features**. (Γενικό εργαλείο συνηθειών, όχι ιατρική/fitness εφαρμογή. Γι' αυτό η κατηγορία είναι Productivity.)

**Advertising ID** → **No** (η εφαρμογή δεν χρησιμοποιεί advertising ID· το manifest δεν δηλώνει `AD_ID`).

**Exact alarms** (αν εμφανιστεί) → η εφαρμογή δηλώνει μόνο `SCHEDULE_EXACT_ALARM` για υπενθυμίσεις σε ώρα που διαλέγει ο χρήστης· το `USE_EXACT_ALARM` είναι μπλοκαρισμένο. Αιτιολόγηση: *"Habit reminders at a time the user picks. The user can turn them off per habit."*

### 2.3 Store settings (Grow → Store presence → Store settings)
| Πεδίο | Τιμή |
| --- | --- |
| Category | **Productivity** |
| Tags | Habit tracker, Productivity, To-do list |
| Email | `lumenateam@gmail.com` |
| Website | `https://tsvms.github.io/kyklos/` |
| Phone | (κενό) |

### 2.4 Main store listing
Κείμενα: ενότητα 3 παρακάτω (μόνο αγγλικά). Γραφικά από το `store/`:
| Πεδίο | Αρχείο |
| --- | --- |
| App icon 512×512 | `store/icon-512.png` |
| Feature graphic 1024×500 | `store/feature-graphic.png` |
| Phone screenshots (2–8) | `store/screenshot-1.png` … `store/screenshot-5.png` (1080×1920) |

### 2.5 Release — νέος προσωπικός λογαριασμός
Οι προσωπικοί λογαριασμοί (μετά τον Νοέμβριο 2023) πρέπει να κάνουν πρώτα **closed test με τουλάχιστον 12 testers για 14 συνεχόμενες μέρες** πριν ζητήσουν Production.
1. Testing → **Closed testing** → Create track → Testers: φτιάξε λίστα email (12+ άτομα με Google λογαριασμό).
2. Create new release → **Play App Signing: Use Google-generated key** (προτεινόμενο) → ανέβασε `Kyklos-1.1.0.aab` (ο φάκελος με το κλειδί υπογραφής αναφέρεται στο `Documents\Kyklos-keys\README-KEYS.txt`).
3. Release name: `1.1.0` · Release notes: παρακάτω.
4. Countries: όλες (ή Ελλάδα + Κύπρος για αρχή).
5. Μετά από 14 μέρες: Dashboard → **Apply for production** → ίδιο AAB → rollout.

**Release notes (en-US)**
```
<en-US>
• New: "X times a day" — e.g. 6 glasses of water, with a counter that fills up
• Sparks when you complete a habit, livelier animations
• Stability fixes
</en-US>
```

### 2.6 Επόμενες ενημερώσεις
Κάθε νέα έκδοση χρειάζεται μεγαλύτερο `versionCode` (τώρα είναι **1**). Με EAS: `eas build -p android --profile production` (το αυξάνει μόνο του)· αν χρησιμοποιήσεις EAS, ανέβασε πρώτα το ίδιο κλειδί με `eas credentials` ώστε τα APK να αναβαθμίζονται πάνω στα παλιά.

---

## 3. Listing text

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
• Light and dark theme
• Export and restore a backup (JSON)

No accounts, ads or analytics. Everything stays on your phone.

**Keywords (iOS, 100):** habit,tracker,streak,routine,goals,reminder,minimal,daily,calm,privacy

---

## 4. Screenshots

Android: έτοιμα στο `store/` (1080×1920, τραβηγμένα από το release APK στον emulator, με λεζάντα). Το Play δέχεται λόγο πλευρών έως 2:1, γι' αυτό δεν ανεβαίνουν ωμά τα 1080×2400 του κινητού.
iPhone (όταν γίνει): 6.9" 1320×2868 ή 6.5" 1284×2778 από TestFlight.
