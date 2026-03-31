/**
 * IndexNow 配置
 * IndexNow 是一种 SEO 协议，允许网站即时通知搜索引擎（如 Bing、Yandex）内容更新
 * 使用方法:
 *   1. 在 Bing Webmaster Tools 获取 IndexNow API Key
 *   2. 设置环境变量 NEXT_PUBLIC_INDEXNOW_KEY 和 NEXT_PUBLIC_INDEXNOW_HOST
 *   3. 访问 /api/indexnow 验证密钥文件是否正常返回
 *   4. 调用 POST /api/indexnow 提交 URL 列表到搜索引擎
 * @see https://www.indexnow.org
 */
module.exports = {
  // IndexNow API Key，需要在 Bing Webmaster Tools 中申请
  // @see https://www.bing.com/indexnow
  INDEXNOW_KEY: process.env.NEXT_PUBLIC_INDEXNOW_KEY || '',

  // 网站域名（不含 https:// 和尾部斜杠），例如 'www.example.com'
  INDEXNOW_HOST: process.env.NEXT_PUBLIC_INDEXNOW_HOST || '',
}
