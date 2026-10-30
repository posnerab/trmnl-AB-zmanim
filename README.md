# trmnl-AB-zmanim
TRMNL plugin source for Zmanim

## Calendar and presentation

The November–December 2026 CBJ Mincha and candle-lighting times come from the
shared calendar generator. Run `python3 shared/scripts/cbj_calendar.py sync`
from Projects; keep `src/transform.js` and the parent
`scripts/zmanim_transform.js` identical. Do not hand-edit the generated block.

Full, horizontal half, vertical half and quadrant layouts use TRMNL framework
classes with inline SVG zman icons (no external emoji assets). The full layout
retains the current period's zmanim; compact views emphasize the next zman,
bilingual parasha and holiday countdown. Hebrew dates and upcoming Shabbos
metadata roll at Milwaukee sunset. Existing zman selection rules are preserved.

The calendar polling URL enables major/minor holidays, fasts, Rosh Chodesh and
special Shabbosos/Mevarchim, with two Gregorian years to cover December's next
holiday. Countdown days are civil dates until the holiday's starting evening;
fasts count to their daytime date, and active holidays display Today. Rosh Chodesh
and special Shabbosos are not the next-holiday countdown target. Times remain
Milwaukee-based and update on TRMNL refresh, not every second.

Run `npm test` in the parent tooling repo. For live publication, save current
settings and all markup, upload the transform and four layouts, update only the
polling URL, refresh data and inspect returned fields. Then render all four sizes
on the device model (`og_plus`). Confirm saved content matches source. A rendered
preview confirms layout; it does not prove the physical display has refreshed.

Shema (Gra) uses Hebcal `sofZmanShma` daily, matching all eight CBJ Shabbos
Shema times in November–December 2026 to the printed minute. Shema (MGA) selects
the latest available `sofZmanShmaMGA*` candidate, matching Next Zman notifications
and complications. Neither Gra nor Baal Hatanya is included in the MGA maximum.
