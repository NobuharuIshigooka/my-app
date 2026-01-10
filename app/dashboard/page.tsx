import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  // 認証されていない場合はサインインページへリダイレクト
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="mt-2 text-gray-600">
            ようこそ、{user?.firstName || user?.emailAddresses[0]?.emailAddress} さん
          </p>

          <div className="mt-8 rounded-lg bg-blue-50 p-6">
            <h2 className="text-xl font-semibold text-blue-900">
              認証システムが正常に動作しています
            </h2>
            <p className="mt-2 text-blue-700">
              このページは認証が必要なページです。ログインに成功しました。
            </p>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>ユーザーID: {userId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
