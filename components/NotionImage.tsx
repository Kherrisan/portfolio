import Image from 'next/image'
import { string } from 'prop-types'

interface ImageProperties {
  'data-notion-file-type': string,
  src: { url: string, expiry_time: string },
  dim: { width: number, height: number },
}

export const getMediaCtx = (value: ImageProperties) => {
  const src = value.src.url
  const expire = value['data-notion-file-type'] === 'file' ? value.src.expiry_time : null
  // const caption = value.caption[0] ? value.caption[0].plain_text : ''
  return { src, caption: 'caption', expire }
}

const NotionImage = ({ value }: {
  value: ImageProperties
}) => {
  const { src: imageSrc, caption: imageCaption } = getMediaCtx(value)
  const {
    dim: { width, height },
  } = value || {}

  return (
    <figure>
      {width && height ? (
        // <img
        //   src={imageSrc}
        //   alt={imageCaption}
        //   width={width}
        //   height={height}
        //   className="rounded"
        // />
        <Image
          src={imageSrc}
          alt={imageCaption}
          width={width}
          height={height}
          className="rounded"
        />
      ) : (
        <img src={imageSrc} alt={imageCaption} className="rounded" />
      )}
      {imageCaption && (
        <figcaption className="text-center">{imageCaption}</figcaption>
      )}
    </figure>
  )
}

export default NotionImage
