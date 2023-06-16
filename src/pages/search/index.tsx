import { GetServerSideProps } from "next";
import { getCookie } from "cookies-next";

export default function SearchPage() { 
    return (<h1>Search page</h1>)
}


export const getServerSideProps: GetServerSideProps = async ({
    req,
    res,
    query,
  }) => {
    const userCookie = getCookie("userId", { req, res });
  
    if (!userCookie) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const { text } = query;
  
    const headers = req.headers.cookie
      ? { cookie: req.headers.cookie }
      : undefined;
  
    const data = await fetch(`http://localhost:3001/search?text=${text}`, {
      headers,
    });
  
    if (data.status === 401) {
      res.setHeader("Set-Cookie", "userId=; Max-Age=0");
  
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

