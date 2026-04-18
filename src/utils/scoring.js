// V&R Milestone Scoring Engine
// 38 Indicators | 4 Locked Sources | 7 V&R Gates

export const BUSINESS_WEIGHTS = {
  'Default': { mh: 0.20, wc: 0.20, ei: 0.25, hl: 0.25, ed: 0.10 },
  'Retail & F&B': { mh: 0.15, wc: 0.15, ei: 0.15, hl: 0.40, ed: 0.15 },
  'Office': { mh: 0.15, wc: 0.20, ei: 0.30, hl: 0.15, ed: 0.20 },
  'Luxury': { mh: 0.10, wc: 0.35, ei: 0.10, hl: 0.30, ed: 0.15 },
  'Tech & Innovation': { mh: 0.10, wc: 0.15, ei: 0.30, hl: 0.15, ed: 0.30 },
};

export const OVERLAY_MODES = ['Full V&R', 'Wealth', 'Education', 'Rich & Educated'];

export const CITY_VIEWS = {
  'Riyadh': { lat: 24.71, lng: 46.67, zoom: 11 },
  'Makkah': { lat: 21.41, lng: 39.83, zoom: 12 },
  'Madinah': { lat: 24.47, lng: 39.60, zoom: 12 },
  'Dubai': { lat: 25.18, lng: 55.26, zoom: 11 },
  'London': { lat: 51.51, lng: -0.12, zoom: 11 },
  'Singapore': { lat: 1.30, lng: 103.84, zoom: 11.5 },
  'New York': { lat: 40.74, lng: -73.99, zoom: 11 },
};

export function computeScore(scores, weights) {
  return Math.round(
    scores.mh * weights.mh +
    scores.wc * weights.wc +
    scores.ei * weights.ei +
    scores.hl * weights.hl +
    scores.ed * weights.ed
  );
}

export function getDisplayScore(district, weights, overlay) {
  if (overlay === 'Wealth') return district.w;
  if (overlay === 'Education') return district.e;
  if (overlay === 'Rich & Educated') return Math.round(district.w * 0.65 + district.e * 0.35);
  return computeScore(district.s, weights);
}

export function getScoreColor(score) {
  if (score >= 80) return '#16a34a';
  if (score >= 65) return '#22c55e';
  if (score >= 50) return '#eab308';
  if (score >= 35) return '#f97316';
  return '#ef4444';
}

export function getTierInfo(score) {
  if (score >= 80) return { label: 'Prime Investment Zone', color: '#166534', bg: '#dcfce7', border: '#16a34a' };
  if (score >= 65) return { label: 'Strong Opportunity', color: '#15803d', bg: '#f0fdf4', border: '#22c55e' };
  if (score >= 50) return { label: 'Moderate — Due Diligence', color: '#a16207', bg: '#fefce8', border: '#eab308' };
  if (score >= 35) return { label: 'Caution — High Risk', color: '#c2410c', bg: '#fff7ed', border: '#f97316' };
  return { label: 'Avoid', color: '#991b1b', bg: '#fef2f2', border: '#f87171' };
}

export const CATEGORIES = [
  { key: 'mh', label: 'Market Health & Risk', color: '#6366f1' },
  { key: 'wc', label: 'Wealth & Capital Flow', color: '#8b5cf6' },
  { key: 'ei', label: 'Economic & Social Infrastructure', color: '#3b82f6' },
  { key: 'hl', label: 'Hyperlocal Signals', color: '#14b8a6' },
  { key: 'ed', label: 'Education & Human Capital', color: '#f59e0b' },
];

export const DATA_SOURCES = [
  { name: 'UBS Global RE Bubble Index', count: 5, color: '#6366f1' },
  { name: 'Knight Frank Wealth Report', count: 10, color: '#8b5cf6' },
  { name: 'World Economic / WEF / UN', count: 15, color: '#3b82f6' },
  { name: '4-Star Academic Research', count: 8, color: '#14b8a6' },
];
