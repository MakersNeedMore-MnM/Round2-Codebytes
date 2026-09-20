# backend/engine.py
import math

def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat / 2) ** 2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def get_merchant_opportunities(merchant, all_requests):
    # Safe coordinate extraction
    m_lat = merchant.get("lat") or merchant.get("location", {}).get("lat")
    m_lng = merchant.get("lng") or merchant.get("location", {}).get("lng")
    max_radius = float(merchant.get("service_radius_km", 4.0))
    merchant_cat = str(merchant.get("category", "")).strip().lower()

    active_opps = []
    for req in all_requests:
        status = str(req.get("status", "")).upper()
        if status != "OPEN":
            continue
        
        # Check category match (case-insensitive)
        req_cat = str(req.get("category", "")).strip().lower()
        if req_cat != merchant_cat:
            continue
            
        # Safe coordinate extraction for customer pin
        c_lat = req.get("lat") or req.get("location", {}).get("lat")
        c_lng = req.get("lng") or req.get("location", {}).get("lng")
        
        if c_lat is None or c_lng is None:
            continue

        dist = calculate_haversine_distance(m_lat, m_lng, c_lat, c_lng)
        
        if dist <= max_radius:
            opp = dict(req)
            # Ensure standard frontend keys are always populated
            opp["id"] = req.get("request_id") or req.get("id")
            opp["title"] = req.get("event_title") or req.get("title")
            opp["distance_km"] = dist
            active_opps.append(opp)
            
    return sorted(active_opps, key=lambda x: x["distance_km"])