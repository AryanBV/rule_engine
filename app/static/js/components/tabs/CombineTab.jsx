//  File: app/static/js/components/tabs/CombineTab.jsx
import React from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';

const CombineTab = ({ 
    rules, 
    selectedRules, 
    setSelectedRules, 
    combineRules, 
    loading 
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">Combine Rules</h2>
            <p className="text-gray-600 mb-6">
                Select at least two rules to combine them with AND operator
            </p>
            <div className="space-y-4">
                {rules.map((rule) => (
                    <div key={rule._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
                            <div className="flex-grow">
                                <h3 className="text-base font-medium">{rule.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
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
                    className={`
                        mt-4 px-4 py-2 rounded text-white
                        ${selectedRules.length < 2 || loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600'}
                    `}
                >
                    {loading ? 'Combining...' : 'Combine Selected Rules'}
                </button>
            </div>
        </div>
    );
};

export default CombineTab;