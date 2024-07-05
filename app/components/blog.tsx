import type { MDXContentProps } from "mdx-bundler/client";
import type { MdxListItem, MdxPage } from "types/common";
import { Link } from "@remix-run/react";
import { CloudinaryImage } from "./";

export function PostCard({ post }: { post: MdxListItem }) {
  return (
    <li
      key={post.slug}
      className="border-b border-text-light dark:border-text-dark pb-4 mb-4"
    >
      <Link to={`/blog/${post.slug}`} className="blog-link">
        <p className="text-2xl font-semibold mb-2">{post.title}</p>
        <p className="text-m">
          {post.date} - {post.readTime?.text}
        </p>
      </Link>
    </li>
  );
}

export function Post({
  page,
  Component,
}: {
  page: MdxPage;
  Component: React.FunctionComponent<MDXContentProps>;
}) {
  return (
    <div className="space-y-4">
      <h1>{page.frontmatter.title}</h1>
      <p className="text-l">
        {page.frontmatter.date} - {page.readTime?.text}
      </p>
      {page.frontmatter.cloudinaryImageId && (
        <CloudinaryImage
          publicId={page.frontmatter.cloudinaryImageId}
          alt={page.frontmatter.cloudinaryImageId}
          className="rounded-lg shadow-lg"
        />
      )}
      <article>
        <Component />
      </article>
    </div>
  );
}
