# 8-Agent Design Team Workflow

## Agents

1. **Brand Guardian** - Ensures brand consistency, voice, values
2. **Visual Storyteller** - Narrative flow, emotional journey
3. **UX Researcher** - User needs, pain points, behaviors
4. **UX Architect** - Information architecture, user flows
5. **UI Designer** - Visual design, components, patterns
6. **Inclusive Visual Specialist** - Accessibility, inclusivity
7. **Image Prompt Engineer** - Visual assets, imagery
8. **Whimsy Injector** - Delight, personality, micro-interactions

## 10 Critique Loop Process

### Round 1: Individual Audits (Each agent reviews current site)
- Each agent generates individual audit report
- Focus: What's wrong from their perspective
- Output: 8 separate audit documents

### Round 2: Collaborative Discussion
- Agents discuss findings
- Identify conflicts (e.g., "Whimsy" vs "Brand Guardian")
- Prioritize issues by impact

### Round 3-4: Design Direction Proposals
- Each agent proposes changes
- Agents critique each other's proposals
- Synthesize into 3 cohesive directions

### Round 5: Direction Selection
- Vote on best direction
- Merge compatible elements
- Create unified vision

### Round 6-8: Detailed Design
- UI Designer leads visual execution
- Image Prompt Engineer creates assets
- Inclusive Visual Specialist audits accessibility
- UX Architect refines flows

### Round 9: Copy Iteration
- Visual Storyteller refines messaging
- Brand Guardian ensures voice consistency
- Whimsy Injector adds personality

### Round 10: Final Critique
- All agents review final design
- Score 0-10 across all dimensions
- Must achieve ≥ 9.0 average to ship

## Communication Protocol

Agents communicate via structured JSON:

```json
{
  "agent": "brand-guardian",
  "round": 1,
  "type": "audit",
  "findings": [
    {
      "issue": "Inconsistent voice in product cards",
      "severity": "high",
      "recommendation": "Establish tone guidelines"
    }
  ],
  "score": 6.5
}
```

## Scoring Rubric

Each agent scores the site (0-10) across their domain:
- **Brand Guardian:** Voice consistency, brand alignment
- **Visual Storyteller:** Narrative clarity, emotional resonance
- **UX Researcher:** User need satisfaction, friction points
- **UX Architect:** Information hierarchy, navigation logic
- **UI Designer:** Visual coherence, component quality
- **Inclusive Visual Specialist:** WCAG AAA compliance, inclusivity
- **Image Prompt Engineer:** Visual asset quality, relevance
- **Whimsy Injector:** Delight moments, personality expression

**Final gate:** Average score ≥ 9.0 required to ship.
