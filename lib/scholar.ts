const getPublications = async () => {
  const resp = await fetch(
    'https://serpapi.com/search?engine=google_scholar_author&author_id=zILf1s4AAAAJ&api_key=' + process.env.SERPAPI_KEY
  )
  const json = JSON.parse(await resp.text())
  console.log(json) // as debug option

  return Array.from(json["articles"])
}

export default getPublications
