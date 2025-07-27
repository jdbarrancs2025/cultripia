# CLAUDE.md - Cultripia Development Rules

## Project Overview
You are developing Cultripia, a cultural experiences marketplace. This is a 4-week MVP project using Next.js, Convex, Clerk, Stripe, and shadcn/ui.

## Core Principles
- **Follow documentation religiously** - Every decision must align with specs in `/docs/`
- **Simplicity first** - Keep all code changes simple and functional
- **One task at a time** - Complete tasks sequentially, marking them done
- **Ask before major decisions** - Check with user for plan verification and clarifications

## Development Workflow

### 1. PLANNING PHASE
When starting development:
1. Read ALL documentation in `/docs/` thoroughly
2. Create a detailed task breakdown in `/tasks/todo.md` based on `/docs/implementation-plan.md`
3. **MUST check with user** to verify the plan before starting any code
4. Break down each implementation step into simple, atomic tasks
5. Each task should be completable in 10-15 minutes maximum

### 2. DEVELOPMENT PHASE
For each task:
1. Mark task as `[IN PROGRESS]` in `/tasks/todo.md`
2. Implement the task with minimal, functional code
3. Test the functionality works
4. Mark task as `[COMPLETED]` in `/tasks/todo.md`
5. Move to next task

### 3. DOCUMENTATION REFERENCE
- Use **REF mcp** for all documentation lookups
- Always reference the specific docs when making decisions:
  - `/docs/masterplan.md` - Tech stack, data model, core features
  - `/docs/flow-pages-roles.md` - User flows, page purposes, access levels
  - `/docs/design-guidelines.md` - UI specifications, colors, components
  - `/docs/implementation-plan.md` - Build sequence, component specs

### 4. CODE QUALITY RULES
- **Simplicity over cleverness** - Write straightforward, readable code
- **Function over form** - Prioritize working features over perfect styling
- **Component reuse** - Use shadcn/ui components as specified in design guidelines
- **No premature optimization** - Build it working first, optimize later
- **Follow the data model** exactly as specified in masterplan.md

### 5. TASK STRUCTURE REQUIREMENTS
Each task in `/tasks/todo.md` must:
- Have a clear, specific title
- Reference the relevant documentation section
- Be atomic (one specific thing to build/fix)
- Include acceptance criteria
- Be marked with status: `[ ]` TODO, `[IN PROGRESS]` active, `[COMPLETED]` done

Example task format:
```
### [COMPLETED] Setup Next.js with TypeScript and Tailwind
**Reference:** `/docs/implementation-plan.md` step 1
**Acceptance criteria:** 
- Next.js project initialized with TypeScript
- Tailwind CSS configured with Cultripia color palette
- shadcn/ui installed and configured
- Project builds without errors
```

### 6. CHECKPOINT REQUIREMENTS
You MUST check with the user at these points:
- After creating the initial task plan (before any coding)
- Before implementing complex features (calendar system, Stripe integration)
- When encountering unclear requirements
- After completing major milestones (auth setup, database schema, etc.)

### 7. FINAL REVIEW PROCESS
After completing all tasks:
1. Run the **code-quality-enforcer** to check for:
   - Bugs and runtime errors
   - Failed tests
   - Code inconsistencies
   - Missing functionality vs. documentation
2. Address any issues found by the code-quality-enforcer
3. Re-run code-quality-enforcer until all issues resolved
4. **Wait for user verification** that everything works as intended
5. Only then: `git commit -m "Implement [feature/milestone name]"`

### 8. ERROR HANDLING
If you encounter issues:
- Document the problem clearly
- Suggest simple solutions
- Ask user for guidance if unclear
- Never make assumptions about requirements
- Update `/tasks/todo.md` with any discovered additional tasks

### 9. TECH STACK COMPLIANCE
Strictly follow the tech choices in `/docs/masterplan.md`:
- Next.js 14 with App Router
- TypeScript for all code
- Convex for database and backend logic
- Clerk for authentication
- Stripe Checkout for payments
- shadcn/ui + Tailwind CSS for UI
- next-intl for internationalization
- Resend for emails
- DeepL for translation

### 10. UI/UX REQUIREMENTS
Follow `/docs/design-guidelines.md` exactly:
- Use specified color palette (Turquesa #009D9B, etc.)
- Implement responsive design (desktop-first, mobile-optimized)
- Use specified shadcn components for each feature
- Follow the exact card layouts and component structures shown
- Ensure accessibility requirements are met

## Remember
- The goal is a working MVP that proves demand with 3 hosts, 5 experiences, 10 bookings
- Every feature should be functional, not perfect
- User experience is more important than code elegance
- Ask questions when in doubt - don't guess!