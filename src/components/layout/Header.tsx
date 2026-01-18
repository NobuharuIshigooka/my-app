"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Wallet className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold text-gray-900">Money Tracker</span>
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center gap-4">
          <SignedIn>
            <Link
              href="/dashboard"
              className="hidden text-sm font-semibold text-gray-700 transition-colors hover:text-blue-700 sm:block"
            >
              ダッシュボード
            </Link>
            <Link
              href="/history"
              className="hidden text-sm font-semibold text-gray-700 transition-colors hover:text-blue-700 sm:block"
            >
              支出履歴
            </Link>
            <Link
              href="/analytics"
              className="hidden text-sm font-semibold text-gray-700 transition-colors hover:text-blue-700 sm:block"
            >
              分析
            </Link>
            <Link
              href="/pricing"
              className="hidden text-sm font-semibold text-gray-700 transition-colors hover:text-blue-700 sm:block"
            >
              料金プラン
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-gray-700 transition-colors hover:text-blue-700"
            >
              料金プラン
            </Link>
            <Button asChild variant="default" size="sm" className="shadow-md hover:shadow-lg">
              <Link href="/sign-in">ログイン</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
