# LocalOps — Hyperlocal Reverse Marketplace & AI Growth Engine

> **Morrow 1.0 Hackathon Submission (Round 2)**  
> *Empowering small neighborhood merchants to capture high-margin perimeter demand and uncover institutional customers with spatial intelligence.*

---

## 📌 Problem Statement

Small and independent local business owners (bakeries, local kitchens, tiffin services, quick printers, fabricators) consistently struggle with one fundamental barrier: **a lack of visible business opportunities right in their own neighborhoods.**

1. **Inability to Identify Existing Demand:** Within a 2–4 km radius of almost every neighborhood shop, there are colleges running fests, co-working offices hosting team meetings, hackathons needing supplies, and residential societies organizing events. These institutions have genuine, recurring bulk demands, but local merchants have no visibility into them.
2. **Missing the Chance to Act:** Because demand is scattered and discussed behind closed doors or in private chats, merchants simply do not know about needy buyers in time to act on them. By the time they hear about an event, the opportunity has passed.
3. **No Marketing or Strategic Guidance:** Independent shop owners are experts at their trade, but they do not have marketing teams or data tools to tell them who their potential high-value customers are, what bulk packages those customers actually need, or what concrete steps to take to proactively grow their business.

## 💡 What LocalOps Does

### 1. Reverse Demand Radar (Inverted Commerce)
Buyers broadcast itemized requirements (quantity, target unit price, delivery timeline, and GPS coordinates). Nearby merchants receive radar alerts only if the demand falls within their physical delivery perimeter.

### 2. Spatial Geofencing (Haversine Formula)
Orders are not routed using arbitrary city filters. The engine calculates real spherical physical distances and compares them against the merchant's self-defined service radius (2–5 km) and kitchen batch capacity.

### 3. Multi-Merchant Counter-Bidding
Merchants can either accept tickets instantly at the buyer's target price or place soft counter-offers with perks (e.g., *₹85/box including hot beverage flasks*).

### 4. AI Hyperlocal Growth Copilot
Powered by an integrated LLM engine, LocalOps analyzes the merchant's category, tags, and coordinates to dynamically generate:
- **Potential Bulk Customer Archetypes:** Pinpointing colleges, co-working hubs, tech communities, and RWAs within their radius.
- **Demand Context:** Explaining exactly *why* those organizations need bulk supplies and what batch sizes they order.
- **Tactical Action Plan:** A concrete, 3-step actionable playbook for the shop owner to unlock offline recurring revenue.

### 5. Instant Purchase Order & Tax Estimate Slip
Generates a 1-click printable/PDF estimate complete with itemized breakdowns, mock GST/FSSAI compliance stamps, and a UPI escrow settlement QR code.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Leaflet / React-Leaflet, Lucide Icons
- **Backend Engine**: FastAPI (Python), Haversine Spatial Geometry, Pydantic
- **AI / LLM Layer**: Google Gemini API (`gemini-2.5-flash`) with structured output schema and deterministic heuristic fallback
- **Design System**: High-contrast Nordic Coastal Palette (`#0D1B2A`, `#1B263B`, `#415A77`, `#778D7A`, `#D4C4A8`, `#F4F1DE`)

---

## 🚀 Quickstart & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
python -m venv .venv

# Activate Virtual Environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic google-genai

# Run FastAPI Server
uvicorn main:app --reload --port 8000
```
### 2. Frontend Setup
```
cd frontend
npm install
npm run dev
```

---

## Team Members: 
* **Team Leader: Prithvi Raj Singh**
* **Team Member: Anmol Kumar**
* **Team Member: Satya Yogieswar**

---

* **"What inspired this project?"**  
  *"We noticed that while ordinary consumer deliveries are dominated by aggregators charging high commissions, bulk institutional procurement in neighborhoods is completely broken. A college fest or hackathon team calls 5 different bakeries or xerox shops manually, while those very shops sit empty with idle capacity just 1 km away. We built LocalOps to eliminate the middleman and give small businesses an intelligent reverse-demand engine."*

* **"What is the core innovation?"**  
  *"Two things: First, mathematical reverse-commerce. Instead of browsing static catalogs, buyers broadcast demand pins, and our spatial Haversine engine matches qualified merchants within physical delivery bounds. Second, the AI Growth Copilot, which acts like an on-demand business consultant for small shop owners, analyzing their physical neighborhood to uncover unexploited institutional buyers."*

* **"What is the future potential?"**  
  *"Adding automated WhatsApp notification webhooks via Twilio, group bulk purchasing for resident societies, and formal UPI escrow smart contracts so merchants are guaranteed payment before starting large batches."*

  
  
