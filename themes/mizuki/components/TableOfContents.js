
import { useEffect, useState } from 'react'

export const TableOfContents = ({ blockMap }) => {
  const [toc, setToc] = useState([])
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    const headings = Object.keys(blockMap.block)
      .map(id => blockMap.block[id].value)
      .filter(block => block.type === 'header' || block.type === 'sub_header' || block.type === 'sub_sub_header')
      .map(block => ({
        id: block.id,
        type: block.type,
        text: block.properties?.title[0][0],
      }))
    setToc(headings)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-10% 0px -60% 0px' } // Adjust rootMargin to highlight earlier
    )

    headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [blockMap])

  if (toc.length === 0) return null

  return (
    <nav>
      <h3 className="text-lg font-bold mb-4 dark:text-white">Contents</h3>
      <ul className="text-sm space-y-2">
        {toc.map(item => (
          <li key={item.id} className={`${{
            header: 'pl-0 font-semibold',
            sub_header: 'pl-4',
            sub_sub_header: 'pl-8'
          }[item.type]}`}>
            <a
              href={`#${item.id}`}
              className={`block hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 ${
                activeSection === item.id
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
