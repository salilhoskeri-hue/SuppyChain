# The Manifest

**Global trade, tracked through a sustainability lens.**

The Manifest is a single-page website that explains how global supply chains work and what they cost the planet. It covers freight, ESG, sustainable sourcing and the SAP systems that most large supply chains run on.

🔗 **Live site:** https://salilhoskeri-hue.github.io/SuppyChain/

---

## What's inside

| Section | What it covers |
|---|---|
| **01 · The Dispatch Board** | Supply chain and freight news by region: Asia-Pacific, Europe, Americas, Middle East & Africa |
| **02 · The ESG Wire** | ESG news by theme: climate, governance and disclosure, social and labour, green finance |
| **03 · The Sustainability Dossier** | Nine case files: Scope 3 emissions, circularity, ethical sourcing, climate-resilient logistics, regulation (CBAM, CSRD), technology, water, packaging and labour |
| **04 · Signal Map** | The 17 UN Sustainable Development Goals, with the 7 most relevant to supply chains linked to dossier files |
| **05 · The SAP Primer** | The SAP S/4HANA Sourcing & Procurement (MM) procure-to-pay flow, a reference list of 37 T-codes, and an example sourcing walkthrough |
| **06 · SAP Ariba** | How Ariba and SAP Business Network fit in front of the S/4HANA core, plus recent Joule AI features |
| **07 · Field Glossary** | Key terms explained simply: Scope 1/2/3, CBAM, CSRD, EPR, nearshoring and more |

## Project structure

```
├── index.html               # The whole site (HTML, CSS and JavaScript in one file)
├── netlify.toml             # Netlify config: publish folder, functions, /api/news redirect
└── netlify/
    └── functions/
        └── news.js          # Server-side proxy to NewsAPI.org for the live news feeds
```

## Live news feed vs. curated fallback

The Dispatch Board and ESG Wire can show **live headlines** from [NewsAPI.org](https://newsapi.org). To keep the API key private, a small serverless function (`netlify/functions/news.js`) fetches the news on the server. It tags each story as Freight, Resilience or Sustainability.

- **On GitHub Pages** (the link above), there's no server to run that function. The site shows **hand-curated briefs** and labels them *"Curated fallback — live feed unavailable"*.
- **On Netlify**, the live feed turns on. To set it up:
  1. Import this repository into [Netlify](https://www.netlify.com/).
  2. Go to **Site settings → Environment variables** and add `NEWS_API_KEY` with your NewsAPI key.
  3. Redeploy. The site will load live headlines from `/api/news`.

## Run it locally

No build step is needed. Download or clone the repo and open `index.html` in a browser. To test the live feed locally, use the [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`netlify dev`) with `NEWS_API_KEY` set.

## About

Built by **Salil Hoskeri** (MSc Sustainable Supply Chain Management, UCD Michael Smurfit Graduate Business School), drawing on a background in SAP procure-to-pay support (SAP Ariba, SAP MM, Guided Buying, Invoice-to-Pay).

This is a learning and portfolio project. The figures on the site are attributed to their sources (CDP, FAO, UNEP, Circularity Gap Report, SAP). The SAP walkthrough uses a fictional company for illustration.
