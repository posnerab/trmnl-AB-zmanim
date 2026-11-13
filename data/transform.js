// Hidden Hebcal polling source for the Zmanim Plugin Merge dashboard.
// Keep dated solar calculations intact so the dashboard selects at its own refresh time.
function transform(input) {
  const zmanim = input.IDX_0;
  const calendar = input.IDX_1;
  if (!zmanim || !zmanim.times || !calendar || !Array.isArray(calendar.items)) {
    throw new Error("Missing Hebcal polling response");
  }
  const today = new Date().toISOString().slice(0, 10);
  const dateKey = days => new Date(Date.parse(today + "T12:00:00Z") + days * 86400000).toISOString().slice(0, 10);
  const start = dateKey(-2);
  const end = dateKey(370);
  const dailyEnd = dateKey(10);
  const items = calendar.items.filter(e => e.date >= start && e.date.slice(0, 10) <= end
    && (e.category !== "hebdate" || e.date <= dailyEnd)).map(e =>
    Object.fromEntries(["date", "category", "subcat", "title", "title_orig", "hebrew", "hdate"]
      .filter(k => e[k] !== undefined).map(k => [k, e[k]])));
  return { zmanim, calendar: { items }, fetched_at: new Date().toISOString() };
}
if (typeof module !== "undefined") module.exports = { transform };
