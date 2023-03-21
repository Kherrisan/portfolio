const CACHE_NAME = 'kendrickzou-portfolio-cache';
const DEFAULT_VERSION = '1.0.0'
const DOMAINS = ["kendrickzou.com", "www.kendrickzou.com", "kherrisan.github.io", "localhost"]
const PORTFOLIO_PACKAGE_NAME = "kendrickzou-portfolio"
const PORTFOLIO_IMG_PACKAGE_NAME = "kendrickzou-portfolio-img"
const VERSION_STORAGE_KEY = "kendrickzou-portfolio-version"
const DEFAULT_IMG_CDN = 'https://cdn.bilicdn.tk/npm'
const CACHABLE_DOMAIN = [
    'i1.hdslb.com',
    'kendrickzou.com',
    'www.kendrickzou.com',
    'cdn.bilicdn.tk/npm',
    'rsms.me',
    'weibo.com',
]

self.cons = {
    w: (m) => {
        console.log(`%c[WARNING]%c ${m}`, 'color:brown;background:yellow;', '')
    },
    i: (m) => {
        console.log(`%c[INFO]%c ${m}`, 'color:white;background:blue;', '')
    },
    e: (m) => {
        console.log(`%c[ERROR]%c ${m}`, 'color:white;background:red;', '')
    },
    d: (m) => {
        console.log(`%c[DEBUG]%c ${m}`, 'color:white;background:black;', '')
    }
}

self.db = {
    read: (key, config) => {
        if (!config) { config = { type: "text" } }
        return new Promise((resolve, reject) => {
            caches.open(CACHE_NAME).then(cache => {
                cache.match(new Request(`https://${DOMAINS[0]}/db/${encodeURIComponent(key)}`)).then(function (res) {
                    if (!res) resolve(null)
                    res.text().then(text => resolve(text))
                }).catch(() => {
                    resolve(null)
                })
            })
        })
    },
    write: (key, value) => {
        return new Promise((resolve, reject) => {
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(new Request(`https://${DOMAINS[0]}/db/${encodeURIComponent(key)}`), new Response(value)).then(resolve)
            }).catch(() => {
                reject()
            })
        })
    }
}

self.addEventListener('install', async function (installEvent) {
    self.skipWaiting();
    installEvent.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                cons.i('Opened cache');
            })
    );
});

self.addEventListener('fetch', event => {
    try {
        event.waitUntil(event.respondWith(handle(event.request)))
    } catch (msg) {
        event.respondWith(handleerr(event.request, msg))
    }
});

const handleerr = async (req, msg) => {
    return new Response(`<h1>CDN分流器遇到了致命错误</h1>
    <b>${msg}</b>`, { headers: { "content-type": "text/html; charset=utf-8" } })
}

const CDN_HOST = "https://npm.elemecdn.com"

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const fetchAndCache = async (url, req) => {
    let resp = await fetch(url)
    const cache = await caches.open(CACHE_NAME)
    if (fullpath(req.url).match(/\.html$/)) {
        resp = await generateHtml(resp)
    }
    await cache.put(req, resp.clone())
    // cons.d(`Fetched parallelly and cached: ${req.url}`)
    return resp
}

const fullpath = (path) => {
    path = path.split('?')[0].split('#')[0]
    if (path.match(/\/$/)) {
        // is index page
        path += 'index'
    }
    if (!path.match(/\.[a-zA-Z0-9]+$/)) {
        // if doesn't have file extension like .html, .js
        path += '.html'
    }
    return path
}

const generateHtml = async (res) => {
    return new Response(await res.blob(), {
        headers: {
            'content-type': 'text/html; charset=utf-8'
        },
        status: res.status,
        statusText: res.statusText
    })
}

const shouldRewriteToCdn = (req) => {
    let url = new URL(req.url)
    if (url.pathname.match(/\/sw\.js/g) || url.pathname.match('/va/script.js')) {
        return false
    }
    return url.origin != new URL(CDN_HOST).origin && DOMAINS.includes(url.hostname)
}

const handle = async function (req) {
    let url = new URL(req.url)
    if (!shouldRewriteToCdn(req)) {
        const resp = await fetch(req, { referrerPolicy: 'no-referrer' })
        if (CACHABLE_DOMAIN.includes(url.hostname)) {
            const cache = await caches.open(CACHE_NAME)
            await cache.put(req, resp.clone())
        }
        return resp
    }
    if (url.pathname.match(/^\/api\//g)) {
        // replace 'localhost:3000' or 'kendrickzou.com' with 'api.kendrickzou.com'
        const resp = await fetch(url.href.replace(url.host, 'api.kendrickzou.com'))
        return new Response(await resp.blob(), {
            headers: resp.headers,
            status: resp.status,
            statusText: resp.statusText
        })
    }
    url = new URL(fullpath(req.url))
    if (url.pathname.indexOf('.html.json') !== -1) {
        url.pathname = url.pathname.replace('.html', '')
    }
    let rewrittenUrl = `${CDN_HOST}/${PORTFOLIO_PACKAGE_NAME}@${version}${url.pathname}`
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            caches.match(req).then(resp => {
                if (!!resp) {
                    // cons.d(`Cache hitted: ${req.url}`)
                    setTimeout(() => {
                        // cons.d(`Cache hitted and respond with cache: ${req.url}`)
                        resolve(resp)
                    }, 200)
                    setTimeout(() => {
                        fetchAndCache(rewrittenUrl, req).then(resolve)
                    }, 0)
                } else {
                    // cons.w(`Cache missed: ${req.url}`)
                    setTimeout(() => {
                        fetchAndCache(rewrittenUrl, req).then(resolve)
                    }, 0)
                    setTimeout(() => {
                        // timeout
                        if (url.pathname.match(/\.html$/)) {
                            resolve(new Response(
                                `<html><head> <meta charSet="utf-8" /></head><body> <div style="position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;width:auto;height:200px"> <h1 style="margin:0;text-align: center;">因为一些小问题，页面加载不出来啦......</h1> <p style="margin:0;text-align: center;">请尝试刷新浏览器，或者彻底清空这个域名站点下的缓存。</p> </div></body></html>`,
                                { headers: { "content-type": "text/html; charset=utf-8" } }
                            ))
                        } else {
                            reject()
                        }
                    }, 5000)
                }
            })
        }, 0)
    })
}

const versionLarger = (v1, v2) => {
    if (!v2) {
        return true
    }
    const [maj1, min1, t1] = v1.split(".").map(x => Number(x))
    const [maj2, min2, t2] = v2.split(".").map(x => Number(x))
    return maj1 > maj2 || min1 > min2 || t1 > t2
}

const setNewestVersion = async () => {
    const registries = [
        `https://registry.npmjs.org/${PORTFOLIO_PACKAGE_NAME}/latest`,
    ]
    return fetchParallelly(registries)
        .then(res => res.json())
        .then(async res => {
            if (!res.version) throw ('No version found!')
            const localVersion = await db.read(VERSION_STORAGE_KEY)
            const remoteVersion = res.version
            cons.d(`Remote version: ${remoteVersion} ; Local version: ${localVersion} `)
            if (versionLarger(remoteVersion, localVersion)) {
                cons.i(`Update blog version to remote version: ${remoteVersion}`);
                await db.write(VERSION_STORAGE_KEY, remoteVersion)
                // window.location.reload()
            }
        })
        .catch(e => {
            cons.e(`Get Blog Newest Version Erorr!Reseon:${e}`);
        })
}

setInterval(async () => {
    cons.i('Trying to fetch the newest version...')
    await setNewestVersion()
}, 120 * 1000);
setTimeout(async () => {
    await setNewestVersion()
}, 0);