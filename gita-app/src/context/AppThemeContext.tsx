import { useAppTheme } from "@/hooks/use-app-theme";
import React, { createContext, useContext } from "react";

type AppThemeValue = ReturnType<typeof useAppTheme>;

const AppThemeContext = createContext<AppThemeValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useAppTheme();
  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppThemeContext(): AppThemeValue {
  const value = useContext(AppThemeContext);
  if (!value) {
    throw new Error("useAppThemeContext must be used within AppThemeProvider");
  }
  return value;
}
