/**
 * ホットペッパーグルメサーチAPI連携エンドポイント
 * 
 * 【役割】
 * - クライアントからの検索リクエストを受け取る
 * - ホットペッパーAPIへプロキシリクエストを送信
 * - APIレスポンスをクライアントに返却
 * 
 * 【動作】
 * 1. クエリパラメータ(lat, lng, range)を検証
 * 2. 環境変数からホットペッパーAPIキーを取得
 * 3. ホットペッパーAPIにGETリクエスト送信:
 *    - エンドポイント: https://webservice.recruit.co.jp/hotpepper/gourmet/v1/
 *    - パラメータ: key, lat, lng, range, count(100), format(json)
 * 4. APIレスポンスをJSON形式で返却
 * 5. エラー時は適切なステータスコードとエラーメッセージを返却
 * 
 * 【エンドポイント】
 * GET /api/search?lat={緯度}&lng={経度}&range={検索範囲}
 * 
 * 【レスポンス】
 * 成功時: ホットペッパーAPIのレスポンスをそのまま返却
 * エラー時: { error: "エラーメッセージ" }
 * 
 * 【環境変数】
 * NEXT_PUBLIC_HOTPEPPER_API_KEY - ホットペッパーAPIキー(必須)
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const range = searchParams.get('range');

    console.log('=== API Route 開始 ===');
    console.log('受信パラメータ:', { lat, lng, range });

    // パラメータのバリデーション
    if (!lat || !lng || !range) {
      console.error('パラメータ不足');
      return NextResponse.json(
        { error: '必須パラメータが不足しています' },
        { status: 400 }
      );
    }

    // ホットペッパーAPIキーを環境変数から取得
    const apiKey = process.env.NEXT_PUBLIC_HOTPEPPER_API_KEY;
    console.log('APIキー取得:', apiKey ? `存在 (長さ: ${apiKey.length})` : '未設定');
    
    if (!apiKey) {
      console.error('APIキーが環境変数に設定されていません');
      return NextResponse.json(
        { error: 'APIキーが設定されていません' },
        { status: 500 }
      );
    }

    // ホットペッパーAPIエンドポイント
    const apiUrl = new URL('https://webservice.recruit.co.jp/hotpepper/gourmet/v1/');
    apiUrl.searchParams.append('key', apiKey);
    apiUrl.searchParams.append('lat', lat);
    apiUrl.searchParams.append('lng', lng);
    apiUrl.searchParams.append('range', range);
    apiUrl.searchParams.append('count', '100'); // 最大100件取得
    apiUrl.searchParams.append('format', 'json');

    console.log('ホットペッパーAPI呼び出し:', apiUrl.toString().replace(apiKey, '***'));

    // ホットペッパーAPIを呼び出し
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('ホットペッパーAPIレスポンスステータス:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ホットペッパーAPIエラー:', errorText);
      throw new Error(`ホットペッパーAPI呼び出しエラー: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('ホットペッパーAPIレスポンス:', JSON.stringify(data).substring(0, 200) + '...');

    // ホットペッパーAPIのレスポンスはすでにアプリで使用する形式と同じ
    const shops = data.results?.shop || [];
    console.log(`ホットペッパーAPI結果: ${shops.length}件`);

    return NextResponse.json(data);

  } catch (error) {
    console.error('=== API Route エラー ===');
    console.error('エラー詳細:', error);
    console.error('エラーメッセージ:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { 
        error: 'データの取得に失敗しました',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
