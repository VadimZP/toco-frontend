import { render, screen } from "@testing-library/react";
import PostComponent from ".";
import "@testing-library/jest-dom";

test("renders post heading with author name", () => {
  const addOrRemoveLike = jest.fn();
  const post = {
    post_id: 1,
    content: "This is the post content",
    created_at: "2023-04-23T10:30:00Z",
    title: "Sample Post",
    author_id: 2,
    likes: "10",
    comments: "5",
  };
  const comments = [
    {
      comment_id: 2,
      content: "This is the comment content",
      name: "Random comment",
      created_at: "2023-05-23T10:30:00Z",
    },
  ];
  render(
    <PostComponent
      post={post}
      addOrRemoveLike={addOrRemoveLike}
      comments={comments}
    />
  );
  const headingElement = screen.getByText("Segun Adebayo");
  expect(headingElement).toBeInTheDocument();
});
