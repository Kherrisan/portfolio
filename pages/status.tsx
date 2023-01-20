import { NextPage } from "next";
import Head from "next/head";
import { string } from "prop-types";
import React from "react";
import useSWR from "swr";
import { H1, H2, Heading, Hr } from "../components/Header";
import { Container } from "../components/Layout";
import { Link } from "../components/Link";

const capacityFormatter = (bytes: number) => {
    if (bytes < 1024) {
        return `${bytes} B`
    } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`
    } else if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    } else {
        return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
    }
}

const StatusCard = ({ title, status, children }: { title: string, status: Boolean, children: React.ReactNode | React.ReactNode[] }) => (
    <div className="border-b-4 h-44 relative bg-light-300 dark:bg-dark-700 rounded p-4 transition-all duration-150 hover:shadow-lg hover:opacity-80">
        <div className="font-bold my-2 text-xl text-gray-900/90 dark:text-light-100/90">
            {title}
        </div>
        <div className="my-2 text-gray-900/90 dark:text-light-100/90 primary-text font-mono text-xs">
            {children}
        </div>
        {status ?
            (<div className="absolute inset-x-4 bottom-2 text-xl text-amber-500 dark:text-amber-500/90 font-semibold">
                OK
            </div>) :
            (<div className="absolute inset-x-4 bottom-2 text-xl text-gray-500 dark:text-gray-400/90 font-semibold">
                FAILED
            </div>)}
    </div>
)

const ServiceWorkerStatusFetcher = async () => {
    const swReg = await navigator.serviceWorker.getRegistration();
    if (!swReg) {
        return {
            registration: undefined
        }
    }
    const cache = await caches.open('kendrickzou-portfolio-cache')
    const resp = await cache.match(new Request('https://kendrickzou.com/db/kendrickzou-portfolio-version'))
    // Get the size of CacheStorage
    const cacheStorage = await caches.open('kendrickzou-portfolio-cache')
    const totalSize = await cacheStorage.keys().then(reqs => {
        return Promise.all(
            reqs.map(req => cacheStorage.match(req).then(res => res?.clone().blob().then(b => b.size) ?? 0))
        ).then(a => a.reduce((acc, n) => acc + n, 0));
    });
    return {
        registration: swReg,
        'portfolio-version': await resp?.text(),
        size: totalSize
    }
}

const ServiceWorkerCard = () => {
    const { data } = useSWR('swReg', ServiceWorkerStatusFetcher)

    return (
        <StatusCard title="Service Worker" status={data?.registration !== undefined}>
            <div className="my-1">
                <span className="">Registration: </span>
                <span className="font-semibold">{data?.registration !== undefined ? 'OK' : 'FAILED'}</span>
            </div>
            <div className="my-1">
                <span className="">Version: </span>
                <span className="font-semibold">{data?.['portfolio-version'] ?? 'N/A'}</span>
            </div>
            <div className="my-1">
                <span className="">Cache Size: </span>
                <span className="font-semibold">{data?.size !== undefined ? capacityFormatter(data.size) : 'N/A'}</span>
            </div>
        </StatusCard >
    )
}

const PortfolioCDNStatusFetcher = async () => {
    let resp = await fetch(`https://registry.npmjs.org/kendrickzou-portfolio/latest`)
    const portfolioResp = await resp.json()
    resp = await fetch(`https://registry.npmjs.org/kendrickzou-portfolio-img/latest`)
    const imgResp = await resp.json()
    return {
        'portfolio-version': portfolioResp.version,
        'portfolio-img-version': imgResp.version
    }
}

const PortfolioCDNCard = () => {
    const { data } = useSWR('cdn', PortfolioCDNStatusFetcher)

    return (
        <StatusCard title="CDN" status={data?.["portfolio-version"]}>
            <div className="my-1">
                <span className="">Version: </span>
                <Link className="font-semibold underline" href="https://www.npmjs.com/package/kendrickzou-portfolio" target="_blank">{data?.["portfolio-version"] ?? ''}</Link>
            </div>
            <div className="my-1">
                <span className="">IMG-Version: </span>
                <Link className="font-semibold underline" href="https://www.npmjs.com/package/kendrickzou-portfolio-img" target="_blank">{data?.["portfolio-img-version"] ?? ''}</Link>
            </div>
        </StatusCard >
    )
}

const VERCEL_API_SET = {
    '/api/bookmark/[url]': 'https://api.kendrickzou.com/api/bookmark/https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV18K411o7k9%2F',
    '/api/search/[query]': 'https://api.kendrickzou.com/api/bookmark/https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1ZK411o7k9%2F',
}

const apiStatusFetcher = async () => Promise.all(Object.entries(VERCEL_API_SET).map(async ([key, url]) => fetch(url).then(resp => resp.status)))

const VercelAPICard = () => {
    const { data } = useSWR('/api', apiStatusFetcher)
    const status = data?.every(code => code === 200) ?? false

    return (
        <StatusCard title="API" status={status}>
            {Object.entries(VERCEL_API_SET).map(([key, url], index) => (
                <div key={index} className="my-1">
                    <span className="">{key}:{' '}</span>
                    <Link className="font-semibold underline" href={url} target='_blank'>{data?.[index]}</Link>
                </div>
            ))}
        </StatusCard>
    )
}

const ServiceStatus: NextPage = () => {

    return (
        <>
            <Head>
                <title>KendrickZou - ServiceStatus</title>
            </Head>
            <Container>
                <H1>ServiceStatus</H1>
                <Hr />

                <H2>Portfolio</H2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <ServiceWorkerCard />
                    <PortfolioCDNCard />
                    <VercelAPICard />
                </div>
                <div className="secondary-text text-xs mt-8 text-center font-mono">Status of ServiceWorker is accessed from the browser directly, and that of CDN and API is fetched from remote npm.js and Vercel respectively.</div>
            </Container>

            <div className="flex-1" />
        </>
    )
}

export default ServiceStatus;