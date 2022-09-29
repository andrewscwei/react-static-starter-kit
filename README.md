# React Static Starter Kit [![CI](https://github.com/andrewscwei/react-static-starter-kit/workflows/CI/badge.svg)](https://github.com/andrewscwei/react-static-starter-kit/actions?query=workflow%3ACI) [![CD](https://github.com/andrewscwei/react-static-starter-kit/workflows/CD/badge.svg)](https://github.com/andrewscwei/react-static-starter-kit/actions?query=workflow%3ACD) [![Netlify Status](https://img.shields.io/netlify/8fc40796-fac4-41bb-8e59-8d1ee7338966)](https://app.netlify.com/sites/react-static-starter-kit/deploys)

This is an experimental starter kit for a React static app.

## Features

1. [React Router](https://reacttraining.com/react-router/)
2. [Polyglot](https://airbnb.io/polyglot.js/)
3. [CSS Modules](https://github.com/css-modules/css-modules) + [PostCSS](https://postcss.org/)
4. HMR (in development)
5. [TypeScript](https://www.typescriptlang.org/) + [Babel](https://babeljs.io/)
6. [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/)
7. [ESLint](https://eslint.org/) + [StyleLint](https://stylelint.io/)
8. [webpack](https://webpack.js.org/)
9. CI/CD via [GitHub Actions](https://github.com/features/actions)
10. Favicon/OG image/Twitter card resources for [Affinity Designer](https://affinity.serif.com/en-us/designer/)

## Usage

```sh
# Install dependencies
$ npm install

# Run in dev
$ npm run dev

# Run tests
$ npm test

# Run tests in specific dir relative to src
$ npm test --files=dir

# Build for prod
$ npm run build

# Analyzes the size the generated bundle(s) and displays a visual report in the default browser
$ npm run build --analyze

# Builds the app but skips all HTML/CSS/JS minifications
$ npm run build --raw
```

See `scripts` in `package.json` for additional commands.

## Repository Template

When using `react-static-starter-kit` as a template, follow these steps to debrand:

1. In `/package.json`, edit the fields: `name`, `version`, `description`, `private` and `license`
2. Remove `/LICENSE` file
3. Remove `RELEASE.md` file
4. Edit `/README.md` to suit your project
5. In `/resources/`, edit the app icon and favicon regenerate the sources
  1. In `/src/static/`, replace the app icon and favicon sources
  2. Update `/src/static/manifest.json`
6. In `/config/app.conf.ts`, edit `meta.title`
7. Edit translation files in `/src/locales/` to reflect locale changes
8. In `/src/components/Footer.tsx`, remove reference to this repository's URL
