from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from typing import List
from pydantic import ValidationError, BaseModel

from ..models import RuleCreate, RuleUpdate, RuleEvaluation, Rule
from ..database import rules_collection
from ..rule_engine import create_rule, evaluate_rule, combine_rules
import logging

logger = logging.getLogger(__name__)

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
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except ValidationError as val_err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(val_err))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")

@router.get("/rules/", response_model=List[Rule])
async def get_rules():
    try:
        rules = []
        for rule in rules_collection.find():
            rule["_id"] = str(rule["_id"])
            rules.append(rule)
        return rules
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")

@router.get("/rules/{rule_id}", response_model=Rule)
async def get_rule(rule_id: str):
    try:
        rule = rules_collection.find_one({"_id": ObjectId(rule_id)})
        if rule is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rule not found")
        rule["_id"] = str(rule["_id"])
        return rule
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid rule ID format")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")
    
@router.put("/rules/{rule_id}", response_model=Rule)
async def update_rule(rule_id: str, rule_update: RuleUpdate):
    try:
        # Check if rule exists
        existing_rule = rules_collection.find_one({"_id": ObjectId(rule_id)})
        if existing_rule is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rule not found")
            
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
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rule update failed")
            
        # Get updated rule
        updated_rule = rules_collection.find_one({"_id": ObjectId(rule_id)})
        updated_rule["_id"] = str(updated_rule["_id"])
        return updated_rule
        
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")

class RuleEvaluationRequest(BaseModel):
    data: dict

@router.post("/rules/evaluate/{rule_id}")
async def evaluate_rule_endpoint(rule_id: str, evaluation: RuleEvaluationRequest):
    try:
        logger.debug(f"Evaluating rule {rule_id} with data: {evaluation.data}")
        
        rule = rules_collection.find_one({"_id": ObjectId(rule_id)})
        if rule is None:
            logger.debug(f"Rule not found: {rule_id}")
            raise HTTPException(status_code=404, detail="Rule not found")
        
        logger.debug(f"Retrieved rule: {rule}")
        
        ast = create_rule(rule["rule_string"])
        result = evaluate_rule(ast, evaluation.data)
        
        logger.debug(f"Rule evaluation result: {result}")
        return {"result": result}
        
    except ValueError as ve:
        logger.debug(f"ValueError in rule evaluation: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Unexpected error in rule evaluation: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error evaluating rule: {str(e)}")

@router.delete("/rules/{rule_id}", response_model=dict)
async def delete_rule(rule_id: str):
    try:
        # Attempt to delete the rule
        result = rules_collection.delete_one({"_id": ObjectId(rule_id)})
        
        # Check if a rule was actually deleted
        if result.deleted_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rule not found")
        
        return {"message": "Rule successfully deleted"}
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid rule ID format")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")

@router.post("/rules/combine", response_model=Rule)
async def combine_rules_endpoint(rule_ids: List[str]):
    try:
        # Fetch rules from database
        rules = [rules_collection.find_one({"_id": ObjectId(rule_id)}) for rule_id in rule_ids]
        rule_strings = [rule["rule_string"] for rule in rules if rule]
        
        if not rule_strings:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No valid rules found")
        
        # Combine rules
        combined_ast = combine_rules(rule_strings)
        
        # Create a new rule with the combined AST
        new_rule = {
            "name": "Combined Rule",
            "description": f"Combination of rules: {', '.join(rule_ids)}",
            "rule_string": str(combined_ast),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "version": 1,
            "active": True
        }
        
        result = rules_collection.insert_one(new_rule)
        new_rule["_id"] = str(result.inserted_id)
        
        return new_rule
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")