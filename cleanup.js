const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      try {
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
          results = results.concat(walk(file));
        } else {
          results.push(file);
        }
      } catch(e) {}
    });
  } catch(e) {}
  return results;
}

const files = walk('./src').filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // If file uses createAdminClient but NOT createClient(cookieStore),
  // and has unused cookies import without reading cookies
  if (
    content.includes('createAdminClient') &&
    !content.includes('createClient(cookieStore)') &&
    content.includes("import { cookies } from 'next/headers'") &&
    !content.includes('cookieStore.get(')
  ) {
    content = content.replace("import { cookies } from 'next/headers'\n", '');
    content = content.replace(/  const cookieStore = await cookies\(\)\n/g, '');
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Cleaned:', file);
  }
});

console.log('Done!');
