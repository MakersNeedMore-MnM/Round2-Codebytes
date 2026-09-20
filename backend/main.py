# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Union, Dict, Any
import uuid

from dummy_data import MERCHANTS, CUSTOMER_REQUESTS
from engine import get_merchant_opportunities
from ai_copilot import generate_merchant_growth_intelligence

app = FastAPI(title="LocalOps Hyperlocal Reverse Engine", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ItemSpec(BaseModel):
    name: str
    quantity: int = 1
    unit: Optional[str] = "items"

class CustomerRequestCreate(BaseModel):
    event_title: Optional[str] = None
    title: Optional[str] = None
    category: str = "Food & Beverage"
    items: Optional[List[Union[ItemSpec, Dict[str, Any]]]] = []
    needed_items: Optional[Union[List[str], str]] = []
    quantity_needed: Optional[int] = 50
    budget_per_unit: Optional[float] = 85.0
    delivery_hours_from_now: Optional[int] = 24
    location_name: Optional[str] = "Koramangala 5th Block"
    lat: Optional[float] = 12.9345
    lng: Optional[float] = 77.6205
    posted_by: Optional[str] = "Local Customer"

    class Config:
        extra = "allow"

class ClaimPayload(BaseModel):
    merchant_id: str

class BidPayload(BaseModel):
    merchant_id: str
    price_per_unit: float
    note: Optional[str] = ""

class AcceptBidPayload(BaseModel):
    bid_id: str

class MerchantCreate(BaseModel):
    name: str
    category: str = "Food & Beverage"
    tags: Optional[List[str]] = []
    max_capacity_per_order: Optional[int] = 120
    lat: float
    lng: float
    service_radius_km: Optional[float] = 3.5
    phone: Optional[str] = "+91 98765 43210"

@app.get("/api/merchants")
def get_merchants():
    return MERCHANTS

@app.post("/api/merchants")
def register_merchant(payload: MerchantCreate):
    new_id = f"shop_{uuid.uuid4().hex[:4]}"
    new_merchant = {
        "id": new_id,
        "name": payload.name,
        "category": payload.category,
        "tags": payload.tags or ["custom", "local"],
        "max_capacity_per_order": payload.max_capacity_per_order or 120,
        "lat": payload.lat,
        "lng": payload.lng,
        "service_radius_km": payload.service_radius_km or 3.5,
        "phone": payload.phone or "+91 98765 43210"
    }
    MERCHANTS.append(new_merchant)
    return {"message": "Merchant registered successfully", "merchant": new_merchant}

@app.get("/api/merchants/{merchant_id}/opportunities")
def get_opportunities(merchant_id: str):
    merchant = next((m for m in MERCHANTS if m["id"] == merchant_id), None)
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    return get_merchant_opportunities(merchant, CUSTOMER_REQUESTS)

@app.get("/api/merchants/{merchant_id}/capacity-stats")
def get_merchant_capacity(merchant_id: str):
    merchant = next((m for m in MERCHANTS if m["id"] == merchant_id), None)
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    
    max_cap = merchant.get("max_capacity_per_order", 120)
    # Total units in orders claimed by this merchant
    committed_units = sum(
        req.get("quantity_needed", 0) 
        for req in CUSTOMER_REQUESTS 
        if req.get("status") == "CLAIMED" and req.get("claimed_by", {}).get("merchant_id") == merchant_id
    )
    
    return {
        "max_capacity": max_cap,
        "committed_units": committed_units,
        "available_units": max(0, max_cap - committed_units),
        "utilization_percent": min(100, round((committed_units / max_cap) * 100)) if max_cap > 0 else 0
    }

@app.get("/api/customer/requests")
def get_customer_requests(posted_by: Optional[str] = None):
    if posted_by:
        return [r for r in CUSTOMER_REQUESTS if r.get("posted_by") == posted_by]
    return CUSTOMER_REQUESTS

@app.post("/api/requests")
def create_customer_request(payload: CustomerRequestCreate):
    title_text = payload.event_title or payload.title or "Bulk Requirement"

    item_names = []
    raw_items = []
    if payload.items:
        for item in payload.items:
            if isinstance(item, dict):
                item_names.append(item.get("name", ""))
                raw_items.append(item)
            else:
                item_names.append(item.name)
                raw_items.append(item.model_dump() if hasattr(item, "model_dump") else item.dict())
    elif isinstance(payload.needed_items, list):
        item_names = payload.needed_items
    elif isinstance(payload.needed_items, str):
        item_names = [i.strip() for i in payload.needed_items.split(",") if i.strip()]

    total_qty = payload.quantity_needed
    if raw_items:
        computed_qty = sum(item.get("quantity", 1) for item in raw_items)
        if computed_qty > 0:
            total_qty = computed_qty

    req_id = f"req_{uuid.uuid4().hex[:6]}"
    new_request = {
        "request_id": req_id,
        "id": req_id,
        "event_title": title_text,
        "title": title_text,
        "category": payload.category,
        "items": raw_items,
        "needed_items": item_names,
        "quantity_needed": total_qty,
        "budget_per_unit": payload.budget_per_unit,
        "delivery_hours_from_now": payload.delivery_hours_from_now,
        "location_name": payload.location_name,
        "lat": payload.lat,
        "lng": payload.lng,
        "posted_by": payload.posted_by,
        "status": "OPEN",
        "bids": [],
        "claimed_by": None
    }

    CUSTOMER_REQUESTS.append(new_request)
    return {"message": "Request created successfully", "request": new_request}

# Direct Instant Claim at Target Price
@app.post("/api/requests/{request_id}/claim")
def claim_request(request_id: str, payload: ClaimPayload):
    merchant = next((m for m in MERCHANTS if m["id"] == payload.merchant_id), None)
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")

    for req in CUSTOMER_REQUESTS:
        current_id = req.get("request_id") or req.get("id")
        if current_id == request_id:
            req["status"] = "CLAIMED"
            req["agreed_price_per_unit"] = req.get("budget_per_unit", 85.0)
            req["claimed_by"] = {
                "merchant_id": merchant["id"],
                "name": merchant["name"],
                "category": merchant["category"],
                "phone": merchant.get("phone", "+91 98765 43210")
            }
            return {"message": "Opportunity claimed successfully", "request": req}

    raise HTTPException(status_code=404, detail="Request not found")

# Place Counter-Offer / Soft Bid
@app.post("/api/requests/{request_id}/bid")
def place_bid(request_id: str, payload: BidPayload):
    merchant = next((m for m in MERCHANTS if m["id"] == payload.merchant_id), None)
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")

    for req in CUSTOMER_REQUESTS:
        current_id = req.get("request_id") or req.get("id")
        if current_id == request_id:
            if "bids" not in req:
                req["bids"] = []
            
            # Replace existing bid from same merchant or append
            req["bids"] = [b for b in req["bids"] if b.get("merchant_id") != payload.merchant_id]
            
            bid_id = f"bid_{uuid.uuid4().hex[:6]}"
            new_bid = {
                "bid_id": bid_id,
                "merchant_id": merchant["id"],
                "merchant_name": merchant["name"],
                "phone": merchant.get("phone", "+91 98765 43210"),
                "price_per_unit": float(payload.price_per_unit),
                "note": payload.note or "Ready for batch delivery with hot thermal containers."
            }
            req["bids"].append(new_bid)
            return {"message": "Bid placed successfully", "bid": new_bid, "request": req}

    raise HTTPException(status_code=404, detail="Request not found")

# Buyer Accepts One of the Counter-Offers
@app.post("/api/requests/{request_id}/accept-bid")
def accept_bid(request_id: str, payload: AcceptBidPayload):
    for req in CUSTOMER_REQUESTS:
        current_id = req.get("request_id") or req.get("id")
        if current_id == request_id:
            bids = req.get("bids", [])
            chosen_bid = next((b for b in bids if b.get("bid_id") == payload.bid_id), None)
            if not chosen_bid:
                raise HTTPException(status_code=404, detail="Bid not found")

            req["status"] = "CLAIMED"
            req["agreed_price_per_unit"] = chosen_bid["price_per_unit"]
            req["claimed_by"] = {
                "merchant_id": chosen_bid["merchant_id"],
                "name": chosen_bid["merchant_name"],
                "category": req.get("category"),
                "phone": chosen_bid.get("phone", "+91 98765 43210")
            }
            return {"message": "Bid accepted and locked", "request": req}

    raise HTTPException(status_code=404, detail="Request not found")

@app.get("/api/merchants/{merchant_id}/growth-copilot")
def get_merchant_growth_copilot(merchant_id: str):
    merchant = next((m for m in MERCHANTS if m["id"] == merchant_id), None)
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    return generate_merchant_growth_intelligence(merchant)