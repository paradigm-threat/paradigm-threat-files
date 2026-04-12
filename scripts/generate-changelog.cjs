/**
 * Builds changelog.json from `git log` (paths-first; no commit hash in output).
 * Optional: PARADIGM_CHANGELOG_STAGED_TOP=1 prepends one row from `git diff --cached`
 * so pre-commit can list paths before the commit object exists.
 */
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

function parseNameStatusOutput(output, hrefForPath) {
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
            href: hrefForPath(filePath)
        })
    }
    return changes
}

function parseChangedFiles(hash) {
    const output = run(`git show --pretty="" --name-status --find-renames ${hash}`)
    return parseNameStatusOutput(output, toArticleHref)
}

function maybeStagedTopEntry() {
    if (process.env.PARADIGM_CHANGELOG_STAGED_TOP !== '1') return null
    try {
        const output = run('git diff --cached --name-status --find-renames')
        const files = parseNameStatusOutput(output, toArticleHref)
        if (files.length === 0) return null
        return {
            repo: 'paradigm-threat-files',
            date: new Date().toISOString(),
            message: '(staged)',
            files
        }
    } catch {
        return null
    }
}

function generateChangelog() {
    try {
        const stagedTop = maybeStagedTopEntry()
        const logData = run(`git log -n ${CHANGE_LIMIT} --pretty=format:"%H|%at|%s"`)
        const fromLog = logData
            .split('\n')
            .filter(Boolean)
            .map((line) => {
                const [hash, timestamp, ...msgParts] = line.split('|')
                return {
                    repo: 'paradigm-threat-files',
                    date: new Date(Number(timestamp) * 1000).toISOString(),
                    message: msgParts.join('|'),
                    files: parseChangedFiles(hash)
                }
            })

        let entries = fromLog
        if (stagedTop) {
            entries = [stagedTop, ...fromLog].slice(0, CHANGE_LIMIT)
        }

        const outputPath = path.resolve(__dirname, '../changelog.json')
        fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2) + '\n')
        console.log('Successfully generated changelog.json')
    } catch (error) {
        console.error('Error generating changelog:', error.message)
        process.exitCode = 1
    }
}

generateChangelog()
