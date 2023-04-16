import {
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { Post } from "@/shared/types";
import PostComponent from "@/components/Post";
import { useRouter } from "next/router";

export default function Home({ posts }: { posts: Post[] }) {
  const [postsList, setPostsList] = useState(posts);
  const [isPostsListLoading, setIsPostsListLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);

  const [postTitle, setPostTitle] = useState("");
  const onPostTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setPostTitle(inputValue);
  };

  const [postContent, setPostContent] = useState("");
  const onPostContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setPostContent(inputValue);
  };

  async function createPost() {
    setIsPostsListLoading(true);
    try {
      const data = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: postContent,
          created_at: new Date(),
          title: postTitle,
        }),
      });
      const response = await data.json();
      setPostsList((prevState) => [response, ...prevState]);
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
      setIsPostsListLoading(false);
    }
  }
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
            postId
          }),
        }
      );
      const response = await data.json();
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
    }
  }

  const router = useRouter();

  const goToPostPage = (userId: number, postId: number) => {
    router.push(`http://localhost:3000/users/${userId}/posts/${postId}`);
  };

  return (
    <>
      <Stack direction="row" spacing={4} align="center">
        <Button
          isLoading={isPostsListLoading}
          loadingText="Loading"
          colorScheme="teal"
          variant="outline"
          spinnerPlacement="start"
          onClick={onOpen}
        >
          Write a post
        </Button>
      </Stack>
      <>
        <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  onChange={onPostTitleChange}
                  ref={initialRef}
                  placeholder="First name"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Content</FormLabel>
                <Textarea
                  onChange={onPostContentChange}
                  placeholder="Last name"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button onClick={createPost} colorScheme="blue" mr={3}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
      {postsList.map((item: Post) => (
        <PostComponent
          key={item.post_id}
          post={item}
          goToPostPage={goToPostPage}
          addOrRemoveLike={addOrRemoveLike}
        />
      ))}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cidCookie = getCookie("connect.sid", { req, res });

  if (!cidCookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const headers = req.headers.cookie
    ? { cookie: req.headers.cookie }
    : undefined;

  const data = await fetch("http://localhost:3001/posts", {
    headers,
  });

  if (data.status === 401) {
    res.setHeader("Set-Cookie", "connect.sid=; Max-Age=0");

    return {
      redirect: {
        destination: "/login/",
        permanent: false,
      },
    };
  }

  const posts = await data.json();

  return { props: { posts } };
};
