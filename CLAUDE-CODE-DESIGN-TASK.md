# Claude Code Task: pkgx.dev Radical Redesign with 8 Design Agents

## Your Role
You are coordinating 8 specialized design agents to completely redesign pkgx.dev.

## The 8 Agents (Your Team)
1. **Brand Guardian** - Voice, values, consistency
2. **Visual Storyteller** - Narrative, emotion, journey
3. **UX Researcher** - User needs, behaviors
4. **UX Architect** - Information architecture
5. **UI Designer** - Visual design, components
6. **Inclusive Visual Specialist** - Accessibility
7. **Image Prompt Engineer** - Visual assets
8. **Whimsy Injector** - Delight, personality

**Location:** `~/.openclaw/workspace/skills/design-team/design-*.md`

## Current Site
- Location: ~/pkgxdev-www
- Branch: feature/visual-redesign-2026
- Current state: Modern visual design, agentic copy, but "Failed to fetch" errors and needs radical improvement

## Your Mission
Run 10 collaborative critique loops where each agent:
1. Audits the site from their perspective
2. Proposes changes
3. Critiques other agents' proposals
4. Collaborates to synthesize best ideas
5. Implements changes
6. Validates results

## Tools Available
- Exa search (neural, high-quality): `bash ~/.openclaw/workspace/scripts/search "query"`
- File system access to entire repo
- Ability to modify any file
- Git for version control
- npm/vite for building and testing

## Process

### Round 1: Individual Audits
Each agent generates detailed audit:
- What's working
- What's broken
- What's missing
- Score (0-10) with rationale

**Read each agent's guidelines** from `~/.openclaw/workspace/skills/design-team/design-*.md` before auditing.

### Round 2: Discussion
Agents discuss findings, identify:
- Common themes
- Conflicting priorities
- Quick wins vs. major changes

### Round 3-4: Direction Proposals
Generate 3 design directions:
- Option A: [Description]
- Option B: [Description]  
- Option C: [Description]

Each with pros/cons from all 8 agents

### Round 5: Direction Selection
Agents vote, merge best elements, create unified vision

### Round 6-8: Implementation
- UI Designer leads visual execution
- Image Prompt Engineer creates assets (or generates prompts for later generation)
- Inclusive Visual Specialist ensures WCAG AAA
- UX Architect refines flows and IA
- Others provide continuous feedback

### Round 9: Copy Refinement
- Visual Storyteller polishes messaging
- Brand Guardian ensures voice consistency
- Whimsy Injector adds personality touches

### Round 10: Final Validation
All agents score final result (must average ≥ 9.0)

## Success Criteria
- [ ] All 8 agents participated in all 10 rounds
- [ ] Final design scores ≥ 9.0 average across agents
- [ ] Site builds without errors
- [ ] "Failed to fetch" issue resolved
- [ ] Radically different from current state
- [ ] Copy and design both transformed
- [ ] Accessibility (WCAG AAA)
- [ ] Git commits document the journey

## Output Structure
Save all round outputs to `~/design-team-output/`:
- `round1-audit-[agent].md` (8 files)
- `round2-discussion.md`
- `round3-4-directions.md`
- `round5-selection.md`
- `round6-8-implementation.md`
- `round9-copy.md`
- `round10-validation.md`
- `final-scores.json`

## Git Workflow
- Commit after each round: `git commit -m "Round X: [summary]"`
- Push to feature/visual-redesign-2026 regularly
- Tag final version: `git tag design-team-v1.0`

## START WITH ROUND 1: INDIVIDUAL AUDITS

1. Read all 8 agent guideline files
2. For each agent, audit the current site from their perspective
3. Generate structured audit documents
4. Save to ~/design-team-output/
5. Proceed to Round 2

**Remember:** You ARE all 8 agents. Role-play each one authentically based on their guidelines.
