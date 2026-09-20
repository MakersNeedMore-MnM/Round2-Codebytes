# backend/ai_copilot.py
import os
import json

# Fallback structured generator if no API key is provided
def get_heuristic_growth_strategy(merchant):
    category = merchant.get("category", "").lower()
    name = merchant.get("name", "Your Business")
    tags = ", ".join(merchant.get("tags", []))
    radius = merchant.get("service_radius_km", 3.0)

    if "food" in category or "bakery" in category or "tiffin" in category:
        return {
            "business_summary": f"{name} operates within a {radius}km hyperlocal zone specializing in {tags}.",
            "potential_customers": [
                {
                    "segment": "Nearby Colleges & Student Clubs",
                    "archetype": "Cultural societies, fest organizers, and student councils",
                    "why_they_need_you": "College fests, hackathons, and committee meetings constantly require high-volume snacks (samosas, puffs, juice boxes) at tight student budgets.",
                    "estimated_demand": "50–150 units per event batch",
                    "best_selling_items": ["Bulk Snack Boxes", "Chai Flasks", "Evening Puff Combos"]
                },
                {
                    "segment": "Boutique Co-working Spaces & IT Hubs",
                    "archetype": "Office managers, startup HRs, team leads",
                    "why_they_need_you": "Weekly team sprint wins, milestone celebrations, and daily 4 PM tea breaks require predictable, hygienic batch catering without delivery app markups.",
                    "estimated_demand": "20–60 packs / 2-3 times a week",
                    "best_selling_items": ["Mini Pastry Platters", "Sandwich Assortments", "Beverage Dispensers"]
                },
                {
                    "segment": "Residential Societies & Apartment Associations",
                    "archetype": "RWA committee members, festive pooja organizers",
                    "why_they_need_you": "Weekend sports days, society AGM meetings, and festive celebrations require bulk treats delivered hot within 15 minutes.",
                    "estimated_demand": "80–200 packs during society events",
                    "best_selling_items": ["Sweet Boxes", "Fresh Breakfast Hampers"]
                }
            ],
            "action_plan": [
                {
                    "step": 1,
                    "title": "Drop 'Pre-Order Menus' at Co-Working Reception Desks",
                    "details": "Print a 1-page rate card specifically for 30+ pax office parties with a dedicated WhatsApp order line."
                },
                {
                    "step": 2,
                    "title": "Partner with College Event Heads",
                    "details": "Offer student committees a 10% discount in exchange for being listed as their official refreshment partner on fest posters."
                },
                {
                    "step": 3,
                    "title": "Set a Scheduled LocalOps Broadcasting Window",
                    "details": "Check LocalOps Radar every morning between 9:00 AM – 11:00 AM when organizers post same-day and next-day bulk demands."
                }
            ]
        }
    elif "print" in category or "banner" in category:
        return {
            "business_summary": f"{name} has high capacity ({merchant.get('max_capacity_per_order', 300)} units) for printing & signage within {radius}km.",
            "potential_customers": [
                {
                    "segment": "Tech Meetups & Community Hackathons",
                    "archetype": "Community leads, developer advocates",
                    "why_they_need_you": "Need last-minute participant ID lanyards, laptop stickers, and stage standees 24 hours prior to launch.",
                    "estimated_demand": "100–500 badges & 2-4 standees",
                    "best_selling_items": ["NFC / QR Badges", "Rollup Banners", "Vinyl Stickers"]
                },
                {
                    "segment": "New Retail & Salon Openings",
                    "archetype": "Local retail shop owners, franchisees",
                    "why_they_need_you": "Promotional launch flyers, sidewalk standees, and price menus before grand opening weekend.",
                    "estimated_demand": "1000 flyers + promotional signage",
                    "best_selling_items": ["Glossy Pamphlets", "Exterior Signboards"]
                }
            ],
            "action_plan": [
                {
                    "step": 1,
                    "title": "Launch a 'Same-Day Hackathon Emergency Print' SLA",
                    "details": "Promote 6-hour turnaround for bulk conference badges within a 4 km perimeter."
                },
                {
                    "step": 2,
                    "title": "Claim Event Tickets Early on LocalOps",
                    "details": "Respond immediately to any college or corporate printing ticket to secure recurring printing contracts."
                }
            ]
        }
    else:
        return {
            "business_summary": f"{name} serving local demands within {radius}km.",
            "potential_customers": [
                {
                    "segment": "Neighborhood Commercial Establishments",
                    "archetype": "SMEs and local businesses",
                    "why_they_need_you": "Reliable localized fulfillment without long lead times.",
                    "estimated_demand": "Variable recurring batches",
                    "best_selling_items": ["Core service catalog"]
                }
            ],
            "action_plan": [
                {
                    "step": 1,
                    "title": "Monitor LocalOps Perimeter",
                    "details": "Keep the live radar tab active during business hours."
                }
            ]
        }


def generate_merchant_growth_intelligence(merchant):
    """
    Calls Google Gemini if GEMINI_API_KEY is present,
    otherwise falls back to the deterministic spatial heuristic engine.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return get_heuristic_growth_strategy(merchant)

    try:
        from google import genai
        client = genai.Client(api_key=api_key)

        prompt = f"""
        You are a seasoned Hyperlocal Business Growth Consultant specializing in offline-to-online reverse commerce.
        Analyze this local merchant business:
        - Name: {merchant.get('name')}
        - Category: {merchant.get('category')}
        - Product Tags: {merchant.get('tags')}
        - Capacity: {merchant.get('max_capacity_per_order')} units per batch
        - Physical Radius: {merchant.get('service_radius_km', 4.0)} km
        - Coordinates: ({merchant.get('lat')}, {merchant.get('lng')})

        Identify who their realistic potential institutional and bulk customers are within a {merchant.get('service_radius_km', 4.0)}km radius 
        (e.g., colleges, schools, coaching centers, co-working offices, residential apartments, tech hubs, hospitals).
        Explain WHY each segment needs them, what batch sizes they require, and give a 3-step action plan for the merchant to grow sales.

        Return ONLY a raw JSON object with this exact structure:
        {{
            "business_summary": "1 sentence overview",
            "potential_customers": [
                {{
                    "segment": "Name of segment",
                    "archetype": "Specific persona / title",
                    "why_they_need_you": "Specific operational reason",
                    "estimated_demand": "Units / batch size",
                    "best_selling_items": ["Item 1", "Item 2"]
                }}
            ],
            "action_plan": [
                {{
                    "step": 1,
                    "title": "Concise step title",
                    "details": "Operational instructions"
                }}
            ]
        }}
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"LLM API Fallback triggered: {e}")
        return get_heuristic_growth_strategy(merchant)