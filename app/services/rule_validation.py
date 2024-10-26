from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel

class RuleValidationResult(BaseModel):
    is_valid: bool
    errors: List[str]
    warnings: List[str]
    performance_impact: str

class RuleValidationService:
    def __init__(self):
        self.valid_operators = {'AND', 'OR'}
        self.valid_comparisons = {'>', '<', '>=', '<=', '=', '!='}
        self.valid_attributes = {'age', 'department', 'salary', 'experience'}
        
    def validate_rule(self, rule_string: str) -> RuleValidationResult:
        errors = []
        warnings = []
        
        # Basic syntax validation
        if not self._validate_syntax(rule_string):
            errors.append("Invalid rule syntax")
            return RuleValidationResult(
                is_valid=False,
                errors=errors,
                warnings=warnings,
                performance_impact="unknown"
            )
        
        # Validate operators
        operators = self._extract_operators(rule_string)
        for op in operators:
            if op not in self.valid_operators:
                errors.append(f"Invalid operator: {op}")
        
        # Validate attributes
        attributes = self._extract_attributes(rule_string)
        for attr in attributes:
            if attr not in self.valid_attributes:
                errors.append(f"Invalid attribute: {attr}")
        
        # Check for potential performance issues
        performance_impact = self._analyze_performance(rule_string)
        if performance_impact == "high":
            warnings.append("Rule may have performance implications")
            
        # Check for redundant conditions
        redundant = self._check_redundancy(rule_string)
        if redundant:
            warnings.append("Rule contains potentially redundant conditions")
        
        return RuleValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            performance_impact=performance_impact
        )
    
    def _validate_syntax(self, rule_string: str) -> bool:
        # Check for balanced parentheses
        if rule_string.count('(') != rule_string.count(')'):
            return False
            
        # Check for valid comparison operators
        tokens = rule_string.split()
        for i, token in enumerate(tokens):
            if token in self.valid_comparisons:
                # Check if token has valid operands
                if i == 0 or i == len(tokens) - 1:
                    return False
                if not (tokens[i-1] in self.valid_attributes or 
                       tokens[i+1].replace("'", "").isnumeric()):
                    return False
        
        return True
    
    def _extract_operators(self, rule_string: str) -> List[str]:
        return [token for token in rule_string.split() 
                if token in self.valid_operators]
    
    def _extract_attributes(self, rule_string: str) -> List[str]:
        tokens = rule_string.split()
        return [token for token in tokens 
                if token not in self.valid_operators 
                and token not in self.valid_comparisons
                and not token.startswith("'")
                and not token.replace(".", "").isdigit()
                and token not in {'(', ')'}]
    
    def _analyze_performance(self, rule_string: str) -> str:
        # Count number of conditions
        condition_count = len([op for op in rule_string.split() 
                             if op in self.valid_comparisons])
        
        # Count number of AND/OR operations
        operator_count = len([op for op in rule_string.split() 
                            if op in self.valid_operators])
        
        if condition_count > 5 or operator_count > 4:
            return "high"
        elif condition_count > 3 or operator_count > 2:
            return "medium"
        return "low"
    
    def _check_redundancy(self, rule_string: str) -> bool:
        # Simple redundancy check for repeated conditions
        conditions = []
        current_condition = []
        
        for token in rule_string.split():
            if token in self.valid_operators:
                if current_condition:
                    conditions.append(" ".join(current_condition))
                    current_condition = []
            else:
                current_condition.append(token)
                
        if current_condition:
            conditions.append(" ".join(current_condition))
            
        return len(conditions) != len(set(conditions))