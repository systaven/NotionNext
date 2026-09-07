import {
  applyShortLinkRoutes,
  collectPostExternalUrls
} from '@/lib/shortLink/server'
import { siteConfig } from '@/lib/config'

const makeBlockMap = () => ({
  block: {
    text: {
      value: {
        type: 'text',
        properties: {
          title: [
            ['普通链接', [['a', 'https://example.com/article?ref=notion']]],
            ['站内链接', [['a', `${siteConfig('LINK')}/about`]]]
          ]
        }
      }
    },
    bookmark: {
      value: {
        type: 'bookmark',
        properties: {
          link: [['https://example.com/article?ref=notion']],
          title: [['示例书签']]
        }
      }
    }
  }
})

describe('post short-link preparation', () => {
  it('collects ordinary Notion hyperlinks and Bookmark URLs once', () => {
    expect(collectPostExternalUrls(makeBlockMap())).toEqual([
      'https://example.com/article?ref=notion'
    ])
  })

  it('rewrites ordinary links while preserving a Bookmark URL for display', () => {
    const blockMap = makeBlockMap()
    const rewritten = applyShortLinkRoutes(
      blockMap,
      new Map([['https://example.com/article?ref=notion', '/r/A1b2C3d4']])
    )

    expect(rewritten).toBe(1)
    expect(blockMap.block.text.value.properties.title[0][1][0][1]).toBe(
      '/r/A1b2C3d4'
    )
    expect(blockMap.block.bookmark.value.properties.link[0][0]).toBe(
      'https://example.com/article?ref=notion'
    )
  })

  it('excludes Notion attachments from short-link creation', () => {
    const blockMap = makeBlockMap()
    blockMap.block.text.value.properties.title.push([
      '附件',
      [[
        'a',
        'https://file.notion.com/f/file/astra-html-lab.zip?table=block'
      ]]
    ])

    expect(collectPostExternalUrls(blockMap)).toEqual([
      'https://example.com/article?ref=notion'
    ])
  })
})
