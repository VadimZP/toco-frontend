import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

import Auth from "./login";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// @ts-ignore
useRouter.mockImplementation(() => ({
  route: "/login",
  pathname: "/login",
  query: "",
  asPath: "/login",
  replace: jest.fn()
}));

describe("Login page", () => {
  test("renders email input", () => {
    render(<Auth />);
    const inputElem = screen.getByRole("textbox", { name: "Email" });
    expect(inputElem).toBeInTheDocument();
  });

  test("renders password input", () => {
    render(<Auth />);
    const inputElem = screen.getByLabelText("Password");
    expect(inputElem).toBeInTheDocument();
  });

  test("renders login submit button", () => {
    render(<Auth />);
    const submitButton = screen.getByRole("button", {
      name: "Login",
    });
    expect(submitButton).toBeInTheDocument;
  });

  test("allows a user to enter a valid email", async () => {
    render(<Auth />);
    const inputElem = screen.getByRole("textbox", { name: "Email" });
    await userEvent.type(inputElem, "test@gmail.com");
    expect(inputElem).toHaveValue("test@gmail.com");
  });

  test("shows an error message for an invalid email", async () => {
    render(<Auth />);
    const inputElem = screen.getByRole("textbox", { name: "Email" });
    await userEvent.type(inputElem, "invalid-email");
    await userEvent.tab();
    expect(screen.getByText("Email is incorrect")).toBeInTheDocument();
  });

  test("calls login button API request", async () => {
    render(<Auth />);

    const inputNameElem = screen.getByRole("textbox", { name: "Email" });
    await userEvent.type(inputNameElem, "test@gmail.com");

    const inputPasswordElem = screen.getByLabelText("Password");
    await userEvent.type(inputPasswordElem, "testtest");

    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(sessionStorage.getItem("is-authenticated")).toBe("true");
    });
  });
});
