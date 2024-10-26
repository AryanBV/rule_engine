import React, { useState, useEffect } from 'react';
import EvaluateTab from '../tabs/EvaluateTab';
import AlertMessage from '../shared/AlertMessage';

const RuleEngineUI = () => {
    const [activeTab, setActiveTab] = useState('evaluate'); // Start with evaluate tab
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Initialize with the correct data
    const [evaluationData, setEvaluationData] = useState(JSON.stringify({
        age: 35,
        department: "Sales",
        salary: 75000,
        experience: 7
    }, null, 2));
    
    const [evaluationResult, setEvaluationResult] = useState(null);

    // Debug log when evaluationData changes
    useEffect(() => {
        console.log('RuleEngineUI - evaluationData:', evaluationData);
    }, [evaluationData]);

    useEffect(() => {
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

    const evaluateRule = async (ruleId) => {
        try {
            setLoading(true);
            let dataToEvaluate;
            try {
                dataToEvaluate = JSON.parse(evaluationData);
            } catch (err) {
                throw new Error('Invalid JSON data');
            }
            
            const response = await fetch(`/api/rules/evaluate/${ruleId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: dataToEvaluate })
            });
            
            if (!response.ok) throw new Error('Evaluation failed');
            const result = await response.json();
            setEvaluationResult({ ruleId, ...result });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
            {error && <AlertMessage type="error" message={error} />}
        </div>
    );
};

export default RuleEngineUI;