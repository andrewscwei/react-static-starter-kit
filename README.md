# React Static Starter Kit [![CI](https://github.com/andrewscwei/react-static-starter-kit/workflows/CI/badge.svg)](https://github.com/andrewscwei/react-static-starter-kit/actions?query=workflow%3ACI) [![CD](https://github.com/andrewscwei/react-static-starter-kit/workflows/CD/badge.svg)](https://github.com/andrewscwei/react-static-starter-kit/actions?query=workflow%3ACD)

This is an experimental starter kit for a React static app.

## Features

1. [React Router](https://reacttraining.com/react-router/)
2. [CSS Modules](https://github.com/css-modules/css-modules) + [PostCSS](https://postcss.org/) + [PurgeCSS](https://purgecss.com/) + [StyleLint](https://stylelint.io/)
3. [TypeScript](https://www.typescriptlang.org/) + [Babel](https://babeljs.io/) + [ESLint](https://eslint.org/)
4. [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/)
5. [webpack](https://webpack.js.org/)
6. Custom i18n solution using [`sprintf-js`](https://www.npmjs.com/package/sprintf-js)
7. Cached fetch responses
8. Web workers
9. CI/CD workflows with [GitHub Actions](https://github.com/features/actions)

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

# Builds the app but skips all HTML/CSS/JS compressions
$ npm run build --raw
```

See `scripts` in `package.json` for additional commands.

## Prerendering

To prerender this app, you can use [`react-snap`](https://www.npmjs.com/package/react-snap):

1. Install `react-snap`:
    ```sh
    $ npm install react-snap --save-dev
    ```
2. Add a `postbuild` script to `package.json`:
    ```json
    // package.json
    {
      ...
      "scripts": {
        ...
        "postbuild": "react-snap",
        ...
      }
      ...
    }
    ```
3. Add the following to `package.json`, note that you must include the root route of every locale for `react-snap` to prerender its subroutes since they're dynamically generated:
    ```json
    // package.json
    {
      ...
      "reactSnap": {
        "source": "build",
        "include": [
          "/404.html",
          "/ja",
          ... // Include the root route of all locales
        ],
        "puppeteerArgs": [
          "--no-sandbox",
          "--disable-setuid-sandbox"
        ],
        "skipThirdPartyRequests": true
      }
      ...
    }
    ```
4. Ensure that Puppeteer is installed when running CI/CD workflows:
    ```yml
    # .github/workflows/job-build.yml
    ...
    jobs:
      default:
        ...
        steps:
          - name: Install APT dependencies for Puppeteer
            run: apt-get update && apt-get install -yq gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
            ...
        ...
      ...
    ...
    ```

## Using as Repository Template

When using `react-static-starter-kit` as a template, follow these steps to strip placeholder content:

1. Replace `LICENSE` file
2. Edit `README.md`
3. Edit fields in `package.json`
4. Edit fields in `config/build.args.ts`
5. Edit resources in `res/`, then ensure to replace the generated assets in the following places:
    1. `src/ui/assets/`
    2. `src/static/`
6. Edit files in `src/ui/components/` and `src/ui/pages/`
7. Edit translations in `src/locales/`

## Breaking Changes

### `v10.0.0`

- Removed styled-components in favor of CSS modules
- Removed Redux in favor of Context API
- Removed `react-snap`
- Updated how assets are imported
- Relocated `locales` directory
- Created reusable workflows for CI/CD
- Added `http-server` for `start` command
- Added interactors
- Added `I18nProvider`

### `v12.0.0`

- Decoupled boilerplate architectural code to `src/base`

### `v13.0.0`

- Restructured folders

### `v14.0.0`

- Moved boilerplate code to `lib/`
- Replaced `react-helmet-async` with custom solution in `lib/`
