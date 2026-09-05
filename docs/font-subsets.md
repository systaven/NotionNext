# 正文字体按需切片

正文使用 LXGW WenKai，完整源字体保留在 `public/fonts/`。页面只引用
`styles/font-subsets.css` 中的切片，不再请求整个源文件。未使用的另一个正文字体和图标字体不参与本次切片。

每个 `@font-face` 使用互不重叠的 `unicode-range`：浏览器根据使用该字体的文字下载对应包。
基础字符、按站内 UI 文字频率排列的常用字符、其余字符分别分组；后两类每包最多 256 个字符。
这是浏览器原生的条件加载逻辑，也适用于客户端路由切换和动态插入的评论，无需扫描 DOM 或阻塞渲染（[MDN unicode-range](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face/unicode-range)）。
`font-display: swap` 让文字先使用系统字体显示。不要预加载全部切片，否则会失去按需加载的收益。

## 重新生成

```sh
python -m pip install -r scripts/font-requirements.txt
python scripts/subset-fonts.py
# 可选：加入导出的文章纯文本，改善常用字符分组
python scripts/subset-fonts.py --corpus /path/to/articles.txt
```

输出包含实际 WOFF2 文件、CSS 和 `public/fonts/lxgw-subsets/manifest.json`。
清单记录源文件大小、字符总数、包数，以及每包字符数、字节数和 Unicode 范围。
脚本会重新打开每个生成文件，验证全部源字符覆盖且各包没有重叠。
文件名包含内容哈希；重新生成后旧包不会自动删除，避免影响已缓存的旧 CSS。
生成产物随代码提交，普通 Next.js 构建不需要安装 Python 依赖。

## 估算一篇文章的字体流量

```sh
python scripts/font-transfer.py /path/to/article.txt
```

输出去重字符数、匹配字符数、需要的包数、总字节数和逐包命中统计。
这是文本冷缓存估算，不含 CSS、HTTP 头及页面侧栏等其他文字；实际流量以浏览器 Network 为准。
切片有重复字体表开销，总包体积可能超过源文件，但单页仅下载命中的包，后续页面复用缓存。

在浏览器 Network 中过滤 `woff2`，禁用缓存后刷新文章，确认请求来自 `lxgw-subsets/`，
且不再请求完整的 `LXGWWenKai-Regular.9a343ba0.woff2`。新增生僻字时应自动请求对应扩展包。

## 当前生成结果

- 源字体：8,015,580 字节，46,490 个字符。
- 切片：181 包，单包 8,388–111,628 字节，基础包 36,564 字节。
- 完整切片合计：10,585,404 字节；优化目标为单页按需传输量。

站内 UI 语料只用于初始分组，建议后续加入实际文章文本重新生成，以减少正文命中扩展包的数量。
