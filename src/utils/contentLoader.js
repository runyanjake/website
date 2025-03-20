import matter from 'front-matter';
import { useEffect, useState } from 'react';


/*
 * Processes Markdown content in a given directory.
 * Searches the directory for index.json, which contains a map of the "active" posts:
 *   {
 *     "files": [
 *       "jake.md",
 *       "pws.md",
 *       "jakeswestcoast.md"
 *     ]
 *   }
 * It then parses the "front matter" from each file which contains attributes used for generating urls/page rendering.
 * Returns a list of post objects, which contain metadata as well as location of markdown file to be rendered.
 */
export function loadContentFromDirectory(contentDirectory) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        setError(null);


        const indexPath = `${contentDirectory}/index.json`;

        const indexResponse = await fetch(indexPath);
        if (!indexResponse.ok) {
          throw new Error('Failed to load content index');
        }
        const { files } = await indexResponse.json();

        const loadedPosts = await Promise.all(
          files.map(async (filename) => {
            const filePath = `${contentDirectory}/posts/${filename}`;
            return await parseFrontMatter(filePath);
          })
        );

        setPosts(loadedPosts);
      } catch (err) {
        setError(err);
        console.error('Error loading content:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, [contentDirectory]);

  return { posts, isLoading, error };
}

/*
 * Given a file path, reads the front matter from the file.
 * Returns a dict of attributes that were specified in the front matter.
 * File Path and slug (created from the file name) are included in this dict by default.
 */
export async function parseFrontMatter(filePath) {
  try {
    const response = await fetch(filePath, {
      headers: {
        'Accept': 'text/markdown,text/plain'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch:', filePath, 'Status:', response.status);
      throw new Error(`Failed to load markdown file ${filePath}: ${response.statusText}`);
    }

    const text = await response.text();
    const { attributes } = matter(text); //Throw away body for now.
    const filename = filePath.split('/').pop().replace('.md', '');

    // Create slug
    let slug;
    if (filename.match(/^\d{4}-\d{2}-\d{2}-/)) {
      slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    } else {
      slug = attributes.title
        ? attributes.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : filename;
    }

    // This usually becomes relevant debugging a new section.
    //console.log('Metadata from Markdown File:', 'slug', slug, 'filename', filename, 'attributes', attributes);

    return {
      ...attributes,
      path: filePath,
      slug: slug
    };
  } catch (error) {
    console.error('Error loading markdown file:', error);
    throw error;
  }
}
