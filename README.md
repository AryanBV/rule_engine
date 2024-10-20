# Rule Engine with AST

This repository contains one application as part of the Zeotap Intern Assignment:
- Rule Engine with AST


### Objective
Develop a simple 3-tier rule engine application (Simple UI, API, and Backend, Data) to determine user eligibility based on attributes like age, department, income, spend, etc. The system uses Abstract Syntax Tree (AST) to represent conditional rules and allows for dynamic creation, combination, and modification of these rules.

### Features
- Create, read, update, and delete rules
- Evaluate data against stored rules
- Combine multiple rules into a single AST
- RESTful API for rule management and evaluation
- MongoDB for rule storage

### API Endpoints
- `POST /api/rules/`: Create a new rule
- `GET /api/rules/`: List all rules
- `GET /api/rules/{rule_id}`: Get a specific rule
- `PUT /api/rules/{rule_id}`: Update a rule
- `DELETE /api/rules/{rule_id}`: Delete a rule
- `POST /api/rules/evaluate/{rule_id}`: Evaluate data against a rule
- `POST /api/rules/combine`: Combine multiple rules into a single rule

### Data Structure
The AST is represented using a `Node` class with the following fields:
- `type`: String indicating the node type ("operator" for AND/OR, "comparison" for conditions)
- `left`: Reference to another `Node` (left child)
- `right`: Reference to another `Node` (right child for operators)
- `field`: String representing the field name for comparison nodes
- `operator`: String representing the comparison operator
- `value`: Value for comparison nodes

### Setup and Running
1. Clone the repository:
   ```
   git clone https://github.com/AryanBV/rule_engine.git
   cd rule_engine
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set up MongoDB and update the connection string in `.env` file.

4. Run the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

5. Access the API documentation at `http://localhost:8000/docs`

## Application 2: Real-Time Data Processing System for Weather Monitoring

### Objective
Develop a real-time data processing system to monitor weather conditions and provide summarized insights using rollups and aggregates. The system utilizes data from the OpenWeatherMap API.

### Features
- Continuous retrieval of weather data for Indian metros
- Temperature conversion from Kelvin to Celsius
- Daily weather summaries with aggregates
- Alerting system for threshold breaches
- Data visualization for summaries and trends

### Setup and Running
[Instructions for setting up and running the weather monitoring system]

## Dependencies
- Python 3.7+
- FastAPI
- MongoDB
- Pydantic
- Requests (for OpenWeatherMap API calls)
- [Any additional libraries used]

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
- Implement a simple web-based UI for easier interaction
- Add support for user-defined functions in rules
- Enhance rule combination strategies
- Extend weather monitoring to include more parameters and forecasting
