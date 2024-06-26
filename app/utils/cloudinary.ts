import { buildUrl } from "cloudinary-build-url";

type TransformationOptions = {
  [key: string]: any;
};

export function getCloudinaryUrl(
  publicId: string,
  options?: TransformationOptions
): string {
  return buildUrl(publicId, {
    cloud: {
      cloudName: "dxbwqifwn",
    },
    transformations: options,
  });
}
