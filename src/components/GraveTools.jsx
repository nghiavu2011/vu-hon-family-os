import { useState } from 'react';
import { haversine } from '../lib/utils.js';

export default function GraveTools({ graves }) {
  const [selected, setSelected] = useState(0);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [result, setResult] = useState('Chọn mộ phần để kiểm tra tình trạng dữ liệu tọa độ.');

  function calculate() {
    const grave = graves[Number(selected)];
    if (!grave) {
      setResult('Chưa chọn mộ phần.');
      return;
    }

    if (grave.lat === null || grave.lng === null || grave.lat === undefined || grave.lng === undefined) {
      setResult(`${grave.name}: chưa có tọa độ GPS. Cần đi thực địa, mở Google Maps tại vị trí mộ, lấy latitude/longitude rồi nhập vào data/grave-sites.json.`);
      return;
    }

    const latNumber = Number(lat);
    const lngNumber = Number(lng);
    if (Number.isNaN(latNumber) || Number.isNaN(lngNumber)) {
      setResult('Cần nhập vĩ độ và kinh độ vị trí xuất phát.');
      return;
    }

    const km = haversine(latNumber, lngNumber, grave.lat, grave.lng);
    setResult(`${grave.name}: khoảng cách đường chim bay ước tính ${km.toFixed(1)} km.`);
  }

  return (
    <section className="section wrap" id="graves">
      <div className="sectionHead">
        <div>
          <h2>Công cụ mộ phần & khoảng cách</h2>
          <p className="sub">Nhập tọa độ mộ, ảnh bia, QR tưởng niệm và tính khoảng cách khi đi tảo mộ.</p>
        </div>
      </div>

      <div className="graveTool">
        <div className="graveVisual"></div>
        <div className="toolPanel">
          <h3>Nhập thử dữ liệu mộ phần</h3>
          <p className="sub">Khi đi thực địa, lấy latitude/longitude từ Google Maps rồi nhập vào data/grave-sites.json.</p>

          <div className="formGrid">
            <select value={selected} onChange={(event) => setSelected(event.target.value)} className="full">
              {graves.map((grave, index) => <option key={grave.personId || grave.name} value={index}>{grave.name}</option>)}
            </select>
            <input value={lat} onChange={(event) => setLat(event.target.value)} placeholder="Vĩ độ của bạn" />
            <input value={lng} onChange={(event) => setLng(event.target.value)} placeholder="Kinh độ của bạn" />
            <button className="btn primary full" onClick={calculate} type="button">Tính khoảng cách demo</button>
          </div>

          <div className="empty">{result}</div>
          <div className="qrRow">
            <div className="qrMock"></div>
            <p className="sub">Mỗi mộ có thể gắn một QR riêng để mở hồ sơ cụ, ảnh bia, ngày giỗ, chỉ đường và người phụ trách.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
