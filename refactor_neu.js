const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client', 'src');

function findAndReplace(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            findAndReplace(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const originalContent = content;

            // Regex to remove neumorphic:<anything> safely
            content = content.replace(/neumorphic:[\w-]+\s?/g, '');
            // NOT stripping generic spaces \s{2,} to avoid corrupting lines!
            
            // Just clean up specific empty quotes combinations safely
            content = content.replace(/className="\s+"/g, 'className=""');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

findAndReplace(directoryPath);
console.log('Done refactoring neumorphic classes safely.');
