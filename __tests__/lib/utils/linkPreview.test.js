import { extractLinkPreview, getFaviconServiceUrl } from '@/lib/utils/linkPreview'

describe('getFaviconServiceUrl', () => {
  it('uses favicon.im with the target hostname only', () => {
    expect(getFaviconServiceUrl('https://docs.example.com/article?id=1')).toBe(
      'https://a.favicon.im/docs.example.com'
    )
  })

  it('returns null for invalid URLs', () => {
    expect(getFaviconServiceUrl('not a URL')).toBeNull()
  })
})

describe('extractLinkPreview', () => {
  it('uses favicon.im instead of the source page icon', () => {
    const preview = extractLinkPreview({
      html: '<link rel="icon" href="/source-icon.png"><title>Example</title>',
      url: 'https://example.com/page'
    })

    expect(preview.favicon).toBe('https://a.favicon.im/example.com')
  })
})
