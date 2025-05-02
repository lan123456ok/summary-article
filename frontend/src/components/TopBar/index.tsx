import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext.tsx";

const TopBar: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return(
        <div className="bg-primary/5 border-b">
            <div className="container mx-auto mx-4 sm:px-6 lg:px-8">
                <div className="flex h-10 items-center justify-between">
                    <button
                        className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}
                    </button>
                </div>
            </div>
        </div>
    )
};

export default TopBar