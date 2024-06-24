import type { LoaderFunction } from "@remix-run/node";
import type { MdxPage } from "types/common";
import * as React from "react";
import { useLoaderData, Link } from "@remix-run/react";
import { getMdxPage } from "../utils/mdx.server";
import { getMDXComponent } from "mdx-bundler/client";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  if (!slug) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const mdxPage = await getMdxPage(slug);
  return mdxPage;
};

export default function BlogPost() {
  const { frontmatter, code } = useLoaderData<MdxPage>();

  //Memoize it to avoid re-creating on every render.
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  return (
    <div className="container mx-auto px-4 py-8 text-white max-w-md md:max-w-2xl lg:max-w-4xl">
      <Link
        to="/blog"
        className="inline-flex items-center text-gray-300 hover:underline mb-4"
      >
        <ArrowLeftCircleIcon className="h-5 w-5 mr-2" />
        Back to Overview
      </Link>
      <h1 className="text-5xl font-bold mb-6">{frontmatter.title}</h1>
      <article className="prose prose-lg">
        <Component />
      </article>
    </div>
  );
}
