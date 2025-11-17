import type { MultipartFile } from "@fastify/multipart";
import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (image: MultipartFile) => {
  // Return "https" URLs by setting secure: true
  cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Transfer image to base64
    const buffer = await image.toBuffer();
    const base64Image = `data:${image.mimetype};base64,${buffer.toString(
      "base64"
    )}`;

    // Upload the image
    const result = await cloudinary.uploader.upload(base64Image, options);

    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
};
