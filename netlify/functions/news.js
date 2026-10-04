// Serverless proxy for NewsAPI.org.
// Runs server-side on Netlify, so the API key in NEWS_API_KEY never reaches the browser.
// Set NEWS_API_KEY in Netlify: Site settings -> Environment variables.

const REGION_QUERIES = {
  apac: '(supply chain OR logistics OR freight) AND (Asia OR China OR India OR Vietnam OR Japan)',
  europe: '(supply chain OR logistics OR freight) AND (Europe OR EU OR Germany OR Rhine)',
  americas: '(supply chain OR logistics OR freight) AND (nearshoring OR Mexico OR "United States" OR Panama)',
  mea: '(supply chain OR logistics OR freight) AND ("Middle East" OR Africa OR "Red Sea" OR Suez OR Gulf)'
};

const TOPIC_QUERIES = {
  climate: '(ESG OR sustainability) AND (climate OR "net zero" OR "carbon emissions" OR "carbon credit")',
  governance: '(ESG OR sustainability) AND (CSRD OR disclosure OR governance OR "double materiality" OR assurance)',
  social: '(ESG OR sustainability) AND ("human rights" OR "labor rights" OR "living wage" OR "supply chain due diligence")',
  finance: '(ESG OR sustainability) AND ("green bond" OR "sustainability-linked loan" OR "transition finance" OR "green finance")'
};

const TAG_RULES = [
  { tag: 'sustain', tagLabel: 'Sustainability', words: ['carbon', 'emission', 'sustainab', 'climate', 'esg', 'recycl', 'circular', 'regulation', 'compliance', 'labor', 'labour', 'water', 'bond', 'finance'] },
  { tag: 'risk', tagLabel: 'Resilience', words: ['disrupt', 'drought', 'delay', 'reroute', 'canal', 'conflict', 'shortage', 'strike', 'risk'] },
  { tag: 'freight', tagLabel: 'Freight', words: ['port', 'shipping', 'freight', 'container', 'logistics', 'rail', 'truck'] }
];

function classify(text) {
  var lower = (text || '').toLowerCase();
  for (var i = 0; i < TAG_RULES.length; i++) {
    var rule = TAG_RULES[i];
    for (var j = 0; j < rule.words.length; j++) {
      if (lower.indexOf(rule.words[j]) !== -1) return { tag: rule.tag, tagLabel: rule.tagLabel };
    }
  }
  return { tag: 'freight', tagLabel: 'Dispatch' };
}

exports.handler = async function (event) {
  var params = event.queryStringParameters || {};
  var key, query;
  if (params.topic) {
    key = params.topic;
    query = TOPIC_QUERIES[key] || TOPIC_QUERIES.climate;
  } else {
    key = params.region || 'apac';
    query = REGION_QUERIES[key] || REGION_QUERIES.apac;
  }
  var apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 501,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'NEWS_API_KEY is not set on this Netlify site yet.' })
    };
  }

  var url = 'https://newsapi.org/v2/everything?' + new URLSearchParams({
    q: query,
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '6'
  }).toString();

  try {
    var res = await fetch(url, { headers: { 'X-Api-Key': apiKey } });
    var data = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: data.message || 'NewsAPI request failed.' })
      };
    }

    var items = (data.articles || []).map(function (a) {
      var classification = classify(a.title + ' ' + (a.description || ''));
      return {
        code: (a.source && a.source.name ? a.source.name.slice(0, 12).toUpperCase() : 'WIRE'),
        tag: classification.tag,
        tagLabel: classification.tagLabel,
        title: a.title,
        body: a.description || '',
        url: a.url,
        publishedAt: a.publishedAt
      };
    });

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=900' },
      body: JSON.stringify({ key: key, items: items })
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Could not reach NewsAPI.' })
    };
  }
};
