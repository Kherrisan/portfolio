import Image from 'next/image'
import { useEffect, useState } from 'react';

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

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
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
     
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return ;
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

const NotionImage = ({ value }: { value: ImageProperties }) => {
  const expire =
    value['data-notion-file-type'] === 'file' ? value.src.expiry_time : null
  const src = value.src.url
  const {
    dim: { width, height },
    caption,
  } = value || {}
  const { width: windowWidth } = useWindowSize();

  return (
    <figure>
      {windowWidth ? (
        <Image
          src={src}
          alt={caption?.[0]?.plain_text ?? 'Loading Image......'}
          width={windowWidth}
          height={(windowWidth * height) / width}
          className="rounded"
          style={{
            objectFit: 'contain',
          }}
        />
      ) : (
        // <img src={src} alt={caption?.[0]?.plain_text} className="rounded" />
        <div style={{
          width: `${width}px`,
          height: `${height}px`,
        }} >
        </div>
      )}
      {caption && caption.length != 0 && (
        <figcaption className="text-center">
          {caption!![0].plain_text}
        </figcaption>
      )}
    </figure>
  )
}

export default NotionImage
