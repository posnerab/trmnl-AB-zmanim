# trmnl-AB-zmanim
TRMNL plugin source for Zmanim

## Calendar and presentation

The November–December 2026 CBJ Mincha and candle-lighting times come from the
shared calendar generator. Run `python3 shared/scripts/cbj_calendar.py sync`
from Projects; keep `src/transform.js` and the parent
`scripts/zmanim_transform.js` identical. Do not hand-edit the generated block.

Full, horizontal half, vertical half and quadrant layouts use TRMNL framework
classes with inline SVG icons. The full screen emphasizes the next zman, with
remaining times on the right, bilingual date/parasha, holiday countdown, and a
bottom row for weather, AQI and lunar phase. It uses the Classic typeface on the
device's full-screen playlist item. Compact layouts retain their zmanim focus.
Hebrew dates and upcoming Shabbos metadata roll at Milwaukee sunset. Hebrew
dates include the short year (`תשפ״ז`, without `ה׳`), and Hebrew parasha names
omit `פרשת`/`פרשה`, matching NextZman.

The calendar polling URL enables major/minor holidays, fasts, Rosh Chodesh and
special Shabbosos/Mevarchim, with two Gregorian years to cover December's next
holiday. Countdown days are civil dates until the holiday's starting evening;
fasts count to their daytime date, and active holidays display Today. Rosh Chodesh
and special Shabbosos are not the next-holiday countdown target. Times remain
Milwaukee-based and update on TRMNL refresh, not every second.

Run `npm test` in the parent tooling repo. For live publication, save current
settings, all markup, and the device playlist. Upload changed source files with
exact read-back, refresh data and inspect the returned fields, then render all
four sizes on `og_plus`. Check the actual device image separately from the editor
preview and wait for a fresh hardware check-in. A served image and hardware
check-in establish delivery, not a photograph of the physical e-ink panel.

## Combined data and single-screen playlist

The visible **Zmanim** plugin (`140532`) uses **Plugin Merge**. `src/shared.liquid`
declares its four exact dependencies so TRMNL continues to fetch their data:

| Source | Instance | Data |
| --- | --- | --- |
| Zmanim · Hebcal Data | `540290` | Two Hebcal polling URLs, dated solar times and calendar context |
| Milwaukee | `140203` | Existing Tempest weather, Fahrenheit, mph and inches |
| Air Quality | `384908` | Existing local AQI recipe and its status |
| Lunar Calendar | `141216` | Existing lunar phase and illumination |

`data/settings.yml` and `data/transform.js` recreate the hidden Hebcal feed. It
retains actual dated solar calculations and trims unused calendar fields. The
visible plugin recomputes selection from those dates at its own refresh time.
Native merge sources are direct objects; private sources are wrapped in
`merge_variables`, sometimes with an additional `data` object. The canonical
transform accepts both these envelopes and the original `IDX_0`/`IDX_1` polling
shape, preserving the tester and other consumers.

Only playlist item `887709` is visible on device `27064`; its font is `classic`.
The former mashups are hidden. Keep source item `906606` and the native/AQI
source entries hidden in the playlist: they supply data without rotating onto
the display. Do not delete the source plugins. There is no account API key in
polling URLs, headers, markup or source; Plugin Merge stays within TRMNL.

Weather observations older than three hours display an update-delay message.
Missing weather, AQI or lunar data leaves Zmanim usable. Missing current-day
Hebcal data shows a refresh-needed state rather than yesterday's clocks. Values
and event selection update on TRMNL's refresh/check-in schedule, not at exact
second boundaries. This does not inherit an iPhone's per-zman display toggles;
it follows NextZman's default selection rules.

The plugin MCP refresh tool only supports polling. For this merged plugin use
**Refresh now** in its settings UI, then verify merge variables and production
logs. The synchronous markup writer can report a localhost transform-preview
failure while the asynchronous production worker succeeds; require a fresh
successful worker result, never treat the saved receipt alone as validation.
TRMNL GitHub Sync may create commits after markup saves: fetch and reconcile
those exact saved files before publishing leaf-to-parent source changes.

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

The hidden Hebcal feed's first polling URL uses a rolling date range;
`data/settings.yml` reflects that feed. The visible plugin retains its original
polling fields while using Plugin Merge. The transform chooses the matching civil day's times,
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
