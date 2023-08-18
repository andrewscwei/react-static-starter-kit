/**
 * @file Client app root.
 */

import React, { StrictMode } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useFavicon, useThemeColor } from '../../lib/dom'
import { joinURL } from '../../lib/utils'
import { BASE_PATH, MASK_ICON_COLOR, PUBLIC_PATH, THEME_COLOR } from '../app.conf'
import routesConf from '../routes.conf'
import './styles/global.css'
import './styles/theme.css'

export default function App() {
  useThemeColor(THEME_COLOR)

  useFavicon({
    maskIcon: {
      color: MASK_ICON_COLOR,
    },
    icon: {
      darkImage: joinURL(PUBLIC_PATH, 'favicon-dark.svg'),
    },
    alternateIcon: {
      darkImage: joinURL(PUBLIC_PATH, 'favicon-dark.png'),
    },
  })

  return (
    <StrictMode>
      <RouterProvider router={createBrowserRouter(routesConf, { basename: BASE_PATH })}/>
    </StrictMode>
  )
}
