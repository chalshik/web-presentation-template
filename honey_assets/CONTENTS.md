# Source material

Originals as received. Nothing here is served by the site — everything the page
uses was derived from these and lives in `../assets/`.

Deduplicated by SHA-256: every file arrived twice, once as `… copy`. The seven
duplicates were removed and the seven survivors renamed by content. No unique
content was lost. Three more files arrived on 2026-08-20 (marked *new* below)
and were renamed by content the same way.

Four mountain photos also arrived on 2026-08-20. They are listed in their own
table because they are **not** ours — see the note under it.

| File | What it shows | Used for |
| --- | --- | --- |
| `photo-hive-frames-from-above.jpeg` | Frames from above, capped comb and bees. 1182×2560 — the only full-size asset. Has "НУРИЗА ♥" written on the top frame. | `assets/hero.jpg` (centre-cropped 3:2, below the handwriting) |
| `photo-open-hive-in-shade.jpeg` | Open hive, frames, hard shadow across it. 462×1000. | unused — too small and too contrasty |
| `photo-honey-surface-in-bucket.jpeg` *new* | Overhead close-up of strained honey in a white bucket, foam and bubbles across the surface. 810×1080 — second-largest asset. | unused |
| `video-comb-closeup-in-hand.mp4` *new* | A comb frame held up close, cells glossy with honey. 368×640, 0.9s. | unused — too short for a slot at normal speed |
| `video-comb-frames-with-bees.mp4` | A frame lifted out, covered in bees, grass behind. 10.8s | `assets/clip-1.mp4` (0–5.5s) + poster |
| `video-hive-frames-in-sunlight.mp4` | Frames in the open hive, sun and shadow banding across them. 10.4s | unused |
| `video-honey-straining.mp4` | Honey through a sieve into a bucket, golden threads. 21.6s | `assets/clip-2.mp4` (12.3–17.3s) + poster |
| `video-opening-the-hive.mp4` | Hive boxes on grass, lid off, frames and cloth. 20.9s | unused |
| `video-pouring-and-stored-buckets.mp4` | Honey pouring, then buckets stored against a shyrdak. 32.8s | unused — was clip 3 until 2026-08-20 |
| `video-uncapping-a-frame.mp4` *new* | Wax cappings sliced off a frame with a knife over the tray, honey underneath. 464×832, 26.9s — the sharpest video here. | `assets/clip-3.mp4` (16.0–22.2s) + poster |

## The mountain photos — provenance unresolved

| File | What it shows | Used for |
| --- | --- | --- |
| `Ak-Tor-Pass-Alay-Mountains.jpg` | Wildflower pasture, rocky ridges, valley beyond. 800×600. | `assets/valley-1.jpg` |
| `Alay-Mountains-Kumbell-Pass.jpg` | Green hills falling to a limestone range. 1024×768. | `assets/valley-2.jpg` |
| `images.jpeg` | Snow peaks over green upland. 335×597. | unused — too small to display |
| `images-2.jpeg` | Aerial, peak above a green valley at low sun. 399×501. | unused — carries a visible "© Altokurov Nursultan" credit |

All four carry `com.apple.quarantine` marking them as **Safari downloads**, and
none has camera EXIF. They are web images, not photographs taken here, and the
sizes (two of them are Google Images thumbnails) say the same thing. The two in
use are placeholders: they show the right range, but nobody has established a
licence for them, and the page they sit on sells a product.

Replacing them with photographs of the actual valley would settle both the
licence question and the honesty question at once, and is the reason the CSS
crops with `object-fit` — a straight swap needs no code change.

## How `../assets/` is derived

One grade for everything, so the three clips match:

```
DN=hqdn3d=6:4:6:6
GR=colorbalance=rm=0.03:bm=-0.03,eq=saturation=1.22:contrast=1.08:gamma=1.02
SH=unsharp=5:5:0.4
ENC=-an -c:v libx264 -profile:v high -crf 29 -preset slow -pix_fmt yuv420p -movflags +faststart -r 30
```

Order matters: denoise first (WhatsApp noise is expensive to encode and it
confuses the motion estimator), sharpen last.

```
clip-1  video-comb-frames-with-bees.mp4   -ss 0  -t 5.5   crop=360:270:0:180,$DN,$GR,$SH
clip-2  video-honey-straining.mp4          -ss 12.3 -t 5  crop=360:270:0:0,$DN,$GR,$SH
clip-3  video-uncapping-a-frame.mp4       -ss 16 -t 6.2   crop=464:348:0:60,$DN,$GR,$SH
hero    photo-hive-frames-from-above.jpeg                 crop=1182:788:0:886,hqdn3d=3:2:0:0,$GR,unsharp=5:5:0.5
```

The mountain photos get a different, much lighter pass — the honey grade would
turn the pasture yellow. They only needed matching to each other, because the
second is hazier than the first:

```
valley-1  Ak-Tor-Pass-Alay-Mountains.jpg    crop=600:600:100:0,$WARM,eq=saturation=1.04:contrast=1.02,
                                            scale=520:520,unsharp=3:3:0.3
valley-2  Alay-Mountains-Kumbell-Pass.jpg   crop=768:768:128:0,$WARM,eq=saturation=1.14:contrast=1.13:gamma=0.98,
                                            scale=520:520,unsharp=3:3:0.3
          where WARM=colorbalance=rm=0.02:bm=-0.02
```

Each crop is the largest 4:3 the source allows — nothing is upscaled, which is
why the three clips are three different sizes. `object-fit: cover` on the video
means that does not affect layout, only sharpness. Posters are the first frame
of each finished clip at `-q:v 4`, so there is no jump when playback starts.

Clip 2 is not the opening of the straining video. The first seconds are thin
threads; the sieve is tipped at 12–17s and the honey comes off the rim in
strands thick enough to read at 360px. After 17s hands and the sieve clamp
crowd the frame.

## The quality ceiling

Every video from the first batch is **360×640** and one photo is 462×1000 —
WhatsApp re-compresses hard on send. The 2026-08-20 batch came through larger
(464×832 video, 810×1080 photo) but still well short of the source. The
originals on the phone are almost certainly 1080p or 4K.
Getting them off the device unchanged (AirDrop, Google Drive, or email as a
*file attachment* rather than a photo) would be a bigger improvement than any
processing, and would make a video hero viable.

Still missing: **a photo of a jar.** Everything here is hives, extraction or
bulk buckets. There is no picture of the thing a customer actually buys.
