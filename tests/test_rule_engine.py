import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from app.rule_engine import create_rule, evaluate_rule, combine_rules, NodeType, Operator, ComparisonOperator

def test_create_rule():
    rule_string = "age > 30 AND department = 'Sales'"
    ast = create_rule(rule_string)
    assert ast is not None
    assert ast.type == NodeType.OPERATOR
    assert ast.operator == Operator.AND
    assert ast.left.type == NodeType.COMPARISON
    assert ast.left.field == "age"
    assert ast.left.operator == ComparisonOperator.GT
    assert ast.left.value == 30
    assert ast.right.type == NodeType.COMPARISON
    assert ast.right.field == "department"
    assert ast.right.operator == ComparisonOperator.EQ
    assert ast.right.value == "Sales"

def test_create_rule_invalid_attribute():
    with pytest.raises(ValueError, match="Invalid attribute: invalid_attr"):
        create_rule("invalid_attr > 30")

def test_evaluate_rule():
    rule_string = "age > 30 AND department = 'Sales'"
    ast = create_rule(rule_string)
    
    assert evaluate_rule(ast, {"age": 35, "department": "Sales"}) == True
    assert evaluate_rule(ast, {"age": 25, "department": "Sales"}) == False
    assert evaluate_rule(ast, {"age": 35, "department": "Marketing"}) == False

def test_combine_rules():
    rule1 = "age > 30"
    rule2 = "department = 'Sales'"
    combined = combine_rules([rule1, rule2])
    assert combined is not None
    assert combined.type == NodeType.OPERATOR
    assert combined.operator == Operator.AND
    assert evaluate_rule(combined, {"age": 35, "department": "Sales"}) == True
    assert evaluate_rule(combined, {"age": 25, "department": "Sales"}) == False

def test_complex_rule():
    rule_string = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
    ast = create_rule(rule_string)
    
    assert evaluate_rule(ast, {"age": 35, "department": "Sales", "salary": 60000, "experience": 3}) == True
    assert evaluate_rule(ast, {"age": 23, "department": "Marketing", "salary": 45000, "experience": 6}) == True
    assert evaluate_rule(ast, {"age": 28, "department": "Sales", "salary": 45000, "experience": 3}) == False

def test_valid_attributes():
    from app.models import VALID_ATTRIBUTES
    assert "age" in VALID_ATTRIBUTES
    assert "department" in VALID_ATTRIBUTES
    assert "salary" in VALID_ATTRIBUTES
    assert "experience" in VALID_ATTRIBUTES

def test_comparison_operators():
    test_cases = [
        ("age > 30", {"age": 35}, True),
        ("age > 30", {"age": 25}, False),
        ("age < 30", {"age": 25}, True),
        ("age < 30", {"age": 35}, False),
        ("age >= 30", {"age": 30}, True),
        ("age >= 30", {"age": 29}, False),
        ("age <= 30", {"age": 30}, True),
        ("age <= 30", {"age": 31}, False),
        ("age = 30", {"age": 30}, True),
        ("age = 30", {"age": 31}, False),
        ("age != 30", {"age": 31}, True),
        ("age != 30", {"age": 30}, False),
    ]
    
    for rule_string, data, expected in test_cases:
        ast = create_rule(rule_string)
        result = evaluate_rule(ast, data)
        assert result == expected, f"Failed for rule '{rule_string}' with data {data}: expected {expected}, got {result}"

def test_error_handling():
    with pytest.raises(ValueError, match="Unexpected end of expression"):
        create_rule("age >")
    
    with pytest.raises(ValueError, match="Invalid attribute: invalid_attr"):
        create_rule("invalid_attr > 30")
    
    with pytest.raises(ValueError, match="Unexpected end of expression"):
        create_rule("(age > 30 AND")
    
    with pytest.raises(ValueError, match="Expected closing parenthesis"):
        create_rule("(age > 30 AND department = 'Sales'")
    
    with pytest.raises(ValueError, match="Unexpected end of expression"):
        create_rule("age")

def test_combine_rules_edge_cases():
    with pytest.raises(ValueError, match="No rules provided to combine"):
        combine_rules([])
    
    single_rule = "age > 30"
    assert str(combine_rules([single_rule])) == str(create_rule(single_rule))

def test_evaluate_rule_missing_field():
    rule = "age > 30"
    ast = create_rule(rule)
    with pytest.raises(ValueError, match="Field age not found in data"):
        evaluate_rule(ast, {"department": "Sales"})

def test_complex_rules():
    rule = "(age > 30 AND department = 'Sales') OR (experience > 5 AND salary >= 50000)"
    ast = create_rule(rule)
    
    assert evaluate_rule(ast, {"age": 35, "department": "Sales", "experience": 3, "salary": 45000}) == True
    assert evaluate_rule(ast, {"age": 28, "department": "Marketing", "experience": 7, "salary": 55000}) == True
    assert evaluate_rule(ast, {"age": 28, "department": "Sales", "experience": 3, "salary": 45000}) == False