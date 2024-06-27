import { buildUrl } from "cloudinary-build-url";
import { config } from "config";

type TransformationOptions = {
  [key: string]: unknown;
};

export function getCloudinaryUrl(
  publicId: string,
  options?: TransformationOptions
): string {
  if (!config.CLOUD_NAME) {
    throw new Error(
      "Cloudinary cloud name is required to compose the image url."
    );
  }

  return buildUrl(publicId, {
    cloud: {
      cloudName: config.CLOUD_NAME,
    },
    transformations: options,
  });
}
