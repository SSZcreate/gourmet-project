/**
 * ぐるめっと - メインページ
 * 
 * 【役割】
 * - 3つの画面(検索/結果/詳細)の状態管理と画面遷移を制御
 * - ホットペッパーAPIを使用した店舗検索のロジック実装
 * - エラーハンドリングとモックデータのフォールバック処理
 * 
 * 【動作】
 * 1. 初期表示: 検索画面(SearchScreen)を表示
 * 2. 検索実行: 位置情報と検索範囲でAPI呼び出し
 * 3. 結果表示: 検索結果を一覧表示(ResultsScreen)
 * 4. 詳細表示: 選択した店舗の詳細を表示(DetailScreen)
 * 5. エラー時: モックデータで代替表示
 * 
 * 【画面遷移】
 * search → results → detail
 *    ↑         ↑        |
 *    |_________|________|
 */
'use client';

import React, { useState } from 'react';
import { Search, ChevronLeft, AlertCircle } from 'lucide-react';
import SearchScreen from '@/components/SearchScreen';
import ResultsScreen from '@/components/ResultsScreen';
import DetailScreen from '@/components/DetailScreen';

// =========================================
// モックデータ
// =========================================
const MOCK_SHOPS = Array.from({ length: 25 }).map((_, i) => ({
  id: `mock-${i + 1}`,
  name: `美味しいレストラン ${i + 1}号店`,
  logo_image: `https://placehold.co/400x400/orange/white?text=No+Image`,
  photo: {
    pc: {
      l: `https://placehold.co/600x400/orange/white?text=Restaurant+Image+${i + 1}`,
    }
  },
  access: `最寄駅${i + 1}から徒歩5分`,
  address: `東京都渋谷区デモ町1-1-${i + 1}`,
  open: '月～金、祝前日: 11:00～15:00 （料理L.O. 14:30 ドリンクL.O. 14:30） 17:00～23:00 （料理L.O. 22:30 ドリンクL.O. 22:30）',
  catch: '絶品料理と落ち着いた空間',
  genre: {
    name: i % 3 === 0 ? '居酒屋' : i % 3 === 1 ? 'イタリアン' : '和食'
  },
  budget: {
    name: '3001～4000円'
  },
  urls: {
    pc: 'https://www.hotpepper.jp/'
  }
}));

// =========================================
// 型定義
// =========================================
type ViewState = 'search' | 'results' | 'detail';
type SearchParams = {
  lat: number | null;
  lng: number | null;
  range: string;
};

// =========================================
// メインアプリコンポーネント
// =========================================
export default function Home() {
  const [view, setView] = useState<ViewState>('search');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({ lat: null, lng: null, range: '3' });
  const [results, setResults] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [page, setPage] = useState(1);
  const RESULTS_PER_PAGE = 10;

  // 検索実行処理
  const handleSearch = async (lat: number, lng: number, range: string) => {
    setLoading(true);
    setError(null);
    setSearchParams({ lat, lng, range });

    try {
      // ホットペッパーAPI Routeを呼び出し
      const response = await fetch(
        `/api/search?lat=${lat}&lng=${lng}&range=${range}`
      );

      console.log('APIレスポンスステータス:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('APIエラー詳細:', errorData);
        throw new Error(errorData.error || `API呼び出しに失敗しました (ステータス: ${response.status})`);
      }

      const data = await response.json();
      console.log('取得したデータ:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      const shops = data.results?.shop || [];
      
      if (shops.length === 0) {
        setError('周辺に店舗が見つかりませんでした。検索範囲を広げてみてください。');
        setResults([]);
      } else {
        setResults(shops);
        setPage(1);
        setView('results');
      }
    } catch (err) {
      setError('検索中にエラーが発生しました。しばらく経ってから再度お試しください。');
      console.error('検索エラー:', err);
      // エラー時はモックデータを使用（開発用フォールバック）
      setResults(MOCK_SHOPS);
      setPage(1);
      setView('results');
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetail = (shop: any) => {
    setSelectedShop(shop);
    setView('detail');
  };

  const handleBack = () => {
    if (view === 'detail') {
      setView('results');
    } else if (view === 'results') {
      setView('search');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-red-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center">
          {view !== 'search' && (
            <button onClick={handleBack} className="mr-3 p-1 hover:bg-red-700 rounded-full transition">
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-lg font-bold flex items-center">
            <Search className="mr-2" size={20} />
            ぐるめっと
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 pb-20">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm flex items-start" role="alert">
            <AlertCircle className="flex-shrink-0 mr-2" size={20} />
            <p>{error}</p>
          </div>
        )}

        {view === 'search' && <SearchScreen onSearch={handleSearch} loading={loading} />}
        
        {view === 'results' && (
          <ResultsScreen
            results={results}
            page={page}
            setPage={setPage}
            resultsPerPage={RESULTS_PER_PAGE}
            onShowDetail={handleShowDetail}
            searchParams={searchParams}
          />
        )}

        {view === 'detail' && selectedShop && (
          <DetailScreen shop={selectedShop} />
        )}
      </main>
      
      <footer className="text-center text-gray-500 text-xs p-4 mt-8">
        Powered by ホットペッパー Webサービス
      </footer>
    </div>
  );
}
