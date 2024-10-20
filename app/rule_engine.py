from typing import Any, Dict, Optional, Union
from dataclasses import dataclass
from typing import List
import re
from enum import Enum

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
        # Convert rule string into tokens
        pattern = r'(\(|\)|\bAND\b|\bOR\b|>=|<=|!=|>|<|=|\b\w+\b|\'[^\']*\'|\d+)'
        tokens = re.findall(pattern, rule_string)
        return [token.strip("'") for token in tokens if token.strip()]

    def parse(self, rule_string: str) -> Node:
        self.tokens = self.tokenize(rule_string)
        self.current = 0
        return self.parse_expression()

    def parse_expression(self) -> Node:
        if self.current >= len(self.tokens):
            raise ValueError("Unexpected end of expression")

        if self.tokens[self.current] == '(':
            self.current += 1
            left = self.parse_expression()
            
            if self.current >= len(self.tokens):
                raise ValueError("Unclosed parenthesis")
            
            if self.tokens[self.current] in ('AND', 'OR'):
                operator = self.tokens[self.current]
                self.current += 1
                right = self.parse_expression()
                
                if self.current >= len(self.tokens) or self.tokens[self.current] != ')':
                    raise ValueError("Expected closing parenthesis")
                    
                self.current += 1
                return Node(
                    type=NodeType.OPERATOR,
                    operator=Operator(operator),
                    left=left,
                    right=right
                )
            
            if self.tokens[self.current] == ')':
                self.current += 1
                return left
                
        return self.parse_comparison()

    def parse_comparison(self) -> Node:
        field = self.tokens[self.current]
        self.current += 1
        
        if self.current >= len(self.tokens):
            raise ValueError(f"Expected operator after {field}")
            
        operator = self.tokens[self.current]
        self.current += 1
        
        if self.current >= len(self.tokens):
            raise ValueError(f"Expected value after {operator}")
            
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

def create_rule(rule_string: str) -> Node:
    parser = RuleParser()
    return parser.parse(rule_string)

def evaluate_rule(node: Node, data: Dict[str, Any]) -> bool:
    evaluator = RuleEvaluator()
    return evaluator.evaluate(node, data)

def combine_rules(rule_strings: List[str]) -> Node:
    if not rule_strings:
        raise ValueError("No rules provided to combine")
    
    if len(rule_strings) == 1:
        return create_rule(rule_strings[0])
    
    # Combine rules with AND operator
    combined_string = "(" + ") AND (".join(rule_strings) + ")"
    return create_rule(combined_string)

def evaluate_combined_rule(self, node: Node, data: Dict[str, Any]) -> bool:
    return self.evaluate(node, data)

def test_rule_engine():
    # Test case 1: Single rule evaluation
    rule1 = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
    
    # Create AST for rule1
    ast1 = create_rule(rule1)
    
    # Test data scenarios
    test_cases = [
        {
            "data": {"age": 35, "department": "Sales", "salary": 60000, "experience": 3},
            "expected": True
        },
        {
            "data": {"age": 23, "department": "Marketing", "salary": 45000, "experience": 6},
            "expected": True
        },
        {
            "data": {"age": 28, "department": "Sales", "salary": 45000, "experience": 3},
            "expected": False
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        result = evaluate_rule(ast1, test_case["data"])
        assert result == test_case["expected"], f"Test case {i} failed. Expected {test_case['expected']}, got {result}"
        print(f"Test case {i} passed!")

if __name__ == "__main__":
    test_rule_engine()

