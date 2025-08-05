import { useEffect, useRef, useState } from "react";
import { ImagePlus, ImageUp } from "lucide-react";

interface Props {
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  previewUrl?: string; // optional image preview for edit mode
  maxSizeMB?: number;
}

const ImageUploader = ({
  value,
  onChange,
  error,
  previewUrl,
  maxSizeMB = 1,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(previewUrl || null);

  const validateImage = (file: File): string => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
    ];
    const maxSize = maxSizeMB * 1024 * 1024;

    if (!validTypes.includes(file.type))
      return "Only JPG, PNG, SVG, or GIF files are allowed.";
    if (file.size > maxSize) return `File must be less than ${maxSizeMB}MB.`;
    return "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      onChange(null); // clear the file
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange({ target: { files: [file] } } as any);
  };

  useEffect(() => {
    if (!value) {
      setPreview(previewUrl || null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [value, previewUrl]);

  return (
    <div
      className={`w-full p-2 max-w-[230px] h-[130px] rounded-lg border-[1px] border-dashed overflow-hidden ${
        error ? "border-red-500" : "border-gray-300"
      } relative group bg-gray-50 cursor-pointer`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <>
          <img
            src={preview}
            alt="Preview"
            className="object-contain w-full h-full rounded-lg"
          />
          <div className="absolute inset-0 bg-black/[0.4] bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-sm flex-col">
            <ImageUp /> Re-upload
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <ImagePlus />
          <p className="text-sm mt-2 text-center">
            Click to upload or drag and drop
            <br />
            <span className="text-xs text-gray-400">
              JPG, PNG, SVG or GIF (Max {maxSizeMB}MB)
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
