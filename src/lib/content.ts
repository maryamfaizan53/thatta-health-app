import type { L } from "./i18n";

export type Tier = "green" | "yellow" | "red";

export type Rule = { if: string; tier: Tier; why: L };
export type Flag = { id: string; tier: Tier; label: L };

export type Medicine = {
  name: L;
  note: L;
  min_age_months: number;
  max_age_months?: number;
  pregnancy_ok: boolean;
};

export type Condition = {
  id: string;
  icon: string; // fluent emoji asset slug
  emoji: string;
  base_tier: Tier;
  max_home_days: number;
  label: L;
  urgent_label?: L;
  keywords: string[]; // english keywords for the text search box
  rules: Rule[];
  flags: Flag[];
  meds: string[];
  red_first_aid?: L[];
  home: L[];
  dont: L[];
};

export type Content = {
  version: number;
  reviewed_by: string;
  disclaimer: L;
  tiers: Record<Tier, { title: L; action: L }>;
  global_flags: Flag[];
  pregnancy: { min_tier: Tier; why: L };
  too_long_why: L;
  emergency_numbers: { number: string; label: L }[];
  medicines: Record<string, Medicine>;
  conditions: Condition[];
};

export const content: Content = {
  version: 1,
  reviewed_by: "",
  disclaimer: {
    en: "Sehat Saathi is not a doctor. It gives general first-aid guidance only. In an emergency always call 1122.",
    ur: "صحت ساتھی ڈاکٹر نہیں ہے۔ یہ صرف عمومی ابتدائی طبی امداد کی رہنمائی دیتا ہے۔ ایمرجنسی میں ہمیشہ 1122 پر کال کریں۔",
    sd: "صحت ساٿي ڊاڪٽر ناهي. هي صرف عام ابتدائي طبي مدد جي رهنمائي ڏئي ٿو. ايمرجنسي ۾ هميشه 1122 تي فون ڪريو.",
  },
  tiers: {
    red: {
      title: {
        en: "Emergency — go to hospital NOW",
        ur: "ایمرجنسی — ابھی ہسپتال جائیں",
        sd: "ايمرجنسي — هاڻي ئي اسپتال وڃو",
      },
      action: {
        en: "Call 1122 for a free ambulance or go to the nearest hospital immediately.",
        ur: "مفت ایمبولینس کے لیے 1122 پر کال کریں یا فوری طور پر قریبی ہسپتال جائیں۔",
        sd: "مفت ايمبولينس لاءِ 1122 تي فون ڪريو يا فوري طور تي ويجهي اسپتال وڃو.",
      },
    },
    yellow: {
      title: {
        en: "See a doctor within 24 hours",
        ur: "24 گھنٹوں کے اندر ڈاکٹر کو دکھائیں",
        sd: "24 ڪلاڪن اندر ڊاڪٽر کي ڏيکاريو",
      },
      action: {
        en: "Go to the nearest RHC or BHU, or call 1123 for free doctor advice.",
        ur: "قریبی RHC یا BHU جائیں، یا مفت ڈاکٹری مشورے کے لیے 1123 پر کال کریں۔",
        sd: "ويجهي RHC يا BHU وڃو، يا مفت ڊاڪٽري صلاح لاءِ 1123 تي فون ڪريو.",
      },
    },
    green: {
      title: {
        en: "You can care for this at home",
        ur: "آپ اس کی گھر پر دیکھ بھال کر سکتے ہیں",
        sd: "توهان هن جي گهر ۾ سنڀال ڪري سگهو ٿا",
      },
      action: {
        en: "Follow the home care steps below and watch for warning signs.",
        ur: "نیچے دیے گئے گھریلو نگہداشت کے طریقے اپنائیں اور خبردار کرنے والی علامات پر نظر رکھیں۔",
        sd: "ھيٺ ڏنل گھريلو سنڀال جا طريقا اپنايو ۽ خبردار ڪندڙ نشانين تي نظر رکو.",
      },
    },
  },
  global_flags: [
    {
      id: "unconscious",
      tier: "red",
      label: {
        en: "Unconscious or having fits",
        ur: "بے ہوش ہے یا دورے پڑ رہے ہیں",
        sd: "بيهوش آهي يا مرگي جا ڏورا پئجي رهيا آهن",
      },
    },
    {
      id: "breathing",
      tier: "red",
      label: {
        en: "Trouble breathing",
        ur: "سانس لینے میں تکلیف",
        sd: "ساه وٺڻ ۾ تڪليف",
      },
    },
    {
      id: "severe_bleeding",
      tier: "red",
      label: {
        en: "Bleeding that does not stop",
        ur: "خون بہنا بند نہیں ہو رہا",
        sd: "رت وهڻ بند ناهي ٿي رهيو",
      },
    },
    {
      id: "cannot_drink",
      tier: "red",
      label: {
        en: "Cannot drink or keep any fluids down",
        ur: "کچھ پی نہیں سکتا یا پییا ہوا اُلٹی کر دیتا ہے",
        sd: "ڪجهه به پي نٿو سگهي يا پيتل اُلٽي ڪري ڇڏي ٿو",
      },
    },
  ],
  pregnancy: {
    min_tier: "yellow",
    why: {
      en: "Pregnancy — a doctor should check any illness during pregnancy",
      ur: "حمل — حمل کے دوران ہر بیماری کا ڈاکٹر سے معائنہ ضروری ہے",
      sd: "حمل — حمل دوران هر بيماري جو ڊاڪٽر کان معائنو ضروري آهي",
    },
  },
  too_long_why: {
    en: "It has lasted too long for home care",
    ur: "یہ گھریلو علاج کے لیے بہت زیادہ دن ہو گئے ہیں",
    sd: "اهو گھريلو علاج لاءِ تمام گهڻا ڏينهن ٿي ويا آهن",
  },
  emergency_numbers: [
    {
      number: "1122",
      label: { en: "Free ambulance", ur: "مفت ایمبولینس", sd: "مفت ايمبولينس" },
    },
    {
      number: "1123",
      label: {
        en: "Free doctor advice, 24/7",
        ur: "مفت ڈاکٹری مشورہ، 24/7",
        sd: "مفت ڊاڪٽري صلاح، 24/7",
      },
    },
  ],
  medicines: {
    paracetamol: {
      name: { en: "Paracetamol (Panadol)", ur: "پیراسیٹامول (پیناڈول)", sd: "پيراسيٽامول (پيناڊول)" },
      note: {
        en: "For fever and pain. The pharmacist will give the right amount for age and weight.",
        ur: "بخار اور درد کے لیے۔ فارماسسٹ عمر اور وزن کے حساب سے صحیح مقدار دے گا۔",
        sd: "تاپ ۽ سور لاءِ. فارماسسٽ عمر ۽ وزن مطابق صحيح مقدار ڏيندو.",
      },
      min_age_months: 0,
      pregnancy_ok: true,
    },
    ors: {
      name: { en: "ORS sachet", ur: "او آر ایس (نمکول)", sd: "او آر ايس (نمکين)" },
      note: {
        en: "Mix one sachet in clean water as written on the packet. Give small sips often.",
        ur: "ایک پاکٹ صاف پانی میں پیکٹ کے مطابق ملائیں۔ تھوڑا تھوڑا کر کے اکثر پلائیں۔",
        sd: "هڪ پيکٽ صاف پاڻيءَ ۾ پيکٽ مطابق ملاو. ٿورو ٿورو ڪري اکثر پياريو.",
      },
      min_age_months: 0,
      pregnancy_ok: true,
    },
    zinc: {
      name: { en: "Zinc tablet (for children)", ur: "زنک گولی (بچوں کے لیے)", sd: "زنک گولي (ٻارن لاءِ)" },
      note: {
        en: "Helps children recover from diarrhea. The pharmacist will explain how to give it.",
        ur: "بچوں کو اسہال سے صحت یاب ہونے میں مدد دیتا ہے۔ فارماسسٹ طریقہ بتا دے گا۔",
        sd: "ٻارن کي اسهال کان صحتمند ٿيڻ ۾ مدد ڏئي ٿو. فارماسسٽ طريقو ٻڌائي ڇڏيندو.",
      },
      min_age_months: 6,
      max_age_months: 59,
      pregnancy_ok: false,
    },
    cetirizine: {
      name: { en: "Cetirizine", ur: "سیٹیریزین", sd: "سيٽيريزين" },
      note: {
        en: "For itching and allergy. The pharmacist will give the right amount for age.",
        ur: "خارش اور الرجی کے لیے۔ فارماسسٹ عمر کے حساب سے صحیح مقدار دے گا۔",
        sd: "خارش ۽ الرجي لاءِ. فارماسسٽ عمر مطابق صحيح مقدار ڏيندو.",
      },
      min_age_months: 24,
      pregnancy_ok: false,
    },
  },
  conditions: [
    {
      id: "fever",
      icon: "Thermometer/3D/thermometer_3d.png",
      emoji: "🌡️",
      base_tier: "green",
      max_home_days: 3,
      label: { en: "Fever", ur: "بخار", sd: "تاپ" },
      urgent_label: { en: "High fever", ur: "تیز بخار", sd: "تيز تاپ" },
      keywords: ["fever", "bukhar", "temperature", "hot"],
      rules: [
        {
          if: "age_months < 3",
          tier: "red",
          why: {
            en: "A baby under 3 months with fever needs a hospital now",
            ur: "3 ماہ سے کم عمر بچے کا بخار — فوری ہسپتال ضروری ہے",
            sd: "3 مهينن کان ننڍي ٻار جي تاپ — فوري اسپتال ضروري آهي",
          },
        },
        {
          if: "age_months < 12",
          tier: "yellow",
          why: {
            en: "A baby under 1 year with fever should see a doctor",
            ur: "ایک سال سے کم بچے کا بخار — ڈاکٹر کو دکھائیں",
            sd: "هڪ سال کان ننڍي ٻار جي تاپ — ڊاڪٽر کي ڏيکاريو",
          },
        },
      ],
      flags: [
        {
          id: "stiff_neck",
          tier: "red",
          label: { en: "Stiff neck or severe headache", ur: "گردن اکڑنا یا شدید سر درد", sd: "ڳچيءَ جو اکڙڻ يا سخت مٿيءَ جو سور" },
        },
        {
          id: "rash",
          tier: "red",
          label: { en: "Rash that does not fade when pressed", ur: "دبانے سے نہ مٹنے والے دانے", sd: "ڊٻائڻ سان نه مٽندڙ دانا" },
        },
        {
          id: "very_high",
          tier: "yellow",
          label: { en: "Very high fever or shivering fits", ur: "بہت تیز بخار یا کانپنا", sd: "تمام تيز تاپ يا ٽٽرڻ" },
        },
      ],
      meds: ["paracetamol"],
      home: [
        { en: "Give plenty of water and fluids", ur: "خوب پانی اور مائع پلائیں", sd: "ڊگهو پاڻي ۽ مائع پياريو" },
        { en: "Dress in light clothes; do not wrap in blankets", ur: "ہلکے کپڑے پہنائیں؛ کمبل میں نہ لپیٹیں", sd: "هلڪا ڪپڙا پهريو؛ ڪمبل ۾ نه ويڙهيو" },
        { en: "Wipe the body with a wet cloth (lukewarm water)", ur: "گیلے کپڑے سے جسم پونچھیں (نیم گرم پانی)", sd: "ٻيجل ڪپڙي سان جسم پوڇيو (اَدُو گرم پاڻي)" },
        { en: "Rest in a cool, airy room", ur: "ٹھنڈے، ہوا دار کمرے میں آرام", sd: "ٿڌي، هوادار ڪمري ۾ آرام" },
      ],
      dont: [
        { en: "Do not give aspirin to children", ur: "بچوں کو ایسپرین نہ دیں", sd: "ٻارن کي ايسپرين نه ڏيو" },
        { en: "Do not use cold water or ice on the body", ur: "جسم پر ٹھنڈا پانی یا برف نہ لگائیں", sd: "جسم تي ٿڌو پاڻي يا برف نه وجھو" },
      ],
    },
    {
      id: "cold",
      icon: "Sneezing%20face/3D/sneezing_face_3d.png",
      emoji: "🤧",
      base_tier: "green",
      max_home_days: 7,
      label: { en: "Cold & cough", ur: "نزلہ اور کھانسی", sd: "نزلو ۽ ڇنگھ" },
      keywords: ["cold", "cough", "flu", "nazla", "khansi", "sneeze"],
      rules: [
        {
          if: "age_months < 6",
          tier: "yellow",
          why: {
            en: "A baby under 6 months with cough should see a doctor",
            ur: "6 ماہ سے کم بچے کی کھانسی — ڈاکٹر کو دکھائیں",
            sd: "6 مهينن کان ننڍي ٻار جي ڇنگھ — ڊاڪٽر کي ڏيکاريو",
          },
        },
      ],
      flags: [
        {
          id: "fast_breathing",
          tier: "red",
          label: { en: "Breathing very fast or chest pulling in", ur: "بہت تیز سانس یا سینہ اندر دھنسنا", sd: "تمام تيز ساه يا ڇاتي اندر وڃڻ" },
        },
        {
          id: "blue_lips",
          tier: "red",
          label: { en: "Lips or face turning blue", ur: "ہونٹ یا چہرہ نیلا پڑنا", sd: "وٽ يا منهنجو نيرو ٿيڻ" },
        },
        {
          id: "chest_pain",
          tier: "yellow",
          label: { en: "Chest pain or coughing blood", ur: "سینے میں درد یا خون کی کھانسی", sd: "ڇاتي ۾ سور يا رت واري ڇنگھ" },
        },
      ],
      meds: ["paracetamol"],
      home: [
        { en: "Warm drinks: soup, warm water with honey (honey only over 1 year)", ur: "گرم مشروبات: شوربہ، شہد والا گرم پانی (شہد صرف 1 سال سے اوپر)", sd: "گرم مشروب: شوربو، ماکيءَ وارو گرم پاڻي (ماکي رڳو 1 سال کان مٿي)" },
        { en: "Steam: sit in a steamy bathroom for 10 minutes", ur: "بھاپ: بھاپ والے باتھ روم میں 10 منٹ بیٹھیں", sd: "بخار: بخار واري غسلخاني ۾ 10 منٽ ويهو" },
        { en: "Rest and keep warm", ur: "آرام کریں اور گرم رکھیں", sd: "آرام ڪريو ۽ گرم رکو" },
      ],
      dont: [
        { en: "Do not give honey to a baby under 1 year", ur: "1 سال سے کم بچے کو شہد نہ دیں", sd: "1 سال کان ننڍي ٻار کي ماکي نه ڏيو" },
        { en: "Do not buy antibiotics without a doctor", ur: "ڈاکٹر کے بغیر اینٹی بائیوٹک نہ خریدیں", sd: "ڊاڪٽر کان سواءِ اينٽي بائيٽڪ نه وٺو" },
      ],
    },
    {
      id: "diarrhea",
      icon: "Droplet/3D/droplet_3d.png",
      emoji: "💧",
      base_tier: "green",
      max_home_days: 2,
      label: { en: "Diarrhea (loose motions)", ur: "اسہال (دست)", sd: "اسهال (دست)" },
      keywords: ["diarrhea", "loose", "motions", "dast", "ishal", "stool"],
      rules: [
        {
          if: "age_months < 6",
          tier: "yellow",
          why: {
            en: "A baby under 6 months with diarrhea should see a doctor",
            ur: "6 ماہ سے کم بچے کا اسہال — ڈاکٹر کو دکھائیں",
            sd: "6 مهينن کان ننڍي ٻار جو اسهال — ڊاڪٽر کي ڏيکاريو",
          },
        },
      ],
      flags: [
        {
          id: "blood_stool",
          tier: "red",
          label: { en: "Blood in the stool", ur: "پاخانے میں خون", sd: "پاخاني ۾ رت" },
        },
        {
          id: "dehydrated",
          tier: "red",
          label: {
            en: "Very thirsty, no urine for many hours, sunken eyes",
            ur: "بہت پیاس، کئی گھنٹوں سے پیشاب نہیں، اندر دھنسی ہوئی آنکھیں",
            sd: "تمام ڇاڳ، ڪيترن ئي ڪلاڪن کان پيشاب نه، اندر ويل اکيون",
          },
        },
        {
          id: "many_motions",
          tier: "yellow",
          label: { en: "Many watery motions in one day", ur: "ایک دن میں کئی بار پانی جیسا پاخانا", sd: "هڪ ڏينهن ۾ ڪيتريون ڀيرا پاڻي وارو پاخانو" },
        },
      ],
      meds: ["ors", "zinc"],
      home: [
        { en: "Give ORS after every loose motion, small sips often", ur: "ہر دست کے بعد او آر ایس دیں، تھوڑا تھوڑا اکثر", sd: "هر دست کان پوءِ او آر ايس ڏيو، ٿورو ٿورو اکثر" },
        { en: "Keep breastfeeding babies", ur: "بچوں کو دودھ پلانا جاری رکھیں", sd: "ٻارن کي کير پيارڻ جاري رکو" },
        { en: "Give soft food: rice, banana, khichdi", ur: "نرم کھانا دیں: چاول، کیلا، کھچڑی", sd: "نرم کاڌو ڏيو: چانور، کيرو، کچڙي" },
        { en: "Wash hands with soap after toilet and before food", ur: "ٹائلٹ کے بعد اور کھانے سے پہلے صابن سے ہاتھ دھوئیں", sd: "ٽائليٽ کان پوءِ ۽ کاڌي کان اڳ صابن سان هٿ ڌُؤو" },
      ],
      dont: [
        { en: "Do not stop food or breast milk", ur: "کھانا یا دودھ بند نہ کریں", sd: "کاڌو يا کير بند نه ڪريو" },
        { en: "Do not give anti-diarrhea pills to children without a doctor", ur: "بچوں کو ڈاکٹر کے بغیر دست بند کرنے کی گولی نہ دیں", sd: "ٻارن کي ڊاڪٽر کان سواءِ دست بند ڪرڻ واري گولي نه ڏيو" },
      ],
    },
    {
      id: "heat",
      icon: "Hot%20face/3D/hot_face_3d.png",
      emoji: "🥵",
      base_tier: "yellow",
      max_home_days: 1,
      label: { en: "Heatstroke / heat illness", ur: "گرمی لگنا (لو)", sd: "گرمي لڳڻ (لو)" },
      keywords: ["heat", "heatstroke", "loo", "garmi", "sun"],
      rules: [],
      flags: [
        {
          id: "fainting",
          tier: "red",
          label: { en: "Fainting, confusion or strange behaviour", ur: "بے ہوشی، گھبراہٹ یا عجیب برتاؤ", sd: "بيهوشي، گهبراهٽ يا عجيب برتاؤ" },
        },
        {
          id: "hot_dry_skin",
          tier: "red",
          label: { en: "Skin very hot and dry, no sweating", ur: "جلد بہت گرم اور خشک، پسینہ نہیں", sd: "پوست تمام گرم ۽ سڪل، پسينو ناهي" },
        },
      ],
      meds: ["ors"],
      home: [
        { en: "Move to shade or a cool place immediately", ur: "فوری سائے یا ٹھنڈی جگہ لے جائیں", sd: "فوري طور تي ڇانءَ يا ٿڌي هنڌ کڻي وڃو" },
        { en: "Wet the body and fan air on it", ur: "جسم گیلا کریں اور ہوا جھلیں", sd: "جسم ٻيجو ڪريو ۽ هوا ڪريو" },
        { en: "Give ORS or water in small sips", ur: "او آر ایس یا پانی تھوڑا تھوڑا پلائیں", sd: "او آر ايس يا پاڻي ٿورو ٿورو پياريو" },
      ],
      dont: [
        { en: "Do not give very cold water to drink", ur: "بہت ٹھنڈا پانی نہ پلائیں", sd: "تمام ٿڌو پاڻي نه پياريو" },
        { en: "Do not leave the person alone in the sun", ur: "شخص کو دھوپ میں اکیلا نہ چھوڑیں", sd: "ماڻهو کي سج ۾ اڪيلو نه ڇڏيو" },
      ],
    },
    {
      id: "snakebite",
      icon: "Snake/3D/snake_3d.png",
      emoji: "🐍",
      base_tier: "red",
      max_home_days: 0,
      label: { en: "Snakebite", ur: "سانپ کا کاٹنا", sd: "ننگ جو چڪ" },
      keywords: ["snake", "bite", "saanp", "nang"],
      rules: [],
      flags: [],
      meds: [],
      red_first_aid: [
        { en: "Keep the person still and calm. Do not let them walk.", ur: "شخص کو ساکت اور پرسکون رکھیں۔ چلنے نہ دیں۔", sd: "ماڻهو کي بيحرڪت ۽ پرسڪون رکو. هلڻ نه ڏيو." },
        { en: "Remove rings, bangles and tight clothes near the bite", ur: "چاٹ کے قریب چھلے، چوڑیاں اور تنگ کپڑے اتار دیں", sd: "چڪ ويجهو زيور، ڇوڙيون ۽ تنگ ڪپڙا لاھو" },
        { en: "Keep the bitten limb lower than the heart, loosely splinted", ur: "کٹے ہوئے عضو کو دل سے نیچے رکھیں، ڈھیلا سہارا دیں", sd: "چڪيل عضو کي دل کان هيٺ رکو، ڏکئي سهارو ڏيو" },
        { en: "Call 1122 now and go to hospital — ask about anti-snake venom", ur: "ابھی 1122 پر کال کریں اور ہسپتال جائیں — اینٹی سنیک وینم کے بارے میں پوچھیں", sd: "هاڻي 1122 تي فون ڪريو ۽ اسپتال وڃو — ننگ جي دوا بابت پڇو" },
        { en: "Note the time of the bite and what the snake looked like", ur: "کاٹنے کا وقت اور سانپ کی شکل یاد رکھیں", sd: "چڪ جو وقت ۽ ننگ جي شڪل ياد رکو" },
      ],
      home: [],
      dont: [
        { en: "Do not cut the wound or suck the venom", ur: "زخم نہ کاٹیں یا زہر نہ چوسیں", sd: "زخم نه ڪاپيو يا زهر نه چوسيو" },
        { en: "Do not tie a tight band (tourniquet)", ur: "کس کر پٹی نہ باندھیں", sd: "ڳٺ ڪري پٽي نه ٻانهيو" },
        { en: "Do not put ice, herbs or oil on the bite", ur: "چاٹ پر برف، جڑی بوٹی یا تیل نہ لگائیں", sd: "چڪ تي برف، جڙي بوٽي يا تيل نه وجھو" },
        { en: "Do not give anything to eat or drink", ur: "کچھ کھانے یا پینے کو نہ دیں", sd: "کاڌو يا پيڻ لاءِ ڪجهه به نه ڏيو" },
      ],
    },
    {
      id: "dogbite",
      icon: "Dog%20face/3D/dog_face_3d.png",
      emoji: "🐶",
      base_tier: "red",
      max_home_days: 0,
      label: { en: "Dog or animal bite", ur: "کتے یا جانور کا کاٹنا", sd: "ڪتي يا جانور جو چڪ" },
      keywords: ["dog", "bite", "kutta", "animal", "cat", "monkey"],
      rules: [],
      flags: [],
      meds: [],
      red_first_aid: [
        { en: "Wash the wound with soap and running water for 15 minutes — this saves lives", ur: "زخم کو صابن اور بہتے پانی سے 15 منٹ دھوئیں — یہ جان بچاتا ہے", sd: "زخم کي صابن ۽ وهندڙ پاڻي سان 15 منٽ ڌُؤو — هي زندگي بچائي ٿو" },
        { en: "Do not cover the wound tightly; a clean loose cloth is fine", ur: "زخم کو کس کر نہ ڈھکیں؛ صاف ڈھیلا کپڑا ٹھیک ہے", sd: "زخم کي ڳٺ ڪري نه ڍڪو؛ صاف ڏکئي ڪپڙو ٺيڪ آهي" },
        { en: "Go to hospital today for the rabies vaccine — even if the bite looks small", ur: "آج ہی ریبیز ویکسین کے لیے ہسپتال جائیں — چاہے کاٹنا چھوٹا لگے", sd: "اڄ ئي ڪتي جي چڪ جي ويڪسين لاءِ اسپتال وڃو — جيتروڻو چڪ ننڍو لڳي" },
        { en: "The full vaccine course is free at government hospitals — complete all doses", ur: "مکيه کورس سرڪاري اسپتال ۾ مفت آهي — سمورا ٽيڪا مڪمل ڪريو", sd: "مڪمل ڪورس سرڪاري اسپتال ۾ مفت آهي — سمورا ٽيڪا مڪمل ڪريو" },
      ],
      home: [],
      dont: [
        { en: "Do not put chili, oil, herbs or soil on the wound", ur: "زخم پر مرچ، تیل، جڑی بوٹی یا مٹی نہ لگائیں", sd: "زخم تي مرچ، تيل، جڙي بوٽي يا مٽي نه وجھو" },
        { en: "Do not wait to see if the dog was sick — go today", ur: "کتے کے بیمار ہونے کا انتظار نہ کریں — آج جائیں", sd: "ڪتي جي بيمار ٿيڻ جو انتظار نه ڪريو — اڄ وڃو" },
      ],
    },
    {
      id: "scorpion",
      icon: "Scorpion/3D/scorpion_3d.png",
      emoji: "🦂",
      base_tier: "yellow",
      max_home_days: 1,
      label: { en: "Scorpion sting", ur: "بچھو کا ڈنک", sd: "ڇيڪُنڊ جو ڏنڪ" },
      keywords: ["scorpion", "bichoo", "sting"],
      rules: [
        {
          if: "age_months < 60",
          tier: "red",
          why: {
            en: "A scorpion sting in a child under 5 is an emergency",
            ur: "5 سال سے کم بچے کو بچھو کا ڈنک — ایمرجنسی ہے",
            sd: "5 سال کان ننڍي ٻار کي ڇيڪُنڊ جو ڏنڪ — ايمرجنسي آهي",
          },
        },
      ],
      flags: [
        {
          id: "sweating_drooling",
          tier: "red",
          label: { en: "Heavy sweating, drooling or vomiting", ur: "بہت پسینہ، رال بہنا یا قے", sd: "تمام پسينو، رال وهڻ يا اُلٽي" },
        },
        {
          id: "muscle_jerks",
          tier: "red",
          label: { en: "Muscle jerks or blurred vision", ur: "پٹھوں کا جھٹکنا یا دھندلا دکھنا", sd: "پٺن جو ڦڙڪڻ يا ڌُندلو ڏسڻ" },
        },
      ],
      meds: ["paracetamol"],
      home: [
        { en: "Wash with soap and water", ur: "صابن اور پانی سے دھوئیں", sd: "صابن ۽ پاڻي سان ڌُؤو" },
        { en: "Put a cool wet cloth on the sting", ur: "ڈنک پر ٹھنڈا گیلا کپڑا رکھیں", sd: "ڏنڪ تي ٿڌو ٻيجل ڪپڙو رکو" },
        { en: "Keep the person calm and still", ur: "شخص کو پرسکون اور ساکت رکھیں", sd: "ماڻهو کي پرسڪون ۽ بيحرڪت رکو" },
      ],
      dont: [
        { en: "Do not cut or suck the sting", ur: "ڈنک کو نہ کاٹیں یا چوسیں", sd: "ڏنڪ نه ڪاپيو يا چوسيو" },
        { en: "Do not tie a tight band above the sting", ur: "ڈنک کے اوپر کس کر پٹی نہ باندھیں", sd: "ڏنڪ مٿي ڳٺ ڪري پٽي نه ٻانهيو" },
      ],
    },
    {
      id: "earpain",
      icon: "Ear/3D/ear_3d.png",
      emoji: "👂",
      base_tier: "green",
      max_home_days: 2,
      label: { en: "Ear pain", ur: "کان کا درد", sd: "ڪن جو سور" },
      keywords: ["ear", "kaan", "earache"],
      rules: [],
      flags: [
        {
          id: "pus_ear",
          tier: "yellow",
          label: { en: "Pus or blood coming from the ear", ur: "کان سے پیپ یا خون آنا", sd: "ڪن مان پوءُ يا رت اچڻ" },
        },
        {
          id: "swelling_behind",
          tier: "red",
          label: { en: "Swelling or redness behind the ear", ur: "کان کے پیچھے سوجن یا سرخی", sd: "ڪن پويان سوڄ يا ڳاڙهائي" },
        },
        {
          id: "hearing_loss",
          tier: "yellow",
          label: { en: "Sudden hearing loss", ur: "اچانک سُنڻ بند ہو جانا", sd: "اچانڪ ٻڌڻ بند ٿي وڃڻ" },
        },
      ],
      meds: ["paracetamol"],
      home: [
        { en: "Put a warm (not hot) cloth near the ear", ur: "کان کے قریب گرم (گرم نہیں) کپڑا رکھیں", sd: "ڪن ويجهو اَدُو گرم ڪپڙو رکو" },
        { en: "Keep the ear dry; do not let water inside", ur: "کان خشک رکھیں؛ اندر پانی نہ جانے دیں", sd: "ڪن سڪو رکو؛ اندر پاڻي نه وڃڻ ڏيو" },
      ],
      dont: [
        { en: "Do not put oil, herbs or anything inside the ear", ur: "کان میں تیل، جڑی بوٹی یا کچھ نہ ڈالیں", sd: "ڪن ۾ تيل، جڙي بوٽي يا ڪجهه به نه وجھو" },
        { en: "Do not poke the ear with sticks or pins", ur: "کان میں چھڑی یا پن نہ ڈالیں", sd: "ڪن ۾ لٺ يا پن نه وجھو" },
      ],
    },
    {
      id: "burn",
      icon: "Fire/3D/fire_3d.png",
      emoji: "🔥",
      base_tier: "yellow",
      max_home_days: 0,
      label: { en: "Burn / scald", ur: "جلنا", sd: "سڙڻ" },
      keywords: ["burn", "fire", "jalna", "scald", "hot water"],
      rules: [],
      flags: [
        {
          id: "large_burn",
          tier: "red",
          label: { en: "Burn bigger than the patient's palm", ur: "مریض کی ہتھیلی سے بڑا جلنا", sd: "مريض جي هٿيلي کان وڏو سڙڻ" },
        },
        {
          id: "face_hands",
          tier: "red",
          label: { en: "Burn on face, hands, feet or private parts", ur: "چہرے، ہاتھوں، پاؤں یا شرمگاہ پر جلنا", sd: "منهن، هٿن، پيرن يا شرمگاهه تي سڙڻ" },
        },
        {
          id: "deep_white",
          tier: "red",
          label: { en: "Skin white, black or very deep", ur: "جلد سفید، کالی یا بہت گہری", sd: "پوست اڇي، ڪاري يا تمام ٿلهي" },
        },
      ],
      meds: [],
      red_first_aid: [
        { en: "Cool the burn under clean running water for 20 minutes", ur: "جلنے والی جگہ کو صاف بہتے پانی میں 20 منٹ ٹھنڈا کریں", sd: "سڙيل هنڌ کي صاف وهندڙ پاڻي ۾ 20 منٽ ٿڌو ڪريو" },
        { en: "Remove rings and tight clothes before swelling starts", ur: "سوجن سے پہلے چھلے اور تنگ کپڑے اتار دیں", sd: "سوڻ کان اڳ زيور ۽ تنگ ڪپڙا لاھو" },
        { en: "Cover loosely with a clean plastic wrap or clean cloth", ur: "صاف پلاسٹک ریپ یا صاف کپڑے سے ڈھیلا ڈھکیں", sd: "صاف پلاسٽڪ ريپ يا صاف ڪپڙي سان ڏکئي ڍڪو" },
      ],
      home: [
        { en: "Keep cooling the burn with clean running water", ur: "جلنے والی جگہ کو صاف بہتے پانی سے ٹھنڈا رکھیں", sd: "سڙيل هنڌ کي صاف وهندڙ پاڻي سان ٿڌو رکو" },
        { en: "Cover with a clean, non-fluffy cloth", ur: "صاف، روئیں دار نہ ہونے والے کپڑے سے ڈھکیں", sd: "صاف، روئيندار نه هجڻ واري ڪپڙي سان ڍڪو" },
      ],
      dont: [
        { en: "Do not put toothpaste, ghee, oil or ink on a burn", ur: "جلنے پر ٹوتھ پیسٹ، گھی، تیل یا سیاہی نہ لگائیں", sd: "سڙڻ تي ٽوٿ پيسٽ، گهيو، تيل يا سياهي نه وجھو" },
        { en: "Do not burst blisters", ur: "چھالے نہ پھوڑیں", sd: "ڇهالا نه ڦوڙيو" },
        { en: "Do not put ice directly on a burn", ur: "جلنے پر برف سیدھی نہ رکھیں", sd: "سڙڻ تي برف سڌي نه رکو" },
      ],
    },
    {
      id: "vomiting",
      icon: "Nauseated%20face/3D/nauseated_face_3d.png",
      emoji: "🤢",
      base_tier: "green",
      max_home_days: 1,
      label: { en: "Vomiting / stomach upset", ur: "قے / پیٹ خراب", sd: "اُلٽي / پيٽ خراب" },
      keywords: ["vomit", "stomach", "qai", "pet", "nausea", "belly"],
      rules: [
        {
          if: "age_months < 6",
          tier: "yellow",
          why: {
            en: "A baby under 6 months vomiting should see a doctor",
            ur: "6 ماہ سے کم بچے کی قے — ڈاکٹر کو دکھائیں",
            sd: "6 مهينن کان ننڍي ٻار جي اُلٽي — ڊاڪٽر کي ڏيکاريو",
          },
        },
      ],
      flags: [
        {
          id: "blood_vomit",
          tier: "red",
          label: { en: "Blood or green color in the vomit", ur: "قے میں خون یا سبز رنگ", sd: "اُلٽي ۾ رت يا ساوو رنگ" },
        },
        {
          id: "severe_belly",
          tier: "red",
          label: { en: "Severe or one-sided belly pain", ur: "شدید یا ایک طرف پیٹ میں درد", sd: "سخت يا هڪ طرف پيٽ ۾ سور" },
        },
        {
          id: "swollen_belly",
          tier: "yellow",
          label: { en: "Swollen, hard belly", ur: "پھولا ہوا، سخت پیٹ", sd: "ڦولل، سخت پيٽ" },
        },
      ],
      meds: ["ors"],
      home: [
        { en: "Give ORS or water in small sips after each vomit", ur: "ہر قے کے بعد تھوڑا تھوڑا او آر ایس یا پانی دیں", sd: "هر اُلٽي کان پوءِ ٿورو ٿورو او آر ايس يا پاڻي ڏيو" },
        { en: "Start light food slowly: rice, toast, banana", ur: "آہستہ آہستہ ہلکا کھانا شروع کریں: چاول، ٹوسٹ، کیلا", sd: "آهستي آهستي هلڪو کاڌو شروع ڪريو: چانور، ٽوسٽ، کيرو" },
        { en: "Keep breastfeeding babies", ur: "بچوں کو دودھ پلانا جاری رکھیں", sd: "ٻارن کي کير پيارڻ جاري رکو" },
      ],
      dont: [
        { en: "Do not give oily or spicy food", ur: "تلی ہوئی یا مصالحہ دار خوراک نہ دیں", sd: "تيليل يا مصالحه دار کاڌو نه ڏيو" },
        { en: "Do not force large drinks at once", ur: "ایک دم زیادہ پانی نہ پلائیں", sd: "هڪ ڀيرو گهڻو پاڻي نه پياريو" },
      ],
    },
    {
      id: "eye",
      icon: "Eye/3D/eye_3d.png",
      emoji: "👁️",
      base_tier: "green",
      max_home_days: 2,
      label: { en: "Eye problem", ur: "آنکھ کا مسئلہ", sd: "اکين جو مسئلو" },
      keywords: ["eye", "aankh", "vision", "red eye"],
      rules: [],
      flags: [
        {
          id: "eye_injury",
          tier: "red",
          label: { en: "Injury, chemical or something stuck in the eye", ur: "آنکھ میں چوٹ، کیمیکل یا کچھ پھنسا ہوا", sd: "اکي ۾ سور، ڪيميڪل يا ڪجهه ڦاٿل" },
        },
        {
          id: "vision_loss",
          tier: "red",
          label: { en: "Sudden loss of vision", ur: "اچانک نظر جانا", sd: "اچانڪ نظر وڃڻ" },
        },
        {
          id: "pus_pain",
          tier: "yellow",
          label: { en: "Pus with pain or very red eye", ur: "پیپ کے ساتھ درد یا بہت سرخ آنکھ", sd: "پوءُ سان سور يا تمام ڳاڙهي اک" },
        },
      ],
      meds: [],
      home: [
        { en: "Wash hands before touching the eye", ur: "آنکھ چھونے سے پہلے ہاتھ دھوئیں", sd: "اکي ڇوهڻ کان اڳ هٿ ڌُؤو" },
        { en: "Clean the eye with cooled boiled water and clean cloth", ur: "ابال کر ٹھنڈا پانی اور صاف کپڑے سے آنکھ صاف کریں", sd: "اُٻالي ٿڌي پاڻي ۽ صاف ڪپڙي سان اک صاف ڪريو" },
        { en: "Do not share towels", ur: "تولیہ بانٹ کر نہ استعمال کریں", sd: "توليو شيئر نه ڪريو" },
      ],
      dont: [
        { en: "Do not rub the eye", ur: "آنکھ نہ ملیں", sd: "اک نه ملو" },
        { en: "Do not use eye drops from an old or shared bottle", ur: "پرانی یا بانٹی ہوئی بوتل کی آنکھ کی دوا نہ ڈالیں", sd: "پراڻي يا ورهايل بوتل جي اکين جي دوا نه وجھو" },
      ],
    },
    {
      id: "cut",
      icon: "Adhesive%20bandage/3D/adhesive_bandage_3d.png",
      emoji: "🩹",
      base_tier: "green",
      max_home_days: 1,
      label: { en: "Cut / wound", ur: "کٹا ہوا / زخم", sd: "ڪٽل / زخم" },
      keywords: ["cut", "wound", "zakhm", "bleeding", "kata"],
      rules: [],
      flags: [
        {
          id: "deep_cut",
          tier: "yellow",
          label: { en: "Deep or gaping cut, may need stitches", ur: "گہرا یا کھلا زخم، شاید ٹانکوں کی ضرورت", sd: "ٿلهو يا کليل زخم، شايد ٽانڪن جي ضرورت" },
        },
        {
          id: "dirty_wound",
          tier: "yellow",
          label: { en: "Dirty wound, rust or animal scratch", ur: "گندا زخم، زنگ یا جانور کے ناخن", sd: "گندو زخم، زنگ يا جانور جي نهن" },
        },
        {
          id: "numb",
          tier: "red",
          label: { en: "Numbness or cannot move fingers/toes", ur: "سن ہونا یا انگلیاں نہ ہلنا", sd: "سن ٿيڻ يا آڱريون نه هلڻ" },
        },
      ],
      meds: [],
      red_first_aid: [
        { en: "Press firmly on the wound with a clean cloth for 10 minutes", ur: "صاف کپڑے سے زخم پر 10 منٹ مضبوط دباؤ ڈالیں", sd: "صاف ڪپڙي سان زخم تي 10 منٽ مضبوط دٻاءُ وجھو" },
        { en: "Raise the bleeding part above the heart", ur: "خون بہنے والے حصے کو دل سے اوپر اٹھائیں", sd: "رت وهندڙ حصي کي دل کان مٿي کڻو" },
        { en: "If blood soaks through, add more cloth — do not remove the first", ur: "اگر خون کپڑے سے رِس جائے تو اوپر مزید کپڑا رکھیں — پہلا نہ ہٹائیں", sd: "جيڪڏهن رت ڪپڙي مان لنگهي وڃي ته مٿي وڌيڪ ڪپڙو رکو — پهريون نه هٽايو" },
      ],
      home: [
        { en: "Wash the cut with clean running water and soap", ur: "کٹے کو صاف بہتے پانی اور صابن سے دھوئیں", sd: "ڪٽ کي صاف وهندڙ پاڻي ۽ صابن سان ڌُؤو" },
        { en: "Cover with a clean bandage or cloth", ur: "صاف پٹی یا کپڑے سے ڈھکیں", sd: "صاف پٽي يا ڪپڙي سان ڍڪو" },
        { en: "Change the bandage daily and keep it dry", ur: "پٹی روز بدلیں اور خشک رکھیں", sd: "پٽي روز بدلايو ۽ سڪي رکو" },
      ],
      dont: [
        { en: "Do not blow on the wound or touch it with dirty hands", ur: "زخم پر پھونک نہ ماریں یا گندے ہاتھوں سے نہ چھوئیں", sd: "زخم تي ڦوڪ نه هڻو يا گندن هٿن سان نه ڇُهو" },
        { en: "Do not put soil, ash or herbs on the wound", ur: "زخم پر مٹی، راکھ یا جڑی بوٹی نہ لگائیں", sd: "زخم تي مٽي، ساھه يا جڙي بوٽي نه وجھو" },
      ],
    },
  ],
};

export const conditionById = (id: string) =>
  content.conditions.find((c) => c.id === id);
