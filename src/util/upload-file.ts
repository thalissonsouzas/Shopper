import fs from 'fs';
import path from 'path';

const destinationFolder = path.join(__dirname, `../../uploads`);

/**
 * Upload a file to 'uploads' folder and return the file path.
 */
export async function uploadFile(id: string, file: Express.Multer.File) {
  const fileExt = path.extname(file.originalname); // png | jpg | gif | etc
  const fileName = `${id}${fileExt}`;
  const fileDestination = path.join(destinationFolder, fileName);

  if (!fs.existsSync(destinationFolder)) {
    await fs.promises.mkdir(destinationFolder);
  }

  await fs.promises.writeFile(fileDestination, file.buffer);

  return fileName;
}

/**
 * Delete a file on uploads folder.
 */
export async function deleteFile(fileName: string) {
  const filePath = path.join(destinationFolder, fileName);

  await fs.promises.unlink(filePath);
}

/**
 * Open file as stream.
 */
export async function getFileStream(fileName: string) {
  const filePath = path.join(destinationFolder, fileName);

  return fs.createReadStream(filePath);
}
