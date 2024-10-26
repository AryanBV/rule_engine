const RuleEngineUI = () => {
    const [activeTab, setActiveTab] = React.useState('create');
    const [rules, setRules] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [selectedRules, setSelectedRules] = React.useState([]);
    const [editingRule, setEditingRule] = React.useState(null);
    const [evaluationData, setEvaluationData] = React.useState('{\n  "age": 30,\n  "department": "Sales",\n  "salary": 50000,\n  "experience": 5\n}');
    const [evaluationResult, setEvaluationResult] = React.useState(null);
    
    const [newRule, setNewRule] = React.useState({
        name: '',
        description: '',
        rule_string: ''
    });

    React.useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/rules/');
            if (!response.ok) throw new Error('Failed to fetch rules');
            const data = await response.json();
            setRules(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createRule = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch('/api/rules/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRule)
            });
            if (!response.ok) throw new Error('Failed to create rule');
            await fetchRules();
            setNewRule({ name: '', description: '', rule_string: '' });
            showNotification('Rule created successfully!', 'success');
        } catch (err) {
            setError(err.message);
            showNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const deleteRule = async (ruleId) => {
        if (!confirm('Are you sure you want to delete this rule?')) return;
        
        try {
            setLoading(true);
            const response = await fetch(`/api/rules/${ruleId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete rule');
            await fetchRules();
            showNotification('Rule deleted successfully!', 'success');
        } catch (err) {
            setError(err.message);
            showNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateRule = async (ruleId, updatedRule) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/rules/${ruleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRule)
            });
            if (!response.ok) throw new Error('Failed to update rule');
            await fetchRules();
            setEditingRule(null);
            showNotification('Rule updated successfully!', 'success');
        } catch (err) {
            setError(err.message);
            showNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const evaluateRule = async (ruleId) => {
        try {
            setLoading(true);
            const data = JSON.parse(evaluationData);
            const response = await fetch(`/api/rules/evaluate/${ruleId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data })
            });
            if (!response.ok) throw new Error('Evaluation failed');
            const result = await response.json();
            setEvaluationResult({ ruleId, ...result });
        } catch (err) {
            setError(err.message);
            showNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const combineRules = async () => {
        if (selectedRules.length < 2) {
            showNotification('Please select at least 2 rules to combine', 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/rules/combine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedRules)
            });
            if (!response.ok) throw new Error('Failed to combine rules');
            await fetchRules();
            setSelectedRules([]);
            showNotification('Rules combined successfully!', 'success');
        } catch (err) {
            setError(err.message);
            showNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'info') => {
        setError(null);
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white ${
            type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    // Add this after your state declarations
    const formatRuleString = (ruleString) => {
        // Check if it's a combined rule (Node structure)
        if (ruleString.includes('Node(type=<NodeType.OPERATOR:')) {
            try {
                // Create a more readable version of the Node structure
                const formattedString = ruleString
                    // Convert NodeType.OPERATOR to plain text
                    .replace(/Node\(type=<NodeType\.OPERATOR:\s*'operator'>/g, 'OPERATOR')
                    // Convert NodeType.COMPARISON to plain text
                    .replace(/Node\(type=<NodeType\.COMPARISON:\s*'comparison'>/g, 'COMPARISON')
                    // Convert Operator.AND to plain text
                    .replace(/operator=<Operator\.AND:\s*'AND'>/g, 'operator="AND"')
                    // Convert Operator.OR to plain text
                    .replace(/operator=<Operator\.OR:\s*'OR'>/g, 'operator="OR"')
                    // Add line breaks and indentation
                    .replace(/,\s+/g, ',\n  ')
                    .replace(/\)/g, '\n)')
                    // Clean up None values
                    .replace(/=None/g, '=null');
    
                // Add proper indentation for nested structures
                let indent = 0;
                const lines = formattedString.split('\n');
                return lines.map(line => {
                    if (line.includes(')')) indent = Math.max(0, indent - 2);
                    const indentedLine = ' '.repeat(indent) + line.trim();
                    if (line.includes('OPERATOR') || line.includes('COMPARISON')) indent += 2;
                    return indentedLine;
                }).join('\n');
            } catch (err) {
                console.error('Error formatting rule string:', err);
                return ruleString;
            }
        }
        return ruleString;
    };

    // Replace the entire return statement in your RuleEngineUI component
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">Rule Engine Dashboard</h1>
            
            {/* Tabs */}
            <div className="mb-8 border-b">
                <div className="flex space-x-4">
                    {['create', 'manage', 'evaluate', 'combine'].map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 transition-colors duration-200 ${
                                activeTab === tab
                                    ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => {
                                setActiveTab(tab);
                                if (['manage', 'evaluate', 'combine'].includes(tab)) {
                                    fetchRules();
                                }
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content using conditional rendering */}
            {activeTab === 'create' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Create New Rule</h2>
                    <form onSubmit={createRule} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Rule Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={newRule.name}
                                onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={newRule.description}
                                onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                                rows="2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Rule Expression</label>
                            <textarea
                                className="w-full p-2 border rounded font-mono"
                                value={newRule.rule_string}
                                onChange={(e) => setNewRule({...newRule, rule_string: e.target.value})}
                                rows="3"
                                placeholder="Example: (age > 35 AND department = 'Sales') OR experience > 5"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Rule'}
                        </button>
                    </form>
                </div>
            )}

            {/* Manage Rules Tab */}
            {activeTab === 'manage' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Manage Rules</h2>
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {rules.map((rule) => (
                                <div key={rule._id} className="border rounded-lg p-4 bg-white shadow-sm">
                                    {editingRule === rule._id ? (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                value={rule.name}
                                                onChange={(e) => {
                                                    const updatedRules = rules.map(r =>
                                                        r._id === rule._id ? {...r, name: e.target.value} : r
                                                    );
                                                    setRules(updatedRules);
                                                }}
                                            />
                                            <textarea
                                                className="w-full p-2 border rounded"
                                                value={rule.description}
                                                onChange={(e) => {
                                                    const updatedRules = rules.map(r =>
                                                        r._id === rule._id ? {...r, description: e.target.value} : r
                                                    );
                                                    setRules(updatedRules);
                                                }}
                                                rows="2"
                                            />
                                            <textarea
                                                className="w-full p-2 border rounded font-mono"
                                                value={rule.rule_string}
                                                onChange={(e) => {
                                                    const updatedRules = rules.map(r =>
                                                        r._id === rule._id ? {...r, rule_string: e.target.value} : r
                                                    );
                                                    setRules(updatedRules);
                                                }}
                                                rows="3"
                                            />
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => updateRule(rule._id, rule)}
                                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingRule(null)}
                                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-grow">
                                                    <h3 className="font-medium">{rule.name}</h3>
                                                    <p className="text-gray-600 text-sm mt-1">
                                                        {rule.description}
                                                    </p>
                                                    <pre className={`mt-2 bg-gray-50 p-3 rounded text-sm overflow-x-auto ${
                                                        rule.description.startsWith('Combination of rules:') 
                                                            ? 'whitespace-pre font-mono'  // For combined rules
                                                            : 'whitespace-pre-wrap break-all' // For regular rules
                                                    }`}>
                                                        {rule.description.startsWith('Combination of rules:') 
                                                            ? formatRuleString(rule.rule_string)
                                                            : rule.rule_string}
                                                    </pre>
                                                </div>
                                                <div className="flex space-x-2 ml-4 shrink-0">
                                                    <button
                                                        onClick={() => setEditingRule(rule._id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteRule(rule._id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'evaluate' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Evaluate Rules</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">JSON Data</label>
                            <textarea
                                className="w-full p-2 border rounded font-mono"
                                value={evaluationData}
                                onChange={(e) => setEvaluationData(e.target.value)}
                                rows="4"
                            />
                        </div>
                        <div className="space-y-4">
                            {rules.map((rule) => (
                                <div key={rule._id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">{rule.name}</h3>
                                            <pre className="text-sm whitespace-pre-wrap">
                                                {rule.rule_string}
                                            </pre>

                                        </div>
                                        {/* Add Evaluate Button for Test Rule, but not for Combined Rule */}
                                        {rule.name !== 'Combined Rule' && (
                                            <button
                                                onClick={() => evaluateRule(rule._id)}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                                disabled={loading}
                                            >
                                                {loading ? 'Evaluating...' : 'Evaluate'}
                                            </button>
                                        )}
                                    </div>
                                    {/* Result message */}
                                    {evaluationResult && evaluationResult.ruleId === rule._id && (
                                        <div className={`mt-4 p-4 rounded ${
                                            evaluationResult.result ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            <p className="font-medium">
                                                Result: {evaluationResult.result ? 'Conditions Met' : 'Conditions Not Met'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}



            {activeTab === 'combine' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-2">Combine Rules</h2>
                    <p className="text-gray-600 mb-6">Select at least two rules to combine them with AND operator</p>
                    <div className="space-y-4">
                        {rules.map((rule) => (
                            <div key={rule._id} className="border rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedRules.includes(rule._id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedRules([...selectedRules, rule._id]);
                                            } else {
                                                setSelectedRules(selectedRules.filter(id => id !== rule._id));
                                            }
                                        }}
                                        className="mt-1.5 h-4 w-4"
                                    />
                                    <div>
                                        <h3 className="text-base font-medium">{rule.name}</h3>
                                        <pre className="mt-2 bg-gray-50 p-2 rounded text-sm whitespace-pre-wrap">
                                            {rule.rule_string}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={combineRules}
                            disabled={selectedRules.length < 2 || loading}
                            className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
                        >
                            Combine Selected Rules
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

window.RuleEngineUI = RuleEngineUI;