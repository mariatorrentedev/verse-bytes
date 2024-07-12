import type { MdxListItem, MdxPage } from "types/common";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import readingTime from "reading-time";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function getMdxPage(slug: string): Promise<MdxPage> {
  const filePath = path.join(process.cwd(), "content", "blog", `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");

  const { code, frontmatter } = await bundleMDX({
    source,
    cwd: path.join(process.cwd(), "content", "blog"),
  });

  const readTime = readingTime(source);

  // Format the date in frontmatter
  if (frontmatter.date) {
    frontmatter.date = formatDate(frontmatter.date);
  }

  return {
    code,
    slug,
    frontmatter,
    readTime,
  };
}

export function getAllPosts(): MdxListItem[] {
  const blogDir = path.join(process.cwd(), "content", "blog");
  const filenames = fs.readdirSync(blogDir);

  const posts = filenames.map((filename) => {
    const filePath = path.join(blogDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const readTime = readingTime(fileContents);
    const { data } = matter(fileContents);

    // Format the date
    if (data.date) {
      data.date = formatDate(data.date);
    }

    return {
      slug: filename.replace(/\.mdx$/, ""),
      readTime,
      ...data,
    };
  });

  return posts;
}
