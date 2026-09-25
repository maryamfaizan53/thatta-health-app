import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ur" | "sd";
export type L = { en: string; ur: string; sd: string };

export const LANGS: { id: Lang; name: string; speech: string }[] = [
  { id: "sd", name: "سنڌي", speech: "sd-PK" },
  { id: "ur", name: "اردو", speech: "ur-PK" },
  { id: "en", name: "English", speech: "en-US" },
];

export const TALUKAS = ["Thatta", "Mirpur Sakro", "Ghorabari", "Keti Bandar"] as const;
export type Taluka = (typeof TALUKAS)[number];

export const ui = {
  emergencyStrip: {
    en: "🚑 Emergency? Call 1122 — free ambulance",
    ur: "🚑 ایمرجنسی؟ 1122 پر کال کریں — مفت ایمبولینس",
    sd: "🚑 ايمرجنسي؟ 1122 تي فون ڪريو — مفت ايمبولينس",
  },
  greeting: {
    en: "Salaam! How can I help?",
    ur: "سلام! میں کیا مدد کر سکتا ہوں؟",
    sd: "سلام! آئون ڪيئن مدد ڪري سگهان؟",
  },
  micPrompt: {
    en: "Tell me what's wrong",
    ur: "بتائیں، کیا تکلیف ہے؟",
    sd: "ٻڌايو، ڪهڙي تڪليف آهي؟",
  },
  typeProblem: {
    en: "Type the problem here…",
    ur: "تکلیف یہاں لکھیں…",
    sd: "تڪليف هتي لکو…",
  },
  find: { en: "Find", ur: "تلاش کریں", sd: "ڳوليو" },
  close: { en: "Close", ur: "بند کریں", sd: "بند ڪريو" },
  chooseLanguage: {
    en: "Choose your language",
    ur: "اپنی زبان منتخب کریں",
    sd: "پنهنجي ٻولي چونڊيو",
  },
  chooseArea: {
    en: "Which area are you in?",
    ur: "آپ کس علاقے میں ہیں؟",
    sd: "توهان ڪهڙي علائقي ۾ آهيو؟",
  },
  doctorAdvice: {
    en: "📞 Free doctor advice: 1123",
    ur: "📞 مفت ڈاکٹری مشورہ: 1123",
    sd: "📞 مفت ڊاڪٽري صلاح: 1123",
  },
  home: { en: "Home", ur: "ہوم", sd: "گهر" },
  hospitals: { en: "Hospitals", ur: "ہسپتال", sd: "اسپتال" },
  about: { en: "About", ur: "تعارف", sd: "تعارف" },
  whoIsSick: {
    en: "Who is sick?",
    ur: "کون بیمار ہے؟",
    sd: "ڪير بيمار آهي؟",
  },
  me: { en: "Me", ur: "میں", sd: "آئون" },
  myChild: { en: "My child", ur: "میرا بچہ", sd: "منهنجو ٻار" },
  someoneElse: { en: "Someone else", ur: "کوئی اور", sd: "ٻيو ڪو" },
  ageQuestion: { en: "What is the age?", ur: "عمر کیا ہے؟", sd: "عمر ڪيتري آهي؟" },
  months: { en: "Months", ur: "مہینے", sd: "مهينا" },
  years: { en: "Years", ur: "سال", sd: "سال" },
  sexQuestion: { en: "Male or female?", ur: "مرد یا عورت؟", sd: "مرد يا عورت؟" },
  male: { en: "Male", ur: "مرد", sd: "مرد" },
  female: { en: "Female", ur: "عورت", sd: "عورت" },
  pregnantQuestion: {
    en: "Are you / is she pregnant?",
    ur: "کیا آپ / وہ حاملہ ہیں؟",
    sd: "ڇا توهان / هوءَ حامله آهي؟",
  },
  yes: { en: "Yes", ur: "ہاں", sd: "ها" },
  no: { en: "No", ur: "نہیں", sd: "نه" },
  notSure: { en: "Not sure", ur: "پتہ نہیں", sd: "خبر ناهي" },
  sinceWhen: {
    en: "Since when?",
    ur: "کب سے؟",
    sd: "ڪڏهن کان؟",
  },
  today: { en: "Today", ur: "آج", sd: "اڄ" },
  day1: { en: "1 day", ur: "1 دن", sd: "1 ڏينهن" },
  day2: { en: "2 days", ur: "2 دن", sd: "2 ڏينهن" },
  day3: { en: "3 days", ur: "3 دن", sd: "3 ڏينهن" },
  days47: { en: "4–7 days", ur: "4–7 دن", sd: "4–7 ڏينهن" },
  weekPlus: { en: "More than a week", ur: "ایک ہفتے سے زیادہ", sd: "هفتي کان وڌيڪ" },
  warningSigns: {
    en: "Does the patient have any of these?",
    ur: "کیا مریض کو ان میں سے کچھ ہے؟",
    sd: "ڇا مريض کي انهن مان ڪجهه آهي؟",
  },
  anyOfThese: {
    en: "Any of these?",
    ur: "ان میں سے کچھ؟",
    sd: "ڇا انهن مان ڪجهه آهي؟",
  },
  noneOfThese: { en: "None of these", ur: "ان میں سے کچھ نہیں", sd: "انهن مان ڪجهه نه" },
  continue: { en: "Continue", ur: "آگے بڑھیں", sd: "اڳتي وڌو" },
  back: { en: "Back", ur: "واپس", sd: "واپس" },
  listen: { en: "🔊 Listen", ur: "🔊 سنیں", sd: "🔊 ٻڌو" },
  shareWhatsApp: { en: "Share on WhatsApp", ur: "واٹس ایپ پر شیئر کریں", sd: "واٽس ايپ تي موڪليو" },
  doThisNow: { en: "Do this now", ur: "ابھی یہ کریں", sd: "هاڻي اهو ڪريو" },
  doNot: { en: "Do NOT", ur: "ہرگز نہ کریں", sd: "ڪڏهن به نه ڪريو" },
  homeCare: { en: "Home care", ur: "گھریلو نگہداشت", sd: "گهر ۾ سنڀال" },
  medicines: { en: "Medicines", ur: "ادویات", sd: "دوائون" },
  showAtStore: { en: "Show at medical store", ur: "میڈیکل اسٹور پر دکھائیں", sd: "ميڊيڪل دڪان تي ڏيکاريو" },
  goToDoctorIf: {
    en: "Go to a doctor if…",
    ur: "ڈاکٹر کے پاس جائیں اگر…",
    sd: "ڊاڪٽر وٽ وڃو جيڪڏهن…",
  },
  nearestHospitals: { en: "Nearest hospitals", ur: "قریبی ہسپتال", sd: "ويجهي اسپتال" },
  call: { en: "Call", ur: "کال", sd: "فون" },
  directions: { en: "Directions", ur: "راستہ", sd: "رستو" },
  callFirstASV: {
    en: "Call first to ask: anti-snake venom available?",
    ur: "پہلے فون کر کے پوچھیں: اینٹی سنیک وینم موجود ہے؟",
    sd: "پهريان فون ڪري پڇو: ننگ جو زهر ختم ڪندڙ دوا موجود آهي؟",
  },
  callFirstARV: {
    en: "Ask: rabies vaccine available?",
    ur: "پوچھیں: کتے کے کاٹنے کی ویکسین موجود ہے؟",
    sd: "پڇو: ڪتي جي چڪ جي ويڪسين موجود آهي؟",
  },
  asvNotVerified: {
    en: "Anti-snake venom: not verified — call first",
    ur: "اینٹی سنیک وینم: تصدیق نہیں — پہلے فون کریں",
    sd: "ننگ جي دوا: تصديق ناهي — پهريان فون ڪريو",
  },
  arvNotVerified: {
    en: "Rabies vaccine: not verified — call first",
    ur: "کتے کے کاٹنے کی ویکسین: تصدیق نہیں — پہلے فون کریں",
    sd: "ڪتي جي چڪ جي ويڪسين: تصديق ناهي — پهريان فون ڪريو",
  },
  changeArea: { en: "Change area", ur: "علاقہ بدلیں", sd: "علائقو بدلايو" },
  howItWorks: { en: "How it works", ur: "یہ کیسے کام کرتا ہے", sd: "هي ڪيئن ڪم ڪري ٿو" },
  step1: {
    en: "You tell us (tap or speak)",
    ur: "آپ بتاتے ہیں (دبائیں یا بولیں)",
    sd: "توهان ٻڌايو (دٻايو يا ڳالهايو)",
  },
  step2: {
    en: "Doctor-reviewed rules decide how urgent it is — AI never decides",
    ur: "ڈاکٹروں کے جائزہ شدہ اصول فیصلہ کرتے ہیں — AI کبھی فیصلہ نہیں کرتا",
    sd: "ڊاڪٽرن جي جاچيل ضابطا فيصلو ڪن ٿا — AI ڪڏهن به فيصلو نه ڪري ٿو",
  },
  step3: {
    en: "We guide you and connect you to 1122 / 1123",
    ur: "ہم آپ کی رہنمائی کرتے ہیں اور 1122 / 1123 سے جوڑتے ہیں",
    sd: "اسان توهان جي رهنمائي ڪريون ٿا ۽ 1122 / 1123 سان ڳنڍيون ٿا",
  },
  reviewedBy: { en: "Reviewed by", ur: "جائزہ لینے والے", sd: "جاچ ڪندڙ" },
  sources: { en: "Sources and credits", ur: "ذرائع اور کریڈٹ", sd: "ذريعا ۽ کريڊٽ" },
  darkMode: { en: "Dark mode", ur: "ڈارک موڈ", sd: "ڊارڪ موڊ" },
  changeLanguage: { en: "Change language", ur: "زبان بدلیں", sd: "ٻولي بدلايو" },
  reasons: { en: "Why:", ur: "وجہ:", sd: "سبب:" },
  impactToday: {
    en: "Today this app helped {n} people on this phone",
    ur: "آج اس ایپ نے اس فون پر {n} لوگوں کی مدد کی",
    sd: "اڄ هن ايپ هن فون تي {n} ماڻهن جي مدد ڪئي",
  },
  startOver: { en: "Start over", ur: "دوبارہ شروع کریں", sd: "ٻيهر شروع ڪريو" },
} satisfies Record<string, L>;

export type UiKey = keyof typeof ui;

export function t(key: UiKey, lang: Lang, vars?: Record<string, string | number>): string {
  let s: string = ui[key][lang] ?? ui[key].en;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}

export function lt(l: L | undefined, lang: Lang): string {
  if (!l) return "";
  return l[lang] ?? l.en;
}

const LS = { lang: "ss_lang", taluka: "ss_taluka", dark: "ss_dark" };

export function speak(text: string, lang: Lang) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LANGS.find((l) => l.id === lang)?.speech ?? "en-US";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

export function stopSpeak() {
  if (typeof window !== "undefined" && "speechSynthesis" in window)
    window.speechSynthesis.cancel();
}

type AppState = {
  lang: Lang | null;
  taluka: Taluka | null;
  dark: boolean;
  ready: boolean;
  setLang: (l: Lang) => void;
  setTaluka: (t: Taluka) => void;
  toggleDark: () => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang | null>(null);
  const [taluka, setTalukaState] = useState<Taluka | null>(null);
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const l = localStorage.getItem(LS.lang) as Lang | null;
    const ta = localStorage.getItem(LS.taluka) as Taluka | null;
    const d = localStorage.getItem(LS.dark);
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const isDark = d === null ? !!prefersDark : d === "1";
    setLangState(l);
    setTalukaState(ta);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    setReady(true);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(LS.lang, l);
  }, []);
  const setTaluka = useCallback((ta: Taluka) => {
    setTalukaState(ta);
    localStorage.setItem(LS.taluka, ta);
  }, []);
  const toggleDark = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem(LS.dark, next ? "1" : "0");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ lang, taluka, dark, ready, setLang, setTaluka, toggleDark }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside AppProvider");
  return v;
}

/** Language for UI display, defaulting to English before onboarding. */
export function useLang(): Lang {
  return useApp().lang ?? "en";
}
