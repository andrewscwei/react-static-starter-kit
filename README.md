# React Static Starter Kit [![CI](https://github.com/andrewscwei/react-static-starter-kit/workflows/CI/badge.svg)](https://github.com/andrewscwei/react-static-starter-kit/actions?query=workflow%3ACI) [![Netlify Status](https://img.shields.io/netlify/8fc40796-fac4-41bb-8e59-8d1ee7338966)](https://app.netlify.com/sites/react-static-starter-kit/deploys)

This is an **experimental** starter kit for a React static app.

## Features

1. HMR (in development)
2. [TypeScript](https://www.typescriptlang.org/)
3. [React Router](https://reacttraining.com/react-router/)
4. i18n support via Context API
5. CSS Modules + [PostCSS](https://postcss.org/)
6. [Jest](https://jestjs.io/)
7. [ESLint](https://eslint.org/)
8. [StyleLint](https://stylelint.io/)

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

# Measures the speed of the build pipeline and outputs a report to console
$ npm run build --speed
```

See `scripts` in `package.json` for additional commands.

## Repository Template

When creating a new repository using `react-static-starter-kit` as a template, follow the steps below to remove the original branding:

1. In `/package.json`, edit the fields: `name`, `version`, `description`, `private` and `license`
2. Remove `/LICENSE` file
3. Remove `RELEASE.md` file
4. Edit `/README.md` to suit your project
5. In `/resources/`, edit the app icon and favicon regenerate the sources
  1. In `/src/static/`, replace the app icon and favicon sources
  2. Update `/src/static/manifest.json`
6. In `/src/app.conf.ts`, edit `meta.title` and `locales` fields
  1. Edit translation files in `/config/locales/` to reflect locale changes
  2. Edit `/src/routes.conf.ts` to reflect locale changes
7. In `/src/components/Footer.tsx`, remove reference to this repository's URL

In terms of configuration and metadata, those were it. The remaining changes are in the individual pages in `/src/containers/` and the assets, components and state containers that they use.
