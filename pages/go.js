'use client';

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function GoPage() {
  const [target, setTarget] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem("externalTarget");
    if (saved && /^https?s?:\/\//i.test(saved)) {
      setTarget(saved);
    } else {
      // 如果没有有效的链接，则返回首页
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (!target) return;
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          window.location.href = target;
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  // 在目标链接加载完成前，可以显示一个加载状态或什么都不显示
  if (!target) return <p>加载中...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-white">
      <h1 className="text-3xl font-semibold mb-4 text-red-500">⚠️ 您即将离开本站</h1>
      <p className="mb-4 text-gray-600 max-w-full">
        即将跳转到外部网站：
        <a
          href={target}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all"
        >
          {target}
        </a>
      </p>
      <p className="text-sm text-gray-500 mb-6">
        为保障您的账户和财产安全，请勿在外部网站输入任何敏感信息。
      </p>
      <p className="text-lg font-bold text-gray-800 mb-6">
        页面将在 {countdown} 秒后自动跳转
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => (window.location.href = target)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          立即访问
        </button>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 px-6 py-2 rounded-lg shadow-md hover:bg-gray-300 transition-colors"
        >
          返回上一页
        </button>
      </div>
    </div>
  );
}
