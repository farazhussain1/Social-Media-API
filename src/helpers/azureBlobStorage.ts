import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Logger } from 'azure-storage';

export class AzureBlobStorage {
  static blobServiceClient: BlobServiceClient;
  static containerClient: ContainerClient;

  constructor() {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!AZURE_STORAGE_CONNECTION_STRING) {
      throw Error('Azure Storage Connection string not found');
    }
    AzureBlobStorage.blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    AzureBlobStorage.containerClient = AzureBlobStorage.blobServiceClient.getContainerClient('agview-files');
  }

  static upload(file: Express.Multer.File) {
    const extension = file.originalname.slice(file.originalname.lastIndexOf('.') + 1);
    const blobName = `${file.fieldname}_${Date.now()}.${extension}`;
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    console.log(blobName, 'File Uploading... ');
    return {
      name: blobName,
      field: file.fieldname,
      url: blockBlobClient.url,
      promise: blockBlobClient.upload(file.buffer, file.size, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      }),
    };
  }

  static async listBlobs() {
    for await (const blob of this.containerClient.listBlobsFlat()) {
      const tempBlockBlobClient = this.containerClient.getBlockBlobClient(blob.name);
      console.log(`\n\tname: ${blob.name}\n\tURL: ${tempBlockBlobClient.url}\n`);
      this.containerClient.deleteBlob(blob.name);
    }
  }
}
