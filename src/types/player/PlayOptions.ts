export interface PlayOptions {
    search: string;
    uploadDate?: 'hour' | 'today' | 'week' | 'month' | 'year';
    duration?: 'short' | 'long';
    sortBy?: 'relevance' | 'date' | 'view count' | 'rating';
    requestedBy?: string;
    index?: number;
    localAddress?: string;
}
