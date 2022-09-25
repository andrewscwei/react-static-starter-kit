/**
 * @file Utility functions for DOM-related operations.
 */

import React, { ComponentType } from 'react'
import { hydrate, render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { I18nProvider } from '../modules/i18n'
import createStore from '../store'
import globalStyle from '../styles/global'
import * as theme from '../styles/theme'

const getTranslations = () => {
  // In development, use require context for all locale translation files so they can be watched by
  // Webpack.
  if (process.env.NODE_ENV === 'development') {
    const req = require.context('../../config/locales', true, /^.*\.json$/)
    return req.keys().reduce((prev, curr) => ({
      ...prev,
      [curr.replace('./', '').replace('.json', '')]: req(curr),
    }), {})
  }
  else {
    return __APP_CONFIG__.translations
  }
}

/**
 * Factory function for generating base React app markup.
 *
 * @param Component - The React component to wrap around.
 * @param options - @see BrowserRouterProps
 *
 * @returns The JSX markup.
 */
export function markup(Component: ComponentType, options: BrowserRouterProps = {}) {
  const GlobalStyle = createGlobalStyle`
    ${globalStyle}
  `

  return (
    <>
      <GlobalStyle/>
      <Provider store={createStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter {...options}>
            <I18nProvider defaultLocale='en' translations={getTranslations()}>
              <Component/>
            </I18nProvider>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </>
  )
}

/**
 * Mounts a React component to a DOM element.
 *
 * @param Component - The React component to mount.
 * @param elementId - The ID of the DOM element to mount the React component to.
 */
export function mount(Component: ComponentType, elementId = 'app') {
  if (process.env.NODE_ENV === 'development') {
    render(markup(Component), document.getElementById(elementId))
  }
  else {
    hydrate(markup(Component), document.getElementById(elementId))
  }
}
