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
  ListItem,
  UnorderedList,
  List,
} from "@chakra-ui/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike, BiChat, BiBookReader } from "react-icons/bi";

import { Comment, Post } from "@/shared/types";

interface PostComponentProps {
  post: Post;
  userId: number;
  goToPostPage?: (userId: number, postId: number) => void;
  addOrRemoveLike: (userId: number, postId: number) => void;
  commentPost?: (userId: number, postId: number) => void;
  comments: Comment[];
}

function Comment({
  comment,
  childComments,
  commentTree,
  userId,
  postId,
  commentPost,
}) {
  return (
    <div>
      <p>{comment.content}</p>
      <Button
        size="xs"
        onClick={() => commentPost(userId, postId, comment.comment_id)}
      >
        Reply
      </Button>
      <UnorderedList style={{ marginLeft: "40px" }}>
        {childComments?.length > 0 &&
          childComments.map((childComment) => {
            return (
              <ListItem key={childComment.comment_id}>
                <Comment
                  userId={userId}
                  postId={postId}
                  commentPost={commentPost}
                  comment={childComment}
                  childComments={commentTree[childComment.comment_id]}
                  commentTree={commentTree}
                />
              </ListItem>
            );
          })}
      </UnorderedList>
    </div>
  );
}

export default function PostComponent({
  post,
  userId,
  comments,
  commentTree,
  goToPostPage,
  addOrRemoveLike,
  commentPost,
}: PostComponentProps) {
  return (
    <>
      <Card w="100%" variant="outline">
        <CardHeader>
          <Flex>
            <Flex flex="1" gap="4" flexWrap="wrap">
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
            onClick={() => addOrRemoveLike(userId, post.post_id)}
          >
            Like {post.likes}
          </Button>
          <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
            Comments {post.comments}
          </Button>
        </CardFooter>
      </Card>
      {commentPost && (
        <Button onClick={() => commentPost(userId, post.post_id)}>
          Write a comment
        </Button>
      )}
      {comments?.length && (
        <List>
          {commentTree[0].map((rootComment) => (
            <ListItem key={rootComment.comment_id}>
              <Comment
                userId={userId}
                postId={post.post_id}
                commentPost={commentPost}
                comment={rootComment}
                childComments={commentTree[rootComment.comment_id] || []}
                commentTree={commentTree}
              />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}
