'use client';

import React, { useState } from 'react';
import { MapPin, Search, Clock, Map, ChevronLeft, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

// =========================================
// モックデータ (実際のAPIが使えない場合のダミー)
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
      // TODO: 実際のAPI呼び出しに置き換え
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResults(MOCK_SHOPS);
      setPage(1);
      setView('results');
    } catch (err) {
      setError('検索中にエラーが発生しました。しばらく経ってから再度お試しください。');
      console.error(err);
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
            グルメリサーチ
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

// =========================================
// [画面1] 検索条件入力画面
// =========================================
function SearchScreen({ onSearch, loading }: { onSearch: (lat: number, lng: number, range: string) => void, loading: boolean }) {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [range, setRange] = useState('3');
  const [locationStatus, setLocationStatus] = useState<string>('');

  const handleGetLocation = () => {
    setLocationStatus('取得中...');
    if (!navigator.geolocation) {
      setLocationStatus('お使いのブラウザは位置情報に対応していません。');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLocationStatus('位置情報を取得しました！');
      },
      (error) => {
        let errorMessage = '位置情報の取得に失敗しました。';
        switch(error.code) {
          case 1: errorMessage = '位置情報の利用が許可されていません。'; break;
          case 2: errorMessage = 'デバイスの位置情報が利用できません。'; break;
          case 3: errorMessage = 'タイムアウトしました。'; break;
        }
        setLocationStatus(`${errorMessage} (デモ用に東京駅周辺を設定します)`);
        setLat(35.681236);
        setLng(139.767125);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lat && lng) {
      onSearch(lat, lng, range);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6 text-center">
        <h2 className="text-xl font-bold mb-2 text-gray-800">近くのお店を探す</h2>
        <p className="text-gray-500 mb-6 text-sm">現在地から周辺のレストランを検索します</p>
        
        <button
          type="button"
          onClick={handleGetLocation}
          className="w-full flex items-center justify-center bg-blue-50 text-blue-600 font-semibold py-4 px-6 rounded-xl border-2 border-blue-100 hover:bg-blue-100 transition duration-200 mb-2"
        >
          <MapPin className="mr-2" size={20} />
          現在地を取得する
        </button>
        
        {locationStatus && (
          <p className={`text-sm mb-4 ${lat ? 'text-green-600' : 'text-orange-500'}`}>
            {locationStatus}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className={`bg-white p-6 rounded-xl shadow-sm transition-opacity duration-300 ${(!lat && !loading) ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="range">
            検索範囲
          </label>
          <div className="relative">
            <select
              id="range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="block appearance-none w-full bg-gray-50 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-red-500"
            >
              <option value="1">300m 以内</option>
              <option value="2">500m 以内</option>
              <option value="3">1000m 以内 (標準)</option>
              <option value="4">2000m 以内</option>
              <option value="5">3000m 以内</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!lat || loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-md disabled:bg-gray-300 disabled:shadow-none transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              検索中...
            </>
          ) : (
            <>
              <Search className="mr-2" size={20} />
              この条件で検索
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// =========================================
// [画面2] 検索結果一覧画面
// =========================================
function ResultsScreen({ results, page, setPage, resultsPerPage, onShowDetail, searchParams }: any) {
  const offset = (page - 1) * resultsPerPage;
  const paginatedResults = results.slice(offset, offset + resultsPerPage);
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const rangeTextMap: {[key: string]: string} = { '1': '300m', '2': '500m', '3': '1000m', '4': '2000m', '5': '3000m' };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-lg font-bold text-gray-800">検索結果</h2>
        <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
          範囲: {rangeTextMap[searchParams.range]}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 px-1">
        {results.length}件見つかりました ({offset + 1}〜{Math.min(offset + resultsPerPage, results.length)}件目を表示)
      </p>

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

// =========================================
// [画面3] 店舗詳細画面
// =========================================
function DetailScreen({ shop }: { shop: any }) {
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

function InfoItem({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
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
