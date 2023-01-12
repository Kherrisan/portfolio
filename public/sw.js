
const CACHE_NAME = 'kendrickzou-portfolio-cache';
const DEFAULT_VERSION = '1.0.0'
const DOMAINS = ["kendrickzou.com", "localhost"]
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

self.addEventListener('fetch', async event => {
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
    const resp = await fetchParallelly(urls)
    const cache = await caches.open(CACHE_NAME)
    cache.put(req, resp.clone())
    return resp
}

const handle = async function (req) {
    let url = new URL(req.url)
    if (!DOMAINS.includes(url.hostname)
        || url.pathname.match(/\/sw\.js/g)) {
        return fetch(req)
    }
    let urls
    if (url.pathname.match(/_next\/static/g)) {
        url.pathname = url.pathname.replace(/_next\/static\//, "")
        const version = await db.read(VERSION_STORAGE_KEY) || DEFAULT_VERSION
        urls = cdnList.map(cdn => `${cdn}/${PORTFOLIO_PACKAGE_NAME}@${version}${url.pathname}${url.searchParams}`)
    } else if (url.pathname.match(/_next\/image/g)) {
        const cdnUrl = decodeURIComponent(url.href.match(/url=(.+?)$/).at(1)).split('&')[0]
        const imgName = cdnUrl.match(/[\w-]+\.(jpg|png|jpeg|webp|heic|avif)/g)[0]
        const width = url.href.split(/[&=]/)[3]
        const transImgName = `${imgName.split('.')[0]}-${width}.${imgName.split('.')[1]}`
        urls = cdnList.map(cdn => cdnUrl.split('&')[0].replace(DEFAULT_IMG_CDN, cdn).replace(imgName, transImgName))
    } else {
        return fetch(req)
    }
    const resp = await caches.match(req)
    if (!!resp) {
        cons.i(`Cache hitted: ${req.url}`)
        return resp;
    }
    cons.w(`Cache missed: ${req.url}`)
    return fetchParallellyAndCache(urls, req)
}

const fetchParallelly = async (urls) => {
    cons.i(`Fetch parallelly: ${urls[0]}......`)
    let controller = new AbortController(); //针对此次请求新建一个AbortController,用于打断并发的其余请求
    const PauseProgress = async (res) => {
        //这个函数的作用时阻塞响应,直到主体被完整下载,避免被提前打断
        return new Response(await (res).arrayBuffer(), { status: res.status, headers: res.headers });
    };
    if (!Promise.any) { //Polyfill,避免Promise.any不存在,无需关注
        Promise.any = function (promises) {
            return new Promise((resolve, reject) => {
                promises = Array.isArray(promises) ? promises : []
                let len = promises.length
                let errs = []
                if (len === 0) return reject(new AggregateError('All promises were rejected'))
                promises.forEach((promise) => {
                    promise.then(value => {
                        resolve(value)
                    }, err => {
                        len--
                        errs.push(err)
                        if (len === 0) {
                            reject(new AggregateError(errs))
                        }
                    })
                })
            })
        }
    }
    //并发请求
    return Promise.any(urls.map(url => {
        return new Promise((resolve, reject) => {
            fetch(url, {
                signal: controller.signal//设置打断点
            })
                .then(PauseProgress)//阻塞当前响应直到下载完成
                .then(res => {
                    if (res.status == 200) {
                        controller.abort()//打断其余响应(同时也打断了自己的,但本身自己已下载完成,打断无效)
                        resolve(res)//返回
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
    cons.i(`Searching For The Newest Version...`)
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