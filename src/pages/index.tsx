import {
  Button,
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
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { Post } from "@/shared/types";
import PostComponent from "@/components/Post/Post";
import { useRouter } from "next/router";

export default function Home({ posts }: { posts: Post[] }) {
  const userId = getCookie("userId");

  const [postsList, setPostsList] = useState(posts);
  const [isPostsListLoading, setIsPostsListLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);

  const [postCreationData, setPostCreationData] = useState({
    title: "",
    content: "",
  });

  const onPostTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostCreationData({ ...postCreationData, title: event.target.value });
  };

  const onPostContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostCreationData({ ...postCreationData, content: event.target.value });
  };

  const [isPostCreationDataValid, setIsPostCreationDataValid] = useState<{
    [key: string]: string;
  }>({
    postTitleErrorMessage: "",
    postContentErrorMessage: "",
  });

  const handlePostTitleBlur = () => {
    if (!postCreationData.title.length) {
      setIsPostCreationDataValid({
        ...isPostCreationDataValid,
        postTitleErrorMessage: "Title field is required",
      });
      return;
    }
    setIsPostCreationDataValid({
      ...isPostCreationDataValid,
      postTitleErrorMessage: "",
    });
  };

  const handlePostContentBlur = () => {
    if (!postCreationData.content.length) {
      setIsPostCreationDataValid({
        ...isPostCreationDataValid,
        postContentErrorMessage: "Content field is required",
      });
      return;
    }
    setIsPostCreationDataValid({
      ...isPostCreationDataValid,
      postContentErrorMessage: "",
    });
  };

  async function createPost() {
    if (!postCreationData.title.length || !postCreationData.content.length)
      return;

    setIsPostsListLoading(true);

    try {
      const data = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...postCreationData,
          created_at: new Date(),
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

  const router = useRouter();

  const goToPostPage = (userId: number, postId: number) => {
    router.push(`http://localhost:3000/users/${userId}/posts/${postId}`);
  };

  return (
    <>
      <Button
        mb={3}
        loadingText="Loading"
        colorScheme="teal"
        variant="outline"
        spinnerPlacement="start"
        onClick={onOpen}
      >
        Write a post
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl
              isInvalid={!!isPostCreationDataValid.postTitleErrorMessage}
            >
              <FormLabel>Title</FormLabel>
              <Input
                onChange={onPostTitleChange}
                ref={initialRef}
                onBlur={handlePostTitleBlur}
              />
              <FormErrorMessage>
                {isPostCreationDataValid.postTitleErrorMessage}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              mt={4}
              isInvalid={!!isPostCreationDataValid.postContentErrorMessage}
            >
              <FormLabel>Content</FormLabel>
              <Textarea
                onChange={onPostContentChange}
                onBlur={handlePostContentBlur}
              />
              <FormErrorMessage>
                {isPostCreationDataValid.postContentErrorMessage}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={createPost}
              colorScheme="blue"
              mr={3}
              isLoading={isPostsListLoading}
              isDisabled={
                !postCreationData.title.length ||
                !postCreationData.content.length
              }
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <VStack>
        {postsList.map((item: Post) => (
          <PostComponent
            key={item.post_id}
            post={item}
            userId={+userId}
            goToPostPage={goToPostPage}
            addOrRemoveLike={addOrRemoveLike}
          />
        ))}
      </VStack>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // const cidCookie = getCookie("connect.sid", { req, res });
  const userCookie = getCookie("userId", { req, res });

  if (!userCookie) {
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
