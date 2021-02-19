import axios from 'axios'
import { ChevronRightOutline, RssOutline } from 'heroicons-react'
import React, { useEffect, useState } from 'react'
import { ProjectProps } from '../config/projects'

const ProjectCard = (props: ProjectProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [projectStat, setProjectStat] = useState({ star: 0, fork: 0 })

  useEffect(() => {
    const githubApi = `https://api.github.com/repos/${props.slug}`

    axios
      .get(githubApi)
      .then(({ data }) => {
        setProjectStat({ star: data.stargazers_count, fork: data.forks })
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  return (
    <a
      href={props.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded shadow hover:shadow-lg relative overflow-hidden"
    >
      <img className="absolute top-0 left-0 right-0 z-0" src={props.bimg} alt="background" />

      <div className="relative bg-white p-4 mt-36 border-t-2 border-gray-100 rounded z-10">
        <div className="text-xl max-w-sm truncate">{props.name}</div>

        <div className="flex items-center mt-2 text-gray-500">
          <RssOutline size={18} className="mr-1" />
          <span className="max-w-sm truncate">{props.slug}</span>
        </div>

        <div className="flex justify-between mt-2 text-gray-500">
          {isLoading ? (
            <div className="flex items-center animate-pulse h-5 w-20 bg-gray-100 rounded"></div>
          ) : (
            <div className="flex items-center space-x-2 h-5">
              <svg height="18" viewBox="0 0 16 16" version="1.1" width="18" aria-hidden="true" className="fill-current">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
              </svg>
              <span>{projectStat.star}</span>
              <svg viewBox="0 0 16 16" version="1.1" width="18" height="18" aria-hidden="true" className="fill-current">
                <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
              </svg>
              <span>{projectStat.fork}</span>
            </div>
          )}

          <div className="flex items-center">
            <ChevronRightOutline size={18} />
          </div>
        </div>
      </div>
    </a>
  )
}

export default ProjectCard
