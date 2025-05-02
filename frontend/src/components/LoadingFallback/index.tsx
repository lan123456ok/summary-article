import React from "react";
import {Loader2} from "lucide-react";

const LoadingFallback: React.FC = () => {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-[300px]">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 text-primary animate-spin"/>
                <p className="text-meted-foreground">Đang tải...</p>
            </div>
        </div>
    );
};

export default LoadingFallback;