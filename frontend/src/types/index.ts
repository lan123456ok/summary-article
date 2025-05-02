export interface User {
    id: string;
    name: string;
    email: string;
}

export type ThemeMode = 'light' | 'dark';

export type NewsCardProps = {
    title: string;
    link_url: string;
    location: string;
    datetime: string;
    image_url: string;
    category: string;
    summary: string;
    className?: string;
}

export type HealthStatus = {
    status: string;
}

export type ArticleData = {
    _id: string;
    title: string;
    link_url: string;
    location: string | null;
    datetime: string | null;
    summary: string | null;
    image_url: string;
    category: string;
    content: string;
    created_at: string;
    updated_at: string;
};

export type ArticleResponse = {
    items: ArticleData[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export type ArticleParams = {
    category?: string;
    page?: number;
    size?: number;
    q?: string
}