import { rest } from 'msw';

export const handlers = [
    rest.post("http://localhost:3001/login", (req, res, ctx) => {
        // Persist user's authentication in the session
        sessionStorage.setItem('is-authenticated', 'true')
        return res(
            ctx.status(200),
        )
    }),
    rest.post("http://localhost:3001/posts", (req, res, ctx) => {
        return res(
            ctx.status(201),
            ctx.json({
                content: "Test content",
                created_at: "2023-05-15T19:38:09.376Z",
                post_id: 999,
                title: "Test title",
            })
        )
    })
]