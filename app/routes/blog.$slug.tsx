import type { LoaderFunction } from "@remix-run/node";
import type { MdxPage } from "types/common";
import * as React from "react";
import * as Blog from "../components/blog";
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
  const page = useLoaderData<MdxPage>();

  //Memoize it to avoid re-creating on every render.
  const Component = React.useMemo(
    () => getMDXComponent(page.code),
    [page.code]
  );

  return (
    <div className="container-md">
      <Link to="/blog" className="text-lg inline-flex items-center mb-4">
        <ArrowLeftCircleIcon className="h-10 w-10 mr-2 hover:dark:text-accent-dark" />
        Back to Overview
      </Link>
      <Blog.Post page={page} Component={Component} />
    </div>
  );
}
