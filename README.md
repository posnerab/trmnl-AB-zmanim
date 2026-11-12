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
metadata roll at Milwaukee sunset.

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

## NextZman parity

Selection follows the current NextZman app: Earliest Daven is sunrise minus
72 minutes; one Shema is the latest of Gra and all MGA candidates (excluding
Baal Hatanya); Tefilla and Chatzos omit method/night qualifiers. Tzeis keeps
Hebcal's 72-minute calculation with the shorter label. Havdalah is exactly
sunset plus 72 minutes in both Shabbos periods. Maariv appears only when the
CBJ calendar publishes it; published special events also participate. The
overnight Sunday deadline is Latest Melave Malka. CBJ Mincha participates in
every period, and elapsed rows disappear immediately after their inclusive
event boundary.

The live first polling URL uses a rolling date range; `src/settings.yml` reflects
the saved configuration. The transform chooses the matching civil day's times,
refuses stale-day data, and bridges a period without a next event to actual
tomorrow data when available. All layouts label that selection Tomorrow. Missing
tomorrow data never causes today's clocks to be reused.

The first polling URL is configured in the TRMNL plugin settings UI as follows,
preserving the second URL, polling headers, and body:

```text
https://www.hebcal.com/zmanim?cfg=json&sec=1&zip=53216&start={{ "now" | date: "%s" | minus: 86400 | date: "%Y-%m-%d" }}&end={{ "now" | date: "%s" | plus: 172800 | date: "%Y-%m-%d" }}
```

This range covers Milwaukee today and tomorrow around UTC midnight and DST.
Use plain Liquid braces: the help article's `##` prefix remains literal in this
settings UI's Parse result and causes polling to fail. Parse must produce clean
dated URLs, then Test request must return a JSON batch before saving.

Both the MCP settings tool and the authenticated account API reject this URL
change with the UI-only host-move guard while polling headers are set, even
though both URLs use the same Hebcal host. Do not clear headers or the body to
bypass that guard. After saving in the UI, read back the settings, refresh data,
verify actual tomorrow dates in `transform_raw_input`, and render all four
layouts. The live range was verified on November 12, 2026: the raw Hebcal batch
contained November 11–14 and the refreshed transform was healthy.

The generated CBJ block now includes published Maariv and special events.
Regenerate from the shared calendar; do not edit those blocks manually.

References: [TRMNL dynamic polling URLs](https://help.trmnl.com/en/articles/12689499-dynamic-polling-urls)
and [Hebcal batch zmanim](https://www.hebcal.com/home/1663/zmanim-halachic-times-api).
