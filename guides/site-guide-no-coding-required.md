# Budapest Bats website — guide for non-coders

This explains how budapestbats.hu actually works, how to make small updates,
how to take it offline if needed, and what tends to go wrong. No coding
knowledge required to read this — some steps need someone comfortable
clicking around GitHub's website.

## How the site works (the short version)

Three services, all connected to each other:

1. **GitHub** — holds the website's code. Account: `budapestbats` (login via
   budapestbats@gmail.com).
2. **Vercel** — takes the code from GitHub and turns it into the live
   website. Every time new code is saved ("pushed") to GitHub, Vercel
   automatically rebuilds and updates the live site within about a minute.
   You never manually "upload" anything to Vercel.
3. **Rackhost** — where the domain `budapestbats.hu` was bought, and where
   its DNS records live (the settings that tell the internet "budapestbats.hu
   means go fetch the site from Vercel").

Vercel account note: **there is no separate Vercel password** — logging into
Vercel is done via "Continue with GitHub," using the same `budapestbats`
GitHub account. Whoever has the GitHub login has the Vercel login too.

## Making a small content update (no software needed)

For simple text changes (fixture dates, a result, contact info), you don't
need VS Code at all:

1. Go to `github.com/budapestbats/budapestbats.hu`
2. Open the file you want to change (site files live inside the
   `budapest-bats-2` folder — e.g. `budapest-bats-2/fixture.html`)
3. Click the pencil icon (top right of the file view) to edit it in the
   browser
4. Make your change, then scroll down and click "Commit changes"
5. That's it — Vercel will automatically rebuild and the live site updates
   within about a minute

### The full pipeline, and how to check it actually worked

Whether you edit on github.com or locally in VS Code, the chain is the
same from that point on:

1. You commit the change (browser: clicking "Commit changes"; VS Code:
   `git add .` then `git commit -m "..."`)
2. You push it to GitHub (browser: automatic; VS Code: `git push`)
3. Vercel is watching the `main` branch and notices the new push within
   seconds — no button to click, no manual upload, nothing else to do
4. Vercel builds and deploys automatically (10-60 seconds for a site
   this size)
5. `budapestbats.hu` now serves the new version

**Don't just assume it worked — check:**
- Go to the Vercel dashboard → the project → **Deployments** tab. The
  newest entry should get a green checkmark within a minute or two. A
  red X means the build failed and the *previous* version is still what
  visitors see (see "What tends to go wrong" below)
- Visit `budapestbats.hu` yourself and confirm the change is actually
  there. If it still looks old, hard-refresh (Ctrl+F5 / Cmd+Shift+R) —
  your own browser may just be showing a cached copy of the old page

### Follow the instructions already written into the code

`fixture.html` and `results.html` each have a comment block near the top
(look for text in capitals like `UPDATE FIXTURE HERE` or
`ENTER SCORES HERE`) with copy-paste-ready templates and an explanation of
exactly what to fill in. These were written specifically so someone without
coding experience could add a new fixture or result correctly. Follow those
instructions literally — copy the block they point at, paste it in the
right place, replace the CAPITALS with real details.

### Text that appears in English and Hungarian

The site has an EN/HU language toggle. Text shown via that toggle lives in
one file: `budapest-bats-2/js/translations.js`, as a list of
`"key": "text"` pairs, once under `en:` and once under `hu:`. If you update
wording that appears through the language toggle, update it in **both**
places (same key, both languages) or one language will show old text.

**Making a link's text translatable**: putting `data-i18n` directly on an
`<a>` tag breaks the link (the translation script replaces the *entire*
contents of whatever it's attached to, including the link itself). Instead,
wrap just the visible words in a `<span>` inside the link, and put
`data-i18n` on that span — e.g.
`<a href="..."><span data-i18n="key">Link text</span></a>`. That way only
the span's text gets swapped, and the surrounding `<a href="...">` is left
alone.

## How to "launch" the site (if it's ever fully down)

If everything below is true, the site is live — usually nothing needs
"launching," it just stays live automatically:
- The domain `budapestbats.hu` is renewed and active at Rackhost
- The DNS records at Rackhost still point to Vercel (see
  `context/conversations/2026-07-31-deployment-and-dns-setup.md` for the
  exact values)
- The domain is still added under the Vercel project's Settings → Domains
- The latest GitHub push built successfully on Vercel (check the
  Deployments tab — green tick = fine, red X = broken build)

## How to take the site offline (temporarily, safely)

The cleanest reversible way, without touching code or deleting anything:

1. Log into Vercel (via GitHub)
2. Open the project → Settings → Domains
3. Remove (don't delete the whole project — just remove the domain
   attachment) `budapestbats.hu` and `www.budapestbats.hu`
4. The domain will stop showing the site. To bring it back, just re-add the
   domain the same way — since the DNS records at Rackhost never changed,
   it should reconnect within minutes.

Do not delete the GitHub repo or the Vercel project itself to "pause" the
site — that's much harder to undo cleanly. Removing the domain is enough.

## What tends to go wrong

- **Domain expires** — this is the big one. Rackhost bills the `.hu` domain
   on the 30th July 2029. If it's not renewed, the site goes down even though GitHub and
  Vercel are both still working perfectly, because the domain itself stops
  existing. Whoever holds the Rackhost login should watch for renewal
  emails from Rackhost and make sure the card on file is valid.
- **A GitHub edit breaks a page** — since every push goes live automatically,
  a typo or a broken tag (like an unclosed `<div>`) can visibly break the
  live site within a minute. If a page looks broken right after an edit,
  go to that file on GitHub, click "History," and revert to the previous
  version — that instantly triggers a new (working) deployment.
- **Vercel build fails** — check the project's Deployments tab. A red X
  next to the latest deployment means the site did NOT update — the
  previous working version is still live, so nothing is broken for
  visitors, but the new change isn't showing. Click into the failed
  deployment to see the error log (usually a typo in the HTML).
- **The GitHub push key (Personal Access Token) expires** — the token
  currently used to push code from VS Code expires **30 August 2026**.
  After that, pushing from a computer will fail with an authentication
  error even though the GitHub account itself is fine. See "STEP 5.5" in
  `new-volunteer-computer-setup.txt` for how to generate a new one. This
  does NOT affect the live site itself (Vercel keeps serving whatever was
  last successfully pushed) — it only blocks *new* pushes until fixed.
- **Someone loses GitHub/Vercel access** — since Vercel login goes through
  GitHub, whoever controls the `budapestbats` GitHub account (and its
  email, budapestbats@gmail.com) controls everything. If that email's
  password needs resetting, do it carefully and make sure at least one
  trusted person has access.
- **DNS records get changed by accident at Rackhost** — if the site
  suddenly stops loading but GitHub/Vercel both look fine, check
  Rackhost's DNS zone editor against the values recorded in
  `context/conversations/2026-07-31-deployment-and-dns-setup.md`.

## Who owns what (as of 2026-07-31)

| Service | Account | Login method |
|---|---|---|
| GitHub | `budapestbats` | budapestbats@gmail.com |
| Vercel | same GitHub account | "Continue with GitHub" — no separate password |
| Rackhost | budapestbats@gmail.com | Rackhost's own login |
| Domain | budapestbats.hu, registered via Rackhost | renews annually |

See `new-volunteer-computer-setup.txt` in this same folder for how to get a
new person's computer set up to make code changes properly (via VS Code)
rather than just quick browser edits.
