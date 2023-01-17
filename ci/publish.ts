import { promisify } from "util";
import { publish, publishImage } from "../pages/api/cdn";

const exec = promisify(require('child_process').exec);
const NEXT_STATIC_PATH = process.env.NEXT_STATIC_PATH || '/Users/zoudikai/Workspace/portfolio/out';
const PORTFOLIO_BOOT_PATH = process.env.PORTFOLIO_BOOT_PATH || '/Users/zoudikai/Workspace/portfolio-boot';

(async () => {
    const img= await publishImage();
    const p = await publish('kendrickzou-portfolio', NEXT_STATIC_PATH);
    await exec(`cp -r ${NEXT_STATIC_PATH}/* ${PORTFOLIO_BOOT_PATH}`);
    await exec(`git add . && git commit -m ${p.version}:${img.version} && git push origin main`, { cwd: PORTFOLIO_BOOT_PATH });
 })();

const noop = () => { }

export default noop