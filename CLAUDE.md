# Asset Label Generator - Development Guidelines

## Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs typechecking first)
- `pnpm lint` - Run linting checks
- `pnpm format` - Format code
- `pnpm preview` - Preview production build

## Code Style
- **Formatting**: Biome formatter (2-space indent, 80 char width)
- **Quotes**: Single quotes for JS/TS strings, double quotes for JSX
- **Types**: Use strict TypeScript typing, avoid `any`
- **Components**: Use functional React components with hooks
- **State**: Atomic state management with Jotai
- **Errors**: Handle errors gracefully, provide user feedback
- **Naming**:
  - Components: PascalCase
  - Functions/variables: camelCase
  - Constants: UPPER_SNAKE_CASE when truly constant
- **Imports**: Automatically organized by Biome
- **Structure**: Keep related code in appropriate packlets