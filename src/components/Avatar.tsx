import { useState } from "react";
import supabase from "../supabase";
import { User } from "@supabase/supabase-js";

interface AvatarProps {
  user: User;
}

const MAX_FILE_SIZE_MB = 1;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const Avatar = ({ user }: AvatarProps) => {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    user.user_metadata?.avatar_url || null
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg("Alleen PNG, JPG, JPEG of WEBP bestanden zijn toegestaan.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMsg("Bestand is te groot. Maximaal 1MB toegestaan.");
      return;
    }

    try {
      setUploading(true);

      const ext = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 12)}.${ext}`;
      const filePath = `uploads/avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: filePath },
      });

      if (updateError) {
        throw updateError;
      }

      setImageUrl(filePath);
    } catch (err: any) {
      setErrorMsg("Fout bij upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-2">Avatar</h2>

      {imageUrl ? (
        <img
          src={
            supabase.storage.from("uploads").getPublicUrl(imageUrl).data
              .publicUrl
          }
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover mb-2"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-2">
          Geen afbeelding
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
      {uploading && <p className="text-sm text-blue-600">Uploaden...</p>}
    </div>
  );
};

export default Avatar;
