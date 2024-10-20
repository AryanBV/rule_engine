# Rule Engine with AST

This repository contains a Rule Engine application with Abstract Syntax Tree (AST) implementation, developed as part of the Zeotap Intern Assignment.

## Objective

Develop a simple 3-tier rule engine application (Simple UI, API, and Backend, Data) to determine user eligibility based on attributes like age, department, income, spend, etc. The system uses Abstract Syntax Tree (AST) to represent conditional rules and allows for dynamic creation, combination, and modification of these rules.

## Features

- Create, read, update, and delete rules
- Evaluate data against stored rules
- Combine multiple rules into a single AST
- RESTful API for rule management and evaluation
- MongoDB for rule storage
- Simple web-based UI for interaction

## API Endpoints

- `POST /api/rules/`: Create a new rule
- `GET /api/rules/`: List all rules
- `GET /api/rules/{rule_id}`: Get a specific rule
- `PUT /api/rules/{rule_id}`: Update a rule
- `DELETE /api/rules/{rule_id}`: Delete a rule
- `POST /api/rules/evaluate/{rule_id}`: Evaluate data against a rule
- `POST /api/rules/combine`: Combine multiple rules into a single rule

## Data Structure

The AST is represented using a `Node` class with the following fields:
- `type`: String indicating the node type ("operator" for AND/OR, "comparison" for conditions)
- `left`: Reference to another `Node` (left child)
- `right`: Reference to another `Node` (right child for operators)
- `field`: String representing the field name for comparison nodes
- `operator`: String representing the comparison operator
- `value`: Value for comparison nodes

## Setup and Running

1. Clone the repository:
   ```
   git clone https://github.com/AryanBV/rule_engine.git
   cd rule_engine
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set up MongoDB:
   - Install and start MongoDB on your system
   - Update the connection string in the `.env` file:
     ```
     MONGODB_URL=mongodb://localhost:27017/rule_engine
     ```

4. Run the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

5. Access the application:
   - Rule Engine UI: `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`

## Usage

1. Open the UI at `http://localhost:8000`
2. Create new rules using the provided form
3. View existing rules in the list
4. Select a rule and enter JSON data to evaluate it

Example rule:
```
((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)
```

Example JSON data for evaluation:
```json
{"age": 35, "department": "Marketing", "salary": 25000, "experience": 7}
```

## Dependencies

- Python 3.7+
- FastAPI
- MongoDB
- Pydantic

## Testing

To run the unit tests:
```
pytest
```

## Design Choices and Non-Functional Considerations

- Used FastAPI for high performance and easy API documentation
- Implemented efficient AST traversal for rule evaluation
- Added basic error handling and input validation
- [Any additional design choices or optimizations]

## Future Improvements

- Add support for user-defined functions in rules
- Enhance rule combination strategies
- Implement more sophisticated data analysis and visualization for rule evaluation
- Add user authentication and authorization

