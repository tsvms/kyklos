// Every user-facing string lives here. Greek is the primary UI language;
// any key missing from `el` falls back to English.

const en = {
  'tabs.today': 'Today',
  'tabs.stats': 'Stats',
  'tabs.settings': 'Settings',

  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.archive': 'Archive',
  'common.unarchive': 'Restore',
  'common.newHabit': 'New habit',

  'today.morning': 'Good morning',
  'today.afternoon': 'Good afternoon',
  'today.evening': 'Good evening',
  'today.progress': '{done} of {total}',
  'today.allDone': 'All done for today. Rest well.',
  'today.keepGoing': 'One small step at a time.',
  'today.emptyTitle': 'Start with something small',
  'today.emptyBody': 'One habit is enough. Small steps make full circles.',
  'today.freeTitle': 'A free day',
  'today.freeBody': 'Nothing scheduled for today. Enjoy it.',
  'today.weekProgress': '{done}/{target} this week',
  'today.streak': '{n} in a row',
  'today.markDone': 'Mark {name} as done',
  'today.markUndone': 'Mark {name} as not done',

  'notif.offTitle': 'Reminders are off',
  'notif.offBody': 'Turn them on and we will nudge you gently.',
  'notif.enable': 'Turn on',
  'notif.openSettings': 'Open settings',
  'notif.deniedHint': 'Notifications are blocked. You can allow them in system settings.',
  'notif.channel': 'Reminders',
  'notif.body': 'A small moment for you.',
  'notif.explain':
    'Kyklos sends one quiet local reminder per habit, at the time you choose. Nothing leaves your phone.',

  'form.newTitle': 'New habit',
  'form.editTitle': 'Edit habit',
  'form.name': 'Name',
  'form.namePlaceholder': 'e.g. Read',
  'form.icon': 'Icon',
  'form.color': 'Colour',
  'form.schedule': 'Schedule',
  'form.reminder': 'Reminder',
  'form.reminderOn': 'Remind me',
  'form.hour': 'Hour',
  'form.minute': 'Minute',
  'form.nameRequired': 'Give it a name',
  'form.dayRequired': 'Pick at least one day',
  'form.timesPerWeek': 'Times per week',
  'form.everyNDays': 'Every how many days',

  'schedule.daily': 'Every day',
  'schedule.weekly': 'Times a week',
  'schedule.weekdays': 'Specific days',
  'schedule.interval': 'Every N days',
  'schedule.weeklySummary': '{n}× a week',
  'schedule.intervalSummary': 'Every {n} days',

  'detail.current': 'Current streak',
  'detail.best': 'Best streak',
  'detail.rate': '30-day rate',
  'detail.history': 'Last 17 weeks',
  'detail.archived': 'Archived — history kept, no reminders.',
  'detail.deleteTitle': 'Delete this habit?',
  'detail.deleteBody': 'Its history will be gone too. Archive it instead if you would like to keep it.',
  'detail.notFound': 'This habit is no longer here.',
  'detail.legendDone': 'Done',
  'detail.legendMissed': 'Open',
  'detail.checkins': '{n} check-ins',

  'stats.total': 'Total check-ins',
  'stats.thisWeek': 'This week',
  'stats.weeks': 'Last 8 weeks',
  'stats.habits': 'Your habits',
  'stats.emptyTitle': 'Your stats will grow with you',
  'stats.emptyBody': 'Check off a habit today and the first bar appears here.',
  'stats.streakShort': '{n} streak',

  'settings.appearance': 'Appearance',
  'settings.system': 'System',
  'settings.light': 'Light',
  'settings.dark': 'Dark',
  'settings.language': 'Language',
  'settings.notifications': 'Reminders',
  'settings.notifOn': 'On',
  'settings.notifOff': 'Off',
  'settings.data': 'Your data',
  'settings.export': 'Export data (JSON)',
  'settings.exportHint': 'A full copy of your habits and check-ins.',
  'settings.exportFailed': 'Export did not work this time. Please try again.',
  'settings.archived': 'Archived habits',
  'settings.archivedNone': 'Nothing archived.',
  'settings.about': 'About',
  'settings.aboutBody':
    'Kyklos is a quiet habit tracker. No accounts, no ads, no tracking — everything stays on this device.',
  'settings.version': 'Version {v}',

  'today.backToToday': 'Back to today',
  'today.pastHint': 'Forgot to check in? You can fill in any of the last 7 days.',
  'today.streakKeep': '{n} in a row · keep it going today',
  'today.perfectDays': 'days in a row with everything done',
  'today.dayA11y': '{date}: {done} of {total}',
  'today.restDay': 'Nothing was planned for this day.',

  'milestone.3': 'Three in a row. The circle has begun.',
  'milestone.7': 'A whole week. Lovely rhythm.',
  'milestone.14': 'Two weeks. It is becoming yours.',
  'milestone.21': 'Three weeks of showing up.',
  'milestone.30': 'A month of small steps.',
  'milestone.100': 'One hundred. Quietly remarkable.',
  'milestone.365': 'A full year. Thank you for showing up.',
  'milestone.generic': '{n} in a row. Well done.',

  'streak.inARow': 'in a row',
  'streak.next': 'Next milestone: {n}',
  'streak.best': 'Best: {n}',

  'detail.total': 'Check-ins',
  'detail.editA11y': 'Edit habit',

  'schedule.dailyHint': 'Every single day',
  'schedule.weekdaysHint': 'You pick the days',
  'schedule.weeklyHint': 'Any days, X times',
  'schedule.intervalHint': 'Every 2, 3… days',

  'stats.perfect': 'Complete days in a row',
  'stats.rate30': '30-day rate',

  'settings.privacyShort': 'No accounts. No tracking. Your data stays on this phone.',
  'settings.import': 'Restore from backup',
  'settings.importHint': 'Replaces what is on this phone with a Kyklos JSON backup.',
  'settings.importTitle': 'Replace all data?',
  'settings.importBody':
    'This backup ({date}) has {habits} habits and {checkins} check-ins. Everything currently on this phone will be replaced.',
  'settings.importConfirm': 'Replace',
  'settings.importDone': 'Restored. Welcome back.',
  'settings.importInvalid': 'This file does not look like a Kyklos backup, so nothing was changed.',
  'settings.deleteAll': 'Delete all data',
  'settings.deleteAllHint': 'Removes every habit and check-in from this phone.',
  'settings.deleteAllTitle': 'Delete everything?',
  'settings.deleteAllBody':
    'All habits and their history will be permanently removed from this phone. You may want to export a backup first.',
  'settings.deleteAllConfirm': 'Delete everything',
  'settings.deleted': 'Everything was deleted. A fresh start.',
  'settings.legal': 'Legal',
  'settings.privacy': 'Privacy policy',
  'settings.terms': 'Terms of use',
  'settings.licenses': 'Open-source licences',

  'legal.updated': 'Effective {date}',
  'licenses.intro': 'Kyklos is built on these open-source projects. Thank you to their authors.',

  'error.title': 'Something did not open properly',
  'error.body': 'Close Kyklos completely and open it again. If it keeps happening, restarting the phone usually helps.',
  'error.retry': 'Try again',

  'seed.read': 'Read',
  'seed.water': 'Glass of water',
  'seed.walk': 'Walk',

  'streak.unit': 'day streak',
  'streak.unitOne': 'day streak',
  'streak.habitUnit': 'in a row',
  'streak.lit': 'The fire is burning. See you tomorrow.',
  'streak.waiting': 'Finish one habit today to keep the fire alive.',
  'streak.out': 'The fire is out. One habit today lights it again.',
  'streak.habitLit': 'Done today. The fire keeps burning.',
  'streak.habitWaiting': 'Check it off today to keep the fire going.',
  'streak.habitOut': 'No fire yet. Check it off to light it.',

  'rank.label': 'Rank',
  'rank.title': 'Ranks',
  'rank.intro': 'Keep your daily fire burning to climb. Your best streak unlocks each rank for good.',
  'rank.next': '{n} more to {rank}',
  'rank.max': 'Top rank. Legendary.',
  'rank.from': 'from {n} days',
  'rank.fromOne': 'from day 1',
  'rank.fromStart': 'where every fire starts',
  'rank.up': 'New rank: {rank}',
  'rank.now': 'Now',

  'today.edit': 'Edit',
  'today.editDone': 'Done',
  'today.editHint': 'Tap a habit to edit it, or the bin to delete it.',
  'today.addHabit': 'Add a habit',
  'today.listTitle': 'Today',
  'today.doneOf': '{done} of {total}',
  'today.saveFailed': 'That did not save. Please try again.',
  'today.deleteA11y': 'Delete {name}',
  'today.actionsHint': 'Long-press for more',

  'stats.streak': 'Day streak',
  'stats.bestStreak': 'Best streak',
} as const;

export type StringKey = keyof typeof en;

const el: Partial<Record<StringKey, string>> = {
  'tabs.today': 'Σήμερα',
  'tabs.stats': 'Στατιστικά',
  'tabs.settings': 'Ρυθμίσεις',

  'common.save': 'Αποθήκευση',
  'common.cancel': 'Άκυρο',
  'common.delete': 'Διαγραφή',
  'common.edit': 'Επεξεργασία',
  'common.archive': 'Αρχειοθέτηση',
  'common.unarchive': 'Επαναφορά',
  'common.newHabit': 'Νέα συνήθεια',

  'today.morning': 'Καλημέρα',
  'today.afternoon': 'Καλό απόγευμα',
  'today.evening': 'Καλησπέρα',
  'today.progress': '{done} από {total}',
  'today.allDone': 'Όλα έγιναν για σήμερα. Ξεκουράσου.',
  'today.keepGoing': 'Ένα μικρό βήμα τη φορά.',
  'today.emptyTitle': 'Ξεκίνα με κάτι μικρό',
  'today.emptyBody': 'Μία συνήθεια αρκεί. Τα μικρά βήματα κλείνουν κύκλους.',
  'today.freeTitle': 'Ελεύθερη μέρα',
  'today.freeBody': 'Τίποτα προγραμματισμένο για σήμερα. Απόλαυσέ το.',
  'today.weekProgress': '{done}/{target} αυτή την εβδομάδα',
  'today.streak': '{n} στη σειρά',
  'today.markDone': 'Ολοκλήρωση: {name}',
  'today.markUndone': 'Αναίρεση: {name}',

  'notif.offTitle': 'Οι υπενθυμίσεις είναι κλειστές',
  'notif.offBody': 'Άνοιξέ τες και θα σου θυμίζουμε, ευγενικά.',
  'notif.enable': 'Ενεργοποίηση',
  'notif.openSettings': 'Άνοιγμα ρυθμίσεων',
  'notif.deniedHint': 'Οι ειδοποιήσεις είναι μπλοκαρισμένες. Μπορείς να τις επιτρέψεις από τις ρυθμίσεις συστήματος.',
  'notif.channel': 'Υπενθυμίσεις',
  'notif.body': 'Μια μικρή στιγμή για σένα.',
  'notif.explain':
    'Το Kyklos στέλνει μία ήσυχη τοπική υπενθύμιση ανά συνήθεια, την ώρα που διαλέγεις. Τίποτα δεν φεύγει από το κινητό σου.',

  'form.newTitle': 'Νέα συνήθεια',
  'form.editTitle': 'Επεξεργασία',
  'form.name': 'Όνομα',
  'form.namePlaceholder': 'π.χ. Διάβασμα',
  'form.icon': 'Εικονίδιο',
  'form.color': 'Χρώμα',
  'form.schedule': 'Πρόγραμμα',
  'form.reminder': 'Υπενθύμιση',
  'form.reminderOn': 'Θύμισέ μου',
  'form.hour': 'Ώρα',
  'form.minute': 'Λεπτά',
  'form.nameRequired': 'Δώσε ένα όνομα',
  'form.dayRequired': 'Διάλεξε τουλάχιστον μία μέρα',
  'form.timesPerWeek': 'Φορές την εβδομάδα',
  'form.everyNDays': 'Κάθε πόσες μέρες',

  'schedule.daily': 'Κάθε μέρα',
  'schedule.weekly': 'Φορές τη βδομάδα',
  'schedule.weekdays': 'Συγκεκριμένες μέρες',
  'schedule.interval': 'Κάθε Ν μέρες',
  'schedule.weeklySummary': '{n}× την εβδομάδα',
  'schedule.intervalSummary': 'Κάθε {n} μέρες',

  'detail.current': 'Τρέχον σερί',
  'detail.best': 'Καλύτερο σερί',
  'detail.rate': 'Ποσοστό 30 ημ.',
  'detail.history': 'Τελευταίες 17 εβδομάδες',
  'detail.archived': 'Σε αρχείο — το ιστορικό μένει, χωρίς υπενθυμίσεις.',
  'detail.deleteTitle': 'Διαγραφή συνήθειας;',
  'detail.deleteBody': 'Θα χαθεί και το ιστορικό της. Αν θέλεις να το κρατήσεις, κάνε αρχειοθέτηση.',
  'detail.notFound': 'Αυτή η συνήθεια δεν υπάρχει πια.',
  'detail.legendDone': 'Έγινε',
  'detail.legendMissed': 'Ανοιχτό',
  'detail.checkins': '{n} ολοκληρώσεις',

  'stats.total': 'Σύνολο ολοκληρώσεων',
  'stats.thisWeek': 'Αυτή την εβδομάδα',
  'stats.weeks': 'Τελευταίες 8 εβδομάδες',
  'stats.habits': 'Οι συνήθειές σου',
  'stats.emptyTitle': 'Τα στατιστικά μεγαλώνουν μαζί σου',
  'stats.emptyBody': 'Ολοκλήρωσε μία συνήθεια σήμερα και η πρώτη μπάρα θα εμφανιστεί εδώ.',
  'stats.streakShort': 'σερί {n}',

  'settings.appearance': 'Εμφάνιση',
  'settings.system': 'Σύστημα',
  'settings.light': 'Φωτεινό',
  'settings.dark': 'Σκοτεινό',
  'settings.language': 'Γλώσσα',
  'settings.notifications': 'Υπενθυμίσεις',
  'settings.notifOn': 'Ενεργές',
  'settings.notifOff': 'Κλειστές',
  'settings.data': 'Τα δεδομένα σου',
  'settings.export': 'Εξαγωγή δεδομένων (JSON)',
  'settings.exportHint': 'Πλήρες αντίγραφο των συνηθειών και των ολοκληρώσεων.',
  'settings.exportFailed': 'Η εξαγωγή δεν πέτυχε αυτή τη φορά. Δοκίμασε ξανά.',
  'settings.archived': 'Αρχειοθετημένες',
  'settings.archivedNone': 'Τίποτα στο αρχείο.',
  'settings.about': 'Σχετικά',
  'settings.aboutBody':
    'Το Kyklos είναι ένα ήσυχο εργαλείο για συνήθειες. Χωρίς λογαριασμούς, διαφημίσεις ή παρακολούθηση — όλα μένουν σε αυτή τη συσκευή.',
  'settings.version': 'Έκδοση {v}',

  'today.backToToday': 'Πίσω στο σήμερα',
  'today.pastHint': 'Ξέχασες να το σημειώσεις; Μπορείς να συμπληρώσεις οποιαδήποτε από τις τελευταίες 7 μέρες.',
  'today.streakKeep': '{n} στη σειρά · συνέχισέ το σήμερα',
  'today.perfectDays': 'μέρες στη σειρά με όλα ολοκληρωμένα',
  'today.dayA11y': '{date}: {done} από {total}',
  'today.restDay': 'Τίποτα δεν ήταν προγραμματισμένο αυτή τη μέρα.',

  'milestone.3': 'Τρεις στη σειρά. Ο κύκλος ξεκίνησε.',
  'milestone.7': 'Μια ολόκληρη εβδομάδα. Ωραίος ρυθμός.',
  'milestone.14': 'Δύο εβδομάδες. Γίνεται δικό σου.',
  'milestone.21': 'Τρεις εβδομάδες συνέπειας.',
  'milestone.30': 'Ένας μήνας από μικρά βήματα.',
  'milestone.100': 'Εκατό. Αθόρυβα αξιοσημείωτο.',
  'milestone.365': 'Ένας ολόκληρος χρόνος. Ευχαριστούμε που είσαι εδώ.',
  'milestone.generic': '{n} στη σειρά. Μπράβο σου.',

  'streak.inARow': 'στη σειρά',
  'streak.next': 'Επόμενος στόχος: {n}',
  'streak.best': 'Καλύτερο: {n}',

  'detail.total': 'Ολοκληρώσεις',
  'detail.editA11y': 'Επεξεργασία συνήθειας',

  'schedule.dailyHint': 'Όλες τις μέρες',
  'schedule.weekdaysHint': 'Εσύ διαλέγεις μέρες',
  'schedule.weeklyHint': 'Όποιες μέρες, Χ φορές',
  'schedule.intervalHint': 'Κάθε 2, 3… μέρες',

  'stats.perfect': 'Ολοκληρωμένες μέρες στη σειρά',
  'stats.rate30': 'Ποσοστό 30 ημερών',

  'settings.privacyShort': 'Χωρίς λογαριασμούς. Χωρίς παρακολούθηση. Τα δεδομένα σου μένουν στο κινητό.',
  'settings.import': 'Επαναφορά από αντίγραφο',
  'settings.importHint': 'Αντικαθιστά ό,τι υπάρχει στο κινητό με ένα αντίγραφο JSON του Kyklos.',
  'settings.importTitle': 'Αντικατάσταση όλων;',
  'settings.importBody':
    'Το αντίγραφο ({date}) έχει {habits} συνήθειες και {checkins} ολοκληρώσεις. Ό,τι υπάρχει τώρα στο κινητό θα αντικατασταθεί.',
  'settings.importConfirm': 'Αντικατάσταση',
  'settings.importDone': 'Η επαναφορά ολοκληρώθηκε. Καλώς ήρθες πίσω.',
  'settings.importInvalid': 'Αυτό το αρχείο δεν μοιάζει με αντίγραφο του Kyklos, οπότε δεν άλλαξε τίποτα.',
  'settings.deleteAll': 'Διαγραφή όλων των δεδομένων',
  'settings.deleteAllHint': 'Αφαιρεί κάθε συνήθεια και ολοκλήρωση από αυτό το κινητό.',
  'settings.deleteAllTitle': 'Διαγραφή όλων;',
  'settings.deleteAllBody':
    'Όλες οι συνήθειες και το ιστορικό τους θα διαγραφούν οριστικά από αυτό το κινητό. Ίσως θέλεις πρώτα να κάνεις εξαγωγή αντιγράφου.',
  'settings.deleteAllConfirm': 'Διαγραφή όλων',
  'settings.deleted': 'Όλα διαγράφηκαν. Μια καινούργια αρχή.',
  'settings.legal': 'Νομικά',
  'settings.privacy': 'Πολιτική απορρήτου',
  'settings.terms': 'Όροι χρήσης',
  'settings.licenses': 'Άδειες ανοιχτού λογισμικού',

  'legal.updated': 'Ισχύει από {date}',
  'licenses.intro': 'Το Kyklos βασίζεται σε αυτά τα έργα ανοιχτού λογισμικού. Ευχαριστούμε τους δημιουργούς τους.',

  'error.title': 'Κάτι δεν άνοιξε σωστά',
  'error.body': 'Κλείσε εντελώς το Kyklos και άνοιξέ το ξανά. Αν επαναληφθεί, συνήθως βοηθά μια επανεκκίνηση του κινητού.',
  'error.retry': 'Δοκίμασε ξανά',

  'seed.read': 'Διάβασμα',
  'seed.water': 'Ένα ποτήρι νερό',
  'seed.walk': 'Περπάτημα',

  'streak.unit': 'μέρες σερί',
  'streak.unitOne': 'μέρα σερί',
  'streak.habitUnit': 'στη σειρά',
  'streak.lit': 'Η φωτιά καίει. Τα λέμε αύριο.',
  'streak.waiting': 'Ολοκλήρωσε μία συνήθεια σήμερα για να μη σβήσει η φωτιά.',
  'streak.out': 'Η φωτιά έσβησε. Μία συνήθεια σήμερα την ανάβει ξανά.',
  'streak.habitLit': 'Έγινε σήμερα. Η φωτιά καίει.',
  'streak.habitWaiting': 'Κάν’ το σήμερα για να συνεχίσει η φωτιά.',
  'streak.habitOut': 'Καμία φωτιά ακόμα. Ολοκλήρωσέ το για να ανάψει.',

  'rank.label': 'Βαθμίδα',
  'rank.title': 'Βαθμίδες',
  'rank.intro': 'Κράτα τη φωτιά αναμμένη κάθε μέρα για να ανεβαίνεις. Το καλύτερό σου σερί ξεκλειδώνει κάθε βαθμίδα για πάντα.',
  'rank.next': 'Ακόμα {n} για {rank}',
  'rank.max': 'Κορυφαία βαθμίδα. Θρύλος.',
  'rank.from': 'από {n} μέρες',
  'rank.fromOne': 'από την 1η μέρα',
  'rank.fromStart': 'εκεί που ξεκινά κάθε φωτιά',
  'rank.up': 'Νέα βαθμίδα: {rank}',
  'rank.now': 'Τώρα',

  'today.edit': 'Επεξεργασία',
  'today.editDone': 'Τέλος',
  'today.editHint': 'Πάτα μια συνήθεια για επεξεργασία ή τον κάδο για διαγραφή.',
  'today.addHabit': 'Προσθήκη συνήθειας',
  'today.listTitle': 'Σήμερα',
  'today.doneOf': '{done} από {total}',
  'today.saveFailed': 'Δεν αποθηκεύτηκε. Δοκίμασε ξανά.',
  'today.deleteA11y': 'Διαγραφή: {name}',
  'today.actionsHint': 'Κράτα πατημένο για περισσότερα',

  'stats.streak': 'Σερί ημερών',
  'stats.bestStreak': 'Καλύτερο σερί',
};

export type Language = 'el' | 'en';

const tables: Record<Language, Partial<Record<StringKey, string>>> = { el, en };

// Weekday labels indexed like Date#getDay (0 = Sunday).
const weekdaysShort: Record<Language, string[]> = {
  el: ['Κυ', 'Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
};

export const LANGUAGE_NAMES: Record<Language, string> = { el: 'Ελληνικά', en: 'English' };

export type Translator = ((key: StringKey, vars?: Record<string, string | number>) => string) & {
  lang: Language;
  weekday: (day: number) => string;
  locale: string;
};

export function makeTranslator(lang: Language): Translator {
  const table = tables[lang];
  const t = ((key, vars) => {
    let s: string = table[key] ?? en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  }) as Translator;
  t.lang = lang;
  t.weekday = (day) => weekdaysShort[lang][day];
  t.locale = lang === 'el' ? 'el-GR' : 'en-GB';
  return t;
}

// ——— Legal documents ———
// Written to describe exactly what the app does. Keep in sync with the code:
// no network requests, no analytics, no accounts, local SQLite only.

export type LegalDocId = 'privacy' | 'terms';
export interface LegalDoc {
  title: string;
  sections: { heading: string; body: string[] }[];
}

export interface LegalFacts {
  publisher: string;
  contactEmail: string;
  effectiveDate: string;
}

function contactLine(lang: Language, f: LegalFacts): string {
  if (f.contactEmail) {
    return lang === 'el'
      ? `Για οποιαδήποτε ερώτηση ή αίτημα σχετικά με το απόρρητο, γράψε μας στο ${f.contactEmail}.`
      : `For any privacy question or request, write to ${f.contactEmail}.`;
  }
  return lang === 'el'
    ? 'Για οποιαδήποτε ερώτηση ή αίτημα, χρησιμοποίησε τα στοιχεία επικοινωνίας του προγραμματιστή στη σελίδα του Kyklos στο App Store ή στο Google Play.'
    : 'For any question or request, use the developer contact details on the Kyklos page in the App Store or Google Play.';
}

export function legalDoc(id: LegalDocId, lang: Language, f: LegalFacts): LegalDoc {
  const el = lang === 'el';
  const who = f.publisher;

  if (id === 'privacy') {
    return el
      ? {
          title: 'Πολιτική απορρήτου',
          sections: [
            {
              heading: 'Με μια ματιά',
              body: [
                'Το Kyklos δεν συλλέγει, δεν αποστέλλει και δεν πουλά κανένα δεδομένο. Δεν υπάρχουν λογαριασμοί, διαφημίσεις, analytics ή παρακολούθηση. Ό,τι γράφεις μένει στο κινητό σου.',
              ],
            },
            { heading: 'Ποιος είναι υπεύθυνος', body: [`Το Kyklos διατίθεται από: ${who}. ${contactLine(lang, f)}`] },
            {
              heading: 'Ποια δεδομένα υπάρχουν και πού',
              body: [
                'Τα ονόματα, τα εικονίδια, τα χρώματα και τα προγράμματα των συνηθειών σου, οι ώρες υπενθύμισης, οι ημερομηνίες που ολοκλήρωσες κάθε συνήθεια και οι προτιμήσεις σου (θέμα, γλώσσα).',
                'Όλα αποθηκεύονται μόνο τοπικά, σε μια βάση δεδομένων μέσα στην εφαρμογή, στη συσκευή σου. Η εφαρμογή δεν κάνει καμία σύνδεση στο διαδίκτυο και δεν έχουμε καμία πρόσβαση σε αυτά.',
              ],
            },
            {
              heading: 'Υπενθυμίσεις και άδειες',
              body: [
                'Οι υπενθυμίσεις είναι τοπικές ειδοποιήσεις που προγραμματίζει το ίδιο το κινητό σου. Δεν περνούν από κανέναν διακομιστή.',
                'Ζητάμε μόνο ό,τι χρειάζεται: ειδοποιήσεις (για τις υπενθυμίσεις), ακριβή ξυπνητήρια (για να έρχονται στην ώρα τους), δόνηση, και ενημέρωση μετά την εκκίνηση της συσκευής (για να επανέρχονται οι υπενθυμίσεις μετά από επανεκκίνηση). Μπορείς να τις αρνηθείς· η εφαρμογή λειτουργεί κανονικά και χωρίς υπενθυμίσεις.',
              ],
            },
            {
              heading: 'Αντίγραφα ασφαλείας',
              body: [
                'Όταν κάνεις «Εξαγωγή δεδομένων», δημιουργείται ένα αρχείο JSON που μοιράζεσαι εσύ, όπου εσύ επιλέξεις. Από εκεί και πέρα ισχύουν οι όροι της υπηρεσίας που διάλεξες.',
                'Αν έχεις ενεργοποιήσει αντίγραφα ασφαλείας συστήματος (iCloud ή Google), το λειτουργικό σου μπορεί να συμπεριλάβει σε αυτά τα δεδομένα της εφαρμογής, σύμφωνα με τις δικές σου ρυθμίσεις και τις πολιτικές της Apple ή της Google.',
              ],
            },
            {
              heading: 'Διαγνωστικά καταστημάτων',
              body: [
                'Αν έχεις επιλέξει να μοιράζεσαι διαγνωστικά με την Apple ή τη Google, αυτές μπορεί να μας δείξουν ανώνυμες αναφορές σφαλμάτων, σύμφωνα με τις δικές τους πολιτικές. Δεν περιέχουν τις συνήθειές σου.',
              ],
            },
            {
              heading: 'Τα δικαιώματά σου (ΓΚΠΔ)',
              body: [
                'Επειδή δεν λαμβάνουμε δεδομένα σου, τα ελέγχεις πλήρως εσύ: πρόσβαση και φορητότητα με την «Εξαγωγή δεδομένων», διόρθωση με την «Επεξεργασία», διαγραφή με τη «Διαγραφή όλων των δεδομένων» ή με την απεγκατάσταση της εφαρμογής.',
                'Έχεις πάντα δικαίωμα να υποβάλεις καταγγελία στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (www.dpa.gr) ή στην αρμόδια αρχή της χώρας σου.',
              ],
            },
            {
              heading: 'Παιδιά',
              body: ['Το Kyklos δεν απευθύνεται ειδικά σε παιδιά και δεν συλλέγει δεδομένα από κανέναν, οποιασδήποτε ηλικίας.'],
            },
            {
              heading: 'Αλλαγές',
              body: [
                `Αν αλλάξει αυτή η πολιτική, η νέα έκδοση θα εμφανίζεται εδώ με νέα ημερομηνία ισχύος. Τρέχουσα έκδοση: ${f.effectiveDate}.`,
              ],
            },
          ],
        }
      : {
          title: 'Privacy policy',
          sections: [
            {
              heading: 'At a glance',
              body: [
                'Kyklos does not collect, transmit or sell any data. There are no accounts, ads, analytics or tracking. What you write stays on your phone.',
              ],
            },
            { heading: 'Who is responsible', body: [`Kyklos is provided by: ${who}. ${contactLine(lang, f)}`] },
            {
              heading: 'What data exists and where',
              body: [
                'Your habit names, icons, colours and schedules, reminder times, the dates you completed each habit, and your preferences (theme, language).',
                'All of it is stored only locally, in a database inside the app on your device. The app makes no internet connections and we have no access to it.',
              ],
            },
            {
              heading: 'Reminders and permissions',
              body: [
                'Reminders are local notifications scheduled by your phone itself. They never pass through any server.',
                'We only ask for what is needed: notifications (for reminders), exact alarms (so they arrive on time), vibration, and a notice when the device starts (so reminders come back after a restart). You can decline any of them; the app works fine without reminders.',
              ],
            },
            {
              heading: 'Backups',
              body: [
                'When you use “Export data”, a JSON file is created that you share yourself, wherever you choose. From then on the terms of the service you picked apply.',
                'If you have system backups enabled (iCloud or Google), your operating system may include the app data in them, according to your settings and the policies of Apple or Google.',
              ],
            },
            {
              heading: 'Store diagnostics',
              body: [
                'If you chose to share diagnostics with Apple or Google, they may show us anonymous crash reports under their own policies. These do not contain your habits.',
              ],
            },
            {
              heading: 'Your rights (GDPR)',
              body: [
                'Because we receive none of your data, you control it completely: access and portability with “Export data”, rectification with “Edit”, erasure with “Delete all data” or by uninstalling the app.',
                'You always have the right to lodge a complaint with the Hellenic Data Protection Authority (www.dpa.gr) or the supervisory authority in your country.',
              ],
            },
            {
              heading: 'Children',
              body: ['Kyklos is not specifically aimed at children and collects no data from anyone, of any age.'],
            },
            {
              heading: 'Changes',
              body: [
                `If this policy changes, the new version will appear here with a new effective date. Current version: ${f.effectiveDate}.`,
              ],
            },
          ],
        };
  }

  return el
    ? {
        title: 'Όροι χρήσης',
        sections: [
          {
            heading: 'Συμφωνία',
            body: [
              `Χρησιμοποιώντας το Kyklos αποδέχεσαι αυτούς τους όρους. Η εφαρμογή διατίθεται από: ${who}. Αν την κατέβασες από το App Store, ισχύει επιπλέον η Τυπική Άδεια Χρήσης Τελικού Χρήστη (EULA) της Apple.`,
            ],
          },
          {
            heading: 'Άδεια χρήσης',
            body: [
              'Σου παρέχουμε προσωπική, μη αποκλειστική, μη μεταβιβάσιμη άδεια να χρησιμοποιείς την εφαρμογή στις συσκευές σου. Το όνομα, το λογότυπο και ο σχεδιασμός του Kyklos παραμένουν ιδιοκτησία του δημιουργού του.',
            ],
          },
          {
            heading: 'Όχι ιατρική συμβουλή',
            body: [
              'Το Kyklos είναι εργαλείο οργάνωσης συνηθειών. Δεν παρέχει ιατρική, ψυχολογική ή διατροφική συμβουλή και δεν υποκαθιστά επαγγελματία υγείας. Για θέματα υγείας απευθύνσου σε ειδικό.',
            ],
          },
          {
            heading: 'Τα δεδομένα σου',
            body: [
              'Τα δεδομένα ζουν μόνο στη συσκευή σου. Αν τη χάσεις, την επαναφέρεις ή απεγκαταστήσεις την εφαρμογή χωρίς αντίγραφο, τα δεδομένα χάνονται και δεν μπορούμε να τα ανακτήσουμε. Σου προτείνουμε να κάνεις κατά διαστήματα «Εξαγωγή δεδομένων».',
            ],
          },
          {
            heading: 'Υπενθυμίσεις',
            body: [
              'Οι υπενθυμίσεις εξαρτώνται από το λειτουργικό σύστημα, τις άδειες και τις ρυθμίσεις εξοικονόμησης μπαταρίας. Μπορεί να καθυστερήσουν ή να μην εμφανιστούν· μη βασίζεσαι σε αυτές για κάτι κρίσιμο, όπως φάρμακα.',
            ],
          },
          {
            heading: 'Εγγυήσεις και ευθύνη',
            body: [
              'Η εφαρμογή παρέχεται «ως έχει». Στον βαθμό που επιτρέπει ο νόμος, δεν ευθυνόμαστε για έμμεσες ζημίες ή απώλεια δεδομένων από τη χρήση της.',
              'Τίποτα σε αυτούς τους όρους δεν περιορίζει τα δικαιώματα που σου δίνει η υποχρεωτική νομοθεσία προστασίας καταναλωτή της Ελλάδας ή της Ευρωπαϊκής Ένωσης.',
            ],
          },
          {
            heading: 'Εφαρμοστέο δίκαιο',
            body: [
              'Οι όροι διέπονται από το ελληνικό δίκαιο. Αν είσαι καταναλωτής, διατηρείς την προστασία των υποχρεωτικών διατάξεων της χώρας διαμονής σου.',
            ],
          },
          {
            heading: 'Αλλαγές και επικοινωνία',
            body: [`Μπορεί να ενημερώσουμε τους όρους σε νέες εκδόσεις. Τρέχουσα έκδοση: ${f.effectiveDate}.`, contactLine(lang, f)],
          },
        ],
      }
    : {
        title: 'Terms of use',
        sections: [
          {
            heading: 'Agreement',
            body: [
              `By using Kyklos you accept these terms. The app is provided by: ${who}. If you downloaded it from the App Store, the Apple Standard End User License Agreement (EULA) also applies.`,
            ],
          },
          {
            heading: 'Licence',
            body: [
              'We grant you a personal, non-exclusive, non-transferable licence to use the app on your devices. The Kyklos name, logo and design remain the property of its creator.',
            ],
          },
          {
            heading: 'Not medical advice',
            body: [
              'Kyklos is a tool for organising habits. It does not provide medical, psychological or nutritional advice and does not replace a health professional. For health matters, consult a specialist.',
            ],
          },
          {
            heading: 'Your data',
            body: [
              'Your data lives only on your device. If you lose or reset it, or uninstall the app without a backup, the data is gone and we cannot recover it. We suggest using “Export data” from time to time.',
            ],
          },
          {
            heading: 'Reminders',
            body: [
              'Reminders depend on the operating system, permissions and battery-saving settings. They may be delayed or not appear; do not rely on them for anything critical, such as medication.',
            ],
          },
          {
            heading: 'Warranties and liability',
            body: [
              'The app is provided “as is”. To the extent permitted by law, we are not liable for indirect damages or data loss arising from its use.',
              'Nothing in these terms limits the rights you have under mandatory consumer-protection law of Greece or the European Union.',
            ],
          },
          {
            heading: 'Governing law',
            body: [
              'These terms are governed by Greek law. If you are a consumer, you keep the protection of the mandatory provisions of your country of residence.',
            ],
          },
          {
            heading: 'Changes and contact',
            body: [`We may update these terms in new versions. Current version: ${f.effectiveDate}.`, contactLine(lang, f)],
          },
        ],
      };
}
