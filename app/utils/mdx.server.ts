import type { MdxPage } from "types/common";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";

export async function getMdxPage(slug: string): Promise<MdxPage> {
  const filePath = path.join(process.cwd(), "content", "blog", `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");

  const { code, frontmatter } = await bundleMDX({
    source,
    cwd: path.join(process.cwd(), "content", "blog"),
  });

  return {
    code,
    slug,
    frontmatter,
  };
}

export function getAllPosts() {
  const blogDir = path.join(process.cwd(), "content", "blog");
  const filenames = fs.readdirSync(blogDir);

  const posts = filenames.map((filename) => {
    const filePath = path.join(blogDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(/\.mdx$/, ""),
      ...data,
    };
  });

  return posts;
}
