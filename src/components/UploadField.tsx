'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Upload } from 'lucide-react';
import {
  checkUploadCandidate,
  formatBytes,
  IMAGE_ACCEPT_ATTRIBUTE,
  VIDEO_ACCEPT_ATTRIBUTE,
  type AcceptedKind,
} from '@/lib/upload-rules';

export type UploadType = 'portfolio' | 'gallery' | 'homepage';

interface UploadFieldProps {
  type: UploadType;
  kind?: AcceptedKind;
  section?: string;
  multi?: boolean;
  label?: string;
  /** Renders the preview square when true, circular for team portraits. */
  round?: boolean;
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

interface UploadResponse {
  url?: string;
  error?: string;
}

/**
 * Translate a failed upload into something the person can act on. The server
 * only returns an error string, so the status code carries the rest.
 */
function explain(status: number, serverError?: string): string {
  if (status === 401) {
    return 'Your admin session has expired. Log out and back in, then retry.';
  }
  if (status === 413) return serverError || 'That file is too large.';
  if (status === 429) return 'Too many uploads in a short window. Wait a moment and retry.';
  if (status === 400) return serverError || 'That file was rejected.';
  if (status === 500) return 'The upload failed on the server. Check the file and retry.';
  return serverError || `Upload failed (${status}).`;
}

export default function UploadField({
  type,
  kind = 'image',
  section,
  multi,
  label = 'Choose file',
  round,
  value,
  onChange,
  className = '',
}: UploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Object URLs are revoked on replacement so a long admin session does not
  // leak a blob per selected file.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const reset = useCallback(() => {
    setFile(null);
    setProgress(0);
    setError(null);
    setSuccess(false);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  const select = useCallback((next: File | null) => {
    if (!next) return;
    setSuccess(false);
    const verdict = checkUploadCandidate(next, kind);
    if (!verdict.ok) {
      setFile(null);
      setError(verdict.error ?? 'That file cannot be uploaded.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    setError(null);
    setFile(next);
  }, [kind]);

  const upload = useCallback(async () => {
    if (!file || uploading) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (section) formData.append('section', section);
    if (multi !== undefined) formData.append('multi', String(multi));

    // XHR rather than fetch: upload progress events are not available on
    // fetch, and a large video with no feedback reads as a hang.
    const xhr = new XMLHttpRequest();

    try {
      const done = await new Promise<UploadResponse>((resolve, reject) => {
        xhr.open('POST', '/api/upload');
        xhr.withCredentials = true;

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        });

        xhr.addEventListener('load', () => {
          let payload: UploadResponse = {};
          try {
            payload = JSON.parse(xhr.responseText) as UploadResponse;
          } catch {
            payload = {};
          }
          resolve(payload);
        });

        xhr.addEventListener('error', () =>
          reject(new Error('The connection dropped before the upload finished.'))
        );
        xhr.addEventListener('abort', () =>
          reject(new Error('Upload cancelled.'))
        );

        xhr.send(formData);
      });

      if (done.url) {
        onChange(done.url);
        setSuccess(true);
        reset();
      } else {
        setError(explain(xhr.status, done.error));
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }, [file, multi, onChange, reset, section, type, uploading]);

  const cancel = useCallback(() => {
    reset();
  }, [reset]);

  const accept = kind === 'video' ? VIDEO_ACCEPT_ATTRIBUTE : IMAGE_ACCEPT_ATTRIBUTE;
  const showPreview = previewUrl || value;
  const isVideoPreview =
    (previewUrl && file?.type.startsWith('video/')) ||
    (!previewUrl && /\.(mp4|webm|mov)$/i.test(value));

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (uploading) return;
    select(event.dataTransfer.files?.[0] ?? null);
  };

  return (
    <div className={className}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!uploading) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-card border border-dashed p-4 transition-colors duration-200 ${
          dragging ? 'border-brand-500 bg-brand-50' : 'border-line-strong bg-surface-sunken'
        }`}
      >
        {showPreview ? (
          <div className="flex items-start gap-4">
            <div
              className={`size-20 shrink-0 overflow-hidden border border-line bg-surface ${
                round ? 'rounded-full' : 'rounded-card'
              }`}
            >
              {isVideoPreview ? (
                <video src={showPreview} muted playsInline className="size-full object-cover" />
              ) : (
                <img src={showPreview} alt="" className="size-full object-cover" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">
                {file ? file.name : 'Uploaded'}
              </p>
              <p className="mt-1 text-xs text-ink-subtle">
                {file
                  ? formatBytes(file.size)
                  : value.replace(/^.*\//, '') || 'Saved'}
              </p>

              {uploading ? (
                <div className="mt-3">
                  <div
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Upload progress"
                    className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted"
                  >
                    <div
                      className="h-full rounded-full bg-brand-500 transition-[width] duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs tabular text-ink-subtle">
                    Uploading — {progress}%
                  </p>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="rounded-full border border-line-strong bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors duration-200 hover:border-brand-500 hover:text-brand-600"
                  >
                    Replace
                  </button>
                  {file ? (
                    <>
                      <button
                        type="button"
                        onClick={upload}
                        className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-brand-600"
                      >
                        Upload now
                      </button>
                      <button
                        type="button"
                        onClick={cancel}
                        className="rounded-full px-3 py-1.5 text-xs text-ink-subtle transition-colors duration-200 hover:text-ink"
                      >
                        Clear
                      </button>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Upload className="size-5 text-ink-subtle" aria-hidden="true" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 hover:border-brand-500 hover:text-brand-600 disabled:opacity-50"
            >
              {label}
            </button>
            <p className="text-xs text-ink-subtle">or drop a file here</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={uploading}
          onChange={(event) => select(event.target.files?.[0] ?? null)}
          className="sr-only"
          aria-label={label}
        />
      </div>

      {uploading ? (
        <p aria-live="polite" className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Uploading {file?.name}…
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-start gap-2 text-sm text-brand-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      {success && !error ? (
        <p aria-live="polite" className="mt-2 flex items-center gap-2 text-sm text-brand-600">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          Uploaded.
        </p>
      ) : null}
    </div>
  );
}