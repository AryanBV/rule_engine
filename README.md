# Rule Engine with AST Implementation

A sophisticated rule engine using Abstract Syntax Tree (AST) for complex business rule evaluation. This project is developed as part of the Zeotap Intern Assignment, featuring a modern web interface for rule management and evaluation.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Setup](#setup)
- [Usage](#usage)
- [API](#api)
- [Progress](#progress)

## 🎯 Overview

A modern 3-tier application that enables:
- Complex rule creation and evaluation
- Dynamic rule combinations
- Real-time data assessment
- Easy rule management through web interface

## ✨ Features Implemented

### Core Features
- ✅ Dynamic rule creation and modification
- ✅ Real-time rule evaluation
- ✅ Rule combination using AST
- ✅ MongoDB data persistence
- ✅ Modern React UI

### Technical Features
- ✅ AST implementation
- ✅ Efficient rule traversal
- ✅ RESTful API design
- ✅ Error handling
- ✅ Input validation

## 🏗️ Architecture

### AST Structure
```python
class Node:
    type: str        # "operator" or "comparison"
    left: Node       # Left child node
    right: Node      # Right child for operators
    field: str       # Field name for comparisons
    operator: str    # Comparison operator
    value: Any       # Comparison value
```

## 🛠️ Technology Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** FastAPI, Python 3.7+
- **Database:** MongoDB
- **Validation:** Pydantic

## 🚀 Setup

### Prerequisites
```bash
- Python 3.7+
- MongoDB
- Node.js and npm
```

### Installation

1. Clone repository:
```bash
git clone https://github.com/AryanBV/rule_engine.git
cd rule_engine
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure MongoDB:
```bash
# Create .env file with:
MONGODB_URL=mongodb://localhost:27017/rule_engine
```

5. Start server:
```bash
uvicorn app.main:app --reload
```

## 📖 Usage

### Rule Creation Example
```python
# Simple Rule
age > 30 AND department = 'Sales'

# Complex Rule
((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)
```

### Data Evaluation Example
```json
{
    "age": 35,
    "department": "Marketing",
    "salary": 25000,
    "experience": 7
}
```

## 📡 API Reference

### Rule Management
```http
POST   /api/rules/                    # Create rule
GET    /api/rules/                    # List rules
GET    /api/rules/{rule_id}           # Get rule
PUT    /api/rules/{rule_id}           # Update rule
DELETE /api/rules/{rule_id}           # Delete rule
```

### Rule Operations
```http
POST   /api/rules/evaluate/{rule_id}  # Evaluate rule
POST   /api/rules/combine             # Combine rules
```

## 📁 Project Structure
```
rule_engine/
├── app/
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   │       └── components/
│   ├── routes/
│   │   └── api.py
│   ├── main.py
│   ├── database.py
│   └── rule_engine.py
├── tests/
├── requirements.txt
└── README.md
```

## 🧪 Testing
Run tests:
```bash
pytest
```

## 📈 Current Progress

### Completed
- ✅ Core engine implementation
- ✅ AST evaluation logic
- ✅ MongoDB integration
- ✅ CRUD operations
- ✅ Modern UI

### In Development
- 🔄 Enhanced error handling
- 🔄 UI/UX improvements
- 🔄 Performance optimizations

### Planned
- 📋 User authentication
- 📋 Rule versioning
- 📋 Advanced visualizations
- 📋 Batch evaluations

## 📚 Documentation
- API Docs: `http://localhost:8000/docs`
- Components: `app/static/js/components/`
- Core Logic: `app/rule_engine.py`

## 🤝 Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Submit pull request

## 🧪 Tests
Run test suite:
```bash
pytest
```

### Test Coverage
- Unit tests
- API tests
- Integration tests

