export interface Post {
    post_id: number;
    content: string;
    created_at: string;
    title: string;
    author_id: number;
    likes: string;
    comments: string;
}

export interface Comment {
    comment_id: number;
    content: string;
    name: string;
    created_at: string;
}