import React from 'react';

const EvaluateTab = ({
    rules,
    evaluationData,
    setEvaluationData,
    evaluateRule,
    evaluationResult,
    loading
}) => {
    return (
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
                                    <pre className="mt-2 bg-gray-50 p-2 rounded text-sm whitespace-pre-wrap">
                                        {rule.rule_string}
                                    </pre>
                                </div>
                                <button
                                    onClick={() => evaluateRule(rule._id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                                    disabled={loading}
                                >
                                    {loading ? 'Evaluating...' : 'Evaluate'}
                                </button>
                            </div>
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
    );
};

export default EvaluateTab;