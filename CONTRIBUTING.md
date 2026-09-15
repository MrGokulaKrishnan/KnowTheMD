# Contributing to KnowTheMD

We welcome contributions from the community to make KnowTheMD the cleanest, fastest Markdown experience available.

## Development Workflow

1. **Clone and Install**:
   ```bash
   git clone https://github.com/knowthemd/knowthemd.git
   cd knowthemd
   npm install
   ```

2. **Branching Model**:
   - `main`: Stable production releases.
   - `develop`: Ongoing integration branch.
   - Create feature branches named `feature/<short-name>` or `fix/<short-name>`.

3. **Running Quality Checks**:
   Before submitting a PR, ensure all checks pass:
   ```bash
   npm run typecheck
   npm run lint
   npm test
   ```

4. **Coding Guidelines**:
   - Write clean, modular TypeScript with strict type checking.
   - Adhere to the Liquid Glass Design System (`@knowthemd/ui`).
   - Include unit or integration tests for every new feature or bug fix.
   - Never disable security sanitization checks.
