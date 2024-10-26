//  File: app/static/js/components/tabs/ManageTab.jsx
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';

const ManageTab = ({ rules, loading, onEdit, onDelete, editingRule, onUpdate }) => {
    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-4">
            {rules.map((rule) => (
                <div key={rule._id} className="bg-white rounded-lg shadow-md p-6">
                    {editingRule === rule._id ? (
                        <div className="space-y-4">
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={rule.name}
                                onChange={(e) => onUpdate(rule._id, {...rule, name: e.target.value})}
                            />
                            <textarea
                                className="w-full p-2 border rounded"
                                value={rule.description}
                                onChange={(e) => onUpdate(rule._id, {...rule, description: e.target.value})}
                                rows="2"
                            />
                            <textarea
                                className="w-full p-2 border rounded font-mono"
                                value={rule.rule_string}
                                onChange={(e) => onUpdate(rule._id, {...rule, rule_string: e.target.value})}
                                rows="3"
                            />
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onUpdate(rule._id, rule)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => onEdit(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">{rule.name}</h3>
                                    <p className="text-gray-600 mt-1">{rule.description}</p>
                                    <pre className="mt-2 bg-gray-50 p-3 rounded text-sm">
                                        {rule.rule_string}
                                    </pre>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(rule._id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Edit rule"
                                    >
                                        <Edit2 className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(rule._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        title="Delete rule"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ManageTab;