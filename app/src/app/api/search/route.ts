import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const range = searchParams.get('range');

    // パラメータのバリデーション
    if (!lat || !lng || !range) {
      return NextResponse.json(
        { error: '必須パラメータが不足しています' },
        { status: 400 }
      );
    }

    // ぐるなびAPIキーを環境変数から取得
    const apiKey = process.env.NEXT_PUBLIC_GNAVI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'APIキーが設定されていません' },
        { status: 500 }
      );
    }

    // rangeの値をぐるなびAPIの形式に変換（メートル単位）
    const rangeMap: { [key: string]: string } = {
      '1': '300',   // 300m
      '2': '500',   // 500m
      '3': '1000',  // 1km
      '4': '2000',  // 2km
      '5': '3000',  // 3km
    };
    const rangeInMeters = rangeMap[range] || '1000';

    // ぐるなびAPIエンドポイント
    const apiUrl = new URL('https://api.gnavi.co.jp/RestSearchAPI/v3/');
    apiUrl.searchParams.append('keyid', apiKey);
    apiUrl.searchParams.append('latitude', lat);
    apiUrl.searchParams.append('longitude', lng);
    apiUrl.searchParams.append('range', rangeInMeters);
    apiUrl.searchParams.append('hit_per_page', '100'); // 最大100件取得

    console.log('ぐるなびAPI呼び出し:', apiUrl.toString());

    // ぐるなびAPIを呼び出し
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ぐるなびAPI呼び出しエラー: ${response.status}`);
    }

    const data = await response.json();

    // データの整形（ホットペッパーAPIと同じ形式に変換）
    const formattedData = {
      results: {
        shop: data.rest?.map((restaurant: any) => ({
          id: restaurant.id,
          name: restaurant.name,
          logo_image: restaurant.image_url?.shop_image1 || 'https://placehold.co/400x400/orange/white?text=No+Image',
          photo: {
            pc: {
              l: restaurant.image_url?.shop_image1 || 'https://placehold.co/600x400/orange/white?text=No+Image',
            }
          },
          access: restaurant.access?.line || restaurant.access?.station || '情報なし',
          address: restaurant.address || '住所情報なし',
          open: restaurant.opentime || '営業時間情報なし',
          catch: restaurant.pr?.pr_short || restaurant.category || '',
          genre: {
            name: restaurant.category || '未分類'
          },
          budget: {
            name: restaurant.budget ? `${restaurant.budget}円` : '予算情報なし'
          },
          urls: {
            pc: restaurant.url || 'https://gnavi.co.jp/'
          }
        })) || []
      }
    };

    console.log(`ぐるなびAPI結果: ${formattedData.results.shop.length}件`);

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error('API Route エラー:', error);
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    );
  }
}
