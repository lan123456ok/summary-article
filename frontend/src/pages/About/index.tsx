import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-bold mb-6">About Us</h1>
            <div className="max-w-3xl">
                <p className="text-lg text-muted-foreground mb-4">
                    We are a dedicated team working to provide the best solutions for our customers.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                    Our mission is to create high-quality, user-friendly applications that meet the needs of our
                    clients.
                </p>

                <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xl font-bold text-primary">JD</span>
                        </div>
                        <div>
                            <h3 className="font-medium">John Doe</h3>
                            <p className="text-sm text-muted-foreground">CEO & Founder</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xl font-bold text-primary">JS</span>
                        </div>
                        <div>
                            <h3 className="font-medium">Jane Smith</h3>
                            <p className="text-sm text-muted-foreground">CTO</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutPage;