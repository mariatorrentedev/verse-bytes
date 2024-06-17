import * as React from "react";
import { bundleMDX } from "mdx-bundler";

export async function getMDXComponent(mdxContent: string) {
  const { code } = await bundleMDX({ source: mdxContent });
  return new Function("React", `return ${code}`)(React);
}
