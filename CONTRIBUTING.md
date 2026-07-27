# Contributing to PathPilot AI

Thank you for your interest in contributing to **PathPilot AI**! We welcome contributions from developers, researchers, designers, and career strategists around the world.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free community. Please treat all contributors with respect, dignity, and constructive empathy.

---

## Development Workflow

### 1. Fork & Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/pathpilot-ai.git
cd pathpilot-ai
npm install
```

### 2. Configure Local Environment
Copy `.env.example` to `.env` and fill in your developer credentials:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
The app will run at `http://localhost:3000`.

---

## Branch & Commit Conventions

### Branch Naming Pattern
- `feature/short-description` — New feature or UI module
- `fix/issue-description` — Bug fix
- `docs/topic-name` — Documentation improvements
- `refactor/module-name` — Code restructuring or performance optimization

### Conventional Commit Standards
We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add STAR behavioral interview rating system`
- `fix: resolve race condition in resume parser file upload`
- `docs: update API documentation for agent execution endpoint`
- `style: harmonize dark theme CSS variables in settings modal`
- `refactor: extract custom useProfile hook into dedicated module`

---

## Coding Standards & Guidelines

### TypeScript & React
- Strict TypeScript (`"strict": true` in `tsconfig.json`). Avoid using `any`; define explicit interfaces in `/src/types/`.
- Functional components with typed props.
- Prefer named exports for components and utility functions.
- Import Lucide icons strictly from `lucide-react`.

### Styling (Tailwind CSS)
- Use CSS variable aliases defined in `src/index.css` (e.g., `bg-[var(--surface)]`, `text-text-main`).
- Ensure full dark and light mode theme support across all new components.
- Ensure minimum touch target sizes of 44px on mobile viewport widths.

---

## Pull Request Submission Checklist

Before submitting a Pull Request, please ensure:

1. **Linter Passes Cleanly:**
   ```bash
   npm run lint
   ```
2. **Production Build Compiles Successfully:**
   ```bash
   npm run build
   ```
3. **No Secret Keys Committed:** Verify that no `.env` files or API keys are present in your commit diff.
4. **Detailed PR Description:** Fill out the PR template explaining the background, changes made, and testing verification steps.
