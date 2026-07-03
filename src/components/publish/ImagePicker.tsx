import { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 10 * 1024 * 1024;

interface Props {
  value: File | null;
  onChange: (file: File | null) => void;
  existingUrl?: string | null;
}

const ImagePicker = ({ value, onChange, existingUrl }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) { toast.error('Formato no permitido. Usa JPG, PNG o WEBP.'); return; }
    if (f.size > MAX_BYTES) { toast.error('La imagen supera 10MB.'); return; }
    onChange(f);
  };

  const display = previewUrl ?? existingUrl ?? null;

  return (
    <div className="mt-2">
      <div className="relative w-full h-48 border-2 border-dashed border-input rounded-xl overflow-hidden bg-muted/30">
        {display ? (
          <>
            <img src={display} alt="Vista previa" className="h-full w-full object-contain" />
            <div className="absolute top-2 right-2 flex gap-2">
              <button type="button" onClick={() => inputRef.current?.click()}
                className="bg-background/90 hover:bg-background border rounded-md px-2 py-1 text-xs flex items-center gap-1">
                <RefreshCw className="h-3 w-3" /> Cambiar
              </button>
              {value && (
                <button type="button" onClick={() => onChange(null)}
                  className="bg-background/90 hover:bg-background border rounded-md px-2 py-1 text-xs flex items-center gap-1">
                  <X className="h-3 w-3" /> Quitar
                </button>
              )}
            </div>
          </>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:bg-muted/50">
            <Camera className="h-12 w-12 mb-2" />
            <span className="font-medium">Haz clic para subir una foto</span>
            <span className="text-sm">JPG, PNG o WEBP · hasta 10MB</span>
          </button>
        )}
        <input ref={inputRef} type="file" className="hidden" accept={ACCEPTED.join(',')}
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
      </div>
      {existingUrl && value && (
        <p className="text-xs text-muted-foreground mt-2">La imagen actual será reemplazada al guardar.</p>
      )}
    </div>
  );
};

export default ImagePicker;
