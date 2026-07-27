/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';

export type StorageBucketName = 
  | 'avatars' 
  | 'resumes' 
  | 'documents' 
  | 'certificates' 
  | 'portfolio' 
  | 'exports' 
  | 'reports';

export class StorageService {
  /**
   * Uploads a file to a specific bucket with automatic path namespacing per user.
   */
  static async uploadFile(
    bucket: StorageBucketName,
    userId: string,
    file: File | Blob,
    fileName?: string
  ): Promise<{ path: string; publicUrl: string | null }> {
    const cleanFileName = fileName || `${Date.now()}_${(file as File).name || 'file.bin'}`;
    const filePath = `${userId}/${cleanFileName}`;

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.warn(`[StorageService] Supabase upload failed for ${bucket}:`, error.message);
        // Local Object URL fallback for offline/demo mode
        const fallbackUrl = URL.createObjectURL(file);
        return { path: filePath, publicUrl: fallbackUrl };
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        path: data.path,
        publicUrl: publicUrlData?.publicUrl || null,
      };
    } catch (e) {
      console.error(`[StorageService] Unexpected error uploading to ${bucket}:`, e);
      const fallbackUrl = URL.createObjectURL(file);
      return { path: filePath, publicUrl: fallbackUrl };
    }
  }

  /**
   * Retrieves a signed URL for private bucket downloads.
   */
  static async getDownloadUrl(bucket: StorageBucketName, filePath: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600); // 1 hour validity

      if (error || !data) {
        // Fallback to public URL or current file path
        const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return pubData?.publicUrl || null;
      }

      return data.signedUrl;
    } catch {
      return null;
    }
  }

  /**
   * Deletes a file from storage.
   */
  static async deleteFile(bucket: StorageBucketName, filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      return !error;
    } catch {
      return false;
    }
  }
}
