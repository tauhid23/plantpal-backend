import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import { env } from "../config/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY.cloudName,
  api_key: env.CLOUDINARY.apiKey,
  api_secret: env.CLOUDINARY.apiSecret,
});

export async function uploadImage(buffer: Buffer, filename?: string) {
  return new Promise<string>((resolve, reject) => {
    const options: UploadApiOptions = {
      folder: "plantpal",
      resource_type: "image",
    };

    if (filename !== undefined) {
      options.filename_override = filename;
    }

    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err || !result) {
        return reject(
          err ?? new Error("Cloudinary upload failed with no result")
        );
      }
      resolve(result.secure_url);
    });
    stream.end(buffer);
  });
}
