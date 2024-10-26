// In EvaluateTab.jsx
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
                        className="w-full p-2 border rounded font-mono text-sm min-h-[150px]"
                        value={evaluationData}
                        onChange={(e) => setEvaluationData(e.target.value)}
                        spellCheck="false"
                    />
                </div>
                {/* Rest of your EvaluateTab component remains the same */}
            </div>
        </div>
    );
};