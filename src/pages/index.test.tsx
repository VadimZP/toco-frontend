import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

import Home from ".";
import { Post } from "@/shared/types";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// @ts-ignore
useRouter.mockImplementation(() => ({
  route: "/login",
  pathname: "/login",
  query: "",
  asPath: "/login",
  replace: jest.fn(),
}));

const post: Post = {
  post_id: 1,
  content: "Mocked content",
  created_at: "2023-04-19 00:45:28",
  title: "Mocked title",
  author_id: 2,
  likes: "100",
  comments: "200",
};

describe("Home page", () => {
  test("renders a button for post creation", () => {
    render(<Home posts={[post]} />);
    const postCreationBtn = screen.getByRole("button", {
      name: "Write a post",
    });
    expect(postCreationBtn).toBeInTheDocument();
  });

  test("doesn't render a creation post modal, if corresponding button is not clicked", () => {
    render(<Home posts={[post]} />);
    const modalElem = screen.queryByLabelText("Create your account");
    expect(modalElem).not.toBeInTheDocument();
  });

  test("renders a creation post modal, if corresponding button is clicked", async () => {
    render(<Home posts={[post]} />);
    const postCreationBtn = screen.getByRole("button", {
      name: "Write a post",
    });

    await userEvent.click(postCreationBtn);

    const modalElem = screen.queryByLabelText("Create your account");
    expect(modalElem).toBeInTheDocument();
  });

  test("shows creation post modal's input's error messages, if they are empty when submit button is clicked", async () => {
    render(<Home posts={[]} />);
    const postCreationBtn = screen.getByRole("button", {
      name: "Write a post",
    });

    await userEvent.click(postCreationBtn);

    const modalElem = screen.queryByLabelText("Create your account");
    expect(modalElem).toBeInTheDocument();

    const titleInputElem = screen.getByLabelText("Title");
    expect(titleInputElem).toBeInTheDocument();

    const contentInputElem = screen.getByLabelText("Content");
    expect(contentInputElem).toBeInTheDocument();

    await userEvent.click(titleInputElem);
    await userEvent.tab();

    await userEvent.click(contentInputElem);
    await userEvent.tab();

    const titleInputErrorMsg = screen.getByText("Title field is required");
    const contentInputErrorMsg = screen.getByText("Content field is required");

    expect(titleInputErrorMsg).toBeInTheDocument();
    expect(contentInputErrorMsg).toBeInTheDocument();
  });

  test("renders a post if the creation post modal's inputs contain data after submit button is clicked", async () => {
    render(<Home posts={[]} />);

    const postCreationBtn = screen.getByRole("button", {
      name: "Write a post",
    });

    await userEvent.click(postCreationBtn);

    const titleInputElem = screen.getByLabelText("Title");
    expect(titleInputElem).toBeInTheDocument();

    const contentInputElem = screen.getByLabelText("Content");
    expect(contentInputElem).toBeInTheDocument();

    const postSubmitBtn = screen.getByRole("button", { name: "Save" });
    expect(postSubmitBtn).toBeInTheDocument();

    await userEvent.type(titleInputElem, "Test title");
    await userEvent.type(contentInputElem, "Test content");

    await userEvent.click(postSubmitBtn);

    const paragraphElem = await screen.findByText("Test content");
    expect(paragraphElem).toBeInTheDocument();
  });
});
