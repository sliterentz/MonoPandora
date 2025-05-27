// ** React Imports
import { createContext, useContext, useState, ReactNode } from 'react'

// ** MUI Imports
import { PaletteMode } from '@mui/material'

// ** ThemeConfig Import
import themeConfig from '../configs/themeConfig'

// ** Types Import
import { ThemeColor,ThemeLayoutValue, ContentWidth } from '../lib/types/layouts'

export type Settings = {
  mode: PaletteMode
  themeColor: ThemeColor
  themeLayout: ThemeLayoutValue
  contentWidth: ContentWidth
}

export type SettingsContextValue = {
  settings: Settings
  saveSettings: (updatedSettings: Settings) => void
}

const initialSettings: Settings = {
  themeColor: 'primary',
  mode: themeConfig.mode,
  themeLayout: themeConfig.themeLayout,
  contentWidth: themeConfig.contentWidth
}

// ** Create Context
export const SettingsContext = createContext<SettingsContextValue>({
  saveSettings: () => null,
  settings: initialSettings
})

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context) throw new Error('useSettingsContext must be use inside SettingsProvider');

  return context;
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  // ** State
  const [settings, setSettings] = useState<Settings>({ ...initialSettings })

  const saveSettings = (updatedSettings: Settings) => {
    setSettings(updatedSettings)
  }

  return <SettingsContext.Provider value={{ settings, saveSettings }}>{children}</SettingsContext.Provider>
}

export const SettingsConsumer = SettingsContext.Consumer
