import { HTMLAttributes } from "react"

const IMAGE_SCALE_FACTORS = ['@1x', '@2x', '@3x']
const IMAGE_BASE_WIDTH = 768

type KImageProps = {
  src: string
  width: number
  height: number
  alt?: string
}

/**
 * 我的图片组件
 *
 * 响应式图片尺寸：
 * 1. 从宽度的角度出发考虑图片尺寸的要求。
 * 2. 请求的图片的最大逻辑分辨率宽度为 768px，可以根据显示器的 scale factor 选择 1x、2x、3x。
 *
 * 阻止 layout shift：
 *
 * @param props
 * @returns
 */
const KImage = (props: {
  src: string
  width: number
  height: number
  alt?: string
} & HTMLAttributes<HTMLSourceElement>) => {
  let { src, width, height, alt, ...attrs } = props
  const aspectRatio = `${width} / ${height}`
  const imgExt = src.split('.').slice(-1)[0]
  const imgPrefix = src.replace(`.${imgExt}`, '')
  const srcset = Array.from({ length: 3 }, (x, i) => i)
    .map(
      (f) =>
        `${imgPrefix}${IMAGE_SCALE_FACTORS[f]}.jpeg ${
          (f + 1) * IMAGE_BASE_WIDTH
        }w`
    )
    .join(', ')
  if (width > IMAGE_BASE_WIDTH) {
    width = IMAGE_BASE_WIDTH
    height = (IMAGE_BASE_WIDTH * height) / width
  }

  return (
    <picture
      className="block w-full h-full"
      {...attrs}
    >
      {/* <source srcSet={srcset.replace('.jpeg', '.avif')} type={`image/avif`} /> */}
      <source srcSet={srcset.replace(/\.jpeg/g, '.webp')} type={`image/webp`} />
      <source srcSet={srcset} type={`image/jpeg`} />
      <img src={src} alt={alt} className='m-0 w-full h-full'/>
    </picture>
  )
}

export default KImage
