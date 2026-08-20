# Alaiku Honey — one-page contact site

A single-page contact card for a honey producer in Bishkek. Photo-led: large
images carry the product, the interface stays out of the way, and every route
to a conversation sits one tap away.

Plain HTML and CSS. No JavaScript, no build step, no dependencies. Open
`index.html` and it runs.

```
index.html            all markup and copy
styles.css            tokens, layout, the load sequence
assets/photo-*.svg    placeholder photos — replace with your own
assets/mark.svg       favicon and logo
assets/qr.svg|.png    QR code for the published URL
```

## Your details, and where they live

In `index.html`, inside the block marked `EDIT THESE`.

| Channel | Link in the file | Rule |
| --- | --- | --- |
| WhatsApp | `https://wa.me/996702546222` | Digits **only** — country code included, **no `+`**, no spaces or dashes. |
| Phone | `tel:+996702546222` | E.164 — this one **does** keep the leading `+`. |
| Instagram | `https://instagram.com/alaikuubaly` | Profile username. |

The tile row under the WhatsApp button is `grid-auto-flow: column`, so it sizes
itself to however many tiles are in it. Adding a channel back — Telegram is
`https://t.me/<username>`, username without the `@` — means copying one
`.channel` block and giving it the next `--i`. No CSS change either way.

The two easy mistakes are opposites: a `+` left in the WhatsApp link breaks it,
and a `+` missing from `tel:` means people abroad cannot dial you. Check both.

Change a number in three places at once — the `href`, the visible text in
`.channel__detail`, and the `aria-label`.

### Everything else to edit

- **Business name** — `Alaiku Honey` appears in `.brand`, the `<title>` and
  the `og:title`. It is a placeholder; use your real name.
- **Headline and the line under it** — `.title` and `.subtitle`.
- **The terms label** — `.offer`, the pill between them. Delete the whole
  `<p>` if you only sell one way.
- **Address and hours** — `.details`. The address links to Google Maps; update
  the `query=` part of that URL if you move.
- **`<title>` and `<meta name="description">`** — what shows in search results
  and when someone shares the link.

## The hero

The hero is the three clips, not a photo. They were separate before — a still
at the top and a slider further down — which meant two media blocks competing
and a 1413px page. Merging them cut it to **1034px** and put the most
compelling thing first.

| File | Size | What it is |
| --- | --- | --- |
| `clip-1.mp4` | 360×270, 5.5s | Comb frames lifted from the hive |
| `clip-2.mp4` | 360×270, 5.1s | Honey straining through a sieve into a bucket |
| `clip-3.mp4` | 464×348, 6.3s | Wax cappings cut off a frame with a knife |
| `clip-1..3.jpg` | matching each clip | Poster frames — first frame of each |
| `valley-1..2.jpg` | 520×520 | The Alay range, in a band under the map |
| `hero.jpg` | 1182×788 | No longer on the page — kept as the `og:image` for link previews |

**4:3, not square.** The source is 9:16 phone video, so any landscape crop
discards a lot; square kept more but pushed the WhatsApp button toward the
fold. 4:3 is the compromise, and the CTA now sits above the fold on a 375×812
phone — verified, not assumed.

**Sticky.** The hero is `position: sticky; top: 0` and the sheet below it
scrolls up over it, so the video stays visible instead of being the first
thing lost. `.card` uses `overflow: clip` rather than `overflow: hidden` —
hidden would silently break the sticky.

**It advances itself.** The clips are not looped: each one running to its end
is what drives the sequence, via the `ended` event, wrapping 3 → 1. A manual
swipe wins — the scroll handler picks up wherever the visitor landed.

### Weight, and how it is kept down

The clips total 936KB, but opening the page does not cost that:

- Only **clip 1** carries `autoplay` and `preload="metadata"`; the others are
  `preload="none"` and are fetched the first time they play. `autoplay`
  overrides `preload`, which is why it is on one clip only — on all three it
  silently pulled every file at load.
- All three are CRF 29 after a denoise pass (`hqdn3d`), which is what makes
  that bitrate hold up: WhatsApp's noise is expensive to encode, so removing
  it first buys back most of what the grade and the sharpen cost.
- Nothing decodes while the hero is off screen, and nothing autoplays at all
  under `prefers-reduced-motion: reduce` — those visitors get posters and
  ordinary video controls.
- Every clip is silent; there is no audio track in the files at all.

### One quirk worth knowing

Browsers restore the scroll position of scrollable elements across a reload,
which dropped returning visitors into the middle of the sequence. That restore
lands at an unpredictable moment — later than `load` in Chrome — so `app.js`
holds the track on clip 1 for a 1600ms settling window and gives up the moment
the visitor touches it. Auto-advance cannot fire in that window: clip 1 is the
only one that autoplays at load, and it runs 5.5 seconds.

### The grade

All three clips and `hero.jpg` run through the same pass: `hqdn3d` to take out
WhatsApp's blocking, a small warm push and a saturation lift so the honey reads
as honey, then a light `unsharp`. The exact chain is in `honey_assets/CONTENTS.md`
so it can be re-run when better source arrives. It is a cosmetic pass — it
cannot put back detail that was never in the file.

### The quality ceiling

Most source video came through WhatsApp at **360×640**; the newer batch made it
through at 464×832, which is why clip 3 is the sharpest of the three. The comb
close-up from that batch is unused: at 0.9 seconds it is too short to hold a
slot, and slowing it to fit read as slow motion rather than as a clip. The clips
work at their display size, but that is the limit. The originals on the phone
are almost certainly 1080p or 4K — pulling them off unchanged (AirDrop, Drive,
or email as a *file attachment*) would let the hero be genuinely sharp.

Still missing: **a photo of a jar.**

## The valley band

Two square photos sit directly under the map, tight to it: the map says where
the honey comes from, the photos say what that place looks like. A wide gap
made them read as two unrelated blocks, so the margin is deliberately smaller
than the one above the map.

They are square because the map is already wide — a landscape pair under it
made the page bottom-heavy — and because both sources are landscape, so 1:1
crops rather than upscales. `object-fit: cover` does the cropping, which means
swapping in different photos needs no code change.

**These two are placeholders.** They came in as Safari downloads with no camera
EXIF and no established licence, and a third one in the same batch carries a
visible photographer's credit. `honey_assets/CONTENTS.md` records what is known
about each. Photographs of the actual valley would replace them one-for-one.

## The origin map

`assets/origin.svg` is a real topographic map, built from open data and
rendered to SVG. Nothing is drawn from imagination:

- **Relief** — SRTM 30m elevation, an 8192-point grid over the district
  (974–4738m), turned into a hillshade lit from the northwest and tinted by
  altitude. Embedded as a small PNG inside the SVG.
- **Rivers, roads, settlements, district boundary** — OpenStreetMap, fetched
  via Overpass: 128 rivers, 303 roads, 79 settlements.
- **Place names** — OSM `name:en` where it exists, otherwise transliterated
  from Kyrgyz Cyrillic, so the map matches the language of the page.
- Labels are placed greedily and any that would collide with another label,
  the title plate or the marker is dropped. Eight survive.

Projection is equirectangular with a `cos(lat)` correction — fine over this
extent. The whole thing is one self-contained 188KB file: no tile server, no
API key, no third-party request at page load, and no usage limits to trip over.

### Where the marker sits

OpenStreetMap has **no feature named Alaiku** — no valley, no river. The only
things carrying the name are two businesses, and the marker sits on one of
them, the Alaiku Camp at 40.308/74.272, inside Kara-Kulja district.

So treat the marker as *approximate*. If the valley is somewhere else in the
district, say where and it moves. The district boundary, the terrain and the
place names around it are all accurate regardless.

To rebuild after changing the extent or labels, re-fetch the elevation grid and
Overpass features, then re-run the generator.

## Design notes

Warm and light, because honey is warm and light. The page background sits close
to paper rather than the heavy cream most honey brands reach for — the
photographs are meant to supply the colour, not the interface.

Two colours with two separate jobs, so they never compete:

- **Amber `#b0710f`** is the brand — the mark, the name, the focus ring. It is
  never used behind white text, where it would fail contrast.
- **Green is action.** The WhatsApp button is a soft fill `#dcefdc` with a
  dark green `#075e54` label — 6.4:1, and it sits far better in a warm light
  palette than a heavy dark slab. The bright `#25D366` is not used as a
  background anywhere: it cannot carry white label text at this size, landing
  near 2:1 against white.

Type is Manrope throughout. Colours, spacing and radii are CSS custom
properties at the top of `styles.css`. Change them there, not further down.

## The opening animation

One sequence on load, about 1.3 seconds, then the page sits still: the hero
photo settles from a slight zoom, the wordmark closes up from wider
letter-spacing, the headline resolves out of a blur, then the buttons cascade
70ms apart and the WhatsApp button gives one soft ring pulse.

All CSS. To retime it, change the `70ms` step in `.rise`. To reorder it, change
the `--i` numbers in `index.html` — they are step positions. The whole sequence
sits inside a `prefers-reduced-motion: no-preference` block, so anyone who has
asked their system to reduce motion gets the finished page with no movement.
Nothing that hides content lives outside a `@keyframes` block either, so the
page still renders in full if the animation never runs.

## Accessibility

- Every text colour meets WCAG AA on its background; the tightest is 4.7:1,
  including the white label on the green button.
- The WhatsApp button is 56px tall and the three channel cards 115px, well
  above the 44px minimum for a comfortable tap.
- Every link has a visible amber focus ring. Do not remove the outline without
  replacing it.

## The QR code

`assets/qr.svg` (print) and `assets/qr.png` (screen) encode the published
GitHub Pages URL, at error-correction level Q so a scuffed print still scans.
Keep the white border — that quiet zone is required.

**It is tied to the current URL.** Renaming the repository or moving to a
custom domain breaks every printed copy, so settle the address before printing
anything.

## Publish it

Pages is already enabled on `main` / root. Commit, push, and the site rebuilds
in about a minute at
`https://chalshik.github.io/web-presentation-template/`. Nothing to build.

## Local preview

```bash
python3 -m http.server 4173
```
