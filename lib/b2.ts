import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Ensure this client is only instantiated on the server
if (typeof window !== "undefined") {
  throw new Error("b2.ts cannot be used on the client side");
}

function getB2Client(): { client: S3Client; bucketName: string } {
  const rawEndpoint = process.env.B2_ENDPOINT || "s3.us-east-005.backblazeb2.com";
  const endpoint = rawEndpoint.startsWith("http") ? rawEndpoint : `https://${rawEndpoint}`;
  const region = process.env.B2_REGION || "us-east-005";
  const accessKeyId = process.env.B2_KEY_ID || "0053819afe948650000000003";
  const secretAccessKey = process.env.B2_APPLICATION_KEY || "K005LHy6bhLAX7qFKyOfzRIioInFrxo";
  const bucketName = process.env.B2_BUCKET_NAME || "wealthystep";

  if (!accessKeyId || !secretAccessKey || !bucketName) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Backblaze B2 credentials (B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME) are missing in environment variables.");
    }
  }

  const client = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  return { client, bucketName };
}

/**
 * Uploads a file (PDF) buffer to Backblaze B2 bucket.
 */
export async function uploadPdfToB2(
  fileBuffer: Buffer | Uint8Array,
  fileKey: string,
  contentType: string = "application/pdf"
): Promise<{ success: boolean; fileKey: string }> {
  const { client, bucketName } = getB2Client();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await client.send(command);
  return { success: true, fileKey };
}

/**
 * Deletes a single object from Backblaze B2.
 */
export async function deleteFromB2(fileKey: string): Promise<boolean> {
  try {
    const { client, bucketName } = getB2Client();
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });
    await client.send(command);
    return true;
  } catch (err) {
    console.error(`Failed to delete file from B2 (${fileKey}):`, err);
    return false;
  }
}

/**
 * Deletes multiple objects from Backblaze B2.
 */
export async function deleteMultipleFromB2(fileKeys: string[]): Promise<boolean> {
  if (fileKeys.length === 0) return true;
  try {
    const { client, bucketName } = getB2Client();
    const command = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: fileKeys.map((Key) => ({ Key })),
        Quiet: true,
      },
    });
    await client.send(command);
    return true;
  } catch (err) {
    console.error("Failed to batch delete files from B2:", err);
    return false;
  }
}

/**
 * Generates a secure, short-lived signed download URL for a file in B2.
 * @param fileKey The B2 object key
 * @param expiresInSeconds Duration the link remains valid (default 300 seconds / 5 minutes)
 * @param downloadFilename Optional attachment filename
 */
export async function getB2SignedDownloadUrl(
  fileKey: string,
  expiresInSeconds: number = 300,
  downloadFilename?: string
): Promise<string> {
  const { client, bucketName } = getB2Client();

  const sanitizedFilename = downloadFilename
    ? downloadFilename.replace(/[^a-zA-Z0-9._-]/g, "_")
    : fileKey.split("/").pop() || "policy_document.pdf";

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    ResponseContentDisposition: `attachment; filename="${sanitizedFilename}"`,
    ResponseContentType: "application/pdf",
  });

  return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Generates a secure, short-lived signed preview URL for viewing PDF directly in browser.
 * Uses inline content disposition so browsers display it without downloading.
 */
export async function getB2SignedPreviewUrl(
  fileKey: string,
  expiresInSeconds: number = 300
): Promise<string> {
  const { client, bucketName } = getB2Client();

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    ResponseContentDisposition: "inline",
    ResponseContentType: "application/pdf",
  });

  return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Downloads the raw PDF bytes from Backblaze B2 to stream directly via same-origin Next.js Route.
 * This bypasses cross-origin iframe security restrictions (X-Frame-Options: DENY).
 */
export async function getB2FileBytes(fileKey: string): Promise<{
  buffer: Buffer;
  contentType: string;
  contentLength?: number;
}> {
  const { client, bucketName } = getB2Client();

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  const response = await client.send(command);
  const byteArray = await (response.Body as any).transformToByteArray();

  return {
    buffer: Buffer.from(byteArray),
    contentType: response.ContentType || "application/pdf",
    contentLength: response.ContentLength,
  };
}

/**
 * Computes live Backblaze B2 storage metrics (total bytes, count of objects, percent used).
 */
export async function getB2StorageMetrics(): Promise<{
  usedBytes: number;
  totalBytes: number;
  fileCount: number;
  usagePercent: number;
}> {
  const { client, bucketName } = getB2Client();
  const totalBytes = 10 * 1024 * 1024 * 1024; // 10 GB Free Tier (10,737,418,240 bytes)
  try {
    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const response = await client.send(command);
    const contents = response.Contents || [];
    const usedBytes = contents.reduce((acc, item) => acc + (item.Size || 0), 0);
    const fileCount = response.KeyCount || contents.length;
    const usagePercent = parseFloat(((usedBytes / totalBytes) * 100).toFixed(4));
    return {
      usedBytes,
      totalBytes,
      fileCount,
      usagePercent,
    };
  } catch (err) {
    console.error("Error fetching B2 storage metrics:", err);
    return {
      usedBytes: 0,
      totalBytes,
      fileCount: 0,
      usagePercent: 0,
    };
  }
}



