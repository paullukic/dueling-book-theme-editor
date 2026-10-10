import { useState } from 'react';
import { useLocal } from '../lib/localStore';

const MAX_DIM = 1920;

// Shrinks big photos so they fit comfortably in local storage.
const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      if (file.type === 'image/gif') {
        resolve(reader.result);
        return;
      }
      const img = new Image();
      img.onerror = () => reject(new Error('decode'));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const png = file.type === 'image/png';
        resolve(canvas.toDataURL(png ? 'image/png' : 'image/jpeg', png ? undefined : 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

const BackgroundPicker = () => {
  const [image, setImage] = useLocal('background', '');
  const [error, setError] = useState('');
  const [over, setOver] = useState(false);

  const take = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image. Pick a JPG, PNG, GIF or WebP.');
      return;
    }
    try {
      const data = await toDataUrl(file);
      if (data.length > 4.5 * 1024 * 1024) {
        setError('That image is too large even after shrinking. Try a smaller one.');
        return;
      }
      setError('');
      setImage(data);
    } catch (e) {
      setError('Could not read that image. Try another file.');
    }
  };

  return (
    <div
      className={over ? 'dropzone over' : 'dropzone'}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        take(e.dataTransfer.files[0]);
      }}
    >
      {image ? (
        <img className="bg-preview" src={image} alt="Current background" />
      ) : (
        <p className="note">Drop an image here, or choose one.</p>
      )}
      <div className="btn-row">
        <label className="btn">
          {image ? 'Change image' : 'Choose image'}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              take(e.target.files[0]);
              e.target.value = '';
            }}
          />
        </label>
        {image && (
          <button
            type="button"
            className="btn btn-quiet"
            onClick={(e) => {
              const file = e.currentTarget.parentElement.querySelector('input[type=file]');
              setImage('');
              if (file) file.focus();
            }}
          >
            Remove
          </button>
        )}
      </div>
      {error && (
        <p className="note note-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default BackgroundPicker;
