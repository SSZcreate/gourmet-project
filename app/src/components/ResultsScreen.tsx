/**
 * 検索結果一覧画面コンポーネント
 * 
 * 【役割】
 * - 店舗検索結果をカード形式で一覧表示
 * - ページネーション機能の提供(10件/ページ)
 * - ソート機能の提供(近い順/値段順)
 * - 検索条件の表示と再検索ボタンの提供
 * 
 * 【動作】
 * 1. 検索結果を10件ずつページ分割して表示
 * 2. ソート順を切り替え可能(近い順/値段順)
 * 3. 各店舗カードに店舗名、画像、ジャンル、キャッチコピー、住所を表示
 * 4. カードクリックで詳細画面へ遷移
 * 5. ページネーションボタンで前後のページへ移動
 * 6. 「再検索」ボタンで検索画面に戻る
 * 
 * 【Props】
 * @param results - 検索結果の店舗配列
 * @param page - 現在のページ番号(1始まり)
 * @param setPage - ページ変更用の状態更新関数
 * @param resultsPerPage - 1ページあたりの表示件数
 * @param onShowDetail - 店舗詳細表示時のコールバック関数
 * @param searchParams - 検索条件(位置情報と検索範囲)
 * @param sortBy - ソート順('distance': 近い順, 'price': 値段順)
 * @param setSortBy - ソート順変更用の状態更新関数
 */
import { MapPin, ArrowUpDown } from 'lucide-react';
import { useMemo } from 'react';

type SearchParams = {
  lat: number | null;
  lng: number | null;
  range: string;
};

type ResultsScreenProps = {
  results: any[];
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  resultsPerPage: number;
  onShowDetail: (shop: any) => void;
  searchParams: SearchParams;
  sortBy: 'distance' | 'price';
  setSortBy: (sort: 'distance' | 'price') => void;
};

export default function ResultsScreen({ 
  results, 
  page, 
  setPage, 
  resultsPerPage, 
  onShowDetail, 
  searchParams,
  sortBy,
  setSortBy
}: ResultsScreenProps) {
  // ソート処理
  const sortedResults = useMemo(() => {
    const sorted = [...results];
    
    if (sortBy === 'distance') {
      // 近い順: mobile_accessの数値でソート(小さい方が近い)
      return sorted.sort((a, b) => {
        const distanceA = parseInt(a.mobile_access || '999');
        const distanceB = parseInt(b.mobile_access || '999');
        return distanceA - distanceB;
      });
    } else {
      // 値段順: budget_averageの数値でソート
      return sorted.sort((a, b) => {
        const priceA = parseInt(a.budget?.average || a.budget?.name?.match(/\d+/) || '9999');
        const priceB = parseInt(b.budget?.average || b.budget?.name?.match(/\d+/) || '9999');
        return priceA - priceB;
      });
    }
  }, [results, sortBy]);

  const offset = (page - 1) * resultsPerPage;
  const paginatedResults = sortedResults.slice(offset, offset + resultsPerPage);
  const totalPages = Math.ceil(sortedResults.length / resultsPerPage);
  const rangeTextMap: {[key: string]: string} = { 
    '1': '300m', 
    '2': '500m', 
    '3': '1000m', 
    '4': '2000m', 
    '5': '3000m' 
  };

  const handleSortChange = (newSort: 'distance' | 'price') => {
    setSortBy(newSort);
    setPage(1); // ソート変更時は1ページ目に戻る
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-lg font-bold text-gray-800">検索結果</h2>
        <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
          範囲: {rangeTextMap[searchParams.range]}
        </span>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600 px-1">
          {sortedResults.length}件見つかりました ({offset + 1}〜{Math.min(offset + resultsPerPage, sortedResults.length)}件目を表示)
        </p>
        
        {/* ソート切り替えボタン */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown size={16} className="text-gray-500" />
          <button
            onClick={() => handleSortChange('distance')}
            className={`px-3 py-1 text-sm rounded-full transition ${
              sortBy === 'distance' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            近い順
          </button>
          <button
            onClick={() => handleSortChange('price')}
            className={`px-3 py-1 text-sm rounded-full transition ${
              sortBy === 'price' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            安い順
          </button>
        </div>
      </div>

      <ul className="space-y-4">
        {paginatedResults.map((shop: any) => (
          <li key={shop.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <button onClick={() => onShowDetail(shop)} className="w-full text-left">
              <div className="flex">
                <img
                  src={shop.photo.pc.l}
                  alt={shop.name}
                  className="w-32 h-32 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/cccccc/ffffff?text=No+Image'; }}
                />
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-red-600 font-medium mb-1">{shop.genre.name}</p>
                    <h3 className="font-bold text-gray-800 leading-tight mb-1 line-clamp-2">{shop.name}</h3>
                    <p className="text-xs text-gray-500 flex items-start line-clamp-2">
                      <MapPin size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                      {shop.access}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 self-end bg-gray-100 px-2 py-1 rounded">
                     詳細を見る →
                  </p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setPage((p: number) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
          >
            前へ
          </button>
          <span className="text-gray-700 font-medium">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
