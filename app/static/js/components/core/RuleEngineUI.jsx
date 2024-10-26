// File: app/static/js/components/core/RuleEngineUI.jsx
import React, { useState, useEffect } from 'react';
import CreateTab from '../tabs/CreateTab';
import ManageTab from '../tabs/ManageTab';
import EvaluateTab from '../tabs/EvaluateTab';
import CombineTab from '../tabs/CombineTab';
import AlertMessage from '../shared/AlertMessage';
import LoadingSpinner from '../shared/LoadingSpinner';

const RuleEngineUI = () => {
    const [activeTab, setActiveTab] = useState('create');
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRules, setSelectedRules] = useState([]);
    const [editingRule, setEditingRule] = useState(null);
    const [evaluationData, setEvaluationData] = useState(
        JSON.stringify({
            age: 35,
            department: "Sales",
            salary: 75000,
            experience: 7
        }, null, 2)
    );
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [newRule, setNewRule] = useState({
        name: '',
        description: '',
        rule_string: ''
    });

    useEffect(() => {
        fetchRules();
    }, []);

    // API Calls
    const fetchRules = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/rules/');
            if (!response.ok) throw new Error('Failed to fetch rules');
            const data = await response.json();
            setRules(data);
        } catch (err) {
            showNotification(err.message, 'error');
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
            showNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'info') => {
        if (type === 'error') setError(message);
        else setError(null);
        
        setTimeout(() => setError(null), 3000);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">Rule Engine Dashboard</h1>
            
            {/* Navigation Tabs */}
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

            {/* Tab Content */}
            {activeTab === 'create' && (
                <CreateTab
                    newRule={newRule}
                    setNewRule={setNewRule}
                    handleSubmit={createRule}
                    loading={loading}
                />
            )}

            {activeTab === 'manage' && (
                <ManageTab
                    rules={rules}
                    loading={loading}
                    onEdit={setEditingRule}
                    onDelete={deleteRule}
                    editingRule={editingRule}
                    onUpdate={updateRule}
                />
            )}

            {activeTab === 'evaluate' && (
                <EvaluateTab
                    rules={rules}
                    evaluationData={evaluationData}
                    setEvaluationData={setEvaluationData}
                    evaluateRule={evaluateRule}
                    evaluationResult={evaluationResult}
                    loading={loading}
                />
            )}

            {activeTab === 'combine' && (
                <CombineTab
                    rules={rules}
                    selectedRules={selectedRules}
                    setSelectedRules={setSelectedRules}
                    combineRules={combineRules}
                    loading={loading}
                />
            )}

            {/* Notifications */}
            {error && <AlertMessage type="error" message={error} />}
        </div>
    );
};

export default RuleEngineUI;