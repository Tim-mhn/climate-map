import { theme as chakraTheme } from '@chakra-ui/core'

const fonts = { ...chakraTheme.fonts, mono: `'Menlo', monospace` }

const breakpoints = ['40em', '52em', '64em']

const theme = {
  ...chakraTheme,
  noDataFillColour: "rgba(230, 230, 220, 0.3)",
  oceanFillColour: "blue",
}

export default theme
