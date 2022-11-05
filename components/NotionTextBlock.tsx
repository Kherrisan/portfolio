export function Text({
  text,
}: {
  text: { value: string; annotations?: string[]}
}) {
  if (!text) return null

  const { value, annotations } = text
  const color = annotations
    ?.filter((x) => x?.startsWith('color') && !x.endsWith('background'))
    .map((x) => x.replace('color', 'text').concat('-600'))
  const bgColor = annotations
    ?.filter((x) => x?.startsWith('color') && x.endsWith('background'))
    .map((x) => x.replace('color', 'bg').replace('_background', '-800/40'))
  const link = annotations?.filter((x) => x?.startsWith('http'))[0]

  return (
    <span
      className={[
        annotations?.includes('b') ? 'font-bold' : null,
        bgColor && bgColor.length > 0 ? bgColor[0] : null,
        color && color.length > 0 ? color[0] : null,
        bgColor && bgColor.length > 0 ? 'rounded' : null,
        // code
        //   ? 'rounded bg-sky-300/20 px-1 font-mono text-sm text-sky-500 dark:bg-sky-800/30 dark:text-sky-400'
        //   : null,
        annotations?.includes('i') ? 'italic' : null,
        annotations?.includes('s') ? 'line-through' : null,
        annotations?.includes('u') ? 'underline' : null,
      ]
        .filter((x) => x) // remove nulls
        .join(' ')}
      // style={color !== 'default' ? { color } : {}}
    >
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      ) : value } 
    </span>
  )
}
