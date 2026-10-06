'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  GripVertical,
  Loader2,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { notify } from '@/components/admin/Toast';
import { albumMediaImageSrc, type WorkAlbum, type WorkAlbumMedia } from '@/lib/work-types';
import {
  ALL_ACCEPT_ATTRIBUTE,
  checkUploadCandidate,
  formatBytes,
} from '@/lib/upload-rules';

/**
 * Editing one album: its written details, its cover photo, and its media.
 *
 * Kept out of the dashboard page because this is a self-contained tool with its
 * own state machine — a row list plus a drag-to-reorder grid — and inlining it
 * would bury the rest of the dashboard under it.
 *
 * Two ways in, and they compose deliberately:
 *
 *   Drive   a folder link, synced on demand. Cheap for a shoot that already
 *           lives in Drive, and nothing is copied except videos.
 *   Upload  files added here. Copied into our own storage, so the site keeps
 *           working whatever Drive does, and a video can be larger than Drive
 *           will serve.
 *
 * A sync never removes an upload. Drive has no opinion about a file it has
 * never seen, so treating its absence as a deletion would quietly throw away
 * the admin's own work.
 */

const THUMB_WIDTH = 400;

interface AlbumEditorProps {
  album: WorkAlbum;
  onClose: () => void;
  /** Replaces the album in the list once the server has confirmed a save. */
  onSaved: (album: WorkAlbum) => void;
}

interface MediaResponse {
  media?: WorkAlbumMedia[];
  rejected?: string[];
  error?: string;
}

interface UploadTicket {
  signedUrl: string;
  storagePath: string;
  error?: string;
}

/**
 * Put one file into the album: ask the server where to put it, send the bytes
 * there, then ask the server to verify and record it.
 *
 * The middle step goes straight to Supabase, so its size is not limited by
 * whatever the hosting platform allows in a request body. XHR rather than fetch
 * because fetch still cannot report upload progress, and a stalled multi-
 * megabyte transfer with no feedback reads as a hung page.
 */
async function uploadOneFile(
  albumId: string,
  file: File,
  onProgress: (fraction: number) => void
): Promise<WorkAlbumMedia[]> {
  const ticketRes = await fetch(`/api/work/albums/${albumId}/media/ticket`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    }),
  });

  const ticket = (await ticketRes.json().catch(() => ({}))) as UploadTicket & { direct?: boolean };

  if (ticketRes.status === 501 || ticket.direct === false) {
    // No Supabase on this server: fall back to the multipart route, which
    // writes to local disk. Only useful in local development.
    return uploadViaRoute(albumId, file, onProgress);
  }

  if (!ticketRes.ok || !ticket.signedUrl) {
    throw new Error(ticket.error ?? 'The server would not accept that file.');
  }

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', ticket.signedUrl);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.setRequestHeader('x-upsert', 'false');

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    });
    xhr.addEventListener('load', () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error('the file could not be transferred')),
    );
    xhr.addEventListener('error', () => reject(new Error('the connection dropped')));
    xhr.addEventListener('abort', () => reject(new Error('the upload was cancelled')));

    xhr.send(file);
  });

  const confirmRes = await fetch(`/api/work/albums/${albumId}/media/confirm`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      storagePath: ticket.storagePath,
      filename: file.name,
      sizeBytes: file.size,
      kind: file.type.startsWith('video/') ? 'video' : 'image',
    }),
  });

  const confirmed = (await confirmRes.json().catch(() => ({}))) as MediaResponse;
  if (!confirmRes.ok || !Array.isArray(confirmed.media)) {
    throw new Error(confirmed.error ?? 'the file was uploaded but could not be saved');
  }

  return confirmed.media;
}

/** Local-disk fallback for when the server has no Supabase configured. */
async function uploadViaRoute(
  albumId: string,
  file: File,
  onProgress: (fraction: number) => void
): Promise<WorkAlbumMedia[]> {
  const formData = new FormData();
  formData.append('file', file);

  const payload = await new Promise<MediaResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/work/albums/${albumId}/media`);
    xhr.withCredentials = true;

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    });
    xhr.addEventListener('load', () => {
      try {
        resolve(JSON.parse(xhr.responseText) as MediaResponse);
      } catch {
        resolve({});
      }
    });
    xhr.addEventListener('error', () => reject(new Error('the connection dropped')));
    xhr.addEventListener('abort', () => reject(new Error('the upload was cancelled')));

    xhr.send(formData);
  });

  if (payload.error || !Array.isArray(payload.media)) {
    throw new Error(payload.error ?? 'the file could not be uploaded');
  }
  return payload.media;
}

export default function AlbumEditor({ album, onClose, onSaved }: AlbumEditorProps) {
  const [draft, setDraft] = useState({
    title: album.title,
    slug: album.slug,
    category: album.category,
    description: album.description,
    driveFolderUrl: album.driveFolderUrl,
  });
  const [savingDetails, setSavingDetails] = useState(false);
  const [media, setMedia] = useState<WorkAlbumMedia[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dropping, setDropping] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);
  const [coverMediaId, setCoverMediaId] = useState(album.coverMediaId);
  const [savingCover, setSavingCover] = useState(false);

  // The row being dragged, and the row it would land on. Refs rather than state
  // so a drag does not re-render the whole grid on every pointer move.
  const dragFrom = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [pendingOrder, setPendingOrder] = useState<number[] | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);

  const inputClass =
    'px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle';

  const loadMedia = useCallback(async () => {
    setLoadingMedia(true);
    try {
      const res = await fetch(`/api/work/albums/${album.id}`);
      const data: { media?: WorkAlbumMedia[] } = await res.json();
      if (Array.isArray(data.media)) setMedia(data.media);
    } catch {
      notify('Could not load this album’s photos.');
    } finally {
      setLoadingMedia(false);
    }
  }, [album.id]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  /* The grid shows the order as it will look once saved, so a drag is visible
     straight away rather than only after a round trip. */
  const ordered = useMemo(() => {
    if (!pendingOrder) return media;
    return pendingOrder
      .map((index) => media[index])
      .filter((item): item is WorkAlbumMedia => Boolean(item));
  }, [media, pendingOrder]);

  const saveDetails = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingDetails(true);
    try {
      const res = await fetch(`/api/work/albums/${album.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const updated = (await res.json()) as WorkAlbum & { error?: string };
      if (updated.error) {
        notify(updated.error);
        return;
      }
      onSaved(updated);
      notify('Album details saved.');
    } catch {
      notify('Could not save those details.');
    } finally {
      setSavingDetails(false);
    }
  };

  const upload = useCallback(
    async (files: File[]) => {
      if (files.length === 0 || uploading) return;

      // Client-side courtesy pass; the route remains the authority.
      const usable: File[] = [];
      const refused: string[] = [];
      for (const file of files) {
        const verdict = checkUploadCandidate(file, 'any');
        if (verdict.ok) usable.push(file);
        else refused.push(`${file.name}: ${verdict.error ?? 'not accepted'}`);
      }

      if (usable.length === 0) {
        setRejected(refused);
        return;
      }

      setUploading(true);
      setProgress(0);
      setRejected(refused);

      const added: WorkAlbumMedia[] = [];
      const problems: string[] = [];

      try {
        /* Each file is transferred browser-to-Supabase using a URL minted by the
           ticket route. The bytes never pass through a Next route handler, which
           is what lets a 10MB photograph succeed: a Vercel function rejects
           request bodies over roughly 4.5MB, so the old multipart route failed
           on exactly the files an admin most wants to add.

           Files go one at a time on purpose. A parallel batch of large videos
           would saturate the connection, share one progress bar, and give no
           indication of which file is actually moving. */
        for (let i = 0; i < usable.length; i++) {
          const file = usable[i];
          setProgress(Math.round((i / usable.length) * 100));

          try {
            const row = await uploadOneFile(album.id, file, (fraction) => {
              // Each file owns a slice of the bar, so the bar never jumps back.
              const base = (i / usable.length) * 100;
              setProgress(Math.round(base + fraction * (100 / usable.length)));
            });
            added.push(...row);
          } catch (cause) {
            problems.push(
              `${file.name}: ${cause instanceof Error ? cause.message : 'could not be uploaded'}`
            );
          }
        }

        setProgress(100);

        if (added.length > 0) {
          // Functional update, so a batch of files cannot clobber rows that
          // arrived while this one was still transferring.
          setMedia((current) => [...current, ...added]);
          setPendingOrder(null);
        }
        setRejected([...refused, ...problems]);

        const addedCount = added.length;
        const refusedCount = (refused.length + problems.length) || 0;
        notify(
          addedCount === 0
            ? 'Nothing was added.'
            : refusedCount > 0
              ? `Added ${addedCount}. ${refusedCount} file${refusedCount === 1 ? '' : 's'} could not be added.`
              : `Added ${addedCount} to this album.`,
          addedCount === 0 || refusedCount > 0 ? 'error' : 'success'
        );
      } catch (cause) {
        notify(cause instanceof Error ? cause.message : 'Upload failed.');
      } finally {
        setUploading(false);
        setProgress(0);
        if (fileInput.current) fileInput.current.value = '';
      }
    },
    [album.id, uploading]
  );

  const saveOrder = async (order: number[]) => {
    const previous = pendingOrder;
    setPendingOrder(order);

    try {
      const res = await fetch(`/api/work/albums/${album.id}/media`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: order.map((index) => ordered[index]?.id) }),
      });
      const data: MediaResponse = await res.json();
      if (data.error || !Array.isArray(data.media)) {
        throw new Error(data.error || 'The order could not be saved.');
      }
      setMedia(data.media);
      setPendingOrder(null);
    } catch (cause) {
      // Put the grid back the way it was rather than leaving a lie on screen.
      setPendingOrder(previous);
      notify(cause instanceof Error ? cause.message : 'Could not save the new order.');
    }
  };

  const pickCover = async (item: WorkAlbumMedia) => {
    setSavingCover(true);
    try {
      const res = await fetch(`/api/work/albums/${album.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverMediaId: item.id }),
      });
      const updated = (await res.json()) as WorkAlbum & { error?: string };
      if (updated.error) {
        notify(updated.error);
        return;
      }
      setCoverMediaId(item.id);
      onSaved(updated);
      notify('Cover updated.');
    } catch {
      notify('Could not update the cover.');
    } finally {
      setSavingCover(false);
    }
  };

  const clearCover = async () => {
    setSavingCover(true);
    try {
      const res = await fetch(`/api/work/albums/${album.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverMediaId: '', coverDriveFileId: '' }),
      });
      const updated = (await res.json()) as WorkAlbum & { error?: string };
      if (updated.error) {
        notify(updated.error);
        return;
      }
      setCoverMediaId('');
      onSaved(updated);
      notify('Cover cleared. The first photo will be used until you pick one.');
    } catch {
      notify('Could not clear the cover.');
    } finally {
      setSavingCover(false);
    }
  };

  const removeItem = async (item: WorkAlbumMedia) => {
    const uploaded = !item.driveFileId;
    if (
      !confirm(
        uploaded
          ? `Remove "${item.filename}"? The uploaded file is deleted from storage too.`
          : `Remove "${item.filename}"? It stays in Google Drive; only this album changes.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/work/albums/${album.id}/media`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId: item.id }),
      });
      const data: MediaResponse = await res.json();
      if (data.error || !Array.isArray(data.media)) {
        throw new Error(data.error || 'That item could not be removed.');
      }
      setMedia(data.media);
      setPendingOrder(null);
      if (coverMediaId === item.id) setCoverMediaId('');
      notify('Removed.');
    } catch (cause) {
      notify(cause instanceof Error ? cause.message : 'Could not remove that item.');
    }
  };

  const onDropFiles = (event: React.DragEvent) => {
    event.preventDefault();
    setDropping(false);
    if (uploading) return;
    upload(Array.from(event.dataTransfer.files ?? []));
  };

  return (
    <div className="rounded-card border border-line-strong bg-cream p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-ink">{album.title}</h3>
          <p className="truncate text-sm text-ink-subtle">/work/{album.slug}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-line-strong bg-surface p-2 text-ink-muted transition-colors duration-200 hover:border-brand-500 hover:text-ink"
          aria-label="Close editor"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      <form onSubmit={saveDetails} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Title"
            aria-label="Title"
            className={inputClass}
          />
          <input
            type="text"
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            placeholder="Category (optional)"
            aria-label="Category"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            value={draft.slug}
            onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
            placeholder="URL slug"
            aria-label="URL slug"
            className={inputClass}
          />
          <input
            type="url"
            value={draft.driveFolderUrl}
            onChange={(e) => setDraft({ ...draft, driveFolderUrl: e.target.value })}
            placeholder="Google Drive folder link (optional)"
            aria-label="Google Drive folder link"
            className={inputClass}
          />
        </div>

        <textarea
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          rows={3}
          placeholder="Description (optional)"
          aria-label="Description"
          className={`w-full ${inputClass}`}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={savingDetails}
            className="rounded-card bg-brand-500 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-brand-600 disabled:opacity-50"
          >
            {savingDetails ? 'Saving…' : 'Save details'}
          </button>
          <p className="text-xs text-ink-subtle">
            A Drive link is optional. With one you can Sync; without one, upload
            photos below.
          </p>
        </div>
      </form>

      <div className="mt-8 border-t border-line pt-6">
        <h4 className="mb-1 font-bold text-ink">Add photos and videos</h4>
        <p className="mb-4 text-sm text-ink-muted">
          Files you add here are copied into our own storage and stay put, even if
          you later re-sync the Drive folder. Images up to 10&nbsp;MB, videos up to
          100&nbsp;MB.
        </p>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            if (!uploading) setDropping(true);
          }}
          onDragLeave={() => setDropping(false)}
          onDrop={onDropFiles}
          className={`rounded-card border border-dashed p-6 text-center transition-colors duration-200 ${
            dropping ? 'border-brand-500 bg-brand-50' : 'border-line-strong bg-surface-sunken'
          }`}
        >
          <Upload className="mx-auto size-5 text-ink-subtle" aria-hidden="true" />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="mt-3 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 hover:border-brand-500 hover:text-brand-600 disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Choose files'}
          </button>
          <p className="mt-2 text-xs text-ink-subtle">
            or drop them here — several at a time is fine
          </p>

          {uploading ? (
            <div className="mx-auto mt-4 max-w-sm">
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
                <Loader2 className="mr-1 inline size-3 animate-spin" aria-hidden="true" />
                Uploading — {progress}%
              </p>
            </div>
          ) : null}

          <input
            ref={fileInput}
            type="file"
            multiple
            accept={ALL_ACCEPT_ATTRIBUTE}
            disabled={uploading}
            onChange={(event) => upload(Array.from(event.target.files ?? []))}
            className="sr-only"
            aria-label="Choose photos and videos"
          />
        </div>

        {rejected.length > 0 ? (
          <ul className="mt-3 space-y-1">
            {rejected.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm text-brand-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <div className="mb-1 flex items-center justify-between gap-4">
          <h4 className="font-bold text-ink">
            {loadingMedia ? 'Loading…' : `${ordered.length} item${ordered.length === 1 ? '' : 's'}`}
          </h4>
          {coverMediaId ? (
            <button
              type="button"
              onClick={clearCover}
              disabled={savingCover}
              className="text-xs text-ink-subtle underline transition-colors duration-200 hover:text-ink disabled:opacity-50"
            >
              Use no cover
            </button>
          ) : null}
        </div>
        <p className="mb-4 text-sm text-ink-muted">
          Drag a photo by its handle to change the order it appears in. Click the
          star to make it the cover.
        </p>

        {loadingMedia ? (
          <p className="text-sm text-ink-subtle">Loading photos…</p>
        ) : ordered.length === 0 ? (
          <p className="text-sm text-ink-subtle">
            Nothing here yet. Upload files above, or sync the Drive folder.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {ordered.map((item, index) => {
              const src = albumMediaImageSrc(item, THUMB_WIDTH);
              const isCover = coverMediaId === item.id;
              const uploaded = !item.driveFileId;

              return (
                <li
                  key={item.id}
                  draggable={!uploading}
                  onDragStart={() => {
                    dragFrom.current = index;
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOver(index);
                  }}
                  onDragEnd={() => {
                    dragFrom.current = null;
                    setDragOver(null);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const from = dragFrom.current;
                    setDragOver(null);
                    dragFrom.current = null;
                    if (from === null || from === index) return;

                    // Moving from a lower index to a higher one has to shift the
                    // gap the other way round, so the item lands where the
                    // pointer was released rather than one place short.
                    const next = [...(pendingOrder ?? media.map((_, i) => i))];
                    const [moved] = next.splice(from, 1);
                    next.splice(index, 0, moved);
                    saveOrder(next);
                  }}
                  className={`group relative overflow-hidden rounded-card border bg-surface transition-opacity ${
                    dragOver === index ? 'border-brand-500' : 'border-line'
                  }`}
                >
                  <div className="relative aspect-4/3 bg-surface-sunken">
                    {item.kind === 'video' ? (
                      <>
                        {item.publicUrl ? (
                          <video
                            src={item.publicUrl}
                            muted
                            playsInline
                            preload="metadata"
                            className="size-full object-cover"
                          />
                        ) : null}
                        <span className="absolute bottom-1 left-1 rounded bg-surface/90 px-1.5 py-0.5 text-[10px] font-medium text-ink">
                          Video
                        </span>
                      </>
                    ) : src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={item.filename} className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs text-ink-subtle">
                        No preview
                      </div>
                    )}

                    <span
                      className="absolute top-1 left-1 cursor-grab rounded bg-surface/90 p-1 text-ink-muted active:cursor-grabbing"
                      aria-hidden="true"
                      title="Drag to reorder"
                    >
                      <GripVertical className="size-3.5" />
                    </span>

                    <button
                      type="button"
                      onClick={() => (isCover ? clearCover() : pickCover(item))}
                      disabled={savingCover}
                      aria-label={isCover ? `Remove cover from ${item.filename}` : `Use ${item.filename} as cover`}
                      aria-pressed={isCover}
                      className={`absolute top-1 right-1 rounded p-1 transition-colors duration-200 disabled:opacity-50 ${
                        isCover
                          ? 'bg-brand-500 text-white'
                          : 'bg-surface/90 text-ink-muted hover:text-brand-600'
                      }`}
                    >
                      {isCover ? (
                        <Check className="size-3.5" aria-hidden="true" />
                      ) : (
                        <Star className="size-3.5" aria-hidden="true" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeItem(item)}
                      aria-label={`Remove ${item.filename}`}
                      className="absolute right-1 bottom-1 rounded bg-surface/90 p-1 text-ink-muted transition-colors duration-200 hover:text-brand-700"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="px-2 py-1.5">
                    <p className="truncate text-[11px] text-ink" title={item.filename}>
                      {item.filename}
                    </p>
                    <p className="text-[10px] text-ink-subtle">
                      {uploaded ? 'Uploaded' : 'Drive'} · {formatBytes(item.sizeBytes)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
