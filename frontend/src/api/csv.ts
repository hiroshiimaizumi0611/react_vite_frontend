import { api } from '../lib/axios'

export interface PresignedUrlResponse {
  url: string;
}

/**
 * 指定した CSV ファイル名の署名付き URL を取得する
 *
 * @param fileName S3オブジェクトキー (例: "sales/2024-08.csv")
 * @returns 署名付きURL文字列
 */
export async function fetchPresignedUrl(fileName: string): Promise<string> {
  const { data } = await api.get<PresignedUrlResponse>(`/api/v1/csv/${fileName}`);
  return data.url;
}