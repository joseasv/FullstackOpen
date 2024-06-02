const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http:localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Jose Sanchez",
        username: "jose",
        password: "sanchez",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByTestId("username")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username").fill("mluukkai");
      await page.getByTestId("password").fill("salainen");

      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Matti Luukkainen logged-in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("mluukkai");
      await page.getByTestId("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      const errorDiv = await page.locator(".alert");
      await expect(errorDiv).toContainText("Wrong username or password");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

      await expect(
        page.getByText("Matti Luukkainen logged-in"),
      ).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId("username").fill("mluukkai");
      await page.getByTestId("password").fill("salainen");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByTestId("title").fill("testTitle");
      await page.getByTestId("author").fill("testAuthor");
      await page.getByTestId("url").fill("testUrl");
      await page.getByRole("button", { name: "create" }).click();
      await expect(page.getByText("testTitle by testAuthor")).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByTestId("title").fill("testTitle");
      await page.getByTestId("author").fill("testAuthor");
      await page.getByTestId("url").fill("testUrl");
      await page.getByRole("button", { name: "create" }).click();

      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "like" }).click();

      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("a blog can be deleted by the user who just created it", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByTestId("title").fill("testTitle");
      await page.getByTestId("author").fill("testAuthor");
      await page.getByTestId("url").fill("testUrl");
      await page.getByRole("button", { name: "create" }).click();

      await page.getByRole("button", { name: "view" }).click();

      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

      await page.getByRole("button", { name: "remove" }).click();

      page.on("dialog", async (dialog) => {
        expect(dialog.message()).toEqual("Remove blog testTitle by testAuthor");
        await dialog.cancel();
      });

      await expect(page.getByText("testTitle by testAuthor")).toBeVisible();

      page.on("dialog", async (dialog) => {
        expect(dialog.message()).toEqual("Remove blog testTitle by testAuthor");
        await dialog.accept();
      });

      await expect(page.getByText("testTitle by testAuthor")).not.toBeVisible();
    });

    test("a blog can only be deleted by the user who created it", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByTestId("title").fill("testTitle");
      await page.getByTestId("author").fill("testAuthor");
      await page.getByTestId("url").fill("testUrl");

      await page.getByRole("button", { name: "create" }).click();
      await page.getByRole("button", { name: "view" }).click();

      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();

      await page.getByTestId("username").fill("jose");
      await page.getByTestId("password").fill("sanchez");
      await page.getByRole("button", { name: "login" }).click();

      await page.getByRole("button", { name: "view" }).click();

      await expect(
        page.getByRole("button", { name: "remove" }),
      ).not.toBeVisible();
    });
  });
});