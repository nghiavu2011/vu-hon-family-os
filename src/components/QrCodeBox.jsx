
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QrCodeBox({ value, label = 'QR tưởng niệm' }) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    let alive = true;

    async function generate() {
      try {
        const url = await QRCode.toDataURL(value || window.location.href, {
          width: 192,
          margin: 1,
          color: {
            dark: '#32170c',
            light: '#fff7e6',
          },
        });

        if (alive) setDataUrl(url);
      } catch (error) {
        console.error(error);
      }
    }

    generate();

    return () => {
      alive = false;
    };
  }, [value]);

  function downloadQr() {
    if (!dataUrl) return;
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = `${label.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  return (
    <div className="qrBox">
      {dataUrl ? <img src={dataUrl} alt={label} /> : <div className="qrMock" />}
      <div>
        <b>{label}</b>
        <small>{value}</small>
        <button className="btn" type="button" onClick={downloadQr}>Tải QR</button>
      </div>
    </div>
  );
}
