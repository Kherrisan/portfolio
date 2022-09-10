import { JSDOM } from 'jsdom'

const getPublications = async () => {
  const resp = await fetch(
    'https://scholar.google.com/citations?user=zILf1s4AAAAJ&hl=en',
    {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
        cookie: process.env.GOOGLE_SCHOLAR_COOKIE || '',
      },
    }
  )
  const html = await resp.text()
  // console.log(html) // this route fails often, keep this as a debug option

  const dom = new JSDOM(html)
  const document = dom.window.document
  const elements = document.querySelectorAll('.gsc_a_tr')
  const data = Array.from(elements).map((element) => {
    const title =
      element.querySelector('.gsc_a_at')?.textContent?.replace(/‐/g, '-') || ''

    // author and publication are in the same element called .gs_gray
    const gray = Array.from(element.querySelectorAll('.gs_gray'))
    const [author, publication] = gray.map(
      (elem) => elem?.textContent?.split('�')[0] || ''
    )

    const date = element.querySelector('.gsc_a_y')?.textContent || ''

    const raw = element.querySelector('.gsc_a_at')?.getAttribute('href') || ''
    const link = 'https://scholar.google.com' + raw

    const citations = element.querySelector('.gsc_a_c')?.textContent || ''
    return { title, author, publication, date, link, citations }
  })

  if (data.length === 0) {
    // failed to parse HTML from Google Scholar, return default publication
    return [
      {
        title:
          'Benefit-Oriented Task Offloading in UAV-Aided Mobile Edge Computing: An Approximate Solution',
        author: 'Yu Gao, Jun Tao, Haotian Wang, Zuyan Wang, Dikai Zou, Yifan Xu',
        publication:
          'Preprint',
        date: '2022',
        link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=zILf1s4AAAAJ&citation_for_view=zILf1s4AAAAJ:u-x6o8ySG0sC',
        citations: '0',
      },
    ]
  }

  return data
}
export default getPublications
