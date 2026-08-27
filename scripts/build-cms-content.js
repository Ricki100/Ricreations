const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const readCollection = (folder) => {
  const directory = path.join(root, 'content', folder);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter((name) => name.endsWith('.json')).map((name) => {
    const item = readJson(path.join(directory, name));
    return { ...item, slug: item.slug || path.basename(name, '.json'), body_html: item.body || '', cover_url: item.cover_image || '', type: folder === 'blog' ? 'blog' : 'project' };
  });
};
const sortContent = (a, b) => Number(b.featured) - Number(a.featured) || Number(a.sort_order || 100) - Number(b.sort_order || 100) || new Date(b.published_at || 0) - new Date(a.published_at || 0);
const brandingFile = path.join(root, 'content', 'settings', 'blog-branding.json');
const output = { generated_at: new Date().toISOString(), posts: readCollection('blog').sort(sortContent), projects: readCollection('projects').sort(sortContent), branding: fs.existsSync(brandingFile) ? readJson(brandingFile) : {} };
const outputDirectory = path.join(root, 'assets', 'data');
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, 'cms-content.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Built ${output.posts.length} blog post(s) and ${output.projects.length} project(s).`);
