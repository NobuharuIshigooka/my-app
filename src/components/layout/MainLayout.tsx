import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * メインレイアウトコンポーネント
 * ヘッダーとメインコンテンツエリアを含む
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
