const CJK_REG = new RegExp(
  '[\u3040-\u309F]+|' + // Hiragana
    '[\u30A0-\u30FF]+|' + // Katakana
    '[\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF]', // Single CJK ideographs
  'g'
)

export const countWord = (blocks: any[]) => {
//   let trimed = text.trim()
//   const cn = (trimed.match(CJK_REG) || []).length
//   const en = (trimed.replace(CJK_REG, '').split(/\s+/) || []).length
//   return [cn, en]
}

export const estimateReadingTime = (text: string, { cn = 300, en = 160 }) => {
//   const len = countWords(text)
//   const readingTime = len[0] / cn + len[1] / en
//   return readingTime < 1 ? '1' : readingTime.toFixed(0)
}
