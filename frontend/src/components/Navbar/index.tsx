import React from "react";
import {Link, useLocation} from "react-router-dom";
import {Sun, Moon} from "lucide-react";
import Logo from "@/components/Logo";
import {useTheme} from "@/context/ThemeContext";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink
} from '@/components/ui/navigation-menu';
import {cn} from "@/lib/utils.ts";

const Navbar: React.FC = () => {
    const location = useLocation();
    const {theme, toggleTheme} = useTheme();

    const menuItems = [
        {href: '/', label: 'Trang chủ'},
        {href: '/about', label: 'Giới thiệu'},
    ];

    return (
        <nav className="border-b bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Logo size="md"/>
                    </div>

                    <div className="flex items-center gap-4">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {menuItems.map((item) => (
                                    <NavigationMenuItem key={item.href}>
                                        <NavigationMenuLink
                                            href={item.href}
                                            className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4",
                                                location.pathname === item.href && "bg-accent/50 text-accent-foreground")}>
                                            {item.label}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar