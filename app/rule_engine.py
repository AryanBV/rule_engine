from typing import Any, Dict, Optional, Union, List
from dataclasses import dataclass
import re
from enum import Enum
from app.models import VALID_ATTRIBUTES
import logging


class NodeType(Enum):
    OPERATOR = "operator"
    COMPARISON = "comparison"
    LITERAL = "literal"
    REFERENCE = "reference"

class Operator(Enum):
    AND = "AND"
    OR = "OR"

class ComparisonOperator(Enum):
    GT = ">"
    LT = "<"
    GTE = ">="
    LTE = "<="
    EQ = "="
    NEQ = "!="

@dataclass
class Node:
    type: NodeType
    value: Optional[Any] = None
    field: Optional[str] = None
    operator: Optional[Union[Operator, ComparisonOperator]] = None
    left: Optional['Node'] = None
    right: Optional['Node'] = None

class RuleParser:
    def __init__(self):
        self.tokens = []
        self.current = 0

    def tokenize(self, rule_string: str) -> list:
        pattern = r'(\(|\)|\bAND\b|\bOR\b|>=|<=|!=|>|<|=|\b\w+\b|\'[^\']*\'|\d+)'
        tokens = re.findall(pattern, rule_string)
        return [token.strip("'") for token in tokens if token.strip()]

    def parse(self, rule_string: str) -> Node:
        self.tokens = self.tokenize(rule_string)
        self.current = 0
        return self.parse_expression()

    def parse_expression(self) -> Node:
        left = self.parse_comparison()
        
        while self.current < len(self.tokens) and self.tokens[self.current] in ('AND', 'OR'):
            operator = Operator(self.tokens[self.current])
            self.current += 1
            right = self.parse_comparison()
            left = Node(type=NodeType.OPERATOR, operator=operator, left=left, right=right)
        
        return left

    def parse_comparison(self) -> Node:
        if self.current >= len(self.tokens):
            raise ValueError("Unexpected end of expression")
        
        if self.tokens[self.current] == '(':
            self.current += 1
            node = self.parse_expression()
            if self.current < len(self.tokens) and self.tokens[self.current] == ')':
                self.current += 1
            else:
                raise ValueError("Expected closing parenthesis")
            return node
        
        field = self.tokens[self.current]
        self.current += 1
        
        if self.current >= len(self.tokens):
            raise ValueError("Unexpected end of expression")
            
        operator = self.tokens[self.current]
        self.current += 1
        
        if self.current >= len(self.tokens):
            raise ValueError("Unexpected end of expression")
            
        value = self.tokens[self.current]
        self.current += 1
        
        # Convert numeric values
        if value.isdigit():
            value = int(value)
        elif value.replace('.', '').isdigit():
            value = float(value)
            
        return Node(
            type=NodeType.COMPARISON,
            field=field,
            operator=ComparisonOperator(operator),
            value=value
        )

class RuleEvaluator:
    def evaluate(self, node: Node, data: Dict[str, Any]) -> bool:
        if node.type == NodeType.OPERATOR:
            left_result = self.evaluate(node.left, data)
            
            # Short-circuit evaluation
            if node.operator == Operator.AND and not left_result:
                return False
            if node.operator == Operator.OR and left_result:
                return True
                
            right_result = self.evaluate(node.right, data)
            
            if node.operator == Operator.AND:
                return left_result and right_result
            return left_result or right_result
            
        elif node.type == NodeType.COMPARISON:
            if node.field not in data:
                raise ValueError(f"Field {node.field} not found in data")
                
            field_value = data[node.field]
            
            if node.operator == ComparisonOperator.GT:
                return field_value > node.value
            elif node.operator == ComparisonOperator.LT:
                return field_value < node.value
            elif node.operator == ComparisonOperator.GTE:
                return field_value >= node.value
            elif node.operator == ComparisonOperator.LTE:
                return field_value <= node.value
            elif node.operator == ComparisonOperator.EQ:
                return field_value == node.value
            elif node.operator == ComparisonOperator.NEQ:
                return field_value != node.value
                
        raise ValueError(f"Invalid node type: {node.type}")

def validate_attributes(node: Node):
    if node.type == NodeType.COMPARISON:
        logger.debug(f"Validating attribute: {node.field}")
        if node.field not in VALID_ATTRIBUTES:
            logger.error(f"Invalid attribute: {node.field}")
            raise ValueError(f"Invalid attribute: {node.field}")
    if node.left:
        validate_attributes(node.left)
    if node.right:
        validate_attributes(node.right)


logger = logging.getLogger(__name__)

def create_rule(rule_string: str) -> Node:
    logger.debug(f"Creating rule from string: {rule_string}")
    parser = RuleParser()
    try:
        ast = parser.parse(rule_string)
        validate_attributes(ast)
        logger.debug(f"Rule created successfully: {ast}")
        return ast
    except Exception as e:
        logger.error(f"Error creating rule: {str(e)}")
        raise

def evaluate_rule(node: Node, data: Dict[str, Any]) -> bool:
    logger.debug(f"Evaluating rule with data: {data}")
    evaluator = RuleEvaluator()
    try:
        result = evaluator.evaluate(node, data)
        logger.debug(f"Rule evaluation result: {result}")
        return result
    except Exception as e:
        logger.error(f"Error evaluating rule: {str(e)}")
        raise

def combine_rules(rule_strings: List[str]) -> Node:
    if not rule_strings:
        raise ValueError("No rules provided to combine")
    
    if len(rule_strings) == 1:
        return create_rule(rule_strings[0])
    
    # Combine rules with AND operator
    combined_string = "(" + ") AND (".join(rule_strings) + ")"
    return create_rule(combined_string)