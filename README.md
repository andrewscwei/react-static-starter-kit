# React Static Starter Kit [![CI](https://github.com/andrewscwei/react-static-starter-kit/workflows/CI/badge.svg)](https://github.com/andrewscwei/react-static-starter-kit/actions?query=workflow%3ACI) [![CD](https://github.com/andrewscwei/react-static-starter-kit/workflows/CD/badge.svg)](https://github.com/andrewscwei/react-static-starter-kit/actions?query=workflow%3ACD)

This is an experimental starter kit for a React static app.

## Features

1. [React Router](https://reacttraining.com/react-router/)
2. [CSS Modules](https://github.com/css-modules/css-modules) + [PostCSS](https://postcss.org/) + [PurgeCSS](https://purgecss.com/) + [StyleLint](https://stylelint.io/)
3. [TypeScript](https://www.typescriptlang.org/) + [ESLint](https://eslint.org/)
4. [Vite](https://vitejs.dev/)
5. [Vitest](https://vitest.dev/)/[React Testing Library](https://testing-library.com/docs/react-testing-library/) for unit testing
6. [Playwright](https://playwright.dev/) for E2E testing
7. Custom i18n solution using [`sprintf-js`](https://www.npmjs.com/package/sprintf-js)
8. Web workers
9. CI/CD workflows with [GitHub Actions](https://github.com/features/actions)

## Usage

```sh
# Install pre-commit
$ brew install pre-commit # or pip install pre-commit

# Install Playwright browsers
$ npx playwright install

# Install dependencies
$ npm install

# Run in dev
$ npm run dev

# Run E2E tests
$ npm test

# Run unit tests
$ npm test:unit

# Build for prod
$ npm run build

# Builds the app but skips all HTML/CSS/JS compressions
$ npm run build --raw
```

See `scripts` in `package.json` for additional commands.

## Using as Repository Template

When using `react-static-starter-kit` as a template, follow these steps to strip placeholder content:

1. Replace `LICENSE` file
2. Edit `README.md`
3. Edit fields in `package.json`
4. Edit fields in `app.config.ts`
5. Edit resources in `res/`, then ensure to replace the generated assets in `src/public/`
6. Edit files in `src/ui/`
7. Edit translations in `src/locales/`
