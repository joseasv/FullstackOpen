import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect } from "vitest";

test("only renders blog's title and author", () => {
  const blog = {
    title: "The test",
    author: "tester",
    url: "https://test.test",
    likes: "0",
    user: { username: "user" },
  };

  const { container } = render(
    <Blog blog={blog} user={{ username: "user" }} removeCallback={() => {}} />,
  );

  let div = container.querySelector(".visibleBlogData");

  expect(div).toHaveTextContent("The test");

  expect(div).toHaveTextContent("tester");

  div = container.querySelector(".notVisibleBlogData");

  expect(div).toHaveTextContent("https://test.test");

  expect(div).toHaveTextContent("0");
});

test("url and likes are shown if view button is clicked", async () => {
  const blog = {
    title: "The test",
    author: "tester",
    url: "https://test.test",
    likes: "2",
    user: { username: "user" },
  };

  const { container } = render(
    <Blog blog={blog} user={{ username: "user" }} removeCallback={() => {}} />,
  );

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  let div = container.querySelector(".notVisibleBlogData");
  screen.debug(div);
  expect(div).toHaveStyle("display: block");
  expect(div).toHaveTextContent("https://test.test");
  expect(div).toHaveTextContent("2");
});

test("if the like button is clicked twice, its event handler is called twite", async () => {
  const blog = {
    title: "The test",
    author: "tester",
    url: "https://test.test",
    likes: "2",
    user: { username: "user" },
  };

  const mockHandler = vi.fn();

  const { container } = render(
    <Blog
      blog={blog}
      user={{ username: "user" }}
      removeCallback={() => {}}
      addLikeCallback={mockHandler}
    />,
  );

  const user = userEvent.setup();
  let button = screen.getByText("view");
  await user.click(button);

  button = screen.getByText("like");
  await user.click(button);
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
