import React, {ReactNode, useState, useEffect} from 'react';
import Navbar from "@/components/Navbar";

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100)

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>

            <main className={`flex-grow  ${isLoaded ?  'animate-fade-up' : 'opacity-0'}`}>
                {children}
            </main>

            <footer className="py-6 border-t">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    &copy; {new Date().getFullYear()} News Summarizer. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

export default MainLayout