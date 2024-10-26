import React, { useState, useEffect } from 'react';
import EvaluateTab from '../tabs/EvaluateTab';
import AlertMessage from '../shared/AlertMessage';
import { mockRules } from '../mockData';

const RuleEngineUI = () => {
    const [activeTab, setActiveTab] = useState('evaluate');
    const [rules, setRules] = useState(mockRules);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [evaluationData, setEvaluationData] = useState(JSON.stringify({
        age: 35,
        department: "Sales",
        salary: 75000,
        experience: 7
    }, null, 2));
    
    const [evaluationResult, setEvaluationResult] = useState(null);

    useEffect(() => {
        console.log('RuleEngineUI - evaluationData:', evaluationData);
    }, [evaluationData]);

    // Mock rule evaluation function
    const evaluateRule = async (ruleId) => {
        try {
            setLoading(true);
            let dataToEvaluate;
            try {
                dataToEvaluate = JSON.parse(evaluationData);
            } catch (err) {
                throw new Error('Invalid JSON data');
            }

            // Find the rule
            const rule = rules.find(r => r._id === ruleId);
            if (!rule) {
                throw new Error('Rule not found');
            }

            // Simple mock evaluation logic
            const result = mockEvaluateRule(rule.rule_string, dataToEvaluate);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setEvaluationResult({ ruleId, result });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Mock rule evaluation logic
    const mockEvaluateRule = (ruleString, data) => {
        try {
            // Parse the rule string
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

    // Helper function to evaluate single conditions
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

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">Rule Engine Dashboard</h1>
            
            {/* Navigation Tabs */}
            <div className="mb-8 border-b">
                <div className="flex space-x-4">
                    <button
                        className="px-4 py-2 transition-colors duration-200 border-b-2 border-blue-500 text-blue-500 font-medium"
                        onClick={() => setActiveTab('evaluate')}
                    >
                        Evaluate
                    </button>
                </div>
            </div>

            {/* Evaluate Tab */}
            <EvaluateTab
                rules={rules}
                evaluationData={evaluationData}
                setEvaluationData={setEvaluationData}
                evaluateRule={evaluateRule}
                evaluationResult={evaluationResult}
                loading={loading}
            />

            {/* Notifications */}
            {error && (
                <AlertMessage 
                    type="error" 
                    message={error} 
                    onClose={() => setError(null)}
                />
            )}
        </div>
    );
};

export default RuleEngineUI;