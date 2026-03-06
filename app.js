// ── Holdings Data ──────────────────────────────────────────────────────────
// Fields:
//   name         - Full investment name
//   ticker       - Display ticker/identifier
//   yahooSymbol  - Yahoo Finance symbol for live prices (null = use static price)
//   assetClass   - "Equity" | "Fixed Income" | "Alternative" | "Cash"
//   shares       - Number of units / shares held
//   price        - Fallback price per share (SEK) — used if live fetch fails
//   costBasis    - Total cost basis (SEK, what you paid in total)

const PRICES_UPDATED = "2026-03-05"; // ← uppdatera detta när du ändrar priserna

const holdings = [
  { name: "Nibe Industrier AB",            ticker: "NIBE B",   yahooSymbol: "NIBE-B.ST",  assetClass: "Equity", shares: 246, price: 35.81,  costBasis: 11384.88 },
  { name: "Billerud AB",                   ticker: "BILL",     yahooSymbol: "BILL.ST",    assetClass: "Equity", shares: 90,  price: 78.6,  costBasis: 10001.70 },
  { name: "Axfood AB",                     ticker: "AXFO",     yahooSymbol: "AXFO.ST",    assetClass: "Equity", shares: 5,   price: 322.9, costBasis: 1450.00  },
  { name: "Industrivärden AB",             ticker: "INDU C",   yahooSymbol: "INDU-C.ST",  assetClass: "Equity", shares: 3,   price: 490.7, costBasis: 1247.01  },
  { name: "Volvo AB",                      ticker: "VOLV B",   yahooSymbol: "VOLV-B.ST",  assetClass: "Equity", shares: 4,   price: 337.5, costBasis: 1184.00  },
  { name: "ARK Innovation UCITS ETF USD A",ticker: "ARXK",     yahooSymbol: "ARXK.DE",    assetClass: "Equity", shares: 18,  price: 71.55,  costBasis: 1342.32  },
  { name: "Hanza AB",                      ticker: "HANZA",    yahooSymbol: "HANZA.ST",   assetClass: "Equity", shares: 119, price: 167.8, costBasis: 7551.74  },
  { name: "Berner Industrier AB",          ticker: "BERNER B", yahooSymbol: "BERNER-B.ST",assetClass: "Equity", shares: 172, price: 103, costBasis: 9193.40  },
  { name: "CTT Systems AB",                ticker: "CTT",      yahooSymbol: "CTT.ST",     assetClass: "Equity", shares: 32,  price: 138.2, costBasis: 9064.96  },
  { name: "Saldo",                         ticker: "SALDO",    yahooSymbol: null,          assetClass: "Cash",   shares: 1,   price: 138.39, costBasis: 138.39   },
];

// ── Dividend History (from Nordnet export) ─────────────────────────────────
const DIVIDENDS = [
  // 2021
  { date: "2021-04-20", ticker: "HUSQ B",  amount: 11.2  },
  { date: "2021-05-04", ticker: "ASSA B",  amount: 13.65 },
  { date: "2021-05-11", ticker: "BILL",    amount: 43    },
  { date: "2021-10-20", ticker: "HUSQ B",  amount: 22.4  },
  { date: "2021-11-25", ticker: "ASSA B",  amount: 13.65 },
  // 2022
  { date: "2022-01-04", ticker: "SBB B",   amount: 9.5   },
  { date: "2022-04-04", ticker: "SBB B",   amount: 9.5   },
  { date: "2022-04-12", ticker: "VOLV B",  amount: 78    },
  { date: "2022-04-12", ticker: "VOLV B",  amount: 78    }, // extra centennial dividend
  { date: "2022-04-13", ticker: "HUSQ B",  amount: 14    },
  { date: "2022-04-20", ticker: "EVO",     amount: 29.15 },
  { date: "2022-05-03", ticker: "SBB B",   amount: 4.18  },
  { date: "2022-05-03", ticker: "ASSA B",  amount: 14.7  },
  { date: "2022-05-11", ticker: "ALIF B",  amount: 12    },
  { date: "2022-05-16", ticker: "BILL",    amount: 55.9  },
  { date: "2022-05-24", ticker: "BYGG P",  amount: 93.75 },
  { date: "2022-06-02", ticker: "SBB B",   amount: 4.18  },
  { date: "2022-07-04", ticker: "SBB B",   amount: 4.18  },
  { date: "2022-08-04", ticker: "SBB B",   amount: 4.18  },
  { date: "2022-09-02", ticker: "SBB B",   amount: 4.18  },
  { date: "2022-10-04", ticker: "SBB B",   amount: 4.18  },
  { date: "2022-10-13", ticker: "HUSQ B",  amount: 28    },
  { date: "2022-11-02", ticker: "SBB B",   amount: 4.18  },
  { date: "2022-11-24", ticker: "ASSA B",  amount: 14.7  },
  { date: "2022-12-02", ticker: "SBB B",   amount: 4.18  },
  // 2023
  { date: "2023-01-04", ticker: "SBB B",   amount: 4.18  },
  { date: "2023-02-02", ticker: "SBB B",   amount: 4.18  },
  { date: "2023-03-03", ticker: "SBB B",   amount: 4.18  },
  { date: "2023-04-05", ticker: "SBB B",   amount: 4.18  },
  { date: "2023-04-12", ticker: "VOLV B",  amount: 308   },
  { date: "2023-04-12", ticker: "HUSQ B",  amount: 14    },
  { date: "2023-04-14", ticker: "EVO",     amount: 45.38 },
  { date: "2023-05-03", ticker: "ASSA B",  amount: 28.8  },
  { date: "2023-05-04", ticker: "COOR",    amount: 26.4  },
  { date: "2023-05-11", ticker: "SBB B",   amount: 4.56  },
  { date: "2023-05-12", ticker: "HANZA",   amount: 45    },
  { date: "2023-05-30", ticker: "BILL",    amount: 420   },
  { date: "2023-06-02", ticker: "SBB B",   amount: 4.56  },
  { date: "2023-10-06", ticker: "COOR",    amount: 26.4  },
  { date: "2023-10-10", ticker: "HUSQ B",  amount: 42    },
  { date: "2023-11-15", ticker: "ASSA B",  amount: 57.6  },
  // 2024
  { date: "2024-04-04", ticker: "VOLV B",  amount: 810   },
  { date: "2024-04-30", ticker: "ASSA B",  amount: 64.8  },
  { date: "2024-05-03", ticker: "COOR",    amount: 26.4  },
  { date: "2024-05-07", ticker: "EVO",     amount: 123.82},
  { date: "2024-05-20", ticker: "HANZA",   amount: 105.6 },
  { date: "2024-05-22", ticker: "NIBE B",  amount: 31.85 },
  { date: "2024-05-27", ticker: "BILL",    amount: 128   },
  { date: "2024-07-01", ticker: "SBB B",   amount: 45.6  },
  { date: "2024-10-08", ticker: "COOR",    amount: 6.6   },
  { date: "2024-11-13", ticker: "ASSA B",  amount: 64.8  },
  // 2025
  { date: "2025-05-14", ticker: "CTT",     amount: 171.2 },
  { date: "2025-05-19", ticker: "HANZA",   amount: 95.2  },
  { date: "2025-05-21", ticker: "NIBE B",  amount: 63.3  },
  { date: "2025-05-26", ticker: "BILL",    amount: 315   },
  // 2026 (estimat)
  { date: "2026-05-01", ticker: "NIBE B",  amount: 86.1,  estimated: true },
  { date: "2026-05-01", ticker: "BILL",    amount: 180,   estimated: true },
  { date: "2026-05-01", ticker: "AXFO",    amount: 45,    estimated: true },
  { date: "2026-05-01", ticker: "INDU C",  amount: 26.25, estimated: true },
  { date: "2026-05-01", ticker: "VOLV B",  amount: 52,    estimated: true },
  { date: "2026-05-01", ticker: "HANZA",   amount: 178.5, estimated: true },
  { date: "2026-05-01", ticker: "BERNER B",amount: 215,   estimated: true },
  { date: "2026-05-01", ticker: "CTT",     amount: 76.8,  estimated: true },
];

// ── Portfolio Transaction History ───────────────────────────────────────────
// Used to build the historical performance chart.
// Buy/sell: symbol = Yahoo symbol (null = fund), cost/proceeds = total SEK.
// Embracer shares are stored as post-split quantities (2:1 split 2021-09-29).
const PORTFOLIO_TRANSACTIONS = [
  // 2020
  { date: "2020-12-27", type: "deposit", amount: 7500 },
  { date: "2020-12-28", type: "buy",  symbol: "BILL.ST",    shares: 10,     cost: 1461 },
  { date: "2020-12-28", type: "buy",  symbol: "HUSQ-B.ST",  shares: 14,     cost: 1504 },
  { date: "2020-12-28", type: "buy",  symbol: "ASSA-B.ST",  shares: 7,      cost: 1425 },
  { date: "2020-12-29", type: "buy",  symbol: null, name: "HB_ENERGI",     shares: 3.8424, cost: 1500 },
  { date: "2020-12-30", type: "buy",  symbol: null, name: "LANNEBO",        shares: 0.9561, cost: 1500 },
  // 2021
  { date: "2021-04-07", type: "sell", symbol: null, name: "LANNEBO",        shares: 0.9561, proceeds: 1629 },
  { date: "2021-04-08", type: "buy",  symbol: "GAPW-B.ST",  shares: 29,     cost: 1727 },
  { date: "2021-04-24", type: "deposit", amount: 2500 },
  { date: "2021-04-26", type: "buy",  symbol: "EMBRAC-B.ST",shares: 18,     cost: 2291 },
  { date: "2021-05-24", type: "deposit", amount: 2500 },
  { date: "2021-05-25", type: "buy",  symbol: null, name: "HB_ENERGI",     shares: 0.5326, cost: 200 },
  { date: "2021-05-25", type: "buy",  symbol: "ALIF-B.ST",  shares: 6,      cost: 1320 },
  { date: "2021-05-25", type: "buy",  symbol: "EMBRAC-B.ST",shares: 10,     cost: 1238 },
  { date: "2021-12-24", type: "deposit", amount: 10000 },
  { date: "2021-12-27", type: "buy",  symbol: "BPART-B.ST", shares: 25,     cost: 2140 },
  { date: "2021-12-27", type: "buy",  symbol: "BILL.ST",    shares: 3,      cost: 494 },
  { date: "2021-12-27", type: "buy",  symbol: "SBB-B.ST",   shares: 38,     cost: 2397 },
  { date: "2021-12-27", type: "buy",  symbol: "VOLV-B.ST",  shares: 12,     cost: 2497 },
  { date: "2021-12-27", type: "buy",  symbol: "EVO.ST",     shares: 2,      cost: 2462 },
  // 2022
  { date: "2022-06-17", type: "buy",  symbol: "BILL.ST",    shares: 3,      cost: 254 },
  { date: "2022-11-06", type: "deposit", amount: 2500 },
  { date: "2022-11-07", type: "buy",  symbol: "HANZA.ST",   shares: 15,     cost: 738 },
  { date: "2022-11-08", type: "buy",  symbol: "HANZA.ST",   shares: 10,     cost: 473 },
  { date: "2022-11-17", type: "buy",  symbol: "HANZA.ST",   shares: 5,      cost: 215 },
  { date: "2022-11-21", type: "buy",  symbol: "HANZA.ST",   shares: 10,     cost: 440 },
  { date: "2022-11-22", type: "buy",  symbol: "HANZA.ST",   shares: 20,     cost: 878 },
  { date: "2022-12-29", type: "buy",  symbol: null, name: "NEOBO",          shares: 3.8,    cost: 237 },
  // 2023
  { date: "2023-01-01", type: "deposit", amount: 5000 },
  { date: "2023-01-02", type: "buy",  symbol: "BILL.ST",    shares: 15,     cost: 1938 },
  { date: "2023-01-02", type: "buy",  symbol: "ASSA-B.ST",  shares: 5,      cost: 1127 },
  { date: "2023-01-02", type: "buy",  symbol: "VOLV-B.ST",  shares: 10,     cost: 1901 },
  { date: "2023-02-10", type: "sell", symbol: null, name: "NEOBO",          shares: 0.8,    proceeds: 14 },
  { date: "2023-02-20", type: "sell", symbol: "ALIF-B.ST",  shares: 6,      proceeds: 736 },
  { date: "2023-02-20", type: "buy",  symbol: "COOR.ST",    shares: 11,     cost: 764 },
  { date: "2023-05-21", type: "deposit", amount: 5000 },
  { date: "2023-05-22", type: "buy",  symbol: "BILL.ST",    shares: 25,     cost: 2445 },
  { date: "2023-05-22", type: "buy",  symbol: "VOLV-B.ST",  shares: 14,     cost: 2930 },
  { date: "2023-06-01", type: "buy",  symbol: "HUSQ-B.ST",  shares: 7,      cost: 569 },
  { date: "2023-10-25", type: "deposit", amount: 5000 },
  { date: "2023-10-25", type: "buy",  symbol: "ASSA-B.ST",  shares: 12,     cost: 2796 },
  { date: "2023-10-25", type: "buy",  symbol: "EVO.ST",     shares: 2,      cost: 2119 },
  // 2024
  { date: "2024-01-01", type: "deposit", amount: 4600 },
  { date: "2024-01-02", type: "buy",  symbol: "HANZA.ST",   shares: 28,     cost: 2402 },
  { date: "2024-01-02", type: "buy",  symbol: "VOLV-B.ST",  shares: 9,      cost: 2373 },
  { date: "2024-01-29", type: "sell", symbol: "HUSQ-B.ST",  shares: 21,     proceeds: 1696 },
  { date: "2024-01-29", type: "sell", symbol: null, name: "HB_ENERGI",     shares: 4.375,  proceeds: 1313 },
  { date: "2024-01-31", type: "buy",  symbol: "NIBE-B.ST",  shares: 49,     cost: 3049 },
  { date: "2024-04-25", type: "buy",  symbol: "BILL.ST",    shares: 8,      cost: 731 },
  { date: "2024-07-01", type: "buy",  symbol: "NIBE-B.ST",  shares: 12,     cost: 545 },
  // 2025
  { date: "2025-01-02", type: "deposit", amount: 5000 },
  { date: "2025-01-02", type: "sell", symbol: "COOR.ST",    shares: 11,     proceeds: 385 },
  { date: "2025-01-02", type: "sell", symbol: null, name: "NEOBO",          shares: 3,      proceeds: 60 },
  { date: "2025-01-02", type: "sell", symbol: "ASSA-B.ST",  shares: 24,     proceeds: 7823 },
  { date: "2025-01-02", type: "sell", symbol: "EMBRAC-B.ST",shares: 28,     proceeds: 889 },
  { date: "2025-01-02", type: "sell", symbol: "GAPW-B.ST",  shares: 29,     proceeds: 411 },
  { date: "2025-01-02", type: "sell", symbol: "EVO.ST",     shares: 4,      proceeds: 3460 },
  { date: "2025-01-02", type: "sell", symbol: "SBB-B.ST",   shares: 38,     proceeds: 173 },
  { date: "2025-01-02", type: "sell", symbol: "VOLV-B.ST",  shares: 45,     proceeds: 12043 },
  { date: "2025-01-02", type: "sell", symbol: "BPART-B.ST", shares: 25,     proceeds: 352 },
  { date: "2025-01-02", type: "buy",  symbol: "BILL.ST",    shares: 26,     cost: 2661 },
  { date: "2025-01-02", type: "buy",  symbol: "HANZA.ST",   shares: 31,     cost: 2406 },
  { date: "2025-01-02", type: "buy",  symbol: "CTT.ST",     shares: 32,     cost: 9065 },
  { date: "2025-01-02", type: "buy",  symbol: "NIBE-B.ST",  shares: 150,    cost: 6545 },
  { date: "2025-01-03", type: "buy",  symbol: null, name: "NN_SVERIGE",     shares: 13.7869, cost: 9200 },
  { date: "2025-06-10", type: "sell", symbol: null, name: "NN_SVERIGE",     shares: 13.7869, proceeds: 9251 },
  { date: "2025-06-10", type: "buy",  symbol: null, name: "STOREBRAND",     shares: 5.8406, cost: 1503 },
  { date: "2025-06-10", type: "buy",  symbol: "BERNER-B.ST",shares: 172,    cost: 9194 },
  { date: "2025-12-30", type: "sell", symbol: null, name: "STOREBRAND",     shares: 5.8406, proceeds: 1585 },
  // 2026
  { date: "2026-01-01", type: "deposit", amount: 5000 },
  { date: "2026-01-02", type: "buy",  symbol: "ARXK.DE",    shares: 18,     cost: 1378 },
  { date: "2026-01-02", type: "buy",  symbol: "INDU-C.ST",  shares: 3,      cost: 1247 },
  { date: "2026-01-02", type: "buy",  symbol: "AXFO.ST",    shares: 5,      cost: 1450 },
  { date: "2026-01-02", type: "buy",  symbol: "VOLV-B.ST",  shares: 4,      cost: 1184 },
  { date: "2026-01-02", type: "buy",  symbol: "NIBE-B.ST",  shares: 35,     cost: 1245 },
];

// ── Palette ────────────────────────────────────────────────────────────────
const EXCHANGE_SUFFIX_MAP = {
  "ST": "Nasdaq Stockholm",
  "DE": "XETRA",
  "L":  "LSE",
  "OL": "Oslo Børs",
  "CO": "Nasdaq Copenhagen",
  "HE": "Nasdaq Helsinki",
};

const EXCHANGE_COLORS = [
  "#6c8ef5","#fbbf24","#a78bfa","#34d399","#f87171","#38bdf8","#fb923c",
];

function getExchange(h) {
  if (!h.yahooSymbol) return "Cash";
  const suffix = h.yahooSymbol.split(".").pop();
  return EXCHANGE_SUFFIX_MAP[suffix] || suffix;
}

const ASSET_CLASS_COLORS = {
  "Equity":       "#6c8ef5",
  "Fixed Income": "#fbbf24",
  "Alternative":  "#a78bfa",
  "Cash":         "#34d399",
};

const HOLDING_COLORS = [
  "#6c8ef5","#34d399","#f87171","#fbbf24","#a78bfa",
  "#38bdf8","#fb923c","#e879f9","#4ade80","#94a3b8",
];

// ── i18n ───────────────────────────────────────────────────────────────────
let currentLang = "sv";

const TRANSLATIONS = {
  en: {
    portfolioLabel:      "Total Value",
    totalInvested:       "Total Invested",
    totalGainLoss:       "Total Gain / Loss",
    holdingsCount:       "Number of Holdings",
    bestPerformer:       "Best Performer",
    allocationByClass:   "Allocation by Asset Class",
    allocationByHolding: "Allocation by Holding",
    allocationByExchange: "Allocation by Exchange",
    holdingsTitle:       "Holdings",
    filterAll:           "All",
    filterEquity:        "Equity",
    filterFixedIncome:   "Fixed Income",
    filterAlternative:   "Alternative",
    filterCash:          "Cash",
    colName:        "Name",
    colTicker:      "Ticker",
    colAssetClass:  "Asset Class",
    colShares:      "Shares",
    colPrice:       "Price",
    colGav:         "Avg. Cost",
    colMarketValue: "Market Value",
    colCostBasis:   "Cost Basis",
    colGainLoss:    "Gain / Loss",
    colReturn:      "Return",
    colAllocation:  "Allocation",
    dividendsTitle:  "Dividends by Year",
    depositsTitle:   "Deposits by Year",
    backBtn:         "← Back",
    pricesUpdated:   "Prices updated",
    total:           "Total",
    assetClass: { "Equity": "Equity", "Fixed Income": "Fixed Income", "Alternative": "Alternative", "Cash": "Cash" },
  },
  sv: {
    portfolioLabel:      "Totalt värde",
    totalInvested:       "Totalt investerat",
    totalGainLoss:       "Total vinst / förlust",
    holdingsCount:       "Antal innehav",
    bestPerformer:       "Bäst avkastning",
    allocationByClass:   "Fördelning per tillgångsslag",
    allocationByHolding: "Fördelning per innehav",
    allocationByExchange: "Fördelning per börs",
    holdingsTitle:       "Innehav",
    filterAll:           "Alla",
    filterEquity:        "Aktier",
    filterFixedIncome:   "Räntebärande",
    filterAlternative:   "Alternativa",
    filterCash:          "Kassa",
    colName:        "Namn",
    colTicker:      "Ticker",
    colAssetClass:  "Tillgångsslag",
    colShares:      "Antal",
    colPrice:       "Pris",
    colGav:         "GAV",
    colMarketValue: "Marknadsvärde",
    colCostBasis:   "Anskaffningsvärde",
    colGainLoss:    "Vinst / förlust",
    colReturn:      "Avkastning",
    colAllocation:  "Andel",
    dividendsTitle:  "Utdelningar per år",
    depositsTitle:   "Insättningar per år",
    backBtn:         "← Tillbaka",
    pricesUpdated:   "Priser uppdaterade",
    total:           "Totalt",
    assetClass: { "Equity": "Aktier", "Fixed Income": "Räntebärande", "Alternative": "Alternativa", "Cash": "Kassa" },
  },
};

function t(key) { return TRANSLATIONS[currentLang][key]; }

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const text = TRANSLATIONS[currentLang][el.dataset.i18n];
    if (text) el.textContent = text;
  });
  document.getElementById("langBtn").textContent = currentLang === "sv" ? "EN" : "SV";
  document.documentElement.lang = currentLang;
}

function toggleLang() {
  currentLang = currentLang === "sv" ? "en" : "sv";
  applyTranslations();
  renderDate();
  render();
}

// ── State ──────────────────────────────────────────────────────────────────
let activeFilter    = "all";
let activeCharts    = {};
let sortKey         = null;
let sortDir         = 1; // 1 = asc, -1 = desc

// ── Derived Data ───────────────────────────────────────────────────────────
function computeHoldings() {
  const totalValue = holdings.reduce((s, h) => s + h.shares * h.price, 0);
  return holdings.map(h => {
    const marketValue = h.shares * h.price;
    const gainLoss    = marketValue - h.costBasis;
    const returnPct   = h.costBasis > 0 ? (gainLoss / h.costBasis) * 100 : 0;
    const allocation  = totalValue > 0 ? (marketValue / totalValue) * 100 : 0;
    const gav         = h.shares > 0 ? h.costBasis / h.shares : 0;
    return { ...h, marketValue, gainLoss, returnPct, allocation, gav };
  });
}

// ── Formatting Helpers ─────────────────────────────────────────────────────
const fmt = {
  currency: v => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 2 }).format(v),
  pct:      v => (v >= 0 ? "+" : "") + v.toFixed(2) + "%",
  shares:   v => Number.isInteger(v) ? v.toLocaleString() : v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }),
};

function signClass(v) {
  return v > 0 ? "positive" : v < 0 ? "negative" : "neutral";
}

// ── Summary Cards ──────────────────────────────────────────────────────────
function renderSummary(computed) {
  const totalValue    = computed.reduce((s, h) => s + h.marketValue, 0);
  const totalInvested = computed.reduce((s, h) => s + h.costBasis, 0);
  const totalGL       = totalValue - totalInvested;
  const totalGLPct    = totalInvested > 0 ? (totalGL / totalInvested) * 100 : 0;
  const best          = [...computed].sort((a, b) => b.returnPct - a.returnPct)[0];

  document.getElementById("totalValue").textContent    = fmt.currency(totalValue);
  document.getElementById("totalInvested").textContent = fmt.currency(totalInvested);

  const glEl  = document.getElementById("totalGainLoss");
  const glPct = document.getElementById("totalGainLossPct");
  glEl.textContent  = fmt.currency(totalGL);
  glEl.className    = "card-value " + signClass(totalGL);
  glPct.textContent = fmt.pct(totalGLPct);
  glPct.className   = "card-sub " + signClass(totalGLPct);

  document.getElementById("holdingsCount").textContent = computed.length;

  if (best) {
    document.getElementById("bestPerformer").textContent = best.ticker;
    const bp = document.getElementById("bestPerformerPct");
    bp.textContent = fmt.pct(best.returnPct);
    bp.className   = "card-sub " + signClass(best.returnPct);
  }
}

// ── Donut Charts ───────────────────────────────────────────────────────────
function buildDonut(canvasId, labels, values, colors) {
  if (activeCharts[canvasId]) activeCharts[canvasId].destroy();
  const ctx = document.getElementById(canvasId).getContext("2d");
  activeCharts[canvasId] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: "#1a1d27",
        borderWidth: 3,
        hoverBorderWidth: 3,
      }],
    },
    options: {
      cutout: "68%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((s, v) => s + v, 0);
              const pct   = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
              return ` ${fmt.currency(ctx.parsed)}  (${pct}%)`;
            },
          },
          backgroundColor: "#1a1d27",
          borderColor: "#2a2e42",
          borderWidth: 1,
          titleColor: "#e2e8f0",
          bodyColor: "#8892a4",
          padding: 10,
        },
      },
      animation: { animateRotate: true, duration: 600 },
    },
  });
}

function renderAllocationChart(computed) {
  const totalValue = computed.reduce((s, h) => s + h.marketValue, 0);
  const classMap = {};
  computed.forEach(h => { classMap[h.assetClass] = (classMap[h.assetClass] || 0) + h.marketValue; });
  const classes = Object.keys(classMap);
  const values  = classes.map(c => classMap[c]);
  const colors  = classes.map(c => ASSET_CLASS_COLORS[c] || "#94a3b8");
  const labels  = classes.map(c => TRANSLATIONS[currentLang].assetClass[c] || c);

  buildDonut("allocationChart", labels, values, colors);

  document.getElementById("allocationLegend").innerHTML = classes.map((_, i) => `
    <div class="legend-item">
      <div class="legend-left">
        <div class="legend-dot" style="background:${colors[i]}"></div>
        <span class="legend-label">${labels[i]}</span>
      </div>
      <span class="legend-value">${fmt.currency(values[i])}</span>
      <span class="legend-pct">${((values[i] / totalValue) * 100).toFixed(1)}%</span>
    </div>
  `).join("");
}

function renderExchangeChart(computed) {
  const totalValue = computed.reduce((s, h) => s + h.marketValue, 0);
  const exchangeMap = {};
  computed.forEach(h => {
    const ex = getExchange(h);
    exchangeMap[ex] = (exchangeMap[ex] || 0) + h.marketValue;
  });
  const exchanges = Object.keys(exchangeMap);
  const values    = exchanges.map(e => exchangeMap[e]);
  const colors    = exchanges.map((_, i) => EXCHANGE_COLORS[i % EXCHANGE_COLORS.length]);

  buildDonut("exchangeChart", exchanges, values, colors);

  document.getElementById("exchangeLegend").innerHTML = exchanges.map((e, i) => `
    <div class="legend-item">
      <div class="legend-left">
        <div class="legend-dot" style="background:${colors[i]}"></div>
        <span class="legend-label">${e}</span>
      </div>
      <span class="legend-value">${fmt.currency(values[i])}</span>
      <span class="legend-pct">${((values[i] / totalValue) * 100).toFixed(1)}%</span>
    </div>
  `).join("");
}

function renderHoldingsChart(computed) {
  const labels = computed.map(h => h.ticker);
  const values = computed.map(h => h.marketValue);
  const colors = computed.map((_, i) => HOLDING_COLORS[i % HOLDING_COLORS.length]);

  buildDonut("holdingsChart", labels, values, colors);

  document.getElementById("holdingsLegend").innerHTML = computed.map((h, i) => `
    <div class="legend-item">
      <div class="legend-left">
        <div class="legend-dot" style="background:${colors[i]}"></div>
        <span class="legend-label">${h.ticker} — ${h.name}</span>
      </div>
      <span class="legend-pct">${h.allocation.toFixed(1)}%</span>
    </div>
  `).join("");
}

// ── Holdings Table ─────────────────────────────────────────────────────────
const BADGE_CLASS = {
  "Equity":       "badge-equity",
  "Fixed Income": "badge-fixed",
  "Alternative":  "badge-alt",
  "Cash":         "badge-cash",
};

function renderTable(computed) {
  let rows = activeFilter === "all" ? computed : computed.filter(h => h.assetClass === activeFilter);

  if (sortKey) {
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return sortDir * (typeof av === "string" ? av.localeCompare(bv) : av - bv);
    });
  }
  document.getElementById("holdingsBody").innerHTML = rows.map(h => {
    const badge   = BADGE_CLASS[h.assetClass] || "";
    return `
      <tr>
        <td><span class="holding-name">${h.name}</span></td>
        <td><span class="holding-ticker">${h.ticker}</span></td>
        <td><span class="badge ${badge}">${TRANSLATIONS[currentLang].assetClass[h.assetClass] || h.assetClass}</span></td>
        <td class="num">${fmt.shares(h.shares)}</td>
        <td class="num">${fmt.currency(h.price)}</td>
        <td class="num">${fmt.currency(h.gav)}</td>
        <td class="num">${fmt.currency(h.marketValue)}</td>
        <td class="num">${fmt.currency(h.costBasis)}</td>
        <td class="num ${signClass(h.gainLoss)}">${fmt.currency(h.gainLoss)}</td>
        <td class="num ${signClass(h.returnPct)}">${fmt.pct(h.returnPct)}</td>
        <td class="num">
          <div class="alloc-bar-wrap">
            <div class="alloc-bar">
              <div class="alloc-bar-fill" style="width:${Math.min(h.allocation, 100)}%"></div>
            </div>
            <span class="alloc-pct">${h.allocation.toFixed(1)}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// ── Sort Headers ───────────────────────────────────────────────────────────
function initSort(computed) {
  document.querySelectorAll(".holdings-table th[data-sort]").forEach(th => {
    th.onclick = () => {
      const key = th.dataset.sort;
      sortDir = sortKey === key ? -sortDir : 1;
      sortKey = key;
      renderTable(computed);
      updateSortHeaders();
    };
  });
  updateSortHeaders();
}

function updateSortHeaders() {
  document.querySelectorAll(".holdings-table th[data-sort]").forEach(th => {
    const active = th.dataset.sort === sortKey;
    th.classList.toggle("sort-active", active);
    th.querySelector(".sort-ind").textContent = active ? (sortDir === 1 ? " ▲" : " ▼") : "";
  });
}

// ── Filter Buttons ─────────────────────────────────────────────────────────
function initFilters(computed) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === activeFilter);
    btn.onclick = () => {
      activeFilter = btn.dataset.filter;
      buttons.forEach(b => b.classList.toggle("active", b.dataset.filter === activeFilter));
      renderTable(computed);
    };
  });
}

// ── Dividends by Year ──────────────────────────────────────────────────────
const DIVIDEND_TICKER_COLORS = [
  "#6c8ef5","#34d399","#f87171","#fbbf24","#a78bfa",
  "#38bdf8","#fb923c","#e879f9","#4ade80","#94a3b8",
  "#f97316","#c084fc","#2dd4bf",
];

function computeDividendsByYear() {
  const byYear        = {};   // year → { ticker → total }
  const tickerSet     = new Set();
  const estimatedYears = new Set();

  DIVIDENDS.forEach(d => {
    const year = d.date.slice(0, 4);
    if (!byYear[year]) byYear[year] = {};
    byYear[year][d.ticker] = (byYear[year][d.ticker] || 0) + d.amount;
    tickerSet.add(d.ticker);
    if (d.estimated) estimatedYears.add(year);
  });

  // Consistent ticker order (sorted alphabetically)
  const tickers = [...tickerSet].sort();
  return { byYear, tickers, estimatedYears };
}

function renderDividendsSection() {
  const { byYear, tickers, estimatedYears } = computeDividendsByYear();
  const yearKeys = Object.keys(byYear).sort();
  const yearLabel = y => estimatedYears.has(y) ? y + "e" : y;

  const tickerColors = {};
  tickers.forEach((t, i) => { tickerColors[t] = DIVIDEND_TICKER_COLORS[i % DIVIDEND_TICKER_COLORS.length]; });

  const datasets = tickers.map(ticker => ({
    label: ticker,
    data: yearKeys.map(y => Math.round((byYear[y][ticker] || 0) * 100) / 100),
    backgroundColor: tickerColors[ticker],
    borderWidth: 0,
    borderRadius: 3,
  }));

  if (activeCharts["dividendsChart"]) activeCharts["dividendsChart"].destroy();

  const ctx = document.getElementById("dividendsChart").getContext("2d");
  activeCharts["dividendsChart"] = new Chart(ctx, {
    type: "bar",
    data: { labels: yearKeys.map(yearLabel), datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (event, elements) => {
        const index = elements.length > 0 ? elements[0].index : (() => {
          const pts = activeCharts["dividendsChart"].getElementsAtEventForMode(event.native, "index", { intersect: false }, false);
          return pts.length > 0 ? pts[0].index : -1;
        })();
        if (index >= 0) showDividendModal(yearKeys[index], yearLabel(yearKeys[index]), byYear, tickerColors);
      },
      onHover: (event, elements) => {
        event.native.target.style.cursor = elements.length > 0 ? "pointer" : "default";
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: "#8892a4", font: { size: 13 } },
        },
        y: {
          stacked: true,
          grid: { color: "#2a2e42" },
          ticks: {
            color: "#8892a4",
            font: { size: 11 },
            callback: v => v >= 1000 ? (v / 1000).toFixed(1) + "k" : v,
          },
        },
      },
      plugins: {
        legend: {
          labels: { color: "#e2e8f0", font: { size: 11 }, boxWidth: 12, padding: 12 },
        },
        tooltip: {
          backgroundColor: "#1a1d27",
          borderColor: "#2a2e42",
          borderWidth: 1,
          titleColor: "#e2e8f0",
          bodyColor: "#8892a4",
          padding: 10,
          callbacks: {
            label: ctx => ctx.parsed.y > 0 ? ` ${ctx.dataset.label}: ${fmt.currency(ctx.parsed.y)}` : null,
            footer: items => {
              const total = items.reduce((s, i) => s + i.parsed.y, 0);
              return `Totalt: ${fmt.currency(total)}`;
            },
          },
        },
      },
    },
  });

  // Year totals summary
  const divYearTotalsEl = document.getElementById("divYearTotals");
  const grandTotal = DIVIDENDS.reduce((s, d) => s + d.amount, 0);
  divYearTotalsEl.innerHTML = yearKeys.map(y => {
    const total = Object.values(byYear[y]).reduce((s, v) => s + v, 0);
    return `<div class="div-year-item" data-year="${y}"><span class="div-year">${yearLabel(y)}</span><span class="div-total">${fmt.currency(total)}</span></div>`;
  }).join("") + `<div class="div-year-item div-year-grand-total"><span class="div-year">${t("total")}</span><span class="div-total">${fmt.currency(grandTotal)}</span></div>`;
  divYearTotalsEl.querySelectorAll(".div-year-item[data-year]").forEach(el => {
    el.addEventListener("click", () => showDividendModal(el.dataset.year, yearLabel(el.dataset.year), byYear, tickerColors));
  });
}

// ── Dividend Year Modal ────────────────────────────────────
function showDividendModal(year, label, byYear, tickerColors) {
  const yearData = byYear[year] || {};
  const tickers = Object.keys(yearData).sort((a, b) => yearData[b] - yearData[a]);
  const values  = tickers.map(t => yearData[t]);
  const colors  = tickers.map(t => tickerColors[t]);
  const total   = values.reduce((s, v) => s + v, 0);

  document.getElementById("divModalTitle").textContent =
    (currentLang === "sv" ? "Utdelningar " : "Dividends ") + label;

  if (activeCharts["divModalChart"]) activeCharts["divModalChart"].destroy();
  const ctx = document.getElementById("divModalChart").getContext("2d");
  activeCharts["divModalChart"] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: tickers,
      datasets: [{ data: values, backgroundColor: colors, borderColor: "#1a1d27", borderWidth: 3 }],
    },
    options: {
      cutout: "68%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
              return ` ${fmt.currency(ctx.parsed)}  (${pct}%)`;
            },
          },
          backgroundColor: "#1a1d27", borderColor: "#2a2e42", borderWidth: 1,
          titleColor: "#e2e8f0", bodyColor: "#8892a4", padding: 10,
        },
      },
      animation: { animateRotate: true, duration: 400 },
    },
  });

  document.getElementById("divModalLegend").innerHTML = tickers.map((ticker, i) => `
    <div class="legend-item">
      <div class="legend-left">
        <div class="legend-dot" style="background:${colors[i]}"></div>
        <span class="legend-label">${ticker}</span>
      </div>
      <span class="legend-value">${fmt.currency(values[i])}</span>
      <span class="legend-pct">${((values[i] / total) * 100).toFixed(1)}%</span>
    </div>
  `).join("");

  document.getElementById("divModal").classList.add("open");
}

function closeDivModal() {
  document.getElementById("divModal").classList.remove("open");
}

function showDividendYear(year) {
  const { byYear, tickers } = computeDividendsByYear();

  // Keep same color mapping as the bar chart
  const tickerColors = {};
  tickers.forEach((tk, i) => { tickerColors[tk] = DIVIDEND_TICKER_COLORS[i % DIVIDEND_TICKER_COLORS.length]; });

  const yearTickers = Object.keys(byYear[year] || {}).sort();
  const values  = yearTickers.map(tk => byYear[year][tk]);
  const colors  = yearTickers.map(tk => tickerColors[tk]);
  const total   = values.reduce((s, v) => s + v, 0);

  document.getElementById("dividendsChartWrap").style.display = "none";
  const detail = document.getElementById("dividendsDetail");
  detail.style.display = "block";
  document.getElementById("dividendsDetailYear").textContent = year;

  buildDonut("dividendsDetailChart", yearTickers, values, colors);

  document.getElementById("dividendsDetailLegend").innerHTML = yearTickers.map((tk, i) => `
    <div class="legend-item">
      <div class="legend-left">
        <div class="legend-dot" style="background:${colors[i]}"></div>
        <span class="legend-label">${tk}</span>
      </div>
      <span class="legend-value">${fmt.currency(values[i])}</span>
      <span class="legend-pct">${((values[i] / total) * 100).toFixed(1)}%</span>
    </div>
  `).join("");
}

function hideDividendYear() {
  document.getElementById("dividendsChartWrap").style.display = "";
  document.getElementById("dividendsDetail").style.display = "none";
  if (activeCharts["dividendsDetailChart"]) {
    activeCharts["dividendsDetailChart"].destroy();
    delete activeCharts["dividendsDetailChart"];
  }
}

// ── Deposits by Year ───────────────────────────────────────────────────────
function renderDepositsSection() {
  const byYear = {};
  PORTFOLIO_TRANSACTIONS
    .filter(t => t.type === "deposit")
    .forEach(t => {
      const year = t.date.slice(0, 4);
      byYear[year] = (byYear[year] || 0) + t.amount;
    });

  const yearKeys = Object.keys(byYear).sort();
  const amounts = yearKeys.map(y => byYear[y]);

  const cumulative = [];
  let sum = 0;
  amounts.forEach(a => { sum += a; cumulative.push(sum); });

  if (activeCharts["depositsChart"]) activeCharts["depositsChart"].destroy();

  const ctx = document.getElementById("depositsChart").getContext("2d");
  activeCharts["depositsChart"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: yearKeys,
      datasets: [
        {
          label: currentLang === "sv" ? "Insättning" : "Deposit",
          data: amounts,
          backgroundColor: "#6c8ef5",
          borderWidth: 0,
          borderRadius: 4,
          yAxisID: "y",
          order: 2,
        },
        {
          label: currentLang === "sv" ? "Kumulativt" : "Cumulative",
          data: cumulative,
          type: "line",
          borderColor: "#34d399",
          backgroundColor: "rgba(52,211,153,0.08)",
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: "#34d399",
          borderWidth: 2,
          yAxisID: "y2",
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8892a4", font: { size: 13 } },
        },
        y: {
          position: "left",
          grid: { color: "#2a2e42" },
          ticks: {
            color: "#8892a4",
            font: { size: 11 },
            callback: v => v >= 1000 ? (v / 1000).toFixed(1) + "k" : v,
          },
        },
        y2: {
          position: "right",
          grid: { display: false },
          ticks: {
            color: "#8892a4",
            font: { size: 11 },
            callback: v => v >= 1000 ? (v / 1000).toFixed(1) + "k" : v,
          },
        },
      },
      plugins: {
        legend: {
          labels: { color: "#e2e8f0", font: { size: 11 }, boxWidth: 12, padding: 12 },
        },
        tooltip: {
          backgroundColor: "#1a1d27",
          borderColor: "#2a2e42",
          borderWidth: 1,
          titleColor: "#e2e8f0",
          bodyColor: "#8892a4",
          padding: 10,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${fmt.currency(ctx.parsed.y)}`,
          },
        },
      },
    },
  });

  const depositGrandTotal = amounts.reduce((s, v) => s + v, 0);
  document.getElementById("depositYearTotals").innerHTML = yearKeys.map(y =>
    `<div class="div-year-item"><span class="div-year">${y}</span><span class="div-total">${fmt.currency(byYear[y])}</span></div>`
  ).join("") + `<div class="div-year-item div-year-grand-total"><span class="div-year">${t("total")}</span><span class="div-total">${fmt.currency(depositGrandTotal)}</span></div>`;
}

// ── Full Render ────────────────────────────────────────────────────────────
function render() {
  const computed = computeHoldings();
  renderSummary(computed);
  renderAllocationChart(computed);
  renderHoldingsChart(computed);
  renderExchangeChart(computed);
  initFilters(computed);
  initSort(computed);
  renderTable(computed);
  renderDividendsSection();
  renderDepositsSection();
}

// ── Header Date ────────────────────────────────────────────────────────────
function renderDate() {
  const locale = currentLang === "sv" ? "sv-SE" : "en-GB";
  document.getElementById("headerDate").textContent = new Date().toLocaleDateString(locale, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const [y, m, day] = PRICES_UPDATED.split("-").map(Number);
  const d = new Date(y, m - 1, day).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  document.getElementById("pricesUpdatedLabel").textContent = `${t("pricesUpdated")} ${d}`;
}

// ── Boot ───────────────────────────────────────────────────────────────────
(function init() {
  renderDate();
  applyTranslations();
  render();
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDivModal(); });
})();
