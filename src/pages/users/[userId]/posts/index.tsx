import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { Post } from "@/shared/types";
import { getCookie } from "cookies-next";
import PostComponent from "@/components/Post";

export default function AllUserPosts({ posts }: { posts: Post[] }) {
  const router = useRouter();

  const goToPostPage = (userId: number, postId: number) => {
    router.push(`http://localhost:3000/users/${userId}/posts/${postId}`);
  };

  return (
    <>
      {posts.map((item: Post) => (
        <PostComponent key={item.post_id} post={item} goToPostPage={goToPostPage} />
      ))}
    </>
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

  const { userId } = params;

  const headers = req.headers.cookie
    ? { cookie: req.headers.cookie }
    : undefined;

  const data = await fetch(`http://localhost:3001/users/${userId}/posts`, {
    headers,
  });

  if (data.status === 401) {
    res.setHeader("Set-Cookie", "connect.sid=; Max-Age=0");

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const posts = await data.json();

  return { props: { posts } };
};
