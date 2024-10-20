from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from typing import List

from ..models import RuleCreate, RuleUpdate, RuleEvaluation, Rule
from ..database import rules_collection
from ..rule_engine import create_rule, evaluate_rule

router = APIRouter()

@router.post("/rules/", response_model=Rule)
async def create_new_rule(rule: RuleCreate):
    try:
        # Validate rule string by attempting to create AST
        ast = create_rule(rule.rule_string)
        
        # Prepare rule document
        rule_doc = {
            "name": rule.name,
            "description": rule.description,
            "rule_string": rule.rule_string,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "version": 1,
            "active": True
        }
        
        # Insert into database
        result = rules_collection.insert_one(rule_doc)
        
        # Get created rule
        created_rule = rules_collection.find_one({"_id": result.inserted_id})
        created_rule["_id"] = str(created_rule["_id"])
        
        return created_rule
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rules/", response_model=List[Rule])
async def get_rules():
    rules = []
    for rule in rules_collection.find():
        rule["_id"] = str(rule["_id"])
        rules.append(rule)
    return rules

@router.get("/rules/{rule_id}", response_model=Rule)
async def get_rule(rule_id: str):
    try:
        rule = rules_collection.find_one({"_id": ObjectId(rule_id)})
        if rule is None:
            raise HTTPException(status_code=404, detail="Rule not found")
        rule["_id"] = str(rule["_id"])
        return rule
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/rules/{rule_id}", response_model=Rule)
async def update_rule(rule_id: str, rule_update: RuleUpdate):
    try:
        # Check if rule exists
        existing_rule = rules_collection.find_one({"_id": ObjectId(rule_id)})
        if existing_rule is None:
            raise HTTPException(status_code=404, detail="Rule not found")
            
        # Prepare update data
        update_data = rule_update.dict(exclude_unset=True)
        if "rule_string" in update_data:
            # Validate new rule string
            create_rule(update_data["rule_string"])
            
        update_data["updated_at"] = datetime.utcnow()
        update_data["version"] = existing_rule["version"] + 1
        
        # Update rule
        result = rules_collection.update_one(
            {"_id": ObjectId(rule_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Rule update failed")
            
        # Get updated rule
        updated_rule = rules_collection.find_one({"_id": ObjectId(rule_id)})
        updated_rule["_id"] = str(updated_rule["_id"])
        return updated_rule
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/rules/evaluate/{rule_id}")
async def evaluate_rule_endpoint(rule_id: str, evaluation: RuleEvaluation):
    try:
        # Get rule from database
        rule = rules_collection.find_one({"_id": ObjectId(rule_id)})
        if rule is None:
            raise HTTPException(status_code=404, detail="Rule not found")
            
        # Create AST from rule string
        ast = create_rule(rule["rule_string"])
        
        # Evaluate rule
        result = evaluate_rule(ast, evaluation.data)
        
        return {"result": result}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.delete("/rules/{rule_id}", response_model=dict)
async def delete_rule(rule_id: str):
    try:
        # Attempt to delete the rule
        result = rules_collection.delete_one({"_id": ObjectId(rule_id)})
        
        # Check if a rule was actually deleted
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Rule not found")
        
        return {"message": "Rule successfully deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/rules/combine", response_model=str)
async def combine_rules_endpoint(rule_ids: List[str]):
    try:
        # Fetch rules from database
        rules = [rules_collection.find_one({"_id": ObjectId(rule_id)}) for rule_id in rule_ids]
        rule_strings = [rule["rule_string"] for rule in rules if rule]
        
        # Combine rules
        combined_ast = combine_rules(rule_strings)
        
        # You might want to store this combined rule or return it directly
        return str(combined_ast)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))