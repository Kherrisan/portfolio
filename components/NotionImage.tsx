import Image from 'next/image'

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
  const expire =
    value['data-notion-file-type'] === 'file' ? value.src.expiry_time : null
  const src = value.src.url
  const {
    dim: { width, height },
    caption,
  } = value || {}

  return (
    <figure>
      {width && height ? (
        <Image
          src={src}
          alt={caption?.[0]?.plain_text ?? 'Loading Image......'}
          width={width}
          height={height}
          className="rounded"
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        />
      ) : (
        <img src={src} alt={caption?.[0]?.plain_text} className="rounded" />
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