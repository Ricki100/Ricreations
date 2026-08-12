# Azzar Electric Gate Motors — WhatsApp Sales Conversation Design

Companion to the main *Azzar WhatsApp Conversation Design* doc — same architecture (Meta Cloud API → Hostinger PHP webhook → Brevo CRM, one conversation-state table, one notification path), scoped to the electric gate motor pilot. Nothing here is built yet; this is the design to build once the WhatsApp Business number (task #12) is set up.

---

## 1. Business Objective

Give the electric gate motor campaign a second capture channel alongside the landing page — someone who sees an ad and messages instead of filling in the form should get the same instant, qualifying conversation, synced to the same Brevo list.

Primary outcomes, in priority order:
1. Capture and qualify gate-motor leads that arrive via WhatsApp (ad click-to-message, or an existing contact reaching out directly).
2. Respond instantly, any time of day — this is what makes "24-hour lead machine" literal rather than aspirational.
3. Qualify before a human is involved: gate situation, gate type (if known), and location known before sales ever types a reply.
4. Recover conversations that stall before finishing.

---

## 2. Conversation Map

```
Incoming WhatsApp message
        │
        ▼
  [First message from this number?]
   │Yes                    │No (returning conversation)
   ▼                        ▼
Welcome Message      Resume at last known stage
   │                  (or re-show menu if idle >24h)
   ▼
Main Menu
 1. Get a free gate motor quote
 2. Ask a question
 3. Talk to someone
        │
        ├─ 1. Get a quote ──► Qualification Flow ──► Confirmation ──► Brevo sync + sales notified
        │
        ├─ 2. Ask a question ──► FAQ Flow ──► "Ready for a quote?" nudge ──► (loops into Get a quote)
        │
        └─ 3. Talk to someone ──► Human Handover, immediate
```

---

## 3. Welcome Message

**First-time contact:**
> Hi 👋 you've reached Azzar Steel & Fencing. We supply and professionally install electric gate motors for homes and businesses across Zimbabwe.
>
> How can we help?
> 1️⃣ Get a free gate motor quote
> 2️⃣ Ask a question
> 3️⃣ Talk to someone

**Returning contact, same day:** skip the intro — "Welcome back — pick up where you left off, or [Main Menu]?"

**Returning contact, idle >24h:** re-send the Main Menu only, no need to repeat the intro.

---

## 4. Qualification Flow — Get a Free Quote

Same four fields as the landing page form and `gate-quote-request.php`, asked one at a time, matching the site-wide minimal-friction rule:

> **Bot:** Great — let's get you a free quote. What's your name?
> *(captures FIRSTNAME; phone number is already known from the WhatsApp session itself)*

> **Bot:** Thanks, [Name] — and what's the best email to send your quote details to?

> **Bot:** Perfect — I've sent this straight to our team. We'll be in touch shortly to confirm the right motor for your gate (it comes down to size and weight — our D5 handles gates up to 500kg, D10 for heavier gates) and arrange your free site visit. Anything else I can help with in the meantime?

*(Deliberately minimal — matching the landing page form. Gate size/weight and site details are confirmed in the follow-up conversation, not asked upfront.)*

---

## 5. FAQ Flow

Triggered by menu option 2 or by keyword matching on free text:

- *"Can you motorise my existing gate?"* → "In most cases, yes — we confirm during a free site visit. Want to get a quote now?" → routes into qualification flow.
- *"How much does it cost?"* → "Cost depends on your gate and site conditions — a free site visit gets you an exact quote. Want to book one?" → routes into qualification flow.
- *"How long does installation take?"* → "Most installations are completed in a single day. Want a free quote to get started?"
- *"Swing or sliding — which do I need?"* → short explainer (see above) → "Want us to confirm during a free site visit?"
- *"Can I see examples of your work?"* → sends 1–2 installation photos + a link to azzar.co.zw/electric-gate-motor.

---

## 6. Human Handover Rules

Same triggers as the main fencing bot design:
- Explicit request for a person (menu option 3, or free text like "can I speak to someone").
- No intent match after one clarifying attempt.
- Anything involving price negotiation — the bot qualifies, never quotes a number.
- Complaints, negative sentiment, or mentions of an existing order/installation issue.
- A returning contact already marked as an active customer in Brevo.

On handover: "No problem — connecting you with our team now. Someone will reply here shortly. If it's urgent, call 0775 752 280." Sales notification fires the same way as a completed quote flow, tagged `LEAD_SOURCE: "WhatsApp Bot — Human Requested"`.

---

## 7. CRM Fields (Brevo)

Reuses the same attribute names as the landing page form on purpose, so the website and WhatsApp channel write to identical fields:

| Attribute | Source | Notes |
|---|---|---|
| `FIRSTNAME` | Asked directly | Existing attribute |
| `EMAIL` | Asked directly | Existing attribute |
| `WHATSAPP` | From the incoming message | Existing Brevo built-in attribute — no need to create |
| `LEAD_SOURCE` | Hardcoded `"WhatsApp Bot — Electric Gate"` | Existing attribute, new value |

No new custom attributes required — same minimal capture as the landing page form.

---

## 8. Follow-up Sequences

- **Mid-flow drop-off:** if someone stops replying partway through qualification, one follow-up after 2 hours: *"Still there? Happy to finish getting your free quote whenever you're ready — just reply and we'll pick up where we left off."* One follow-up only.
- **Post-quote, no sales reply logged:** internal safeguard — flag in the sales notification if a lead has gone >24h without a logged reply.

---

## 9. Error Handling

- Unrecognised free text → one clarifying attempt referencing the Main Menu, then hand over to a human if still unrecognised.
- Webhook/API failure → customer still gets their confirmation message; failure logged server-side, same pattern as `quote-request.php` and `gate-quote-request.php`.
- Out-of-hours messages → flow runs regardless of time; confirmation message can note response-time expectations once a working-hours check is added.

---

## 10. Reporting

Once live, track (feeding the same weekly report defined in the framework doc):
- Conversations started vs. completed qualification
- WhatsApp-sourced hot leads vs. landing-page-sourced hot leads
- Most common gate situation / gate type
- Drop-off point in the flow
- Human handover rate and reasons

---

## Build Order

1. Meta Business/WhatsApp number setup (task #12 — only Azzar/rozay can do this step).
2. Build `api/whatsapp-webhook.php` + conversation-state table, starting with just the qualification flow (Section 4) — proven first before adding FAQ/handover breadth.
3. Test end-to-end with a real WhatsApp message.
4. Layer in FAQ flow, then human handover, then follow-up sequences, in that order of value.
