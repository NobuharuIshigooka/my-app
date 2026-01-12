import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "無料プラン",
      price: "¥0",
      period: "永久無料",
      description: "基本的な家計簿機能を無料で利用できます",
      features: [
        { name: "支出記録", included: true },
        { name: "カテゴリ分け（9種類）", included: true },
        { name: "今週・今月の合計表示", included: true },
        { name: "支出履歴の閲覧", included: true },
        { name: "カテゴリ別支出表示", included: true },
        { name: "グラフ分析機能", included: false },
        { name: "期間別比較", included: false },
        { name: "CSV エクスポート", included: false },
      ],
      cta: "無料で始める",
      ctaLink: "/sign-up",
      variant: "outline" as const,
      highlighted: false,
    },
    {
      name: "プレミアムプラン",
      price: "¥500",
      period: "月額",
      description: "高度な分析機能で支出を深く理解できます",
      features: [
        { name: "支出記録", included: true },
        { name: "カテゴリ分け（9種類）", included: true },
        { name: "今週・今月の合計表示", included: true },
        { name: "支出履歴の閲覧", included: true },
        { name: "カテゴリ別支出表示", included: true },
        { name: "グラフ分析機能", included: true },
        { name: "期間別比較", included: true },
        { name: "CSV エクスポート", included: true },
      ],
      cta: "プレミアムを始める",
      ctaLink: "/sign-up",
      variant: "default" as const,
      highlighted: true,
    },
  ];

  return (
    <MainLayout>
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <Container>
          <div className="text-center">
            <h1 className="animate-in fade-in slide-in-from-bottom-4 text-4xl font-bold text-gray-900 duration-1000 sm:text-5xl">
              料金プラン
            </h1>
            <p className="animate-in fade-in slide-in-from-bottom-4 mt-4 text-xl text-gray-700 duration-1000 delay-200">
              あなたに合ったプランをお選びください
            </p>
          </div>
        </Container>
      </section>

      {/* プラン比較セクション */}
      <section className="py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`animate-in fade-in zoom-in relative border-2 shadow-lg transition-all hover:scale-105 hover:shadow-xl ${
                  plan.highlighted
                    ? "border-blue-500 bg-blue-50/30 duration-700 delay-200"
                    : "border-gray-300 duration-700 delay-100"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                    おすすめ
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="ml-2 text-gray-600">/ {plan.period}</span>
                  </div>
                  <p className="mt-4 text-gray-600">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                        ) : (
                          <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                        )}
                        <span
                          className={
                            feature.included ? "text-gray-900" : "text-gray-400"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={plan.variant}
                    size="lg"
                    className={`mt-8 w-full shadow-md hover:shadow-lg ${
                      plan.highlighted
                        ? ""
                        : "border-2 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Link href={plan.ctaLink}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* よくある質問 */}
          <div className="mt-16">
            <h2 className="animate-in fade-in slide-in-from-bottom-4 mb-8 text-center text-3xl font-bold text-gray-900 duration-700">
              よくある質問
            </h2>
            <div className="mx-auto max-w-3xl space-y-6">
              <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-gray-300 shadow-md duration-700 delay-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    プランの変更はいつでもできますか？
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    はい、いつでもプランの変更が可能です。プレミアムプランへのアップグレード、または無料プランへのダウングレードはダッシュボードからいつでも行えます。
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-gray-300 shadow-md duration-700 delay-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    支払い方法は？
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    クレジットカード（Visa、Mastercard、American
                    Express）でのお支払いが可能です。決済は安全な Stripe
                    を通じて処理されます。
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-gray-300 shadow-md duration-700 delay-300 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    データはいつまで保存されますか？
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    無料プラン・プレミアムプランともに、データは無期限で保存されます。アカウントを削除しない限り、すべての支出記録が保持されます。
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-gray-300 shadow-md duration-700 delay-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    プレミアムプランの解約方法は？
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    ダッシュボードの設定からいつでも解約できます。解約後も請求期間の終了まではプレミアム機能をご利用いただけます。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* CTAセクション */}
      <section className="bg-blue-700 py-16 text-white">
        <Container>
          <div className="text-center">
            <h2 className="animate-in fade-in zoom-in text-3xl font-bold duration-700">まずは無料で始めましょう</h2>
            <p className="animate-in fade-in zoom-in mt-4 text-xl duration-700 delay-100">
              今すぐアカウントを作成して、家計簿管理を始められます
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
