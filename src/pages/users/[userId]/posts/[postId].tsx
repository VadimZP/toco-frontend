import { GetServerSideProps } from "next";
import { getCookie } from "cookies-next";

import { Comment, Post } from "@/shared/types";
import PostComponent from "@/components/Post";

export default function UserPost({
  post,
  comments,
}: {
  post: Post;
  comments: Comment[];
}) {
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

  return (
    <PostComponent
      post={post}
      comments={comments}
      addOrRemoveLike={addOrRemoveLike}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params = {},
}) => {
  const cidCookie = getCookie("connect.sid", { req, res });

  if (!cidCookie) {
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
