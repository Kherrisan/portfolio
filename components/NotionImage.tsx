import Image from 'next/image'
import { useEffect, useState } from 'react';
import KImage from './KImage';

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined,
    height: number | undefined,
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

interface ImageProperties {
  'data-notion-file-type': string
  src: { url: string; expiry_time: string }
  dim: { width: number; height: number }
  caption?: Array<{ plain_text: string }>
}

export const getMediaCtx = (value: ImageProperties) => {
  const src = value.src.url
  const expire =
    value['data-notion-file-type'] === 'file' ? value.src.expiry_time : null
  // const caption = value.caption[0] ? value.caption[0].plain_text : ''
  return { src, caption: 'caption', expire }
}

const NotionImage = ({ value }: { value: ImageProperties }) => {
  const src = value.src.url
  const {
    dim: { width, height },
    caption,
  } = value || {}

  return (
    <div className='flex justify-center my-5'>
      <figure className={`m-0 aspect-[${width}/${height}] h-auto`} style={{ width: `min(90%, ${width}px)`}}>
        <KImage src={src} width={width} height={height} alt={caption ? caption[0].plain_text : src} />
        {caption && caption.length != 0 && (
          <figcaption className="text-center">
            {caption!![0].plain_text}
          </figcaption>
        )}
      </figure>
    </div>
  )
}

export default NotionImage