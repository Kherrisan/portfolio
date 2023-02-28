import { useTheme } from 'next-themes'
import Giscus from '@giscus/react'

const Comments = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div
      id="comments-section"
      className="mt-4 rounded border border-gray-400/30 p-4 md:-mx-4"
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
