const IMAGE_SCALE_FACTORS = [
    '@1x',
    '@2x',
    '@3x'
]
const IMAGE_BASE_WIDTH = 768

type KImageProps = {
    src: string,
    width: number,
    height: number,
    alt?: string
}

/**
 * 我的图片组件
 * 
 * 响应式图片尺寸：
 * 1. 从宽度的角度出发考虑图片尺寸的要求。
 * 2. 请求的图片的最大逻辑分辨率宽度为 768px，可以根据显示器的 scale factor 选择 768、768@2、768@3。
 * 
 * 阻止 layout shift：
 * 
 * @param props 
 * @returns 
 */
const KImage = (props: KImageProps) => {
    let { src, width, height, alt } = props;
    const aspectRatio = `${width} / ${height}`;
    const imgExt = src.split('.').slice(-1)[0];
    const imgPrefix = src.replace(`.${imgExt}`, '');
    const srcset = Array.from({ length: 3 }, (x, i) => i).map(f => `${imgPrefix}${IMAGE_SCALE_FACTORS[f]}.jpeg ${(f + 1) * IMAGE_BASE_WIDTH}w`).join(', ');
    if (width > IMAGE_BASE_WIDTH) {
        width = IMAGE_BASE_WIDTH;
        height = IMAGE_BASE_WIDTH * height / width;
    }

    return (
        <img
            srcSet={srcset}
            alt={alt}
            style={{
                width: width,
                height: 'auto',
                aspectRatio: aspectRatio
            }}
        />
    );
};

export default KImage;