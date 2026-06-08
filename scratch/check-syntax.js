const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('c:/Users/dimas/Documents/kampus/sems-6/SIM/web/views/pages/detail.html', 'utf8');

// Extract all contents inside <script> tags (excluding external sources)
const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;

while ((match = regex.exec(html)) !== null) {
    const js = match[1].trim();
    if (js.length === 0) continue;
    count++;
    console.log(`Checking script block #${count}...`);
    try {
        new vm.Script(js);
        console.log(`Script block #${count} is syntactically correct!`);
    } catch (err) {
        console.error(`Syntax error in script block #${count}:`, err.message);
        // Find line number in original file
        const upToMatch = html.substring(0, match.index + match[0].indexOf(match[1]));
        const lineOffset = upToMatch.split('\n').length;
        console.error(`Error started around line ${lineOffset} in detail.html`);
    }
}
