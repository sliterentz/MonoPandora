// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { ThemeColor } from '../../lib/types/layouts'

export type CardStatsVerticalProps = {
  title: string
  stats: string
  icon: ReactNode
  subtitle: string
  color?: ThemeColor
  trendNumber: string
  trend?: 'positive' | 'negative'
}
