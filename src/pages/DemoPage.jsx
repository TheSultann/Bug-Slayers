import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteMeta } from '../content.js';

const STORAGE_KEY = 'bug-slayers-safechain-mvp-v2';
const STATE_VERSION = 2;
const MAX_EVENTS = 30;
const DEFAULT_CHANNEL = 'Kassa / Chilonzor';
const DEFAULT_LOCATION = 'Toshkent / Savdo nuqtasi';

const severityRank = {
  critical: 0,
  warning: 1,
  info: 2,
  success: 3,
};

const eventTypeLabels = {
  sale: "O'tgan savdo",
  intake: 'Yangi partiya',
  release: 'Blok yechildi',
  quarantine: "Qo'lda blok",
  'blocked-sale': "To'xtatilgan savdo",
};

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function getOffsetDate(days) {
  const value = startOfDay(new Date());
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
}

function getOffsetTimestamp(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function formatDate(date) {
  const value = new Date(date);
  const day = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const year = value.getFullYear();
  return `${day}.${month}.${year}`;
}

function formatDateTime(date) {
  const value = new Date(date);
  const day = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  return `${day}.${month} ${hours}:${minutes}`;
}

function formatMoney(amount) {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getDaysUntilExpiry(expiryDate) {
  const current = startOfDay(new Date());
  const target = startOfDay(new Date(expiryDate));
  return Math.round((target - current) / (24 * 60 * 60 * 1000));
}

function getRemainingStock(product) {
  return Math.max(product.stock - product.sold, 0);
}

function formatEventType(type) {
  return eventTypeLabels[type] || type.replace(/-/g, ' ');
}

function formatLevel(level) {
  if (level === 'critical') {
    return 'Jiddiy';
  }

  if (level === 'warning') {
    return 'Ogohlantirish';
  }

  if (level === 'success') {
    return 'Yaxshi';
  }

  return "Ma'lumot";
}

function createEvent({
  type,
  level,
  title,
  description,
  productId = null,
  createdAt = new Date().toISOString(),
}) {
  return {
    id: makeId(type),
    type,
    level,
    title,
    description,
    productId,
    createdAt,
  };
}

function getProductStatus(product) {
  const daysToExpiry = getDaysUntilExpiry(product.expiryDate);
  const remaining = getRemainingStock(product);

  if (product.quarantined) {
    return {
      tone: 'critical',
      label: 'Bloklangan',
      hint: "Qo'lda blok yoqilgan",
      risk: 'Yuqori',
    };
  }

  if (daysToExpiry < 0 && remaining > 0) {
    return {
      tone: 'critical',
      label: "Muddat o'tgan",
      hint: `${Math.abs(daysToExpiry)} kun o'tib ketgan`,
      risk: 'Yuqori',
    };
  }

  if (daysToExpiry <= 2 && remaining > 0) {
    return {
      tone: 'warning',
      label: 'Muddat yaqin',
      hint: `${daysToExpiry} kun qoldi`,
      risk: "O'rta",
    };
  }

  if (remaining === 0) {
    return {
      tone: 'info',
      label: 'Tugagan',
      hint: "Qayta to'ldirish kerak",
      risk: 'Past',
    };
  }

  if (remaining <= 4) {
    return {
      tone: 'info',
      label: 'Kam qoldi',
      hint: `${remaining} dona qoldi`,
      risk: 'Past',
    };
  }

  return {
    tone: 'success',
    label: 'Faol',
    hint: "Sotuv mumkin",
    risk: 'Past',
  };
}

function getStatusActionText(status) {
  if (status.label === "Muddat o'tgan") {
    return "Darhol javondan oling va kassada sotuvni to'xtating.";
  }

  if (status.label === 'Bloklangan') {
    return "SKU qayta sotuvga chiqishi uchun avval qo'lda tekshiruv kerak.";
  }

  if (status.label === 'Muddat yaqin') {
    return "Bu mahsulotni kuzatuvda ushlang va tekshiruvni tezlashtiring.";
  }

  if (status.label === 'Kam qoldi') {
    return "Demo paytida javon bo'sh qolmasligi uchun tez orada to'ldiring.";
  }

  return "Hozirgi MVP qoidalari bo'yicha bu SKU ni sotish mumkin.";
}

function buildAlerts(products, events) {
  const blockedAttempts = events.reduce((acc, event) => {
    if (event.type === 'blocked-sale' && event.productId) {
      acc[event.productId] = (acc[event.productId] || 0) + 1;
    }

    return acc;
  }, {});

  const alerts = [];

  products.forEach((product) => {
    const remaining = getRemainingStock(product);
    const daysToExpiry = getDaysUntilExpiry(product.expiryDate);
    const blockedCount = blockedAttempts[product.id] || 0;

    if (product.quarantined && remaining > 0) {
      alerts.push({
        id: `quarantine-${product.id}`,
        level: 'critical',
        label: "Qo'lda blok",
        title: `${product.name} sotuvdan bloklangan`,
        description: `${remaining} dona mahsulot ${product.location} da ushlab turilibdi.`,
        recommendation: "Partiyani tekshirib, faqat qo'lda tasdiqlagandan keyin oching.",
      });
    }

    if (daysToExpiry < 0 && remaining > 0) {
      alerts.push({
        id: `expired-${product.id}`,
        level: 'critical',
        label: "Muddati o'tgan",
        title: `${product.name} muddatidan o'tgan`,
        description: `${remaining} dona mahsulot hali ham faol ro'yxatda turibdi.`,
        recommendation: "Kassada bloklang va partiyani alohida nazoratga o'tkazing.",
      });
    } else if (daysToExpiry <= 2 && remaining > 0) {
      alerts.push({
        id: `near-expiry-${product.id}`,
        level: 'warning',
        label: 'Muddat xavfi',
        title: `${product.name} tez orada tugaydi`,
        description: `${remaining} dona mahsulotni ${daysToExpiry} kun ichida ko'rib chiqish kerak.`,
        recommendation: "Tekshiruvni tezlashtiring va SKU ni kuzatuvda qoldiring.",
      });
    }

    if (blockedCount > 0) {
      alerts.push({
        id: `blocked-${product.id}`,
        level: blockedCount > 1 ? 'critical' : 'warning',
        label: 'Kassa mojarosi',
        title: `${blockedCount} ta bloklangan sotuv urinish`,
        description: `${product.name} kassada qayta-qayta nazoratni ishga tushiryapti.`,
        recommendation: "Kassir oqimini to'g'rilang yoki partiyani darhol javondan oling.",
      });
    }

    if (remaining > 0 && remaining <= 3 && daysToExpiry > 2) {
      alerts.push({
        id: `low-stock-${product.id}`,
        level: 'info',
        label: 'Qoldiq nazorati',
        title: `${product.name} deyarli tugagan`,
        description: `Faqat ${remaining} dona sotiladigan qoldiq qolgan.`,
        recommendation: "Qayta to'ldirishni rejalang yoki javon oqimini yoping.",
      });
    }
  });

  return alerts
    .sort((left, right) => severityRank[left.level] - severityRank[right.level])
    .slice(0, 8);
}

function createSeedState() {
  const products = [
    {
      id: 'sku-milk',
      name: 'Sut 2.5%',
      category: 'Sut mahsuloti',
      sku: 'SC-1001',
      batch: 'MILK-APR-07',
      expiryDate: getOffsetDate(-1),
      stock: 18,
      sold: 6,
      price: 18000,
      supplier: 'Agro Fresh',
      location: 'Kassa / Chilonzor',
      quarantined: false,
    },
    {
      id: 'sku-yogurt',
      name: 'Tabiiy yogurt',
      category: 'Sut mahsuloti',
      sku: 'SC-1002',
      batch: 'YG-APR-11',
      expiryDate: getOffsetDate(2),
      stock: 22,
      sold: 17,
      price: 14500,
      supplier: 'Agro Fresh',
      location: 'Kassa / Yunusobod',
      quarantined: false,
    },
    {
      id: 'sku-water',
      name: 'Mineral suv 1L',
      category: 'Ichimlik',
      sku: 'SC-1003',
      batch: 'WT-MAY-02',
      expiryDate: getOffsetDate(60),
      stock: 40,
      sold: 11,
      price: 9000,
      supplier: 'Pure Drop',
      location: 'Kassa / Sergeli',
      quarantined: false,
    },
    {
      id: 'sku-baby-food',
      name: 'Bolalar pyuresi',
      category: "Bolalar oziq-ovqati",
      sku: 'SC-1004',
      batch: 'BP-APR-18',
      expiryDate: getOffsetDate(9),
      stock: 9,
      sold: 2,
      price: 26000,
      supplier: 'Nutri Kids',
      location: 'Kassa / Chilonzor',
      quarantined: true,
    },
  ];

  const events = [
    createEvent({
      type: 'blocked-sale',
      level: 'critical',
      title: "Muddati o'tgan savdo to'xtatildi",
      description: "Sut 2.5% to'lovdan oldin kassada rad etildi.",
      productId: 'sku-milk',
      createdAt: getOffsetTimestamp(-55),
    }),
    createEvent({
      type: 'sale',
      level: 'success',
      title: "Xavfsiz savdo o'tdi",
      description: 'Mineral suv 1L nazorat muammosisiz sotildi.',
      productId: 'sku-water',
      createdAt: getOffsetTimestamp(-32),
    }),
    createEvent({
      type: 'quarantine',
      level: 'warning',
      title: "Qo'lda blok yoqildi",
      description: "Bolalar pyuresi nazoratchi tekshiruvdan keyin blokka o'tkazildi.",
      productId: 'sku-baby-food',
      createdAt: getOffsetTimestamp(-18),
    }),
  ];

  return {
    version: STATE_VERSION,
    products,
    events,
  };
}

function loadState() {
  if (typeof window === 'undefined') {
    return createSeedState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createSeedState();
    }

    const parsed = JSON.parse(raw);

    if (
      parsed?.version !== STATE_VERSION ||
      !Array.isArray(parsed.products) ||
      !Array.isArray(parsed.events)
    ) {
      return createSeedState();
    }

    return parsed;
  } catch {
    return createSeedState();
  }
}

function MetricCard({ label, value, tone, caption }) {
  return (
    <article className="panel mvp-metric">
      <span className={`mvp-badge mvp-badge--${tone}`}>{label}</span>
      <strong>{value}</strong>
      <p>{caption}</p>
    </article>
  );
}

function ScenarioButton({ title, text, tone, onClick }) {
  return (
    <button type="button" className="mvp-scenario-button" onClick={onClick}>
      <span className={`mvp-badge mvp-badge--${tone}`}>{title}</span>
      <strong>{text}</strong>
    </button>
  );
}

function AlertCard({ alert }) {
  return (
    <article className="mvp-alert-card">
      <div className="mvp-alert-card__top">
        <span className={`mvp-badge mvp-badge--${alert.level}`}>{alert.label}</span>
        <span className="mvp-alert-card__severity">{formatLevel(alert.level)}</span>
      </div>
      <h3>{alert.title}</h3>
      <p>{alert.description}</p>
      <strong>{alert.recommendation}</strong>
    </article>
  );
}

function EventCard({ event }) {
  return (
    <article className="mvp-journal-card">
      <div className="mvp-journal-card__top">
        <span className={`mvp-badge mvp-badge--${event.level}`}>{formatEventType(event.type)}</span>
        <time dateTime={event.createdAt}>{formatDateTime(event.createdAt)}</time>
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
    </article>
  );
}

function InventoryCard({ product, onToggleQuarantine }) {
  const remaining = getRemainingStock(product);
  const status = getProductStatus(product);
  const sellableRatio =
    remaining === 0 ? 0 : Math.max(8, Math.round((remaining / product.stock) * 100));

  return (
    <article className="mvp-inventory-card">
      <div className="mvp-inventory-card__header">
        <div>
          <div className="mvp-inventory-card__title-row">
            <h3>{product.name}</h3>
            <span className={`mvp-badge mvp-badge--${status.tone}`}>{status.label}</span>
          </div>
          <p>
            {product.category} / {product.sku} / {product.batch}
          </p>
        </div>
        <button
          type="button"
          className="button button--secondary mvp-inline-button"
          onClick={() => onToggleQuarantine(product.id)}
        >
          {product.quarantined ? 'Ochish' : 'Bloklash'}
        </button>
      </div>

      <div className="mvp-inventory-card__grid">
        <div>
          <span>Muddat</span>
          <strong>{formatDate(product.expiryDate)}</strong>
        </div>
        <div>
          <span>Qoldiq</span>
          <strong>{remaining}</strong>
        </div>
        <div>
          <span>Sotilgan</span>
          <strong>{product.sold}</strong>
        </div>
        <div>
          <span>Narx</span>
          <strong>{formatMoney(product.price)}</strong>
        </div>
      </div>

      <div className="mvp-inventory-card__meter" aria-hidden="true">
        <span
          className={`mvp-inventory-card__meter-fill mvp-inventory-card__meter-fill--${status.tone}`}
          style={{ width: `${sellableRatio}%` }}
        />
      </div>

      <div className="mvp-inventory-card__footer">
        <span>{status.hint}</span>
        <span>{product.location}</span>
      </div>
    </article>
  );
}

export default function DemoPage() {
  const [state, setState] = useState(loadState);
  const [feedback, setFeedback] = useState(null);
  const [saleForm, setSaleForm] = useState({
    productId: '',
    quantity: 1,
    channel: DEFAULT_CHANNEL,
  });
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Savdo',
    sku: '',
    batch: '',
    expiryDate: getOffsetDate(7),
    stock: 10,
    price: 15000,
    supplier: "Qo'lda kiritildi",
    location: DEFAULT_LOCATION,
  });

  useEffect(() => {
    document.title = `${siteMeta.name} | SafeChain amaliy demo`;
  }, []);

  useEffect(() => {
    if (!saleForm.productId && state.products[0]) {
      setSaleForm((current) => ({
        ...current,
        productId: state.products[0].id,
      }));
    }
  }, [saleForm.productId, state.products]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors in preview mode.
    }
  }, [state]);

  const inventory = [...state.products].sort((left, right) => {
    const leftRank = severityRank[getProductStatus(left).tone] ?? 99;
    const rightRank = severityRank[getProductStatus(right).tone] ?? 99;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return getDaysUntilExpiry(left.expiryDate) - getDaysUntilExpiry(right.expiryDate);
  });

  const alerts = buildAlerts(state.products, state.events);
  const selectedProduct =
    inventory.find((product) => product.id === saleForm.productId) || inventory[0] || null;
  const selectedStatus = selectedProduct ? getProductStatus(selectedProduct) : null;

  const metrics = {
    trackedProducts: state.products.length,
    activeUnits: state.products.reduce((sum, product) => sum + getRemainingStock(product), 0),
    blockedSales: state.events.filter((event) => event.type === 'blocked-sale').length,
    safeSales: state.events.filter((event) => event.type === 'sale').length,
    criticalSignals: alerts.filter((alert) => alert.level === 'critical').length,
  };

  const complianceScore = Math.max(
    42,
    100 -
      metrics.criticalSignals * 16 -
      alerts.filter((alert) => alert.level === 'warning').length * 6,
  );
  const complianceTone =
    complianceScore < 60 ? 'critical' : complianceScore < 80 ? 'warning' : 'success';

  const leadAlert = alerts[0] || null;
  const scenarioPresets = [
    {
      id: 'expired',
      title: 'Blok holati',
      text: "Muddati o'tgan savdoni sinang",
      tone: 'critical',
      values: {
        productId: 'sku-milk',
        quantity: 1,
        channel: DEFAULT_CHANNEL,
      },
    },
    {
      id: 'warning',
      title: 'Kuzatuv',
        text: "Muddat yaqin mahsulotni ko'ring",
      tone: 'warning',
      values: {
        productId: 'sku-yogurt',
        quantity: 1,
        channel: 'Kassa / Yunusobod',
      },
    },
    {
      id: 'safe',
      title: "Toza savdo",
      text: "Oddiy savdoni o'tkazing",
      tone: 'success',
      values: {
        productId: 'sku-water',
        quantity: 2,
        channel: 'Kassa / Sergeli',
      },
    },
  ];

  const applyStateChange = (updater, nextFeedback) => {
    setState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;

      return {
        ...next,
        events: next.events.slice(0, MAX_EVENTS),
      };
    });

    setFeedback(nextFeedback);
  };

  const handleSaleSubmit = (event) => {
    event.preventDefault();

    if (!selectedProduct) {
      setFeedback({
        tone: 'warning',
        title: 'Avval mahsulot tanlang',
        text: 'Tanlangan SKU bo`lmasa savdo ishlamaydi.',
      });
      return;
    }

    const quantity = Number(saleForm.quantity);

    if (!Number.isFinite(quantity) || quantity < 1) {
      setFeedback({
        tone: 'warning',
        title: "Miqdor noto'g'ri",
        text: "Savdo miqdori kamida 1 bo'lishi kerak.",
      });
      return;
    }

    const remaining = getRemainingStock(selectedProduct);
    const expired = getDaysUntilExpiry(selectedProduct.expiryDate) < 0;
    const isBlocked = selectedProduct.quarantined || expired;

    if (isBlocked) {
      applyStateChange(
        (current) => ({
          ...current,
          events: [
            createEvent({
              type: 'blocked-sale',
              level: 'critical',
              title: "SafeChain savdoni to'xtatdi",
              description: `${selectedProduct.name} ${saleForm.channel} orqali sotilmaydi.`,
              productId: selectedProduct.id,
            }),
            ...current.events,
          ],
        }),
        {
          tone: 'critical',
          title: "Savdo bloklandi",
          text: expired
            ? "Muddati o'tgan partiya kassada to'xtatildi."
            : "Blok qoidasi bu savdoni to'xtatdi.",
        },
      );
      return;
    }

    if (quantity > remaining) {
      applyStateChange(
        (current) => ({
          ...current,
          events: [
            createEvent({
              type: 'blocked-sale',
              level: 'warning',
              title: 'Qoldiq mos kelmadi',
              description: `${selectedProduct.name}: so'raldi ${quantity}, mavjud ${remaining}.`,
              productId: selectedProduct.id,
            }),
            ...current.events,
          ],
        }),
        {
          tone: 'warning',
          title: 'Savdo rad etildi',
          text: "So'ralgan miqdor sotiladigan qoldiqdan ko'p.",
        },
      );
      return;
    }

    const saleLevel = getDaysUntilExpiry(selectedProduct.expiryDate) <= 2 ? 'warning' : 'success';

    applyStateChange(
      (current) => ({
        ...current,
        products: current.products.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, sold: product.sold + quantity }
            : product,
        ),
        events: [
          createEvent({
            type: 'sale',
            level: saleLevel,
            title: "Savdo o'tdi",
            description: `${selectedProduct.name} dan ${quantity} dona ${saleForm.channel} orqali sotildi.`,
            productId: selectedProduct.id,
          }),
          ...current.events,
        ],
      }),
      {
        tone: saleLevel,
        title: "Savdo yozildi",
        text:
          saleLevel === 'warning'
            ? "Savdo o'tdi, lekin SKU hali ham kuzatuvda turadi."
            : "SafeChain savdoni tasdiqladi.",
      },
    );
  };

  const handleProductSubmit = (event) => {
    event.preventDefault();

    if (!productForm.name.trim() || !productForm.batch.trim() || !productForm.sku.trim()) {
      setFeedback({
        tone: 'warning',
        title: "Mahsulot kartasi to'liq emas",
        text: "Kiritish uchun nom, SKU va partiya kerak.",
      });
      return;
    }

    const stock = Number(productForm.stock);
    const price = Number(productForm.price);

    if (!productForm.expiryDate || !Number.isFinite(stock) || stock < 1 || !Number.isFinite(price) || price < 0) {
      setFeedback({
        tone: 'warning',
        title: "Partiya ma'lumoti noto'g'ri",
        text: "Muddat, qoldiq va narx to'g'ri bo'lishi kerak.",
      });
      return;
    }

    const product = {
      id: makeId('product'),
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      sku: productForm.sku.trim(),
      batch: productForm.batch.trim(),
      expiryDate: productForm.expiryDate,
      stock,
      sold: 0,
      price,
      supplier: productForm.supplier.trim() || "Qo'lda kiritildi",
      location: productForm.location.trim() || DEFAULT_LOCATION,
      quarantined: false,
    };

    applyStateChange(
      (current) => ({
        ...current,
        products: [product, ...current.products],
        events: [
          createEvent({
            type: 'intake',
            level: 'info',
            title: "Yangi partiya qo'shildi",
            description: `${product.name} SafeChain ro'yxatiga qo'shildi.`,
            productId: product.id,
          }),
          ...current.events,
        ],
      }),
      {
        tone: 'success',
        title: "Partiya qo'shildi",
        text: "Yangi SKU endi ro'yxatda va kassada ko'rinadi.",
      },
    );

    setProductForm({
      name: '',
      category: 'Savdo',
      sku: '',
      batch: '',
      expiryDate: getOffsetDate(7),
      stock: 10,
      price: 15000,
      supplier: "Qo'lda kiritildi",
      location: DEFAULT_LOCATION,
    });
    setSaleForm((current) => ({
      ...current,
      productId: product.id,
    }));
  };

  const handleToggleQuarantine = (productId) => {
    const product = state.products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    const nextMode = !product.quarantined;

    applyStateChange(
      (current) => ({
        ...current,
        products: current.products.map((item) =>
          item.id === productId
            ? { ...item, quarantined: nextMode }
            : item,
        ),
        events: [
          createEvent({
            type: nextMode ? 'quarantine' : 'release',
            level: nextMode ? 'warning' : 'success',
            title: nextMode ? "Qo'lda blok yoqildi" : 'Blok yechildi',
            description: `${product.name} ${nextMode ? "sotuvdan olindi" : "yana javonga qaytdi"}.`,
            productId,
          }),
          ...current.events,
        ],
      }),
      {
        tone: nextMode ? 'warning' : 'success',
        title: nextMode ? "Qo'lda blok yoqildi" : "Qo'lda blok olib tashlandi",
        text: nextMode
          ? "Bu SKU endi kassada avtomatik bloklanadi."
          : "Agar muddat qoidasi ruxsat bersa, bu SKU yana sotiladi.",
      },
    );
  };

  const handleScenarioPick = (preset) => {
    setSaleForm(preset.values);
    setFeedback({
      tone: preset.tone,
      title: preset.title,
      text: "Tayyor ssenariy yuklandi. Natijani ko'rish uchun savdoni ishga tushiring.",
    });
    window.location.hash = 'pos';
  };

  return (
    <main className="demo-page mvp-page">
      <section className="section demo-hero mvp-hero">
        <div className="demo-hero__backdrop demo-hero__backdrop--left" />
        <div className="demo-hero__backdrop demo-hero__backdrop--right" />
        <div className="demo-hero__mesh" />

        <div className="shell mvp-hero__grid">
          <div className="mvp-hero__intro">
            <span className="status-pill">
              <span className="status-pill__pulse" />
              SafeChain demo markazi / video + MVP
            </span>
            <p className="section__eyebrow">06 / Demo materiali va ishchi MVP</p>
            <h1>Savdo nazorati, risk signali va partiya boshqaruvi bitta oynada.</h1>
            <p className="mvp-hero__copy">
              Bu sahifada talab qilingan demo materiallari ham bor, ishchi MVP ham bor. Avval
              videoni ko'rasiz, keyin jonli nazorat oqimini shu yerning o'zida sinaysiz.
            </p>

            <div className="demo-hero__actions">
              <a className="button" href="#pos">
                Kassa oqimini ochish
              </a>
              <a className="button button--secondary" href="#demo-materials">
                Videoni ko'rish
              </a>
            </div>

            <div className="mvp-scenario-grid">
              {scenarioPresets.map((preset) => (
                <ScenarioButton
                  key={preset.id}
                  title={preset.title}
                  text={preset.text}
                  tone={preset.tone}
                  onClick={() => handleScenarioPick(preset)}
                />
              ))}
            </div>

            <div className="mvp-metrics-grid">
              <MetricCard
                label="Kuzatuvdagi SKU"
                value={metrics.trackedProducts}
                tone="info"
                caption="SafeChain ichida ko'rinayotgan mahsulotlar."
              />
              <MetricCard
                label="Jiddiy signal"
                value={metrics.criticalSignals}
                tone="critical"
                caption="Hozir qaror kerak bo'lgan holatlar."
              />
              <MetricCard
                label="To'xtagan savdo"
                value={metrics.blockedSales}
                tone="warning"
                caption="Xavfli savdolar to'lovdan oldin ushlanadi."
              />
              <MetricCard
                label="Nazorat foizi"
                value={`${complianceScore}%`}
                tone="success"
                caption="Faol riskga qarab hisoblangan oddiy ko'rsatkich."
              />
            </div>
          </div>

          <aside className="mvp-hero__side">
            <article className="panel mvp-summary-card">
              <div className="mvp-summary-card__top">
                <span className={`mvp-badge mvp-badge--${complianceTone}`}>Qisqa holat</span>
                <Link className="mvp-summary-card__link" to="/">
                  Pitchga qaytish
                </Link>
              </div>

              <h2>{leadAlert ? leadAlert.title : 'Hozir tizim tinch ishlayapti'}</h2>
              <p>
                {leadAlert
                  ? leadAlert.recommendation
                  : "Jiddiy to'siq yo'q. Ro'yxat kuzatiladi va har bir savdo jurnalga yoziladi."}
              </p>

              <div className="mvp-scoreboard">
                <div className="mvp-scoreboard__top">
                  <span>Nazorat holati</span>
                  <strong>{complianceScore}%</strong>
                </div>
                <div className="mvp-scoreboard__track" aria-hidden="true">
                  <span
                    className={`mvp-scoreboard__fill mvp-scoreboard__fill--${complianceTone}`}
                    style={{ width: `${complianceScore}%` }}
                  />
                </div>
              </div>

              <div className="mvp-summary-card__grid">
                <div>
                  <span>Faol qoldiq</span>
                  <strong>{metrics.activeUnits}</strong>
                </div>
                <div>
                  <span>O'tgan savdo</span>
                  <strong>{metrics.safeSales}</strong>
                </div>
                <div>
                  <span>So'nggi yangilanish</span>
                  <strong>{formatDateTime(new Date().toISOString())}</strong>
                </div>
                <div>
                  <span>Saqlash usuli</span>
                  <strong>Brauzer ichida</strong>
                </div>
              </div>

              <div className="mvp-summary-card__steps">
                <h3>Tez sinash yo'li</h3>
                <ol>
                  <li>Sut 2.5% ni sotib ko'ring va blokni ko'ring.</li>
                  <li>Mineral suv 1L ni soting va xavfsiz savdoni ko'ring.</li>
                  <li>Yangi partiya qo'shing va ro'yxatda kuzating.</li>
                </ol>
              </div>
            </article>

            <article className="panel video-frame mvp-demo-card" id="demo-materials">
              <div className="mvp-demo-card__intro">
                <div>
                  <p className="section__eyebrow">6.1 / Demo-video</p>
                  <h2>SafeChain demo videosi</h2>
                </div>
                <a
                  className="button button--secondary mvp-inline-button mvp-demo-card__button"
                  href={siteMeta.videoWatchUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  YouTube&apos;da ochish
                </a>
              </div>

              <p className="mvp-demo-card__summary">
                1-5 daqiqalik walkthrough ichida muammo, yechim va SafeChain savdo nuqtasida
                qanday ishlashi qisqa ko&apos;rinishda beriladi.
              </p>

              <div className="video-frame__embed">
                <iframe
                  src={siteMeta.videoEmbedUrl}
                  title="SafeChain demo video"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <div className="mvp-demo-card__details">
                <span className="mvp-badge mvp-badge--info">6.2 / Video ichida</span>
                <ul className="list list--compact mvp-demo-card__list">
                  <li>
                    <span className="list__bullet list__bullet--solution" />
                    <span>Muammo va yechim nima ekanini tez tushuntiradi.</span>
                  </li>
                  <li>
                    <span className="list__bullet list__bullet--solution" />
                    <span>SafeChain savdo nuqtasida qanday ishlashini ko'rsatadi.</span>
                  </li>
                  <li>
                    <span className="list__bullet list__bullet--solution" />
                    <span>Pitch paytida mahsulotni gap bilan emas, ko'rinish bilan isbotlaydi.</span>
                  </li>
                </ul>
              </div>
            </article>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="shell mvp-layout">
          <div className="mvp-layout__main">
            <article className="panel mvp-module" id="pos">
              <div className="mvp-module__heading">
                <div>
                  <p className="section__eyebrow">6.4 / Kassa sinovi</p>
                  <h2>Kassa nazorati</h2>
                  <p className="mvp-module__copy">
                    Tayyor ssenariyni tanlang yoki SKU ni qo'lda belgilang. Savdo to'lovdan oldin
                    tekshiriladi.
                  </p>
                </div>
                {selectedStatus && (
                  <span className={`mvp-badge mvp-badge--${selectedStatus.tone}`}>
                    {selectedStatus.label}
                  </span>
                )}
              </div>

              <form className="mvp-form" onSubmit={handleSaleSubmit}>
                <div className="mvp-form-grid">
                  <label className="mvp-field">
                    <span>Mahsulot</span>
                    <select
                      value={saleForm.productId}
                      onChange={(event) =>
                        setSaleForm((current) => ({
                          ...current,
                          productId: event.target.value,
                        }))
                      }
                    >
                      {inventory.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} / {getRemainingStock(product)} dona
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="mvp-field">
                    <span>Miqdor</span>
                    <input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={saleForm.quantity}
                      onChange={(event) =>
                        setSaleForm((current) => ({
                          ...current,
                          quantity: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="mvp-field">
                    <span>Nuqta</span>
                    <input
                      placeholder="Kassa / Chilonzor"
                      value={saleForm.channel}
                      onChange={(event) =>
                        setSaleForm((current) => ({
                          ...current,
                          channel: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="mvp-form__actions">
                  <button type="submit" className="button">
                    Savdoni o'tkazish
                  </button>
                  <p className="mvp-form__hint">
                    Hozirgi qoida muddati o'tgan va bloklangan mahsulotni avtomatik to'xtatadi.
                  </p>
                </div>
              </form>

              {selectedProduct && (
                <div className="mvp-checkout-card">
                  <div className="mvp-checkout-card__head">
                    <div>
                      <h3>{selectedProduct.name}</h3>
                      <p>
                        {selectedProduct.batch} / {selectedProduct.location}
                      </p>
                    </div>
                    <strong>{formatMoney(selectedProduct.price)}</strong>
                  </div>

                  <div className="mvp-checkout-card__grid">
                    <div>
                      <span>Muddat</span>
                      <strong>{formatDate(selectedProduct.expiryDate)}</strong>
                    </div>
                    <div>
                      <span>Qoldiq</span>
                      <strong>{getRemainingStock(selectedProduct)}</strong>
                    </div>
                    <div>
                      <span>Xavf</span>
                      <strong>{selectedStatus?.risk}</strong>
                    </div>
                  </div>

                  <div className="mvp-checkout-card__note">
                    <span className={`mvp-badge mvp-badge--${selectedStatus?.tone || 'info'}`}>
                      Tavsiya
                    </span>
                    <p>{selectedStatus ? getStatusActionText(selectedStatus) : ''}</p>
                  </div>
                </div>
              )}

              {feedback && (
                <div className={`mvp-feedback mvp-feedback--${feedback.tone}`} aria-live="polite">
                  <strong>{feedback.title}</strong>
                  <p>{feedback.text}</p>
                </div>
              )}
            </article>

            <article className="panel mvp-module" id="inventory">
              <div className="mvp-module__heading">
                <div>
                  <p className="section__eyebrow">6.5 / Kiritish va ro'yxat</p>
                  <h2>Yangi partiya qo'shing va holatini boshqaring</h2>
                  <p className="mvp-module__copy">
                    Bu qism tez ishlashi uchun sodda qilingan: partiya yaratasiz, keyin pastdagi
                    jonli ro'yxatdan blokni boshqarasiz.
                  </p>
                </div>
                <span className="mvp-badge mvp-badge--info">Brauzerda saqlanadi</span>
              </div>

              <form className="mvp-form" onSubmit={handleProductSubmit}>
                <div className="mvp-form-grid mvp-form-grid--wide">
                  <label className="mvp-field">
                    <span>Nomi</span>
                    <input
                      placeholder="Masalan: Shokoladli sut 1L"
                      value={productForm.name}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="mvp-field">
                    <span>Toifa</span>
                    <input
                      placeholder="Sut mahsuloti"
                      value={productForm.category}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="mvp-field">
                    <span>SKU</span>
                    <input
                      placeholder="SC-2044"
                      value={productForm.sku}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          sku: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="mvp-field">
                    <span>Partiya</span>
                    <input
                      placeholder="MILK-MAY-01"
                      value={productForm.batch}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          batch: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="mvp-field">
                    <span>Muddat</span>
                    <input
                      type="date"
                      value={productForm.expiryDate}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          expiryDate: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="mvp-field">
                    <span>Qoldiq</span>
                    <input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={productForm.stock}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          stock: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="mvp-field">
                    <span>Narx (UZS)</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      inputMode="numeric"
                      value={productForm.price}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          price: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="mvp-field">
                    <span>Yetkazib beruvchi</span>
                    <input
                      placeholder="Yetkazib beruvchi yoki importer"
                      value={productForm.supplier}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          supplier: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="mvp-field">
                    <span>Joylashuv</span>
                    <input
                      placeholder="Toshkent / Savdo nuqtasi"
                      value={productForm.location}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          location: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="mvp-form__actions">
                  <button type="submit" className="button">
                    Partiyani qo'shish
                  </button>
                  <p className="mvp-form__hint">
                    To'liq karta uchun nom, SKU, partiya, muddat, qoldiq va narx kerak.
                  </p>
                </div>
              </form>

              <div className="mvp-section-bar">
                <strong>Jonli ro'yxat</strong>
                <span>{inventory.length} ta mahsulot xavf bo'yicha saralangan</span>
              </div>

              <div className="mvp-inventory-list">
                {inventory.map((product) => (
                  <InventoryCard
                    key={product.id}
                    product={product}
                    onToggleQuarantine={handleToggleQuarantine}
                  />
                ))}
              </div>
            </article>
          </div>

          <aside className="mvp-layout__side">
            <article className="panel mvp-module" id="signals">
              <div className="mvp-module__heading">
                <div>
                  <p className="section__eyebrow">6.6 / Xavf signallari</p>
                  <h2>Signal navbati</h2>
                  <p className="mvp-module__copy">
                    Jiddiy holatlar tepada turadi. Signal hozirgi ro'yxat va savdo amallaridan
                    qayta hisoblanadi.
                  </p>
                </div>
                <span className="mvp-badge mvp-badge--warning">{alerts.length} signal</span>
              </div>

              <div className="mvp-alert-list">
                {alerts.length > 0 ? (
                  alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
                ) : (
                  <div className="mvp-empty-state">
                    <strong>Signal yo'q</strong>
                    <p>Hozir faol savdo to'sig'i ko'rinmayapti.</p>
                  </div>
                )}
              </div>
            </article>

            <article className="panel mvp-module">
              <div className="mvp-module__heading">
                <div>
                  <p className="section__eyebrow">6.7 / Amallar jurnali</p>
                  <h2>So'nggi amallar</h2>
                  <p className="mvp-module__copy">
                    Har bir kiritish, savdo, ochish va bloklash demo uchun alohida yozib boriladi.
                  </p>
                </div>
                <span className="mvp-badge mvp-badge--info">{state.events.length} ta amal</span>
              </div>

              <div className="mvp-journal-list">
                {state.events.map((item) => (
                  <EventCard key={item.id} event={item} />
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}
