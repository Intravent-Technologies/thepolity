import fs from 'fs';
import path from 'path';
import {
  getSupabaseAdminClient,
  isSupabaseConfigured,
  localUploadsDir,
  SUPABASE_STORAGE_BUCKET,
} from './config';
import type { UploadType, UploadedAsset } from './types';

function getPublicMediaUrl(storagePath: string): string {
  const { data } = getSupabaseAdminClient()
    .storage.from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function uploadMediaFile(options: {
  buffer: Buffer;
  contentType: string;
  filename: string;
  directory: UploadType;
}): Promise<UploadedAsset> {
  const safeName = options.filename.replace(/[^a-zA-Z0-9.\-_]/g, '-');
  const filename = `${Date.now()}-${safeName}`;

  if (isSupabaseConfigured()) {
    const storagePath = `${options.directory}/${filename}`;
    const { error } = await getSupabaseAdminClient()
      .storage.from(SUPABASE_STORAGE_BUCKET)
      .upload(storagePath, options.buffer, {
        contentType: options.contentType,
        upsert: false,
      });

    if (error) throw error;

    return {
      filename,
      url: getPublicMediaUrl(storagePath),
    };
  }

  const uploadDir = path.join(localUploadsDir(), options.directory);
  fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, options.buffer);

  return {
    filename,
    url: `/uploads/${options.directory}/${filename}`,
  };
}

export async function deleteUploadedAsset(assetUrl?: string): Promise<void> {
  if (!assetUrl) return;

  if (isSupabaseConfigured()) {
    const storagePath = getSupabaseStoragePath(assetUrl);
    if (!storagePath) return;

    await getSupabaseAdminClient()
      .storage.from(SUPABASE_STORAGE_BUCKET)
      .remove([storagePath]);
    return;
  }

  if (!assetUrl.startsWith('/uploads/')) return;

  const normalizedPath = assetUrl.replace(/^\/+/, '').split('/').join(path.sep);
  const fullPath = path.join(process.cwd(), 'public', normalizedPath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

function getSupabaseStoragePath(assetUrl: string): string | null {
  try {
    const url = new URL(assetUrl);
    const marker = `/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/`;
    const index = url.pathname.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(url.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}