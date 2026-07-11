# PROJECT_PRINCIPLES.md
## Ibrahim Delivers BN — Guiding Principles
## V1 - date 11th July 2026:wq!

*Status: DRAFT — for review. Numbers marked TBD are placeholders, not commitments.*

---

## 1. What this project is

A local marketplace platform for Brunei, connecting three groups:
- **Shopkeepers** — list and sell products
- **Customers** — browse and buy
- **Delivery drivers** — bid to deliver orders

The platform sits in the middle, holding funds temporarily and coordinating the
handoff between all three, without taking on inventory or delivery itself.

**Current scope: Bandar Seri Begawan area only.** Everything in this document
assumes shopkeeper, customer, and driver are all local to the Bandar area.
Expansion to other districts (Kuala Belait, Tutong, Temburong) is a deliberate
future consideration, not a v1 concern — see Section 9.

---

## 2. Core principles

**Keep it simple, launch small.** This is a solo-developer project built in a
low-stress, mentally engaging way — not a race to build every feature at once.
Where a decision could go simple or complex, default to simple for v1, and
leave a clear note for later rather than over-engineering upfront. Manual
processes are an acceptable v1 substitute for automation (e.g. manually
reviewing shopkeeper signups before automating a vetting flow).

**Speed drives the whole model.** This platform exists to strengthen the local
shopkeeper economy — shopkeepers already have the stock, so the platform's job
is to remove friction and make selling fast. That means: orders should be
accepted quickly, fulfillment decisions should be made quickly, and delivery
should happen quickly. Every process in this document should be designed with
"how do we keep this moving fast" as a first-class concern, not an
afterthought.

---

## 3. Shopkeepers

- Only shopkeepers based in Brunei may sign up.
- Signup requires approval before a shopkeeper can list products (exact vetting
  process TBD — starting manual is fine).
- Shopkeepers get a portal to upload products, prices, photos, and descriptions.
- Shopkeepers control their own listings but operate within platform rules
  (pricing transparency, no prohibited items, response time expectations — TBD).

---

## 4. Order fulfillment — collection, bidding, and delivery

**Fulfillment options.** When placing an order, the customer can choose:
- **Delivery** — fulfilled by a driver (via bidding) or by the shopkeeper
  themselves, **or**
- **Self-collection** — customer picks the order up from the shopkeeper
  directly. Common and expected in Brunei; always available as an option.

**If delivery is chosen — the two-stage clock:**

1. **Stage 1 — Shopkeeper decision window (1 business hour).** As soon as an
   order is placed, available local delivery drivers can start **bidding** a
   price to deliver it. The shopkeeper has **1 hour of business time** to
   respond — business hours are **8am-8pm Brunei time**. If an order lands
   outside those hours, or a shopkeeper's window would run past 8pm, the clock
   pauses overnight and resumes at 8am the next day. Shopkeepers should never
   be expected to respond while closed/asleep.

   The shopkeeper must choose one of **three** options within that window:
   - Accept a driver's bid, **or**
   - Choose to deliver the order themselves, **or**
   - **Decline — out of stock.** If the shopkeeper can't actually fulfill the
     order (a real risk given inconsistent stock control among Brunei
     shopkeepers), the order is cancelled and the customer is **refunded
     immediately** — not left waiting toward the 48-hour deadline for a
     delivery that was never possible. A fast, honest "sorry, out of stock"
     is a far better experience than a slow failure, and protects the
     credibility of the delivery guarantee itself.

2. **Stage 2 — Pickup and delivery (remaining time).** Once a driver's bid is
   accepted (or the shopkeeper opts to self-deliver), the emphasis shifts to
   the driver (or shopkeeper) to **pick up and deliver as quickly as
   possible** — not to use up all the remaining time by default. Fast
   turnaround is the goal, not just staying inside the deadline.

**Overall deadline.** The **delivery deadline itself runs on calendar time**,
not business hours — the customer doesn't care that it's midnight, they just
want their order. Only the *shopkeeper's response window* (Stage 1) respects
business hours; once a driver is engaged, the countdown to the two-working-day
delivery deadline continues regardless of time of day. Working days for the
overall deadline exclude Friday, Sunday, and public holidays (Brunei's
weekend falls on Friday and Sunday).

- If delivery is not completed within the two-working-day window, the customer
  is **automatically refunded** — no manual intervention or dispute process
  required to trigger this.
- **A driver is paid when photo proof of delivery is uploaded** — this is one
  of the core mechanics of the whole model: payment is tied directly to
  verified delivery, not to accepting a bid or picking up the order.
- What happens if a shopkeeper doesn't respond within the 1-hour decision
  window at all (auto-select cheapest bid? escalate? cancel?) is **TBD** —
  not resolved yet.
- Longer term: if a shopkeeper declines orders as "out of stock" frequently,
  that's a useful signal worth surfacing back to them (or factoring into their
  standing on the platform) rather than just quietly routing around it. Not a
  v1 concern, but worth remembering — see Section 9.

---

## 5. Money flow (escrow model)

1. Customer pays the full order amount at checkout.
2. Funds are **held by the platform** (not paid to the shopkeeper immediately).
3. If a driver's delivery bid is accepted, that bid amount is earmarked to come
   out of the shopkeeper's proceeds — the driver is not paid by the customer or
   platform directly, but out of what the shopkeeper would otherwise receive.
4. On confirmed delivery:
   - Driver is paid their **full bid amount**, in full — no cut taken by the
     platform.
   - Platform takes its **commission** (see Section 6) out of the shopkeeper's
     sale proceeds.
   - Shopkeeper receives the remainder: **order total − delivery bid − platform
     commission**.
5. If delivery fails / the two-working-day window is missed:
   - Customer is refunded automatically and in full.
   - Platform takes **no commission** on a refunded order.
   - How the platform recovers a driver's time/cost on a failed delivery, if at
     all, is **TBD** — not resolved yet, needs more thought.

*Note: v1 can implement this manually (platform holds funds in a business*
*account, releases/refunds by hand) before building automated payment*
*splitting (e.g. Stripe Connect or similar). Don't over-build payment*
*infrastructure before there's real transaction volume to justify it.*

---

## 6. How the platform earns money

- The platform earns via a **percentage commission on the shopkeeper's sale**
  (not on the delivery fee, and not charged to the customer or driver directly).
- Commission rate: **TBD** — placeholder range 8-10%, to be set based on market
  research once closer to launch. Not hardcoded into the database as a fixed
  constant — should be configurable.
- Commission is only taken when a sale is **successfully completed and
  delivered** — never on a refunded order.
- This aligns platform incentives with shopkeepers: the platform only earns
  when a shopkeeper actually makes a sale.

---

## 7. Delivery verification (for the two-working-day guarantee)

- **Primary proof of delivery**: driver uploads a photo at drop-off. This marks
  the order as delivered and starts the release of funds to the shopkeeper.
- **Default assumption is success** — the customer is not required to actively
  confirm receipt for the order to be marked complete.
- Customers instead have a **"Report a problem"** option to dispute a delivery
  if something went wrong, rather than an active "confirm receipt" step being
  required. This reduces friction (customers forget to confirm) while still
  giving a route to flag issues.
- Dispute handling process itself is **TBD** — not resolved yet.
- Calculating "two working days" requires a **Brunei public holiday calendar**
  in the system (holidays shift yearly, e.g. Islamic calendar-based holidays)
  — this needs a maintained data source, not a hardcoded date list. TBD how
  this gets kept up to date (manual entry vs. an external holiday API).

---

## 8. Driver payment principles

- Drivers bid their own price for a delivery — no fixed platform-set delivery
  rate.
- Whatever a driver bids and has accepted, they receive **in full** — the
  platform does not take a cut of the driver's bid.
- This is a deliberate choice to keep driver economics simple and transparent,
  since drivers are likely the harder side of the marketplace to recruit and
  retain, and undiluted, predictable pay matters for that.

---

## 9. Open questions — not yet resolved

These are known gaps, deliberately left open rather than guessed at:

- How does the platform recover any cost/risk from a failed delivery where a
  driver was already engaged but the order still gets refunded?
- What's the dispute resolution process when a customer reports a problem?
- What are the exact shopkeeper vetting/approval criteria before going live?
- What items or categories (if any) are prohibited from being listed?
- Legal/compliance considerations for holding customer funds in escrow in
  Brunei — needs real research before this becomes a live financial product,
  not just a coding project.
- Exact commission percentage and whether it's flat or tiered by volume.
- How to handle shopkeepers who frequently decline orders as "out of stock" —
  at what point does this become a platform-standing issue rather than just
  an occasional honest miss?
- **Geographic scope (not a v1 concern):** everything in this document
  currently assumes shopkeeper, customer, and driver are all within the
  Bandar Seri Begawan area. Out-of-province orders (e.g. a shop in Kuala
  Belait delivering to Bandar, or vice versa) introduce real complexity —
  different driver pools, longer distances, possibly different delivery
  timeframes — and are deliberately out of scope until the Bandar-only model
  is proven. Flagged here so it isn't forgotten, not to be designed around yet.

---

## 10. How to use this document

- Treat this as the **source of truth** for product decisions when building
  features — if a coding task seems to conflict with a principle here, that's
  worth flagging and resolving before building, not after.
- Update this file as decisions get made — especially Section 9, as those
  open questions get answered.
- This file can be referenced by Cline via `.clinerules` so AI-assisted
  development stays aligned with the intended business model, not just
  whatever seems locally reasonable for a single coding task.
