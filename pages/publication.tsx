import type { GetStaticProps, NextPage } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faEnvelope, faGraduationCap, faHome } from '@fortawesome/free-solid-svg-icons'

import Head from 'next/head'

import HoverCard from '../components/HoverCard'
import getPublications from '../lib/scholar'
import { H1, Heading } from '../components/Header'
import { HrStyle } from '../components/Border'
import { AmberText, SecondaryText } from '../styles/global'
import tw from 'twin.macro'
import { publications } from '../config/publication'

const CCF = ({ rank, children }: { rank?: 'C' | 'B' | 'A' | 'S' | 'Q1' | 'Q2' | 'Q3' | undefined | null, children: React.ReactNode }) => {
    let color = '';
    switch (rank) {
        case 'C':
        case 'Q3':
            color = 'bg-green-600/10 text-green-600 hover:bg-green-600/20';
            break;
        case 'B':
        case 'Q2':
            color = 'bg-blue-600/10 text-blue-600 hover:bg-blue-600/20';
            break;
        case 'A':
        case 'Q1':
            color = 'bg-purple-600/10 text-purple-600 hover:bg-purple-600/20';
            break;
        case 'S':
            color = 'bg-orange-600/10 text-orange-600 hover:bg-orange-600/20';
            break;
        default:
            color = 'bg-gray-600/10 text-gray-600 hover:bg-gray-600/20';
            break;
    }
    return (
        <span className={"p-1 rounded font-bold transition-all duration-150 " + color}>
            {children}
        </span>
    )
}

const PublicationItem = ({ year, title, authors, source, href, rank }: { year: number, title: string, authors: string, source: string, href: string, rank?: 'C' | 'B' | 'A' | 'S' | 'Q1' | 'Q2' | 'Q3' | undefined | null }) => {
    return (
        <div className="grid grid-cols-10 sm:grid-cols-12 pt-4">
            <div className="col-span-2 text-gray-500/90 dark:text-gray-400/90">
                {year}
            </div>
            <div className="col-span-10">
                <div className='secondary-text opacity-80'>
                    {authors.split(',').map((author, index) => (
                        <span key={index} className={author.trim() === 'D Zou' ? 'opacity-100 font-bold' : ''}>
                            {author.trim() === 'J Tao' ? author + ' ' : author}
                            {author.trim() === 'J Tao' ? <FontAwesomeIcon icon={faCircleInfo} style={{ width: '1em', height: '1em', fontSize: '1em', verticalAlign: 'middle' }} className="inline-block ml-1" /> : ''}
                            {index === authors.split(',').length - 1 ? '' : ', '}
                        </span>
                    ))
                    }
                </div>
                <div className='heading-text font-bold text-lg'>
                    <a href={href} target='_blank' rel="noreferrer">
                        {title}
                    </a>
                </div>
                <div className='leading-8'>
                    <CCF rank={rank}>{source}</CCF>
                </div>
            </div>
        </div>
    )
}

const Publication: NextPage<{
    data: {
        title: string
        authors: string
        publication?: string
        year: string
        link: string
        cited_by: { value?: number }
    }[]
}> = ({ data }) => {
    return (
        <>
            <Head>
                <title>KendrickZou - Publication</title>
            </Head>

            <div className="container mx-auto max-w-4xl px-6">
                <H1 css={HrStyle}>Publication</H1>

                {
                    publications.map((item, index) => (
                        <PublicationItem key={index} year={item.year} title={item.title} authors={item.authors} source={item.source} href={item.href} rank={item.rank} />
                    ))
                }

                {/* <PublicationItem year={2025} title='Semantics-aware Location Privacy Preserving: A Differential Privacy Approach' authors='D Zou, J Tao, Z Wang' source='Computers & Security' href='https://www.sciencedirect.com/science/article/pii/S0167404825000914' rank='B' />

                <PublicationItem year={2024} title='An Accurate and Lightweight Intrusion Detection Model Deployed on Edge Network Devices' authors='Y Ao, J Tao, D Zou, W Sun, L Yu' source='2024 International Joint Conference on Neural Networks (IJCNN)' href='https://ieeexplore.ieee.org/document/10651457' rank='C' />

                <PublicationItem year={2024} title='A Preference-Driven Malicious Platform Detection Mechanism for Users in Mobile Crowdsensing' authors='H Wang, J Tao, D Chi, Y Gao, D Zou, Y Xu' source='IEEE Transactions on Information Forensics & Security' href='https://dl.acm.org/doi/10.1109/TIFS.2024.3352412' rank='A' />

                <PublicationItem year={2023} title='IMRSG: Incentive Mechanism Based on Rubinstein-Starr Game for Mobile CrowdSensing' authors='H Wang, J Tao, D Chi, Y Gao, Z Wang, D Zou, Y Xu' source='IEEE Transactions on Vehicular Technology' href='https://ieeexplore.ieee.org/abstract/document/10261277' rank='Q1' />

                <PublicationItem year={2023} title='Benefit-Oriented Task Offloading in UAV-Aided Mobile Edge Computing: An Approximate Solution' authors='Y Gao, J Tao, H Wang, Z Wang, D Zou, Y Xu' source='Peer-to-Peer Networking and Applications' href='https://link.springer.com/article/10.1007/s12083-023-01499-5' rank='C' />

                <PublicationItem year={2023} title='Privacy-Preserving Data Aggregation in IoTs: A Randomize-then-Shuffle Paradigm' authors='Z Wang, J Tao, D Zou' source='IEEE 97th Vehicular Technology Conference (VTC2023-Spring)' href='https://dl.acm.org/doi/10.1145/3579093' rank='A' />

                <PublicationItem year={2023} title='Towards the Minimal Wait-for Delay for Rechargeable WSNs with Multiple Mobile Chargers' authors='Z Wang, J Tao, Y Xu, Y Gao, D Zou' source='ACM Transactions on Sensor Networks' href='https://dl.acm.org/doi/10.1145/3579093' rank='B' /> */}

                {/* {data.map((item, index) => (
                    <div key={index} className="grid grid-cols-10 sm:grid-cols-12 pb-10 pt-6">
                        <div className="col-span-2 mb-4 text-gray-500/90 dark:text-gray-400/90">
                            {item.year}
                        </div>
                        <div className="col-span-10">
                            <div css={SecondaryText}>
                                {item.authors.split(', ').map((author, index) => (
                                    <span key={index}>
                                        {author.toLowerCase() === 'd zou' ? (
                                            <span className="opacity-100 font-bold">{author}</span>
                                        ) : (
                                            <span className="opacity-80">{author}</span>
                                        )}

                                        {index !== item.authors.split(', ').length - 1 && (
                                            <span>, </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                            <Heading>
                                <a href={`/`}>{item.title}</a>
                            </Heading>
                            <div css={[AmberText, tw`font-semibold`]}>
                                {item.publication ?? '-'}
                            </div>
                        </div>
                    </div>
                ))} */}

                {/* <div className="secondary-text text-center font-mono text-xs mt-8">
                    Updates every 24 hrs, sourced from{' '}
                    <a
                        href="https://scholar.google.com/citations?user=zILf1s4AAAAJ&hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-links"
                    >
                        Google Scholar
                    </a> through {' '}
                    <a
                        href='serpapi.com' target="_blank"
                        rel="noopener noreferrer"
                        className="hover-links">
                        serpapi.com
                    </a> API.
                </div> */}
            </div>

            <div className="flex-1" />
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const data = await getPublications()
    return {
        props: { data },
        revalidate: 86400, // 24 hrs
    }
}

export default Publication
