export const siteMeta = {
  name: 'Bug Slayers',
  tagline:
    "SafeChain orqali importdan kassagacha bo'lgan nazorat bir panelda.",
  contactEmail: 'hello@bugslayers.uz',
  prototypeUrl: 'https://stitch.withgoogle.com/projects/4022772081421735983',
  videoEmbedUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ?rel=0',
};

export const navItems = [
  { label: 'Muammo', href: '/#muammo' },
  { label: 'Jamoa', href: '/#jamoa' },
  { label: 'Nega biz', href: '/#nega-biz' },
  { label: "Yo'l xaritasi", href: '/#yol-xaritasi' },
  { label: 'Reja', href: '/#amalga-oshirish' },
  { label: 'Demo', href: '/demo' },
];

export const heroStats = [
  { value: '03', label: 'Xavf qatlami' },
  { value: '24/7', label: 'Raqamli kuzatuv' },
  { value: 'AI', label: 'Signal engine' },
];

export const controlLoopSteps = [
  {
    index: '01',
    title: "Ma'lumot yig'iladi",
    text: "Import, ombor va savdo izlari bitta nazorat qatlamiga ulanadi.",
  },
  {
    index: '02',
    title: 'AI signal ajratadi',
    text: "Xavfli mahsulot yoki nuqta model orqali topiladi.",
  },
  {
    index: '03',
    title: "Sotuv joyida javob",
    text: "Signal, blok yoki audit log ko'rinishida darhol javob qaytaradi.",
  },
];

export const problemVsSolution = {
  problem: {
    eyebrow: 'Muammo',
    title: "Nazoratsiz savdo iste'molchi va davlatga zarba beradi",
    points: [
      "Muddati o'tgan mahsulotlar kassaga yetib boradi — salomatlik xavfi.",
      "Savdoning bir qismi tizimdan tashqarida qoladi.",
      "Nazorat organlari muammoni kech ko'radi.",
    ],
  },
  solution: {
    eyebrow: 'Yechim',
    title: "SafeChain nazoratni operatsiya ichiga joylaydi",
    points: [
      "Muddati o'tgan mahsulot kassada avtomatik bloklanadi.",
      "Mahsulot importdan iste'molchigacha kuzatiladi.",
      "AI kirim-chiqimdagi nomuvofiqlikni topadi.",
    ],
  },
};

export const teamMembers = [
  {
    name: 'Azizbek Rahmonov',
    role: 'Team Lead',
    badge: 'Strategy',
    bio: "Jamoaning texnik va produkt vizyonini boshqaradi. Loyiha arxitekturasi va asosiy qarorlarni belgilaydi.",
    skills: ['Leadership', 'System Design'],
    stack: 'Planning, Architecture',
    links: [
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'LinkedIn', href: 'https://linkedin.com/' },
    ],
    image: '/logo2.png',
  },
  {
    name: 'Sultan',
    role: 'Full Stack Engineer',
    badge: 'Build',
    bio: "Loyihaning arxitekturasi, frontend interfeysi va backend xizmatlarini to'liq integratsiya qiladi.",
    skills: ['React', 'Node.js', 'Database'],
    stack: 'Full Stack, Core Logic',
    links: [
      { label: 'LinkedIn', href: 'https://linkedin.com/' },
      { label: 'GitHub', href: 'https://github.com/TheSultann' },
    ],
    image: '/logo2.png',
  },
  {
    name: 'Alimova Sevinchoy',
    role: 'Project Manager & Technical Writer',
    badge: 'Manage',
    bio: "Jarayonlarni rejalashtirish, jamoa sinxronizatsiyasi va loyihaning barcha texnik hujjatlarini yuritishga mas'ul.",
    skills: ['Management', 'Tech Writing'],
    stack: 'Agile, Documentation',
    links: [
      { label: 'LinkedIn', href: 'https://linkedin.com/' },
      { label: 'Portfolio', href: 'https://example.com/' },
    ],
    image: '/logo2.png',
  },
  {
    name: 'Operations Lead',
    role: 'Delivery & Support',
    badge: 'Ops',
    bio: "Jarayonlar va operatsion tartibni ushlab turadi.",
    skills: ['Coordination', 'Support'],
    stack: 'Communication, QA',
    links: [
      { label: 'Telegram', href: 'https://t.me/' },
      { label: 'Portfolio', href: 'https://example.com/' },
    ],
    image: '/logo2.png',
  },
];

export const whyUsCards = [
  {
    title: "Nazoratni operatsiyaning ichida ishlatamiz",
    text: "SafeChain faqat hisobot emas — savdo jarayonida ishlaydi.",
    size: 'large',
  },
  {
    title: 'Product, texnik ijro va nazorat logikasi bir jamoada',
    text: "Yechim bo'linib ketmaydi va tezroq materiallashadi.",
    size: 'wide',
  },
  {
    title: "AI bilan yashirin signallarni ko'ramiz",
    text: "Kirim-chiqim nomuvofiqliklarini avtomatik topamiz.",
    size: 'small',
  },
  {
    title: 'Prototype dan MVP gacha tez yuramiz',
    text: "Dizayn, demo va web qatlamini bir zanjirda chiqaramiz.",
    size: 'small',
    tone: 'accent',
  },
];

export const roadmap = [
  {
    stage: 'Idea',
    status: 'Tugallangan',
    progress: 100,
    progressTone: 'full',
    summary: "Muammo va qiymat taklifi aniqlashtirildi.",
  },
  {
    stage: 'Prototype',
    status: 'Tugallangan',
    progress: 100,
    progressTone: 'full',
    summary: 'Asosiy oqimlar va vizual ekranlar tayyor.',
  },
  {
    stage: 'MVP',
    status: 'Faol bosqich',
    progress: 48,
    progressTone: 'strong',
    isCurrent: true,
    summary: 'Backend, AI modul va dashboard ulanadi.',
  },
  {
    stage: 'Launch',
    status: 'Rejada',
    progress: 20,
    progressTone: 'early',
    summary: 'Deploy, analytics va feedback bilan bozorga.',
  },
];

export const implementationPlan = [
  {
    index: '01',
    title: 'Discovery va scope',
    text: "Muammo ko'lami va birinchi sprint chegarasi belgilanadi.",
  },
  {
    index: '02',
    title: 'Prototype va validatsiya',
    text: "Maket chiqarilib, asosiy ssenariylar test qilinadi.",
  },
  {
    index: '03',
    title: 'MVP qurish',
    text: 'Frontend, API va AI xizmatlari ishlaydigan holatga yetkaziladi.',
  },
  {
    index: '04',
    title: 'Launch va monitoring',
    text: "Analytics va feedback bilan product barqarorlashadi.",
  },
];

export const stackGroups = [
  { label: 'Frontend', value: 'React, Vite' },
  { label: 'Backend', value: 'Node.js / FastAPI' },
  { label: 'AI', value: 'OpenAI API, anomaly logic' },
  { label: 'Infra', value: 'Supabase, Vercel' },
];

export const demoHighlights = [
  "Asosiy user flow va interface bitta ko'rinishda.",
  'AI signal qay tarzda ishlashi qisqa ssenariy bilan.',
  "Product qayerga kengayishi aniq ko'rsatiladi.",
];

export const chatbotSamples = [
  {
    side: 'assistant',
    text: "Assalomu alaykum. SafeChain demo markaziga xush kelibsiz.",
  },
  {
    side: 'user',
    text: "Nazorat organlari uchun ham foydali bo'ladimi?",
  },
  {
    side: 'assistant',
    text: "Ha. AI signal va audit trail orqali muammoni operatsiyaning o'zida ko'rish mumkin.",
  },
];

export const footerLinks = [
  { label: 'Telegram', href: 'https://t.me/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'Demo', href: '/demo' },
];
