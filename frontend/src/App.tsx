import React from 'react'
import AppRouter from "@/routes";
import {ThemeProvider} from "@/context/ThemeContext";
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <ThemeProvider>
        <AppRouter/>
        <Toaster richColors/>
    </ThemeProvider>
  )
}

export default App