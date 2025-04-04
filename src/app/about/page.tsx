import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* ヒーローセクション */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-10">
          <div className="relative h-80 w-full">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
              alt="Akameeのチーム"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">会社概要</h1>
            <p className="text-gray-600 mb-4">
              Akameeは、厳選された高品質な商品を提供するECサイトです。私たちは「お客様の生活をより豊かに、より便利に」をミッションに掲げ、日々サービスの向上に努めています。
            </p>
            <p className="text-gray-600">
              2023年の設立以来、お客様一人ひとりに寄り添ったサービスを心がけ、安心・安全な商品をお届けしています。私たちは品質にこだわり、環境に配慮した商品選定を行うとともに、丁寧なカスタマーサポートを提供しています。
            </p>
          </div>
        </div>
        
        {/* ミッション・ビジョン・バリュー */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-10 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">ミッション・ビジョン・バリュー</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">ミッション</h3>
              <p className="text-gray-600">
                お客様の生活をより豊かに、より便利にする高品質な商品を提供します。
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">ビジョン</h3>
              <p className="text-gray-600">
                日本一信頼されるECサイトとなり、お客様の日常に欠かせないパートナーになることを目指します。
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">バリュー</h3>
              <p className="text-gray-600">
                誠実さ、品質へのこだわり、お客様第一、環境への配慮、革新性を大切にしています。
              </p>
            </div>
          </div>
        </div>
        
        {/* 会社情報 */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">会社情報</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium w-1/3">会社名</td>
                  <td className="py-3 px-4">Akamee株式会社</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium">設立</td>
                  <td className="py-3 px-4">2023年4月1日</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium">代表者</td>
                  <td className="py-3 px-4">代表取締役 山田 太郎</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium">所在地</td>
                  <td className="py-3 px-4">〒150-0042 東京都渋谷区宇田川町36-6 ワールド宇田川ビル 8F</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium">資本金</td>
                  <td className="py-3 px-4">1,000万円</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium">事業内容</td>
                  <td className="py-3 px-4">
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>ECサイトの運営</li>
                      <li>商品の企画・開発</li>
                      <li>輸入販売</li>
                      <li>コンサルティング業務</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium">従業員数</td>
                  <td className="py-3 px-4">15名（2023年12月現在）</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium">取引銀行</td>
                  <td className="py-3 px-4">〇〇銀行 渋谷支店</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium">公式サイト</td>
                  <td className="py-3 px-4">https://www.akamee.example.com</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium">お問い合わせ</td>
                  <td className="py-3 px-4">info@akamee.example.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 