import React, { useState } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

type SearchScreenProps = {
  onSearch: (lat: number, lng: number, range: string) => void;
  loading: boolean;
};

export default function SearchScreen({ onSearch, loading }: SearchScreenProps) {
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
