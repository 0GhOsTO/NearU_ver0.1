'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { supabase } from '@/lib/supabase/client';

interface AvatarUploadProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onUploaded?: (url: string) => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB — mirrors the avatars bucket limit

export default function AvatarUpload({ src, name, size = 'lg', onUploaded }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset the input so re-selecting the same file re-fires onChange.
    e.target.value = '';
    if (!file) return;

    setError('');

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('Image must be 2 MB or smaller.');
      return;
    }

    setUploading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError('You must be signed in to upload a photo.');
        return;
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      // Unique filename inside the user's own folder — sidesteps CDN cache
      // staleness and satisfies the owner-scoped storage RLS policy.
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      onUploaded?.(publicUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        className="relative inline-block cursor-pointer"
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <Avatar src={src} name={name} size={size} />
        <div className="absolute bottom-0 right-0 rounded-full bg-nu-blue p-1.5 text-white shadow-md ring-2 ring-white">
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Camera className="h-3.5 w-3.5" />
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleChange}
        />
      </div>
      {error && <p className="max-w-[12rem] text-center text-xs text-nu-coral">{error}</p>}
    </div>
  );
}
