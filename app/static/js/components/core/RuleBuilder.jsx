import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import AlertMessage from '../shared/AlertMessage'

const RuleBuilder = () => {
  const [ruleName, setRuleName] = useState('')
  const [ruleDescription, setRuleDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!ruleName.trim()) {
      setError('Rule name is required')
      return
    }
    // TODO: Implement rule creation logic
    try {
      // API call to create rule
      console.log('Creating rule:', { ruleName, ruleDescription })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <AlertMessage 
            variant="destructive"
            icon={<AlertCircle className="h-4 w-4" />}
            title="Error"
            description={error}
          />
        )}
        
        <div className="space-y-2">
          <label htmlFor="ruleName" className="text-sm font-medium">
            Rule Name
          </label>
          <Input
            id="ruleName"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            placeholder="Enter rule name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ruleDescription" className="text-sm font-medium">
            Description
          </label>
          <Input
            id="ruleDescription"
            value={ruleDescription}
            onChange={(e) => setRuleDescription(e.target.value)}
            placeholder="Enter rule description"
          />
        </div>

        <Button type="submit">Create Rule</Button>
      </form>
    </Card>
  )
}

export default RuleBuilder