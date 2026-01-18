import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 保護したいルートを定義
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/history(.*)",
  "/analytics(.*)",
  "/api/expenses(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // 保護されたルートへのアクセス時は認証を要求
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // 静的ファイルとNext.jsの内部ファイルを除外
    "/((?!.*\\..*|_next).*)",
    "/",
    // APIルートも含める
    "/(api|trpc)(.*)",
  ],
};
