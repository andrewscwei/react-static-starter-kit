/**
 * @file Utility functions for DOM-related operations.
 */

import React, { ComponentType } from 'react'
import { hydrate, render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, BrowserRouterProps, Route, RouteComponentProps } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import store from '../store'
import * as theme from '../styles/theme'

/**
 * Factory function for generating base React app markup.
 *
 * @param Component - The React component to wrap around.
 * @param options - @see BrowserRouterProps
 *
 * @returns The JSX markup.
 */
export function markup(Component: ComponentType<{ route: RouteComponentProps }>, options: BrowserRouterProps = {}): JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter {...options}>
          <Route render={route => (
            <Component route={route}/>
          )}/>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

/**
 * Mounts a React component to a DOM element.
 *
 * @param Component - The React component to mount.
 * @param elementId - The ID of the DOM element to mount the React component to.
 */
export function mount(Component: ComponentType<{ route: RouteComponentProps }>, elementId = 'app') {
  if (process.env.NODE_ENV === 'development') {
    render(markup(Component), document.getElementById(elementId))
  }
  else {
    hydrate(markup(Component), document.getElementById(elementId))
  }
}
