import { render, screen } from "@testing-library/react";
import AddBlogForm from "./AddBlogForm";
import userEvent from "@testing-library/user-event";

test("<AddBlogForm /> calls the event handler with the right details", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<AddBlogForm createBlog={createBlog} />);

  const titleInput = screen.getByPlaceholderText("titleInput");
  const authorInput = screen.getByPlaceholderText("authorInput");
  const urlInput = screen.getByPlaceholderText("urlInput");
  const sendButton = screen.getByText("create");

  await user.type(titleInput, "testTitle");
  await user.type(authorInput, "testAuthor");
  await user.type(urlInput, "testUrl");
  await user.click(sendButton);

  console.log(createBlog.mock.calls);
  console.log(createBlog.mock.calls[0][0]);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("testTitle");
  expect(createBlog.mock.calls[0][0].author).toBe("testAuthor");
  expect(createBlog.mock.calls[0][0].url).toBe("testUrl");
});