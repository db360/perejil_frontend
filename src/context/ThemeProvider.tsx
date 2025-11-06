import { useEffect, useState } from "react"
import { ThemeContext } from "./theme";

export function ThemeProvider({children}: {children: React.ReactNode}) {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if(savedTheme) {
            return savedTheme === "dark";
        }
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        if(isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark]);

   
    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(prev => !prev) }}>
            {children}
        </ThemeContext.Provider>
    )
}