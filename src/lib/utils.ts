/**
 * 日付フォーマット用ユーティリティ関数
 */

/**
 * ISO形式の日付文字列を日本語形式に変換
 * @param dateString - ISO形式の日付文字列
 * @returns 日本語形式の日付文字列（例: 2023年4月1日）
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // 無効な日付の場合は空文字を返す
  if (isNaN(date.getTime())) {
    return '';
  }
  
  // 日本語形式にフォーマット
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * 通貨をフォーマットする関数
 * @param price - 金額（数値）
 * @returns フォーマットされた通貨文字列
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(price);
} 