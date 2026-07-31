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

## 6. The real blocker: .hu registry owner-details confirmation
- After step 5, DNS records were correct but the domain still didn't resolve anywhere — not a propagation delay, but because the **.hu registry itself had never activated delegation** for budapestbats.hu
- Confirmed via `nslookup -type=NS budapestbats.hu a.hu` (querying the `.hu` TLD's own nameserver directly) — it returned nothing, meaning no delegation existed at the registry level
- Root cause, found on Rackhost's Domainek page: status showed **"Tulajdonos adatok hiányoznak"** (owner data missing). `.hu` domains require a registrant who is a Hungarian resident (or elsewhere in the EU) with a valid personal ID/tax number — this wasn't filled in yet
- Fix: a Hungarian friend's details were submitted via Rackhost's "Tulajdonos adatai" (owner details) form (name, Hungarian address, ID card number, phone, email)
- Rackhost then emailed a confirmation link to budapestbats@gmail.com (required to verify the contact email before the registration request is even forwarded to the .hu Registry) — that link was clicked the same day
- Status moved to "Regisztráció folyamatban" (registration in progress), and registry delegation went active later the same day
- Confirmed live: `nslookup -type=NS budapestbats.hu a.hu` now shows Rackhost's nameservers, public DNS resolves correctly, and `https://www.budapestbats.hu` returns 200 with valid SSL

## Launch status: LIVE (2026-07-31)
budapestbats.hu is fully live — code, DNS, and domain registration all
resolved. If the site ever goes down again, check in this order: (1) is the
domain still renewed at Rackhost, (2) do the DNS records at Rackhost still
match section 5 above, (3) does Vercel's Deployments tab show a successful
build. See `/guides/site-guide-no-coding-required.md` and
`/guides/new-volunteer-computer-setup.txt` (repo root) for handover
documentation aimed at non-technical club members.
