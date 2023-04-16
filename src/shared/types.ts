export interface Post {
    post_id: number;
    content: string;
    created_at: string;
    comments: (string | null)[];
    title: string;
    author_id: number;
    likes: string;
}