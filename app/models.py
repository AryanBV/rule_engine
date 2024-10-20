from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
from enum import Enum

class RuleCreate(BaseModel):
    name: str
    description: str
    rule_string: str

class RuleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    rule_string: Optional[str] = None

class RuleEvaluation(BaseModel):
    rule_id: str
    data: Dict[str, Any]

class Rule(BaseModel):
    id: str = Field(alias="_id")
    name: str
    description: str
    rule_string: str
    created_at: datetime
    updated_at: datetime
    version: int
    active: bool

    class Config:
        allow_population_by_field_name = True