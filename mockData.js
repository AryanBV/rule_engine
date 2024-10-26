// app/static/js/mockData.js

export const mockRules = [
    {
      _id: "1",
      name: "Senior Sales Rule",
      description: "Rule for senior sales employees",
      rule_string: "age > 30 AND department = 'Sales'",
      created_at: "2024-10-26T10:00:00Z",
      updated_at: "2024-10-26T10:00:00Z",
      version: 1,
      active: true
    },
    {
      _id: "2",
      name: "Marketing Experience Rule",
      description: "Rule for experienced marketing staff",
      rule_string: "department = 'Marketing' AND experience > 5",
      created_at: "2024-10-26T11:00:00Z",
      updated_at: "2024-10-26T11:00:00Z",
      version: 1,
      active: true
    }
  ];
  
  export const evaluateRule = (ruleString, data) => {
    try {
      // Simple rule evaluation logic for demo
      if (ruleString.includes('AND')) {
        const [condition1, condition2] = ruleString.split('AND').map(c => c.trim());
        return evaluateCondition(condition1, data) && evaluateCondition(condition2, data);
      } else if (ruleString.includes('OR')) {
        const [condition1, condition2] = ruleString.split('OR').map(c => c.trim());
        return evaluateCondition(condition1, data) || evaluateCondition(condition2, data);
      }
      return evaluateCondition(ruleString, data);
    } catch (error) {
      console.error('Rule evaluation error:', error);
      return false;
    }
  };
  
  const evaluateCondition = (condition, data) => {
    const matches = condition.match(/([\w]+)\s*([><=!]+)\s*(.+)/);
    if (!matches) return false;
    
    const [_, field, operator, value] = matches;
    const cleanValue = value.replace(/['"]/g, '');
    const fieldValue = data[field];
    const numValue = Number(cleanValue);
  
    switch (operator) {
      case '>':
        return fieldValue > numValue;
      case '<':
        return fieldValue < numValue;
      case '>=':
        return fieldValue >= numValue;
      case '<=':
        return fieldValue <= numValue;
      case '=':
        return isNaN(numValue) ? fieldValue === cleanValue : fieldValue === numValue;
      case '!=':
        return isNaN(numValue) ? fieldValue !== cleanValue : fieldValue !== numValue;
      default:
        return false;
    }
  };