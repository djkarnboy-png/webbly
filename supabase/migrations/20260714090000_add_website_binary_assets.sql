-- Allow website uploads to include binary assets (images, fonts), stored as
-- base64 text in the existing `content` column. Adds an `encoding` column so
-- readers know how to decode each row, and widens the content_type check to
-- accept the new mime types.

alter table public.website_files
  add column encoding text not null default 'utf8'
  check (encoding in ('utf8', 'base64'));

alter table public.website_files
  drop constraint website_files_content_type_check;

alter table public.website_files
  add constraint website_files_content_type_check check (
    content_type in (
      'text/html',
      'text/css',
      'text/javascript',
      'application/json',
      'image/svg+xml',
      'text/plain',
      'text/markdown',
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/webp',
      'image/x-icon',
      'font/woff',
      'font/woff2',
      'font/ttf',
      'font/otf',
      'application/vnd.ms-fontobject'
    )
  );

grant insert (website_id, path, content, content_type, size_bytes, encoding)
on public.website_files to authenticated;
