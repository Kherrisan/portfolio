import { promisify } from 'util'

import { publish, publishImage } from '../pages/api/cdn'

const exec = promisify(require('child_process').exec)
const NEXT_STATIC_PATH = process.env.NEXT_STATIC_PATH || './out/'
const PORTFOLIO_BOOT_PATH =
  process.env.PORTFOLIO_BOOT_PATH || './portfolio-boot/'

;(async () => {
  const img = await publishImage()
  const p = await publish('kendrickzou-portfolio', NEXT_STATIC_PATH)
  await exec(
    `rsync -azvP --exclude=/.git --delete ${NEXT_STATIC_PATH} ${PORTFOLIO_BOOT_PATH}`
  )
  console.log(`Synced ${NEXT_STATIC_PATH} to ${PORTFOLIO_BOOT_PATH}`)
  // await exec(`cp -r ${NEXT_STATIC_PATH}/* ${PORTFOLIO_BOOT_PATH}`);
  await exec(
    `git add . && git commit -m ${p.version}:${img.version} && GIT_SSH_COMMAND='ssh -i ../github-codespaces-key' git push origin main`,
    { cwd: PORTFOLIO_BOOT_PATH }
  )
  console.log(
    `Pushed ${p.version}:${img.version} to remote git repository: portfolio-boot`
  )
})()

const noop = () => {}

export default noop
