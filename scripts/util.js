const SentryCli = require('@sentry/cli')
const simpleGit = require('simple-git')
const { exec } = require('child_process')

require('dotenv').config()

if (!process.env.SENTRY_AUTH_TOKEN) {
	console.log(
		'Environment variable not found. Add SENTRY_AUTH_TOKEN to `.env.local`'
	)
	console.log(
		'Go to https://sentry.io/settings/account/api/auth-tokens/ to create an auth token.'
	)
	process.exit(1)
}

const cli = new SentryCli({
	org: 'irj',
	project: 'chordboard',
	authToken: process.env.SENTRY_AUTH_TOKEN,
})
const git = simpleGit()

const bumpVersion = (versionScope = 'patch') =>
	new Promise((resolve, reject) => {
		const bump = exec(
			`yarn version --${versionScope}`,
			(err, stdout, stderr) => {
				if (err) return reject(err)
				resolve(stdout)
			}
		)
		bump.stdout.pipe(process.stdout)
	})

const buildAndDeploy = env =>
	new Promise((resolve, reject) => {
		const deploy = exec(`yarn deploy:${env}`, (err, stdout, stderr) => {
			if (err) return reject(err)
			resolve(stdout)
		})
		deploy.stdout.pipe(process.stdout)
	})

const createSentryRelease = async (env, version, totalTime) => {
	const sourceMapsPath = './build/static/js/'

	// Create a release
	console.log(`Creating release: ${version}...`)
	await cli.releases.new(version)

	// Associate commits with the release
	console.log('Adding commits to release...')
	await cli.releases.setCommits(version, { auto: true })

	// Upload source maps
	console.log(`Uploading sourcemaps from ${sourceMapsPath}...`)
	await cli.releases.uploadSourceMaps(version, {
		include: [sourceMapsPath],
		rewrite: false,
		urlPrefix: '~/static/js',
	})

	// Finalize the release after the deploy is done
	console.log('Finalizing release...')
	await cli.releases.finalize(version)

	// Tell sentry about the new deploy
	console.log('Creating new deploy entry on sentry...')
	await cli.releases.newDeploy(version, {
		env,
		time: totalTime,
	})
}

const doGitMergeIntoMaster = async (mainBranch, devBranch) => {
	const status = await git.status()

	console.log('Merging git changes into master...')

	// Make sure staging history is clean.
	if (status.modified.length > 0) {
		console.log('Please commit your changes before continuing')
		return process.exit(1)
	}

	// Checkout dev, if current branch isn't develop or master, ask if should
	// merge into develop.
	if (status.current !== devBranch && status.current !== mainBranch) {
		console.log(
			`do you want to merge branch ${status.current} into ${devBranch}?`
		)
		// TODO: prompt and merge
	}
	await git.checkout(devBranch)

	// Pull changes into develop.
	await git.pull()

	// Checkout master and pull changes into master.
	await git.checkout(mainBranch)
	await git.pull()

	// Merge develop into master.
	await git.merge({ [devBranch]: true })
}

const pushMainToOrigin = async (mainBranch, devBranch) => {
	await git.push()
	await git.checkout(devBranch)
	await git.merge({ [mainBranch]: true })
	await git.push()
}

module.exports = {
	bumpVersion,
	buildAndDeploy,
	createSentryRelease,
	doGitMergeIntoMaster,
	pushMainToOrigin,
}
