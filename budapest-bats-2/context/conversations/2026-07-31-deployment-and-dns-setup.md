# 2026-07-31 — Deployment, GitHub reset, and DNS setup

Running log of getting budapestbats.hu actually live.

## 1. Git identity fix
- All existing commits were authored as `Julian Romano <julianromanopod@gmail.com>` (personal account) instead of the club
- Set repo-local (not global) git config: `user.name = "Budapest Bats"`, `user.email = "budapestbats@gmail.com"`
- Only affects this repo — Julian's personal projects are untouched

## 2. GitHub repo reset
- Deleted the old `budapestbats/budapestbats.hu` repo and recreated it empty (same name, same owner, Public)
- Reason: wanted a clean start with the correct commit identity from commit #1 onward
- Locally, squashed the old messy history (4 commits, all "first commit"/"Initial commit", wrong author) into a single clean orphan commit: "Initial commit: Budapest Bats website", authored as Budapest Bats
- Pushed that single commit to the fresh repo

## 3. Vercel — the 404 problem and fix
- The old Vercel project (`budapestbats-hu`) was showing `404: DEPLOYMENT_NOT_FOUND` and got deleted
- Root cause: the actual site files (`index.html`, `css/`, `js/`, `images/`) live inside the **`budapest-bats-2/` subfolder** of the repo, not at the repo root (repo root only has `README.md`). Vercel by default looks for `index.html` at the root, found nothing, deployed nothing.
- Fix: created a new Vercel project importing the same GitHub repo, and explicitly set **Root Directory = `budapest-bats-2`** in the import config screen
- New deployment works correctly: `https://budapestbats-hu-37sr.vercel.app/`
- **Takeaway for future imports/re-imports of this repo: Root Directory must always be set to `budapest-bats-2`, or you'll get the same 404.**

## 4. Domain connected in Vercel
- Added `budapestbats.hu` and `www.budapestbats.hu` in Vercel project → Settings → Domains
- (First attempt added both as separate rows and hit a "domain overlaps" validation error — only the apex domain needs to be added; Vercel auto-covers `www` via the "Redirect apex domains to www" option)
- Vercel provided:
  - A record: `@` → `216.198.79.1`
  - CNAME record: `www` → `0c6b320cf9e4a3e7.vercel-dns-017.com`

## 5. DNS records at Rackhost
- Rackhost (rackhost.hu) is the registrar and DNS host for budapestbats.hu
- Path: Rackhost dashboard → DNS zónák → "Rekordok szerkesztése" on budapestbats.hu → "A, CNAME, TXT rekordok" section
- Previously both `budapestbats.hu` and `www.budapestbats.hu` had **A records pointing to `91.227.139.235`** (Rackhost's default placeholder IP)
- Changed to:
  - `budapestbats.hu` — A record → `216.198.79.1`
  - `www.budapestbats.hu` — deleted the old A record, added a **CNAME** record → `0c6b320cf9e4a3e7.vercel-dns-017.com`
- Confirmed live at Rackhost's authoritative nameserver (`ns1.dns24.hu`) via `nslookup` immediately after saving — just waiting on propagation to public resolvers (Google DNS etc.) and Vercel's automatic SSL issuance after that.

## Still open / worth knowing later
- Domain renewal at Rackhost is annual — if it lapses, the site goes down even though GitHub/Vercel are still fine. See the maintenance guide in `/guides` for details.
- See `/guides/site-guide-no-coding-required.md` and `/guides/new-volunteer-computer-setup.txt` (repo root) for handover documentation aimed at non-technical club members.
