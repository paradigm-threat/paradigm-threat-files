const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function generateChangelog() {
    try {
        const logData = execSync('git log -n 5 --pretty=format:"%H|%at|%s"').toString();
        const entries = logData.split('\n').map(line => {
            const [hash, timestamp, message] = line.split('|');
            return {
                hash,
                date: new Date(timestamp * 1000).toISOString(),
                message
            };
        });

        const outputPath = path.resolve(__dirname, '../changelog.json');
        fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
        console.log('Successfully generated changelog.json');
    } catch (error) {
        console.error('Error generating changelog:', error.message);
    }
}

generateChangelog();
