# Inbound mail (`@paradigmthreat.net`)

Receive-only MX on the Relay fleet. Relay does **not** send email.

Canonical ops / install docs:

**[relay-gateway `docs/MAIL_INBOUND.md`](https://gitlab.com/clevertree/relay-gateway/-/blob/main/docs/MAIL_INBOUND.md)** (local: `~/dev/relay/relay-gateway/docs/MAIL_INBOUND.md`)  
**[INSTALL_FEATURES.md — inbound_mail](https://gitlab.com/clevertree/relay-gateway/-/blob/main/docs/INSTALL_FEATURES.md)** — `RELAY_FEAT_INBOUND_MAIL`, domains, user, hostname

| | |
|--|--|
| MX | `mail.paradigmthreat.net` → **iad1** `162.209.124.53` |
| Catch-all | `@paradigmthreat.net` → Maildir user `arl` on iad1 |
| Read | **relay-ops** UI → **Inbox** tab (standard); or SSH `ubuntu@iad1` |
| Live mesh | `iad1` / `ord1` / `hkg1` — only iad1 accepts SMTP |
| Installer | Optional OpenSMTPD catcher on any new node; DNS MX remains a manual step |
