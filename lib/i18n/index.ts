// Every user-facing string lives here. Kyklos is English-only.

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
  'today.allDone': 'All done for today. Rest well.',
  'today.emptyTitle': 'Start with something small',
  'today.emptyBody': 'One habit is enough. Small steps make full circles.',
  'today.freeTitle': 'A free day',
  'today.freeBody': 'Nothing scheduled for today. Enjoy it.',
  'today.weekProgress': '{done}/{target} this week',
  'today.perDayProgress': '{done} of {total} today',
  'today.countA11y': '{name}: {done} of {total}. Tap to add one, hold to take one back.',
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
  'form.perDay': 'Times a day',
  'form.perDayHint': 'For things like glasses of water. Each tap on the circle counts one; hold it to take one back.',
  'form.everyNDays': 'Every how many days',

  'schedule.daily': 'Every day',
  'schedule.weekly': 'Times a week',
  'schedule.weekdays': 'Specific days',
  'schedule.interval': 'Every N days',
  'schedule.weeklySummary': '{n}× a week',
  'schedule.perDay': '{n}× a day',
  'schedule.intervalSummary': 'Every {n} days',

  'detail.rate': '30-day rate',
  'detail.history': 'Last 17 weeks',
  'detail.archived': 'Archived — history kept, no reminders.',
  'detail.deleteTitle': 'Delete this habit?',
  'detail.deleteBody': 'Its history will be gone too. Archive it instead if you would like to keep it.',
  'detail.notFound': 'This habit is no longer here.',
  'detail.legendDone': 'Done',
  'detail.legendMissed': 'Open',
  'detail.checkins': '{n} check-ins',

  'stats.thisWeek': 'This week',
  'stats.weeks': 'Last 8 weeks',
  'stats.habits': 'Your habits',
  'stats.emptyTitle': 'Your stats will grow with you',
  'stats.emptyBody': 'Check off a habit today and the first bar appears here.',

  'settings.appearance': 'Appearance',
  'settings.system': 'System',
  'settings.light': 'Light',
  'settings.dark': 'Dark',
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

  'streak.best': 'Best: {n}',

  'detail.total': 'Check-ins',
  'detail.editA11y': 'Edit habit',

  'schedule.dailyHint': 'Every single day',
  'schedule.weekdaysHint': 'You pick the days',
  'schedule.weeklyHint': 'Any days, X times',
  'schedule.intervalHint': 'Every 2, 3… days',

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
  'seed.water': 'Drink water',
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

  'widget.today': '{done} of {total} today',
  'widget.todayShort': '{done}/{total} today',
  'widget.nothingDue': 'Nothing due today',
  'widget.more': '+{n} more',
  'widget.streakA11y': '{n} day streak, {rank}. {done} of {total} today.',
  'widget.markDone': 'Mark {name} done',
  'widget.undo': '{name}, done. Tap to undo.',
  'today.saveFailed': 'That did not save. Please try again.',
  'today.deleteA11y': 'Delete {name}',
  'today.actionsHint': 'Long-press for more',

  'stats.streak': 'Day streak',
  'stats.bestStreak': 'Best streak',
} as const;

export type StringKey = keyof typeof en;


// Weekday labels indexed like Date#getDay (0 = Sunday).
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export type Translator = ((key: StringKey, vars?: Record<string, string | number>) => string) & {
  weekday: (day: number) => string;
  /** Dates read "Saturday 26 September" with a 24-hour clock. */
  locale: string;
};

export function makeTranslator(): Translator {
  const t = ((key, vars) => {
    let s: string = en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  }) as Translator;
  t.weekday = (day) => WEEKDAYS[day];
  t.locale = 'en-GB';
  return t;
}

/** The app's one translator. */
export const t = makeTranslator();

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

function contactLine(f: LegalFacts): string {
  if (f.contactEmail) return `For any privacy question or request, write to ${f.contactEmail}.`;
  return 'For any question or request, use the developer contact details on the Kyklos page in the App Store or Google Play.';
}

export function legalDoc(id: LegalDocId, f: LegalFacts): LegalDoc {
  const who = f.publisher;

  if (id === 'privacy') {
    return {
          title: 'Privacy policy',
          sections: [
            {
              heading: 'At a glance',
              body: [
                'Kyklos does not collect, transmit or sell any data. There are no accounts, ads, analytics or tracking. What you write stays on your phone.',
              ],
            },
            { heading: 'Who is responsible', body: [`Kyklos is provided by: ${who}. ${contactLine(f)}`] },
            {
              heading: 'What data exists and where',
              body: [
                'Your habit names, icons, colours and schedules, reminder times, the dates you completed each habit, and your theme preference.',
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

  return {
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
            body: [`We may update these terms in new versions. Current version: ${f.effectiveDate}.`, contactLine(f)],
          },
        ],
      };
}
