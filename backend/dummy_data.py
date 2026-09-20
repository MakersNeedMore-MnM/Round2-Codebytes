# dummy_data.py

# 1. Local Businesses (Merchants) in Bengaluru
MERCHANTS = [
    {
        "id": "shop_01",
        "name": "Asha Tiffin & Snacks",
        "category": "Food & Beverage",
        "tags": ["snacks", "samosa", "chai", "breakfast"],
        "max_capacity_per_order": 80,       # Can make up to 80 snack packs
        "lat": 12.9345,                     # Koramangala 5th Block
        "lng": 77.6205,
        "service_radius_km": 3.0
    },
    {
        "id": "shop_02",
        "name": "Green Leaf Juice & Bakery",
        "category": "Food & Beverage",
        "tags": ["bakery", "sandwiches", "juice", "pastries"],
        "max_capacity_per_order": 40,       # Smaller shop, handles up to 40 items
        "lat": 12.9121,                     # HSR Layout Sector 1
        "lng": 77.6446,
        "service_radius_km": 2.5
    },
    {
        "id": "shop_03",
        "name": "Bangalore Quick Print & Banners",
        "category": "Printing & Banners",
        "tags": ["posters", "standees", "badges", "id_cards"],
        "max_capacity_per_order": 300,
        "lat": 12.9360,                     # Near Christ University area
        "lng": 77.6080,
        "service_radius_km": 5.0
    }
]

# 2. Customer Requests (Events / People needing services nearby)
CUSTOMER_REQUESTS = [
    {
        "request_id": "req_101",
        "event_title": "College Cultural Fest - Volunteer Refreshments",
        "posted_by": "Student Council, Jyoti Nivas College",
        "category": "Food & Beverage",
        "needed_items": ["snacks", "samosa"],
        "quantity_needed": 50,              # Perfect batch for Asha Tiffin
        "budget_per_unit": 85.0,            # In INR (Slide 6 demo)
        "delivery_hours_from_now": 28,      # Tomorrow afternoon (~28 hrs away)
        "lat": 12.9338,                     # Near Koramangala
        "lng": 77.6189,
        "status": "OPEN"
    },
    {
        "request_id": "req_102",
        "event_title": "Weekend Hackathon Stage Banner & Badges",
        "posted_by": "Tech Community Organizer",
        "category": "Printing & Banners",
        "needed_items": ["standees", "badges"],
        "quantity_needed": 120,
        "budget_per_unit": 45.0,
        "delivery_hours_from_now": 48,
        "lat": 12.9100,                     # HSR Layout
        "lng": 77.6400,
        "status": "OPEN"
    }
]