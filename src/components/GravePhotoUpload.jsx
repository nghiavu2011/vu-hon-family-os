
import { useState } from 'react';
import { uploadGravePhoto } from '../services/storageService.js';

export default function GravePhotoUpload({ grave }) {
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage('Đang xử lý ảnh...');
    try {
      const result = await uploadGravePhoto({
        file,
        graveId: grave.id,
        personId: grave.personId,
      });
      setPreview(result.url);
      setMessage(result.note || `Đã xử lý ảnh: ${result.fileName}`);
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Không xử lý được ảnh.');
    }
  }

  return (
    <div className="graveUpload">
      <label className="uploadButton">
        <input type="file" accept="image/*" onChange={handleFile} />
        Chọn ảnh bia / toàn cảnh
      </label>
      {message ? <p>{message}</p> : null}
      {preview ? <img src={preview} alt="Preview ảnh mộ phần" /> : null}
    </div>
  );
}
