import { GetServerSideProps } from "next";
import { getCookie } from "cookies-next";

import { Comment, Post } from "@/shared/types";
import PostComponent from "@/components/Post/Post";

export default function UserPost({
  post,
  comments,
}: {
  post: Post;
  comments: Comment[];
}) {
  const userId = getCookie("userId");

  async function addOrRemoveLike(userId: number, postId: number) {
    try {
      const data = await fetch(
        `http://localhost:3001/users/${userId}/posts/${postId}/likes`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            postId,
          }),
        }
      );
      const response = await data.json();
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
    }
  }

  async function commentPost(
    userId: number,
    postId: number,
    parentId?: number
  ) {
    try {
      const data = await fetch(
        `http://localhost:3001/users/${userId}/posts/${postId}/comments`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            postId,
            ...(parentId && { parentId }),
          }),
        }
      );
      const response = await data.json();
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
    }
  }

  return (
    <PostComponent
      post={post}
      userId={+userId}
      comments={comments}
      commentTree={comments.reduce((acc, comment) => {
        const parentCommentId = comment.parent_id || 0; // use 0 as root node
        acc[parentCommentId] = acc[parentCommentId] || [];
        acc[parentCommentId].push(comment);
        return acc;
      }, {})}
      addOrRemoveLike={addOrRemoveLike}
      commentPost={commentPost}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params = {},
}) => {
  const userCookie = getCookie("userId", { req, res });
  // const cidCookie = getCookie("connect.sid", { req, res });

  if (!userCookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { userId, postId } = params;

  const headers = req.headers.cookie
    ? { cookie: req.headers.cookie }
    : undefined;

  const data = await fetch(
    `http://localhost:3001/users/${userId}/posts/${postId}`,
    {
      headers,
    }
  );

  if (data.status === 401) {
    res.setHeader("Set-Cookie", "connect.sid=; Max-Age=0");

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { post, comments } = await data.json();

  return { props: { post, comments } };
};
