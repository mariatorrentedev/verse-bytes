import type { LoaderFunction } from "@remix-run/node";
import type { MdxListItem } from "types/common";
import { useLoaderData } from "@remix-run/react";
import { getAllPosts } from "../utils/mdx.server";
import * as Blog from "../components/blog";

type LoaderData = {
  posts: MdxListItem[];
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
          <div key={post.slug}>
            <Blog.PostCard post={post} />
          </div>
        ))}
      </ul>
    </div>
  );
}
