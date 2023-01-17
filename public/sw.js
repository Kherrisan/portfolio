const CACHE_NAME = 'kendrickzou-portfolio-cache';
const DEFAULT_VERSION = '1.0.0'
const DOMAINS = ["kendrickzou.com", "www.kendrickzou.com", "kherrisan.github.io", "localhost"]
const PORTFOLIO_PACKAGE_NAME = "kendrickzou-portfolio"
const PORTFOLIO_IMG_PACKAGE_NAME = "kendrickzou-portfolio-img"
const VERSION_STORAGE_KEY = "kendrickzou-portfolio-version"
const DEFAULT_IMG_CDN = 'https://cdn.bilicdn.tk/npm'

let cachelist = [];
self.cons = {
    s: (m) => {
        console.log(`%c[SUCCESS]%c ${m}`, 'color:white;background:green;', '')
    },
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
                cache.put(new Request(`https://${DOMAINS[0]}/db/${encodeURIComponent(key)}`), new Response(value));
                resolve()
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
                self.cons.i('Opened cache');
            })
    );
});

self.addEventListener('fetch', event => {
    try {
        event.respondWith(handle(event.request))
    } catch (msg) {
        event.respondWith(handleerr(event.request, msg))
    }
});

const handleerr = async (req, msg) => {
    return new Response(`<h1>CDN分流器遇到了致命错误</h1>
    <b>${msg}</b>`, { headers: { "content-type": "text/html; charset=utf-8" } })
}

const cdnList = [
    "https://npm.elemecdn.com",
    "https://cdn.jsdelivr.net/npm",
    "https://npm.sourcegcdn.com",
    "https://cdn.bilicdn.tk/npm",
    "https://cdn-jsd.pigax.cn",
    "https://cdn1.tianli0.top/npm"
]

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const fetchParallellyAndCache = async (urls, req) => {
    const resp = await fetchParallelly(urls, req)
    const cache = await caches.open(CACHE_NAME)

    if (fullpath(req.url).match(/\.html$/)) {
        const respCp = await generateHtml(resp)
        cache.put(req, respCp.clone())
        return respCp
    }
    cache.put(req, resp.clone())
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

const shouldFetchParallelly = (req) => {
    let url = new URL(req.url)
    if (url.pathname.match(/\/sw\.js/g) || url.pathname.match('/va/script.js')) {
        return false
    }
    for (let i = 0; i < cdnList.length; i++) {
        if (url.origin === new URL(cdnList[i]).origin) {
            // 是去往 NPM-CDN 的请求
            return true
        }
    }
    return DOMAINS.includes(url.hostname)
}

const handle = async function (req) {
    let url = new URL(req.url)
    if (!shouldFetchParallelly(req)) {
        return fetch(req)
    }
    if (url.pathname.match(/^\/api\//g)) {
        // replace 'localhost:3000' or 'kendrickzou.com' with 'api.kendrickzou.com'
        const apiUrl = url.href.replace(url.host, 'api.kendrickzou.com')
        return fetch(new Request(apiUrl), { mode: 'no-cors' })
    }
    url = new URL(fullpath(req.url))
    if (url.pathname.indexOf('.html.json') !== -1) {
        url.pathname = url.pathname.replace('.html', '')
    }
    let urls
    if (url.pathname.match(/\/kendrickzou-portfolio-img/g)) {
        urls = cdnList.map(cdn => url.href.replace(DEFAULT_IMG_CDN, cdn))
    } else {
        const version = await db.read(VERSION_STORAGE_KEY) || DEFAULT_VERSION
        urls = cdnList.map(cdn => `${cdn}/${PORTFOLIO_PACKAGE_NAME}@${version}${url.pathname}`)
    }
    const resp = await caches.match(req)
    if (!!resp) {
        cons.i(`Cache hitted: ${req.url}`)
        return resp;
    }
    cons.w(`Cache missed: ${req.url}`)
    return fetchParallellyAndCache(urls, req)
}

const fetchParallelly = async (urls, req) => {
    cons.i(`Fetch parallelly: ${urls[0]}......`)
    let controller = new AbortController(); //针对此次请求新建一个AbortController,用于打断并发的其余请求
    const PauseProgress = async (res) => {
        // 这个函数的作用时阻塞响应,直到主体被完整下载,避免被提前打断
        return new Response(await res.blob(), { status: res.status, headers: res.headers });
    };

    // 并发请求
    return Promise.any(urls.map(url => {
        return new Promise((resolve, reject) => {
            fetch(url, {
                signal: controller.signal//设置打断点
            })
                .then(PauseProgress)//阻塞当前响应直到下载完成
                .then(res => {
                    if (res.status == 200) {
                        // 打断其余响应(同时也打断了自己的,但本身自己已下载完成,打断无效)
                        controller.abort()
                        resolve(res)
                    } else {
                        reject(res)
                    }
                })
                .catch(err => { })
        })
    }))
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
                cons.s(`Update blog version to remote version: ${remoteVersion}`);
                await db.write(VERSION_STORAGE_KEY, remoteVersion)
                window.location.reload()
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