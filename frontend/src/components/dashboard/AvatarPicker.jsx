import { useRef } from 'react';
import toast from 'react-hot-toast';
import { fileToAvatarDataUrl } from '../../utils/imageUtils';

const AvatarPicker = ({ value, onChange, name = '' }) => {
  const inputRef = useRef(null);

  const handleBrowse = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      onChange(dataUrl);
      toast.success('Photo selected');
    } catch (err) {
      toast.error(err.message || 'Could not load image');
    }
  };

  const initial = name?.[0]?.toUpperCase() || 'U';

  return (
    <div className="space-y-3">
      <p className="label-premium mb-0">Profile photo</p>
      <div className="flex flex-wrap items-center gap-5">
        <div className="w-24 h-24 rounded-2xl bg-gradient-gold flex items-center justify-center text-3xl font-display font-semibold text-luxury-charcoal shadow-gold-glow overflow-hidden ring-2 ring-luxury-line">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleBrowse}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn-outline !py-2 !px-5 !text-xs"
          >
            Browse photo
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs text-luxury-muted hover:text-red-600 transition-colors text-left"
            >
              Remove photo
            </button>
          )}
          <p className="text-xs text-luxury-muted max-w-xs">JPG, PNG or WebP · max 5 MB</p>
        </div>
      </div>
    </div>
  );
};

export default AvatarPicker;
