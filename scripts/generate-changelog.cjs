const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const CHANGE_LIMIT = 20
const IGNORE_PATHS = new Set(['changelog.json', 'index.json'])

function run(cmd) {
    return execSync(cmd, { encoding: 'utf8' }).trim()
}

function toArticleHref(filePath) {
    const clean = filePath.replace(/\\/g, '/').replace(/^\.\//, '')
    if (/\/page\.mdx?$/i.test(clean)) {
        const dir = clean.replace(/\/page\.mdx?$/i, '')
        return dir ? `/${dir}` : '/'
    }
    if (/\.mdx?$/i.test(clean)) {
        return `/${clean.replace(/\.mdx?$/i, '')}`
    }
    return `/${clean}`
}

function parseChangedFiles(hash) {
    const output = run(`git show --pretty="" --name-status --find-renames ${hash}`)
    if (!output) return []

    const changes = []
    for (const rawLine of output.split('\n')) {
        const line = rawLine.trim()
        if (!line) continue

        const cols = line.split(/\t+/)
        const status = cols[0] || ''
        const code = status[0]
        if (!['A', 'M', 'R'].includes(code)) continue

        const filePath = code === 'R' ? cols[2] : cols[1]
        if (!filePath) continue

        if (IGNORE_PATHS.has(filePath)) continue

        changes.push({
            status: code,
            path: filePath,
            href: toArticleHref(filePath)
        })
    }
    return changes
}

function generateChangelog() {
    try {
        const logData = run(`git log -n ${CHANGE_LIMIT} --pretty=format:"%H|%at|%s"`)
        const entries = logData
            .split('\n')
            .filter(Boolean)
            .map((line) => {
                const [hash, timestamp, ...msgParts] = line.split('|')
                return {
                    repo: 'paradigm-threat-files',
                    hash,
                    date: new Date(Number(timestamp) * 1000).toISOString(),
                    message: msgParts.join('|'),
                    files: parseChangedFiles(hash)
                }
            })

        const outputPath = path.resolve(__dirname, '../changelog.json')
        fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2) + '\n')
        console.log('Successfully generated changelog.json')
    } catch (error) {
        console.error('Error generating changelog:', error.message)
        process.exitCode = 1
    }
}

generateChangelog()
