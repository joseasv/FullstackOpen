const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

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
      await loginWith(page, "mluukkai", "salainen");
      await expect(page.getByText("Matti Luukkainen logged-in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "wrong");

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
      await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "testTitle", "testAuthor", "testUrl");
      await expect(page.getByText("testTitle by testAuthor")).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(page, "testTitle", "testAuthor", "testUrl");

      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "like" }).click();

      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("a blog can be deleted by the user who just created it", async ({
      page,
    }) => {
      await createBlog(page, "testTitle", "testAuthor", "testUrl");

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
      await createBlog(page, "testTitle", "testAuthor", "testUrl");

      await page.getByRole("button", { name: "view" }).click();

      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();

      await loginWith(page, "jose", "sanchez");

      await page.getByRole("button", { name: "view" }).click();

      await expect(
        page.getByRole("button", { name: "remove" }),
      ).not.toBeVisible();
    });

    test("blogs are ordered in decreasing order by the number of likes", async ({
      page,
    }) => {
      for (let i = 0; i < 3; i++) {
        await createBlog(
          page,
          `testTitle${i + 1}`,
          `testAuthor${i + 1}`,
          `testUrl${i + 1}`,
        );
      }

      let i = 0;
      for (const viewButton of await page
        .getByRole("button", { name: "view" })
        .all()) {
        await viewButton.click();
        await page
          .getByRole("button", { name: "like" })
          .click({ clickCount: i + 1 });
        await page.getByText(`likes ${i + 1}`).waitFor();
        await page.getByRole("button", { name: "hide" }).click();
        i++;
      }

      /*
        const viewButtons = await page
        .getByRole("button", { name: "view" })
        .all();

      console.log(`${viewButtons.length} view buttons`);

      await viewButtons[0].click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByText("likes 1").waitFor();
      await page.getByRole("button", { name: "hide" }).click();

      await viewButtons[1].click();
      await page.getByRole("button", { name: "like" }).click({ clickCount: 2 });
      await page.getByText("likes 2").waitFor();
      await page.getByRole("button", { name: "hide" }).click();

      await viewButtons[2].click();
      await page.getByRole("button", { name: "like" }).click({ clickCount: 3 });
      await page.getByText("likes 3").waitFor();
      await page.getByRole("button", { name: "hide" }).click();*/

      await page.reload({ waitUntil: "domcontentloaded" });

      await page.getByText("testTitle3 testAuthor3").waitFor();

      const blogsByClass = await page.locator(".visibleBlogData").all();

      await expect(blogsByClass[0]).toContainText("testTitle3 testAuthor3");
      await expect(blogsByClass[1]).toContainText("testTitle2 testAuthor2");
      await expect(blogsByClass[2]).toContainText("testTitle1 testAuthor1");
    });
  });
});