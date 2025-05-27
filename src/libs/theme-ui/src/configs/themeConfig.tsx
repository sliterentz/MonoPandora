// ** MUI Imports
import { PaletteMode } from '@mui/material'

// ** Types
import { ContentWidth } from '../lib/types/layouts'

import { ThemeLayoutValue } from '../lib/types/layouts'

type ThemeConfig = {
  mode: PaletteMode
  templateName: string
  themeLayout: ThemeLayoutValue
  routingLoader: boolean
  disableRipple: boolean
  navigationSize: number
  menuTextTruncate: boolean
  contentWidth: ContentWidth
  responsiveFontSizes: boolean
}

const themeConfig: ThemeConfig = {
  // ** Layout Configs
  templateName: 'Monopando' /* App Name */,
  mode: 'dark' /* light | dark */,
  themeLayout: 'vertical'  /* vertical | horizontal | mini */,
  contentWidth: 'full' /* full | boxed */,

  // ** Routing Configs
  routingLoader: true /* true | false */,

  // ** Navigation (Menu) Configs
  menuTextTruncate: true /* true | false */,
  navigationSize: 260 /* Number in PX(Pixels) /*! Note: This is for Vertical navigation menu only */,

  // ** Other Configs
  responsiveFontSizes: true /* true | false */,
  disableRipple: false /* true | false */
}

export default themeConfig
