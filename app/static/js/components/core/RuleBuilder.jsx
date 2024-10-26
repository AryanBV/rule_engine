//  File: app/static/js/components/core/RuleBuilder.jsx
import React from 'react';
import { PlusCircle, XCircle } from 'lucide-react';

const RuleBuilder = ({ value, onChange }) => {
    const validAttributes = ['age', 'department', 'salary', 'experience'];
    const comparisons = ['>', '<', '>=', '<=', '=', '!='];

    return (
        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Visual Rule Builder</h3>
                <div className="text-sm text-gray-500">Click elements to insert</div>
            </div>

            <textarea
                className="w-full p-2 border rounded font-mono bg-white"
                value={value}
                onChange={onChange}
                rows="3"
                placeholder="Example: (age > 35 AND department = 'Sales') OR experience > 5"
            />
            
            <div className="space-y-3">
                <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Attributes</div>
                    <div className="flex flex-wrap gap-2">
                        {validAttributes.map(attr => (
                            <button 
                                key={attr}
                                onClick={() => onChange({ target: { value: value + ` ${attr}` } })}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                            >
                                {attr}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Comparisons</div>
                    <div className="flex flex-wrap gap-2">
                        {comparisons.map(op => (
                            <button 
                                key={op}
                                onClick={() => onChange({ target: { value: value + ` ${op}` } })}
                                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                            >
                                {op}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Operators</div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => onChange({ target: { value: value + ' AND ' } })}
                            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                        >
                            AND
                        </button>
                        <button 
                            onClick={() => onChange({ target: { value: value + ' OR ' } })}
                            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                        >
                            OR
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-sm text-gray-500 mt-4">
                <p>Examples:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Simple: age > 30 AND department = 'Sales'</li>
                    <li>Complex: (age > 30 OR experience > 5) AND salary >= 50000</li>
                </ul>
            </div>
        </div>
    );
};

export default RuleBuilder;