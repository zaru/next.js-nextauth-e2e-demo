import { test, expect } from "@playwright/test";

test("ログインしていないとリダイレクトされる", async ({ page }) => {
  await page.goto("http://localhost:3000/protect");
  const currentUrl = page.url();
  const urlWithoutQuery = new URL(currentUrl);
  const pathname = urlWithoutQuery.pathname;
  expect(pathname).toBe("/api/auth/signin");
});

test("ログイン状態でアクセスすると、ユーザ情報が表示される", async ({
  browser,
}) => {
  const context = await browser.newContext();
  await context.addCookies([
    {
      name: "authjs.session-token",
      value: "dummy-jwt-token",
      domain: "localhost:3000",
      path: "/",
    },
  ]);

  const page = await context.newPage();
  await page.goto("http://localhost:3000/protect");
  await expect(page.locator("pre")).toContainText("zaru");
});
