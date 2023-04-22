import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  IconButton,
  Button,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike, BiChat, BiShare, BiBookReader } from "react-icons/bi";

import { Comment, Post } from "@/shared/types";

interface PostComponentProps {
  post: Post;
  goToPostPage?: (userId: number, postId: number) => void;
  addOrRemoveLike: (userId: number, postId: number) => void;
  comments: Comment[];
}

export default function PostComponent({
  post,
  comments,
  goToPostPage,
  addOrRemoveLike,
}: PostComponentProps) {
  return (
    <>
      <Card maxW="md" mb={6}>
        <CardHeader>
          {/* @ts-ignore */}
          <Flex spacing="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />

              <Box>
                <Heading size="sm">Segun Adebayo</Heading>
                <Text>Creator, Chakra UI</Text>
              </Box>
            </Flex>
            <IconButton
              variant="ghost"
              colorScheme="gray"
              aria-label="See menu"
              icon={<BsThreeDotsVertical />}
            />
          </Flex>
        </CardHeader>
        <CardBody>
          <Text>{post.content}</Text>
        </CardBody>

        <CardFooter
          justify="space-between"
          flexWrap="wrap"
          sx={{
            "& > button": {
              minW: "136px",
            },
          }}
        >
          <Button
            flex="1"
            variant="ghost"
            leftIcon={<BiBookReader />}
            {...(goToPostPage && {
              onClick: () => goToPostPage(post.author_id, post.post_id),
            })}
          >
            Read
          </Button>
          <Button
            flex="1"
            variant="ghost"
            leftIcon={<BiLike />}
            onClick={() => addOrRemoveLike(post.author_id, post.post_id)}
          >
            Like {post.likes}
          </Button>
          <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
            Comments {post.comments}
          </Button>
          {/* <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
          Share
        </Button> */}
        </CardFooter>
      </Card>
      <OrderedList>
        {comments?.map((comment) => (
          <ListItem key={comment.comment_id}>{comment.content}</ListItem>
        ))}
      </OrderedList>
    </>
  );
}
