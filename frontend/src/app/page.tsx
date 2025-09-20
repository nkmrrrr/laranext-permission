"use client";

import { useHealthCheck } from "@/hooks/useAuth";

export default function Home() {
  const { data: healthData, isLoading, error } = useHealthCheck();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Laravel + Next.js 連携テスト
        </h1>

        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              API ヘルスチェック
            </h2>

            {isLoading && <p className="text-blue-600">API接続確認中...</p>}

            {error && (
              <div className="text-red-600">
                <p>エラーが発生しました:</p>
                <pre className="text-sm mt-1 bg-red-50 p-2 rounded">
                  {error.message}
                </pre>
              </div>
            )}

            {healthData && (
              <div className="text-green-600">
                <p className="font-medium">✅ API接続成功!</p>
                <div className="text-sm mt-2 bg-green-50 p-2 rounded">
                  <p>
                    <strong>Status:</strong> {healthData.status}
                  </p>
                  <p>
                    <strong>Message:</strong> {healthData.message}
                  </p>
                  <p>
                    <strong>Timestamp:</strong> {healthData.timestamp}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Laravel バックエンド (Port: 8080) と Next.js フロントエンド (Port:
              3000) の連携が正常に動作しています。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
