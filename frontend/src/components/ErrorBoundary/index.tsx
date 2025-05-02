import React, {Component, ErrorInfo, ReactNode} from "react";
import {Button} from "@/components/ui/button.tsx";
import {AlertTriangle} from "lucide-react";

interface ErrorBoundaryProps {
    children?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDeriveStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({
            error,
            errorInfo
        });

        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });

        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                    <div className="max-w-md w-full p-6 bg-card rounded-xl shadow-lg border text-center">
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-destructive/10 p-3">
                                <AlertTriangle className="h-10 w-10 text-destructive"/>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold mb-2">Oops, something went wrong</h1>
                        <p className="text-muted-foreground mb-6">
                            We've encountered an unexpected error. Please try refreshing the page or returning to the
                            homepage.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={() => window.location.reload()} variant="outline">
                                Refresh Page
                            </Button>
                            <Button onClick={this.handleReset}>
                                Go to Homepage
                            </Button>
                        </div>

                        {import.meta.env.DEV === 'development' && this.state.error && (
                            <div className="mt-6 p-4 bg-muted rounded-md text-left overflow-auto max-h-60">
                                <p className="font-mono text-sm mb-2">{this.state.error.toString()}</p>
                                {this.state.errorInfo && (
                                    <pre className="font-mono text-xs text-muted-foreground">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        return this.props.children;
    }
}

export default ErrorBoundary;