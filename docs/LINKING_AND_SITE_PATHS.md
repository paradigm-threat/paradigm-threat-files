# Linking and site paths (paradigm-threat-files)

## How the live site maps this repo

**https://paradigmthreat.net** serves **all** content from the **paradigm-threat-files** repository at the **site root**.

- Repo path = URL path (after the domain).
- Examples:
  - File `governance/war/investigations/cia-investigation.md` → `https://paradigmthreat.net/governance/war/investigations/cia-investigation.md`
  - File `history/mudflood/foo.png` → `https://paradigmthreat.net/history/mudflood/foo.png`

So **root-relative** links of the form `/governance/...`, `/history/...`, etc. are correct when writing for **paradigmthreat.net** (e.g. from timeline `content/` in paradigm-threat-timeline, or from internal docs that assume the site).

## Blog exception

Files under **`blog/`** still follow **`docs/BLOG.md`**: use **fully absolute** URLs (`https://paradigmthreat.net/...`) so posts work when viewed on GitHub, RSS, or other contexts where the site root is not implicit.

## Timeline cross-links

From **paradigm-threat-timeline** `content/*.md`, link to investigations with root-relative paths as above; see **paradigm-threat-timeline** `docs/CONTENT_MARKDOWN_STYLE.md` and `.cursor/rules/paradigm-threat-timeline.mdc`.
