import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingDown, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
        <Container>
          <div className="text-center">
            <h1 className="animate-in fade-in slide-in-from-bottom-4 text-4xl font-bold leading-tight text-gray-900 duration-1000 sm:text-5xl">
              3つの機能だけ。
              <br />
              続けられる家計簿
            </h1>
            <p className="animate-in fade-in slide-in-from-bottom-4 mt-6 text-xl leading-relaxed text-gray-700 duration-1000 delay-200">
              支出記録、カテゴリ分け、ダッシュボード表示。
              <br />
              必要最小限の機能で、誰でも簡単に継続できる家計簿アプリ。
            </p>
            <div className="animate-in fade-in slide-in-from-bottom-4 mt-10 flex flex-col items-center justify-center gap-4 duration-1000 delay-300 sm:flex-row">
              <Button asChild size="lg" className="w-full shadow-md transition-all hover:scale-105 hover:shadow-lg sm:w-auto">
                <Link href="/sign-up">無料で始める</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-2 border-blue-700 text-blue-700 shadow-sm transition-all hover:scale-105 hover:bg-blue-50 hover:shadow-md sm:w-auto"
              >
                <Link href="/pricing">料金プランを見る</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 機能紹介セクション */}
      <section className="py-16">
        <Container>
          <h2 className="animate-in fade-in slide-in-from-bottom-4 mb-12 text-center text-3xl font-bold text-gray-900 duration-700">
            シンプルな3つの機能
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-gray-300 shadow-md duration-700 delay-100 hover:scale-105 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Wallet className="h-6 w-6" />
                  支出記録
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-gray-700">
                  金額とカテゴリを選ぶだけ。記録ボタンを押すだけで完了します。
                </p>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-gray-300 shadow-md duration-700 delay-200 hover:scale-105 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <TrendingDown className="h-6 w-6" />
                  カテゴリ分け
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-gray-700">
                  食費、交通費など固定9カテゴリから選択。迷わずシンプル。
                </p>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-gray-300 shadow-md duration-700 delay-300 hover:scale-105 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <BarChart3 className="h-6 w-6" />
                  ダッシュボード
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-gray-700">
                  今週・今月の支出が一目でわかる。プレミアムならグラフで分析も。
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTAセクション */}
      <section className="bg-blue-700 py-16 text-white">
        <Container>
          <div className="text-center">
            <h2 className="animate-in fade-in zoom-in text-3xl font-bold duration-700">今すぐ始めましょう</h2>
            <p className="animate-in fade-in zoom-in mt-4 text-xl duration-700 delay-100">
              無料で支出記録を始められます。いつでもプレミアムにアップグレード可能。
            </p>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="animate-in fade-in zoom-in mt-8 border-2 border-white bg-white text-blue-700 shadow-md duration-700 delay-200 hover:scale-105 hover:bg-gray-50 hover:shadow-lg transition-transform"
            >
              <Link href="/sign-up">無料アカウントを作成</Link>
            </Button>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
