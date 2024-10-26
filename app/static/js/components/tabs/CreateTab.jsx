//  File: app/static/js/components/tabs/CreateTab.jsx
import React from 'react';
import RuleBuilder from '../core/RuleBuilder';

const CreateTab = ({ newRule, setNewRule, handleSubmit, loading }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Rule</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <RuleBuilder
                        value={newRule.rule_string}
                        onChange={(e) => setNewRule({...newRule, rule_string: e.target.value})}
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
    );
};

export default CreateTab;