// First, create a mockData.js file in your project
const mockRules = [
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
    },
    {
      _id: "3",
      name: "High Salary Rule",
      description: "Rule for high salary employees",
      rule_string: "salary > 70000",
      created_at: "2024-10-26T12:00:00Z",
      updated_at: "2024-10-26T12:00:00Z",
      version: 1,
      active: true
    }
  ];
  
  export { mockRules };