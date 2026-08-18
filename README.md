# Northbar — one-page contact site

A single-page contact card for an espresso equipment supplier in Bishkek. One
screen: what you do, four ways to reach you, address and hours. A conventional
light layout — white card, clear hierarchy, one primary action — so nothing on
it needs explaining to a first-time visitor.

Plain HTML and CSS. No JavaScript, no build step, no dependencies. Open
`index.html` and it runs.

```
index.html          all markup and copy
styles.css          tokens, layout, the load animation
assets/machine.svg  the product illustration
assets/mark.svg     favicon and logo
```

## Your details, and where they live

Everything is in `index.html`, inside the block marked `EDIT THESE`.

| Channel | Link in the file | Rule |
| --- | --- | --- |
| WhatsApp | `https://wa.me/996773160307` | Digits **only** — country code included, **no `+`**, no spaces or dashes. |
| Telegram | `https://t.me/chigurick` | Username **without** the `@`. |
| Phone | `tel:+996773160307` | E.164 — this one **does** keep the leading `+`. |
| Instagram | `https://instagram.com/chigurick` | Profile username. |

The two easy mistakes are opposites: a `+` left in the WhatsApp link breaks it,
and a `+` missing from `tel:` means people abroad can't dial you. Check both.

If you change a number or handle, change three things together — the `href`,
the visible text in `.channel__detail`, and the `aria-label` on the link.

The WhatsApp link carries `?text=…`, which pre-fills the customer's first
message. Delete that part of the URL if you'd rather they start from a blank
chat.

### Everything else to edit

- **Business name** — `Northbar` appears in `.brand`, the `<title>` and the
  `og:title`. It's a placeholder; use your own.
- **Headline and the line under it** — `.title` and `.subtitle`.
- **Address and hours** — `.details`, currently Tynalieva 12, Bishkek and
  Mon–Sat 09:00–19:00. The address links to Google Maps; if you move, update
  the `query=` part of that URL to match.
- **`<title>` and `<meta name="description">`** — what shows in search results
  and when someone shares the link.

## The product image

`assets/machine.svg` is a drawing, and a real photo of a machine you actually
sell will do more work. Drop yours in as `assets/machine.jpg`, change the `src`
on `.stage__machine`, and update the `width` and `height` attributes to the
real pixel size so the page doesn't jump while it loads. It sits in a light grey
panel, so a shot on a white or light background suits it best.

## Design notes

Light and deliberately ordinary: a light grey page, a white card, dark text.
On phones the card goes edge to edge, since a floating card with margins wastes
width where it is scarcest.

The hierarchy is one primary action plus three alternatives. **Message on
WhatsApp** is the filled green button because it is the one most people will
use; Telegram, Call and Instagram sit under it as equal outlined buttons. If a
different channel gets you more business, swap which one is `.primary`.

The green is `#075e54`, WhatsApp's own dark green, not the familiar bright
`#25D366`. The bright green cannot carry white label text at this size — it
lands around 2:1 against white — while the dark one clears 7:1. The glyph is
what people recognise anyway.

Colours, spacing and radii are CSS custom properties at the top of
`styles.css`. Change them there, not further down.

## The opening animation

The page plays one short sequence on load, about 1.2 seconds end to end, then
sits still:

1. The product panel rises and the machine scales up into place.
2. The wordmark settles in from wider letter-spacing — the letters close up
   rather than just appearing.
3. The headline resolves out of a blur, like a title card.
4. The subtitle, then the four buttons, cascade in 70ms apart.
5. The WhatsApp button gives one soft ring pulse to land the eye on it.

After that the only movement is the machine drifting up and down by 6px on a
7-second loop.

All of it is CSS — there is no script to fail. To retime the cascade, change
the `70ms` step in the `.rise` rule in `styles.css`. To reorder it, change the
`--i` numbers on the elements in `index.html`: they are step positions, 0
through 8. To remove a piece, delete its rule from the
`prefers-reduced-motion: no-preference` block.

The whole sequence lives inside that block, so a visitor who has asked their
system to reduce motion gets the finished page immediately, with no movement at
all. Nothing that hides content sits outside a `@keyframes` block either, so if
a browser never runs the animation the page still renders in full.

## Accessibility

Worth keeping if you edit:

- Every text colour meets WCAG AA on its background; the tightest is 5.0:1,
  and that includes the white label on the green button.
- Every button is 56px tall, above the 44px minimum for a comfortable tap.
- Every link has a visible amber focus ring. Don't remove the outline without
  replacing it.
- The opening sequence is pure CSS and respects
  `prefers-reduced-motion: reduce`; see above.

## Publish it

Push to GitHub, then **Settings → Pages**, set **Source** to *Deploy from a
branch*, pick `main` and `/ (root)`, save. It goes live at
`https://<username>.github.io/<repository>/` in about a minute.

Any static host works the same way — drag the folder onto Netlify, or point
Vercel or Cloudflare Pages at the repo. There is nothing to build.

## Local preview

```bash
python3 -m http.server 4173
```
