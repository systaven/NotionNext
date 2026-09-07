import { convertFileCdnUrl } from '@/lib/db/notion/convertFileCdnUrl'

describe('convertFileCdnUrl', () => {
  it('converts a signed file.notion.com URL to a stable attachment identifier', () => {
    expect(
      convertFileCdnUrl(
        'https://file.notion.com/f/f/space-id/attachment-id/image.png?expirationTimestamp=1788177600000&signature=signed'
      )
    ).toBe('attachment:attachment-id:image.png')
  })

  it('decodes filenames and supports the legacy file.notion.so host', () => {
    expect(
      convertFileCdnUrl(
        'https://file.notion.so/f/f/space-id/attachment-id/%E5%9B%BE%E7%89%87%20screenshot.png'
      )
    ).toBe('attachment:attachment-id:图片 screenshot.png')
  })

  it('leaves non-CDN and malformed URLs untouched', () => {
    expect(convertFileCdnUrl('https://example.com/image.png')).toBeNull()
    expect(convertFileCdnUrl('not a URL')).toBeNull()
    expect(convertFileCdnUrl(null)).toBeNull()
  })
})
