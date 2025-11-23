/**
 * 店舗詳細画面コンポーネント
 * 
 * 【役割】
 * - 選択された店舗の詳細情報を表示
 * - ホットペッパーの店舗ページへの外部リンク提供
 * - 店舗の写真、住所、アクセス、営業時間、予算情報を整理して表示
 * 
 * 【動作】
 * 1. 店舗画像をヘッダーに大きく表示
 * 2. 店舗名、キャッチコピー、ジャンルを表示
 * 3. InfoItemコンポーネントを使用して以下を表示:
 *    - 住所(MapPinアイコン)
 *    - アクセス情報(Mapアイコン)
 *    - 営業時間(Clockアイコン)
 *    - 平均予算(アイコンなし)
 * 4. 「ホットペッパーで見る」ボタンで外部ページへ遷移
 * 
 * 【Props】
 * @param shop - 店舗オブジェクト(ホットペッパーAPIのレスポンス形式)
 */
import { MapPin, Map, Clock, ExternalLink } from 'lucide-react';
import InfoItem from '@/components/InfoItem';

type DetailScreenProps = {
  shop: any;
};

export default function DetailScreen({ shop }: DetailScreenProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
      <div className="relative">
        <img
          src={shop.photo.pc.l}
          alt={shop.name}
          className="w-full h-64 object-cover"
           onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image'; }}
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-gray-700 shadow-sm">
          {shop.genre.name}
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{shop.name}</h2>
        <p className="text-red-600 font-medium mb-6">{shop.catch}</p>

        <div className="space-y-6">
          <InfoItem icon={<MapPin />} title="住所" content={shop.address} />
          <InfoItem icon={<Map />} title="アクセス" content={shop.access} />
          <InfoItem icon={<Clock />} title="営業時間" content={shop.open} />
          
          <div className="pt-4 border-t border-gray-100">
             <h4 className="text-sm font-bold text-gray-500 mb-2">予算の目安</h4>
             <p className="text-lg font-semibold text-gray-800">{shop.budget.name}</p>
          </div>
        </div>

        <a
          href={shop.urls.pc}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl shadow flex items-center justify-center transition duration-200"
        >
          ホットペッパーで見る
          <ExternalLink size={18} className="ml-2" />
        </a>
      </div>
    </div>
  );
}
