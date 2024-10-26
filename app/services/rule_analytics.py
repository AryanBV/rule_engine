from datetime import datetime
from typing import Dict, Any, List
from pydantic import BaseModel

class RuleUsageStats(BaseModel):
    total_evaluations: int = 0
    avg_execution_time: float = 0
    true_results: int = 0
    false_results: int = 0
    last_evaluated: datetime = None

class RuleAnalyticsService:
    def __init__(self):
        self.usage_stats: Dict[str, RuleUsageStats] = {}
        
    def track_evaluation(self, rule_id: str, execution_time: float, result: bool):
        if rule_id not in self.usage_stats:
            self.usage_stats[rule_id] = RuleUsageStats()
            
        stats = self.usage_stats[rule_id]
        stats.total_evaluations += 1
        stats.avg_execution_time = (
            (stats.avg_execution_time * (stats.total_evaluations - 1) +
             execution_time) / stats.total_evaluations
        )
        if result:
            stats.true_results += 1
        else:
            stats.false_results += 1
        stats.last_evaluated = datetime.utcnow()
        
    def get_rule_analytics(self, rule_id: str) -> Dict[str, Any]:
        stats = self.usage_stats.get(rule_id, RuleUsageStats())
        
        return {
            "performance": {
                "average_execution_time": round(stats.avg_execution_time, 2),
                "evaluation_count": stats.total_evaluations,
                "success_rate": (stats.true_results / stats.total_evaluations 
                               if stats.total_evaluations > 0 else 0)
            },
            "usage": {
                "outcomes": [
                    {"name": "Successful", "value": stats.true_results},
                    {"name": "Failed", "value": stats.false_results}
                ]
            }
        }
        
    def get_all_analytics(self) -> Dict[str, Dict[str, Any]]:
        return {
            rule_id: self.get_rule_analytics(rule_id)
            for rule_id in self.usage_stats
        }