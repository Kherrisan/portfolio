import { useTheme } from 'next-themes'
import Giscus from '@giscus/react'

const Comments = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div
      id="comments-section"
      className="mt-6 rounded border border-gray-400/30 col-span-12 lg:col-span-9 rounded p-4"
    >
      <Giscus
        repo="kherrisan/giscus-discussions"
        repoId="R_kgDOHrXU0g"
        category="Announcements"
        categoryId="DIC_kwDOHrXU0s4CQSsV"
        mapping="pathname"
        reactionsEnabled="1"
        theme={resolvedTheme}
        loading="lazy"
        inputPosition="top"
      />
    </div>
  )
}

export default Comments
