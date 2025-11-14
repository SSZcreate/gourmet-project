import { MapPin } from 'lucide-react';

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
};

export default function ResultsScreen({ 
  results, 
  page, 
  setPage, 
  resultsPerPage, 
  onShowDetail, 
  searchParams 
}: ResultsScreenProps) {
  const offset = (page - 1) * resultsPerPage;
  const paginatedResults = results.slice(offset, offset + resultsPerPage);
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const rangeTextMap: {[key: string]: string} = { 
    '1': '300m', 
    '2': '500m', 
    '3': '1000m', 
    '4': '2000m', 
    '5': '3000m' 
  };

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
