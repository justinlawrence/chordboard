process.on('exit', code => {
	if (code === 0) {
		console.log('Done')
	} else {
		console.log('Exited')
	}
})

const semver = require('semver')
const {
	createSentryRelease,
	buildAndDeploy,
	bumpVersion,
	doGitMergeIntoMaster,
	pushMainToOrigin,
} = require('./util')
const pkg = require('../package.json')

const ENV = 'live'
const DEV_BRANCH = 'dev'
const MAIN_BRANCH = 'master'

;(async () => {
	const versionScope = process.argv[2]

	try {
		const startTime = new Date()
		await doGitMergeIntoMaster(MAIN_BRANCH, DEV_BRANCH)

		// Get next patch version
		// TODO: support minor and major versioning
		const version = semver.inc(pkg.version, 'patch')
		console.log(`Updating version to ${version}`)
		await bumpVersion(versionScope)

		// Push changes to remote repo and checkout dev branch
		console.log('Pushing changes to remote git repositories...')
		await pushMainToOrigin(MAIN_BRANCH, DEV_BRANCH)

		// Build project and deploy to S3
		console.log('Building and deploying project...')
		await buildAndDeploy(ENV)

		// Tell sentry about the new deploy
		const totalTime = new Date() - startTime
		await createSentryRelease(ENV, version, totalTime)
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
})()
