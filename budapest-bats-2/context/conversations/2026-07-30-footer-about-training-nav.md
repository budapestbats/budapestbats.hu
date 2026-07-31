# 2026-07-30 — Footer, About, Training, Nav fixes

Running log of changes made to budapestbats.hu in this session.

## 1. Footer fix
- Was `position: fixed` (glued to viewport, overlapping content)
- Changed to a sticky footer: `body` is now a full-height flex column, footer uses `margin-top: auto`
- Files: `css/base.css`, `css/layout.css`

## 2. About section
- Added a "What is Australian Football?" section on index.html, after "About the club"
- Explains Aussie Rules basics + notes Empire Cup matches are generally 9-a-side
- Files: `index.html`, `css/pages/index.css`

## 3. Context folder
- Added `context/README.md` and `context/conversations/` for keeping a running record of these conversations

## 4. Training section
- Added Training section: Mondays 18:30-20:30 at Alsó-nagyrét, Margitsziget, 1007 Budapest; Wednesdays 19:00-21:00 at Kőbánya Sport Club, 1105 Budapest, Ihász u. 24
- Two embedded Google Maps (no API key needed), one per location
- Iterated a few times to:
  - Use the correct Alsó-nagyrét coordinates
  - Add postal codes in Hungarian address order
  - Align heading/address/map rows across both days using CSS Grid with named `grid-template-areas`
  - Fix mobile stacking so each day's heading/address/map group together (rather than all headings, then all addresses, then all maps)
- Files: `index.html`, `css/pages/index.css`

## 5. Nav bar mobile scaling
- Diagnosed: logo had a 70px floor, brand text used flat `3vw`, nav link font-size/padding were fixed — none of it scaled down on narrow phones, unlike the rest of the page
- Fixed: logo, brand text, nav link font-size/padding, and gaps now use `clamp()` to scale fluidly
- Follow-up: on iPhone SE (375px), "Results" was still getting cut off — added `flex-wrap: wrap` to the nav and link list so links wrap to a second row instead of overflowing/clipping
- Files: `css/layout.css`

## Still open
- Fixture/results pages: add placeholder comments (e.g. "update fixture here", "enter scores here") so someone with basic HTML can update them
