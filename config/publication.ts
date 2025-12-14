export interface PublicationProps {
    year: number
    title: string
    authors: string
    source: string
    href: string
    rank?: 'C' | 'B' | 'A' | 'S' | 'Q1' | 'Q2' | 'Q3' | undefined | null
}

export const publications: PublicationProps[] = [
    {
        year: 2025,
        title: 'Semantics-aware Location Privacy Preserving: A Differential Privacy Approach',
        authors: 'D Zou, J Tao, Z Wang',
        source: 'Computers & Security',
        href: 'https://www.sciencedirect.com/science/article/pii/S0167404825000914',
        rank: 'B'
    },
    {
        year: 2024,
        title: 'An Accurate and Lightweight Intrusion Detection Model Deployed on Edge Network Devices',
        authors: 'Y Ao, J Tao, D Zou, W Sun, L Yu',
        source: '2024 International Joint Conference on Neural Networks (IJCNN)',
        href: 'https://ieeexplore.ieee.org/document/10651457',
        rank: 'C'
    },
    {
        year: 2024,
        title: 'A Preference-Driven Malicious Platform Detection Mechanism for Users in Mobile Crowdsensing',
        authors: 'H Wang, J Tao, D Chi, Y Gao, D Zou, Y Xu',
        source: 'IEEE Transactions on Information Forensics & Security',
        href: 'https://dl.acm.org/doi/10.1109/TIFS.2024.3352412',
        rank: 'A'
    },
    {
        year: 2023,
        title: 'IMRSG: Incentive Mechanism Based on Rubinstein-Starr Game for Mobile CrowdSensing',
        authors: 'H Wang, J Tao, D Chi, Y Gao, Z Wang, D Zou, Y Xu',
        source: 'IEEE Transactions on Vehicular Technology',
        href: 'https://ieeexplore.ieee.org/abstract/document/10261277',
        rank: 'Q1'
    },
    {
        year: 2023,
        title: 'Benefit-Oriented Task Offloading in UAV-Aided Mobile Edge Computing: An Approximate Solution',
        authors: 'Y Gao, J Tao, H Wang, Z Wang, D Zou, Y Xu',
        source: 'Peer-to-Peer Networking and Applications',
        href: 'https://link.springer.com/article/10.1007/s12083-023-01499-5',
        rank: 'C'
    },
    {
        year: 2023,
        title: 'Privacy-Preserving Data Aggregation in IoTs: A Randomize-then-Shuffle Paradigm',
        authors: 'Z Wang, J Tao, D Zou',
        source: 'IEEE 97th Vehicular Technology Conference (VTC2023-Spring)',
        href: 'https://dl.acm.org/doi/10.1145/3579093',
    },
    {
        year: 2023,
        title: 'Towards the Minimal Wait-for Delay for Rechargeable WSNs with Multiple Mobile Chargers',
        authors: 'Z Wang, J Tao, Y Xu, Y Gao, D Zou',
        source: 'ACM Transactions on Sensor Networks',
        href: 'https://dl.acm.org/doi/10.1145/3579093',
        rank: 'B'
    }
]