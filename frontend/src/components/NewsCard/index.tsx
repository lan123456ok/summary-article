import React, {useState} from 'react';
import {MapPin, Calendar, ExternalLink, Sparkles} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {Button} from "@/components/ui/button.tsx";
import {NewsCardProps} from "@/types";

const NewsCard: React.FC<NewsCardProps> = ({
                                               title,
                                               link_url,
                                               location,
                                               datetime,
                                               image_url,
                                               category,
                                               summary,
                                               className
                                           }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    }

    const handleImageLoad = () => {
        setImageLoaded(true);
    }

    const handleImageError = () => {
        setImageError(true);
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }

            const timeString = date.toLocaleTimeString('vi-VN', {
                hour: 'numeric',
                minute: 'numeric'
            });

            const dateStringWithoutTime = date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            return `${timeString}, ${dateStringWithoutTime}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    const getCategoryColor = (category: string) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500',
            'bg-cyan-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-teal-500',
            'bg-pink-500', 'bg-orange-500', 'bg-lime-500', 'bg-emerald-500', 'bg-violet-500',
        ];

        if (!category || category.length === 0) {
            return 'bg-gray-500';
        }

        let hash = 0;
        for (let i = 0; i < category.length; i++) {
            hash = category.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <Card
            className={cn(
                "overflow-hidden h-full flex flex-col hover:shadow-lg py-0 gap-2 transition-all duration-300 hover:-translate-y-1",
                className)
            }>
            <div className="relative overflow-hidden h-40">
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 bg-muted/50 animate-pulse flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-muted-foreground/30"/>
                    </div>
                )}

                <img
                    alt={title}
                    src={imageError ? '/placeholder-image.png' : image_url}
                    className={cn("w-full h-full object-cover transition-transform duration-300 hover:scale-105",
                        !imageLoaded && !imageError && "opacity-0",
                        imageLoaded && "opacity-100")}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                />
                <div
                    className={cn(
                        "absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg font-medium text-sm",
                        getCategoryColor(category)
                    )}
                >
                    {category ? category : 'Không có'}
                </div>
            </div>

            <CardHeader className="p-3 pb-0 space-y-1">
                <CardTitle className="text-base line-clamp-2">
                    <a
                        href={link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors duration-200 hover:underline"
                    >
                        {title}
                    </a>
                </CardTitle>

                <CardDescription className="flex flex-wrap items-center text-xs gap-3 mt-1">
                    <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-primary/70"/>
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-primary/70"/>
                        <span>{formatDate(datetime)}</span>
                    </div>
                </CardDescription>
            </CardHeader>

            <CardContent className="px-3 pt-2 flex-grow">
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 h-full flex flex-col">
                    <div className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-1 text-primary"/>
                        <h4 className="font-medium text-md text-primary">AI Summary</h4>
                    </div>

                    <div className="flex-grow">
                        <p className={cn(
                            "text-muted-foreground text-sm transition-all duration-300",
                            isExpanded ? "" : "line-clamp-3"
                        )}>
                            {summary || 'Chưa cập nhật bản tóm tắt'}
                        </p>

                        {summary && summary.length > 100 && (
                            <Button
                                variant="link"
                                size="sm"
                                onClick={toggleExpand}
                                className="p-0 h-auto text-primary hover:text-primary/80 text-sm font-medium"
                                aria-label={isExpanded ? "Rút gọn" : "Xem thêm"}
                            >
                                {isExpanded ? "Rút gọn" : "Xem thêm"}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-3 pt-0 mt-auto">
                <a
                    href={link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-xs"
                >
                    Đọc thêm <ExternalLink className="h-3 w-3 ml-1"/>
                </a>
            </CardFooter>
        </Card>
    )
}

export default NewsCard