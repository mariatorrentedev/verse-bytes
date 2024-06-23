import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getAllPosts } from "../utils/mdx.server";

type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

type LoaderData = {
  posts: Post[];
};

export const loader: LoaderFunction = async () => {
  const posts = getAllPosts();
  return { posts };
};

export default function BlogIndex() {
  const { posts } = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto px-4 py-8 text-white max-w-md md:max-w-2xl lg:max-w-4xl">
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="border-b pb-4 mb-4">
            <Link
              to={`/blog/${post.slug}`}
              className="block bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition"
            >
              <p className="text-2xl font-semibold mb-2 text-white">
                {post.title}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
