import type { MultipartFile } from "@fastify/multipart";

export interface TransactionsType {
  amount: number;
  file_image?: string;
  note?: string;
  user_id: string;
  category_id: string;
}


export interface uploadImageToCloudType {
  file_image: MultipartFile;
}
