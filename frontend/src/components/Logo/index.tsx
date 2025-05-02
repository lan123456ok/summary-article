import React from 'react';
import {Link} from 'react-router-dom';
import {Newspaper, FileSpreadsheet} from 'lucide-react';
import {cn} from '@/lib/utils';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Logo: React.FC<LogoProps> = ({size = 'md' , className}) => {
    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
    };

    const iconSize = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    return (
        <Link
            to="/"
            className={cn(
                `font-bold ${sizeClasses[size]} text-primary flex items-center`,
                className)}
        >
            <div className="relative mr-2">
                <Newspaper size={iconSize[size]} className="text-primary"/>
                <FileSpreadsheet size={iconSize[size] * 0.7}
                                 className="text-primary absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4"
                />
            </div>
            <span className="text-xl font-semibold text-primary">NewSummarize</span>
        </Link>
    )
}

export default Logo