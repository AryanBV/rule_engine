from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_rule():
    response = client.post(
        "/api/rules/",
        json={"name": "Test Rule", "description": "A test rule", "rule_string": "age > 30 AND department = 'Sales'"}
    )
    assert response.status_code == 200
    assert "id" in response.json()

# Add more API tests as needed