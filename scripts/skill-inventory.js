import fs from 'node:fs';
import path from 'node:path';

const skillsDir = path.resolve('skills');
const skillDirs = fs.readdirSync(skillsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

console.log(`Found ${skillDirs.length} skills in ${skillsDir}`);

const skillInventory = skillDirs.map(name => {
  const skillFile = path.join(skillsDir, name, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    return { name, error: 'NO_SKILL_MD' };
  }
  const content = fs.readFileSync(skillFile, 'utf-8');
  const lines = content.split('\n');
  const hasFrontmatter = content.startsWith('---');
  let description = '';
  if (hasFrontmatter) {
    const endFm = content.indexOf('---', 3);
    const fmText = content.slice(3, endFm);
    const match = fmText.match(/description:\s*(.+)/);
    if (match) description = match[1].trim();
  }
  return {
    name,
    lines: lines.length,
    hasFrontmatter,
    description
  };
});

console.log(JSON.stringify(skillInventory, null, 2));
