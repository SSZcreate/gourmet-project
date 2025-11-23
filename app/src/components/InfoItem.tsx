/**
 * 情報表示用の再利用可能コンポーネント
 * 
 * 【役割】
 * - アイコン + タイトル + 内容のセットを統一されたスタイルで表示
 * - DetailScreenなど複数の場所で使用される共通UI部品
 * 
 * 【動作】
 * 1. 左側にアイコンを表示(灰色)
 * 2. 右側にタイトル(小さく太字)と内容(通常サイズ)を縦に並べて表示
 * 3. flexレイアウトで要素を整列
 * 
 * 【使用例】
 * <InfoItem 
 *   icon={<MapPin />} 
 *   title="住所" 
 *   content="東京都渋谷区..." 
 * />
 * 
 * 【Props】
 * @param icon - 表示するアイコン(lucide-reactなどのReactコンポーネント)
 * @param title - 情報のタイトル(「住所」「営業時間」など)
 * @param content - 情報の内容(実際の住所や営業時間のテキスト)
 */
import React from 'react';

type InfoItemProps = {
  icon: React.ReactNode;
  title: string;
  content: string;
};

export default function InfoItem({ icon, title, content }: InfoItemProps) {
  return (
    <div className="flex items-start">
      <div className="text-gray-400 mr-3 mt-1">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-500 mb-1">{title}</h4>
        <p className="text-gray-800 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
