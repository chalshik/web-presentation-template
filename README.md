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
| WhatsApp | `https://wa.me/996773160307` | Digits **only** — country code included, **no `+`**, no spaces or dashes. |
| Telegram | `https://t.me/chigurick` | Username **without** the `@`. |
| Phone | `tel:+996773160307` | E.164 — this one **does** keep the leading `+`. |
| Instagram | `https://instagram.com/chigurick` | Profile username. |

The two easy mistakes are opposites: a `+` left in the WhatsApp link breaks it,
and a `+` missing from `tel:` means people abroad cannot dial you. Check both.

Change a number in three places at once — the `href`, the visible text in
`.channel__detail`, and the `aria-label`.

### Everything else to edit

- **Business name** — `Alaiku Honey` appears in `.brand`, the `<title>` and
  the `og:title`. It is a placeholder; use your real name.
- **Headline and the line under it** — `.title` and `.subtitle`.
- **Address and hours** — `.details`. The address links to Google Maps; update
  the `query=` part of that URL if you move.
- **`<title>` and `<meta name="description">`** — what shows in search results
  and when someone shares the link.

## The photographs

All four are real, cut from the material in `honey_assets/`:

| File | Size | What it is |
| --- | --- | --- |
| `hero.jpg` | 1182×788 | Capped comb and bees, centre-cropped 3:2 from the one full-size photo |
| `photo-1.jpg` | 360×360 | Bees on comb |
| `photo-2.jpg` | 360×360 | Honey straining into a bucket |
| `photo-3.jpg` | 360×360 | This season's buckets |

The three squares are single frames pulled from video. That works only because
they display at ~108 CSS px on a phone — a 360px frame is a genuine 3.3×, so
they stay sharp. Do not reuse them anywhere larger.

`pour.mp4` is a 6-second silent loop of the straining shot, 436KB, not yet
placed on the page. See below for why.

### The ceiling on all of this

Every video came through WhatsApp at **360×640**, and one photo at 462×1000.
WhatsApp re-compresses hard on send. The originals on the phone are almost
certainly 1080p or 4K, and getting them off the device unchanged — AirDrop,
Google Drive, or email as a *file attachment* rather than a photo — would be a
far bigger quality jump than any processing here.

Until then, the hero video stays off the page: at 360px wide it would display
across ~536 CSS px, well under 1× density, and look visibly soft next to the
photo that is there now.

**The gap worth filling: there is no photo of a jar.** Every asset is hives,
extraction or bulk buckets. Customers buy a jar, and there is currently no
picture of one. A few jars on a windowsill with light coming through them would
do more for sales than anything else on this list.

When replacing a photo, update the `width` and `height` attributes to the real
pixel size. The CSS also pins `aspect-ratio` on each slot, so the layout never
jumps while an image loads.

## The origin map

`assets/origin.svg` is a drawn locator, not a real map — stylised mountains, a
marker, and three hives, in the site's own palette. It makes no claim to
cartographic accuracy; it says "this honey comes from a mountain valley" and
names the place in text.

The place is real and was checked: OpenStreetMap's geocoder puts Kara-Kulja at
40.633, 73.591 and confirms Alaiku sits inside Кара-Кулжа району, Ош облусу.
Osh city is at 40.517, 72.805 for reference.

It is deliberately not a pin on exact coordinates. Naming the valley and
district tells the provenance story without publishing where the hives
physically stand. If you would rather show the precise spot, say so and I will
swap it for a real interactive map — OpenStreetMap has a free keyless embed.

To move the marker, edit `PIN_X` / `PIN_Y` in the SVG's marker group, or ask and
I will regenerate it.

## Design notes

Warm and light, because honey is warm and light. The page background sits close
to paper rather than the heavy cream most honey brands reach for — the
photographs are meant to supply the colour, not the interface.

Two colours with two separate jobs, so they never compete:

- **Amber `#b0710f`** is the brand — the mark, the name, the focus ring. It is
  never used behind white text, where it would fail contrast.
- **Dark green `#075e54`** is action. That is WhatsApp's own dark green, not
  the familiar bright `#25D366`, which cannot carry white label text at this
  size — it lands near 2:1 against white, while the dark one clears 7:1.

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
- Every button is 56px tall, above the 44px minimum for a comfortable tap.
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
