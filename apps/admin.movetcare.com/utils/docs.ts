import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const docsDirectory = join(process.cwd(), '_docs');

export function getDocSlugs() {
  return fs.readdirSync(docsDirectory);
}

export function getDocBySlug(slug: string, fields: Array<any> = []) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(docsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items: any = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach(field => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllDocs(fields: any = []) {
  const slugs = getDocSlugs();
  const docs = slugs
    .map(slug => getDocBySlug(slug, fields))
    // sort docs by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return docs;
}
