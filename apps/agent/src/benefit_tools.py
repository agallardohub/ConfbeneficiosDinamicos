"""Benefits tools for Buk (Hackathon edition).
"""

from __future__ import annotations

import json
import os
from typing import Annotated, Any, Dict, List
from langchain_core.tools import tool
from langgraph.types import Command
from langchain_core.messages import ToolMessage
from langchain_core.tools import InjectedToolCallId

@tool
def fetch_buk_benefits(
    category: Annotated[str, "Optional category to filter benefits (health, wellness, security, gift, fast)."] = "",
    tool_call_id: Annotated[str, InjectedToolCallId] = "",
) -> Command:
    """Fetch benefits available for the user in Buk.
    
    Returns a Command that updates the 'benefits' state and renders the BenefitList component.
    """
    try:
        # Resolve path to benefits.json
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        data_path = os.path.join(base_dir, "data", "benefits.json")
        
        with open(data_path, "r", encoding="utf-8") as f:
            benefits = json.load(f)
            
        if category:
            benefits = [b for b in benefits if b.get("category") == category]
            
        summary = f"Found {len(benefits)} benefits"
        if category:
            summary += f" in the {category} category"
        summary += ". The assistant should now switch to the benefits view using setView(view='benefits')."

        # We return a Command to update the agent state
        # The frontend will see 'benefits' in the state snapshot
        return Command(
            update={
                "benefits": benefits,
                "messages": [ToolMessage(content=summary, tool_call_id=tool_call_id)],
            }
        )
    except Exception as e:
        return Command(
            update={
                "messages": [
                    ToolMessage(
                        content=f"Error fetching benefits: {str(e)}",
                        tool_call_id=tool_call_id,
                    )
                ],
            }
        )

@tool
def create_buk_benefit(benefit: dict[str, Any]) -> str:
    """
    Create a new benefit and persist it to the benefits.json store.
    The benefit should follow the Buk benefit schema.
    """
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_path = os.path.join(base_dir, "data", "benefits.json")
        
        with open(json_path, "r", encoding="utf-8") as f:
            benefits = json.load(f)
        
        # Ensure a unique ID
        max_id = max([b.get("id", 0) for b in benefits]) if benefits else 0
        benefit["id"] = max_id + 1
        
        benefits.append(benefit)
        
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(benefits, f, indent=2, ensure_ascii=False)
            
        return f"Beneficio '{benefit.get('name')}' creado exitosamente con ID {benefit['id']}."
    except Exception as e:
        return f"Error al crear el beneficio: {str(e)}"

def load_benefit_tools() -> List[Any]:
    return [fetch_buk_benefits, create_buk_benefit]
