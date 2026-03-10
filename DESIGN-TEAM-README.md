# 8-Agent Design Team Setup - Complete

## ✅ What's Been Deployed

### 1. Design Agents Installed
Location: `~/.openclaw/workspace/skills/design-team/`

All 8 agents:
- `design-brand-guardian.md`
- `design-visual-storyteller.md`
- `design-ux-researcher.md`
- `design-ux-architect.md`
- `design-ui-designer.md`
- `design-inclusive-visuals-specialist.md`
- `design-image-prompt-engineer.md`
- `design-whimsy-injector.md`

### 2. Search Tools Verified
- ✅ Exa Search (neural, high-quality)
- ✅ Perplexity Search (fallback)
- ✅ Unified wrapper: `bash ~/.openclaw/workspace/scripts/search "query"`

### 3. Repository Setup
- Location: `~/pkgxdev-www`
- Branch: `feature/visual-redesign-2026` (created)
- Status: Ready for design work

### 4. Coordination Files
- `design-team-workflow.md` - 10-round process spec
- `run-design-team.sh` - Orchestration script (executable)
- `CLAUDE-CODE-DESIGN-TASK.md` - Claude Code task prompt
- `DESIGN-TEAM-README.md` - This file

## 🚀 How to Run

### Option 1: Claude Code CLI (Recommended)
```bash
ssh openclaw@100.99.136.10
cd ~/pkgxdev-www
claude-code --task CLAUDE-CODE-DESIGN-TASK.md --obra --dir ~/pkgxdev-www
```

### Option 2: Manual Round-by-Round
```bash
ssh openclaw@100.99.136.10
cd ~/pkgxdev-www
./run-design-team.sh  # Creates scaffolding
# Then manually run each round following design-team-workflow.md
```

## 📋 The 10-Round Process

1. **Round 1:** Individual audits (8 agents)
2. **Round 2:** Collaborative discussion
3. **Round 3-4:** Design direction proposals
4. **Round 5:** Direction selection
5. **Round 6-8:** Implementation
6. **Round 9:** Copy refinement
7. **Round 10:** Final validation

**Success gate:** ≥ 9.0 average score across all 8 agents.

## 📁 Output Location
All round outputs: `~/design-team-output/`

## 🎯 Success Criteria
- [ ] All 8 agents participated in all 10 rounds
- [ ] Final design scores ≥ 9.0 average
- [ ] Site builds without errors
- [ ] "Failed to fetch" issue resolved
- [ ] Radically different from current state
- [ ] Copy and design both transformed
- [ ] Accessibility (WCAG AAA)
- [ ] Git commits document the journey

## 🔍 Verification

Test that everything works:
```bash
# Test search
bash ~/.openclaw/workspace/scripts/search "pkgx package manager"

# Verify agents
ls -l ~/.openclaw/workspace/skills/design-team/

# Check repo
cd ~/pkgxdev-www
git status
npm install  # If dependencies needed
npm run build  # Test build
```

## 📞 Next Steps

1. Review this setup
2. Start Claude Code with CLAUDE-CODE-DESIGN-TASK.md
3. Monitor the 10 rounds as agents collaborate
4. Review final design when complete

---

**Setup completed:** 2026-03-10 21:21 UTC  
**Setup by:** T2 Orchestrator (subagent)  
**Ready for:** Timothy to start Claude Code execution
