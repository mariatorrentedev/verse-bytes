import type { MDXContentProps } from "mdx-bundler/client";
import type { MdxListItem, MdxPage } from "types/common";
import { Link } from "@remix-run/react";
import CloudinaryImage from "./cloudinary-image";

export function PostCard({ post }: { post: MdxListItem }) {
  return (
    <li key={post.slug} className="border-b pb-4 mb-4">
      <Link
        to={`/blog/${post.slug}`}
        className="block bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition"
      >
        <p className="text-2xl font-semibold mb-2 text-white">{post.title}</p>
        <p className="text-m text-gray-400">
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
      <h1 className="text-4xl font-bold mb-2">{page.frontmatter.title}</h1>
      <p className="text-lg text-gray-400">
        {page.frontmatter.date} - {page.readTime?.text}
      </p>
      {page.frontmatter.cloudinaryImageId && (
        <CloudinaryImage
          publicId={page.frontmatter.cloudinaryImageId}
          alt={page.frontmatter.cloudinaryImageId}
        />
      )}
      <article className="prose prose-lg mt-4 text-lg">
        <Component />
      </article>
    </div>
  );
}
