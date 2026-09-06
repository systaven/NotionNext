import SmartLink from '@/components/SmartLink'

const CategoryBar = ({ categoryOptions = [], postCount = 0 }) => (
  <nav id='category-bar' className='fuwari-card fuwari-category-bar p-3 mb-4' aria-label='文章分类'>
    <div className='flex items-center gap-2 min-w-0'>
      <SmartLink href='/' className='fuwari-category-pill' aria-label='首页'><i className='fas fa-home' /></SmartLink>
      <SmartLink href='/archive' className='fuwari-category-pill'>归档 <span>{postCount}</span></SmartLink>
      <span className='fuwari-category-divider' aria-hidden='true' />
      <div className='fuwari-category-scroll flex gap-2 overflow-x-auto min-w-0'>
        {categoryOptions.map(category => (
          <SmartLink key={category.name} href={`/category/${encodeURIComponent(category.name)}`} className='fuwari-category-pill'>
            {category.name} <span>{category.count}</span>
          </SmartLink>
        ))}
      </div>
    </div>
  </nav>
)

export default CategoryBar
