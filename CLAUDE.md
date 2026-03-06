# SCIM - Portfolio Dashboard

A static, single-page investment portfolio tracker for a Swedish stock portfolio. No build step, no backend — pure HTML/CSS/JS opened directly in a browser.

## Files

- `index.html` — layout and structure
- `styles.css` — dark theme styling
- `app.js` — all data and logic

## Architecture

Everything lives in `app.js`:

- **`holdings`** — current positions (name, ticker, yahooSymbol, assetClass, shares, price, costBasis)
- **`DIVIDENDS`** — full dividend history by date and ticker
- **`PORTFOLIO_TRANSACTIONS`** — buy/sell/deposit history used for historical performance
- **`PRICES_UPDATED`** — date string shown in the UI; update this when prices are changed

Prices are static (no live fetching). Update `price` on each holding and `PRICES_UPDATED` manually.

## Asset Classes

`"Equity"` | `"Fixed Income"` | `"Alternative"` | `"Cash"`

## Currency & Language

All prices and values are in **SEK**. The UI supports Swedish (`sv`) and English (`en`), toggled via the `EN`/`SV` button. Translations live in the `TRANSLATIONS` object.

## Charts

Uses **Chart.js 4.4** (CDN) with the date-fns adapter. Three donut charts (asset class, holding, exchange) and one stacked bar chart (dividends by year).

## Updating Holdings

1. Edit the `holdings` array in `app.js`
2. Update `PRICES_UPDATED` to today's date
3. Add any new dividends to `DIVIDENDS`
4. Add buy/sell/deposit entries to `PORTFOLIO_TRANSACTIONS`
