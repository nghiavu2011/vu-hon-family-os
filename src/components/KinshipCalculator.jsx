import { useState, useMemo } from 'react';
import { calculateKinship } from '../lib/kinship.js';

export default function KinshipCalculator({ people, preselectIdA, preselectIdB, onClose }) {
  const [personIdA, setPersonIdA] = useState(preselectIdA || (people[people.length - 1]?.id || ''));
  const [personIdB, setPersonIdB] = useState(preselectIdB || (people[0]?.id || ''));
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');

  const filteredPeopleA = useMemo(() => {
    if (!searchA) return people;
    const s = searchA.toLowerCase();
    return people.filter((p) => p.name.toLowerCase().includes(s) || (p.branch && p.branch.toLowerCase().includes(s)));
  }, [people, searchA]);

  const filteredPeopleB = useMemo(() => {
    if (!searchB) return people;
    const s = searchB.toLowerCase();
    return people.filter((p) => p.name.toLowerCase().includes(s) || (p.branch && p.branch.toLowerCase().includes(s)));
  }, [people, searchB]);

  const result = useMemo(() => {
    return calculateKinship(personIdA, personIdB, people);
  }, [personIdA, personIdB, people]);

  const personA = people.find((p) => p.id === personIdA);
  const personB = people.find((p) => p.id === personIdB);

  const swapRoles = () => {
    const temp = personIdA;
    setPersonIdA(personIdB);
    setPersonIdB(temp);
  };

  return (
    <section className="section wrap" id="kinship">
      <div className="panel pad kinshipPanel">
        <div className="sectionHead">
          <div>
            <h2>Bộ Tra cứu Xưng hô & Quan hệ Họ tộc</h2>
            <p className="sub">
              Giải quyết bài toán xưng hô theo đúng lễ nghĩa Á Đông: Xác định chuẩn vai vế, thứ bậc huyết hệ giữa 2 người bất kỳ trong tộc họ Vũ.
            </p>
          </div>
          {onClose && (
            <button className="btn" onClick={onClose} type="button">
              Đóng lại ✕
            </button>
          )}
        </div>

        <div className="kinshipSelectors">
          <div className="kinshipBox">
            <span className="boxBadge">Vị trí thứ nhất (Tôi / Bản thân)</span>
            <input
              type="text"
              placeholder="Gõ để lọc tên tôi..."
              value={searchA}
              onChange={(e) => setSearchA(e.target.value)}
              className="kinshipSearchInput"
            />
            <select
              value={personIdA}
              onChange={(e) => setPersonIdA(e.target.value)}
              className="kinshipSelect"
            >
              {filteredPeopleA.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Đời {p.gen || '?'}) {p.branch ? `- ${p.branch}` : ''}
                </option>
              ))}
            </select>
            {personA && (
              <div className="personSnippet">
                <b>{personA.name}</b> • Đời {personA.gen || '?'} • {personA.gender === 'female' ? 'Nữ' : 'Nam'}
              </div>
            )}
          </div>

          <div className="swapButtonWrapper">
            <button className="btn swapBtn" onClick={swapRoles} title="Đổi vị trí 2 người" type="button">
              ⇄ Đổi vị trí
            </button>
          </div>

          <div className="kinshipBox">
            <span className="boxBadge">Vị trí thứ hai (Người cần xưng hô)</span>
            <input
              type="text"
              placeholder="Gõ để lọc tên người kia..."
              value={searchB}
              onChange={(e) => setSearchB(e.target.value)}
              className="kinshipSearchInput"
            />
            <select
              value={personIdB}
              onChange={(e) => setPersonIdB(e.target.value)}
              className="kinshipSelect"
            >
              {filteredPeopleB.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Đời {p.gen || '?'}) {p.branch ? `- ${p.branch}` : ''}
                </option>
              ))}
            </select>
            {personB && (
              <div className="personSnippet">
                <b>{personB.name}</b> • Đời {personB.gen || '?'} • {personB.gender === 'female' ? 'Nữ' : 'Nam'}
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="kinshipResultCard">
            <div className="kinshipMainRelation">
              <span className="relationLabel">Mối quan hệ phả hệ:</span>
              <span className="relationValue">{result.relation}</span>
            </div>

            <div className="kinshipCallingGrid">
              <div className="callingBox primaryCall">
                <span className="callingTitle">👉 {personA?.name || 'Bạn'} gọi {personB?.name || 'người đó'} là:</span>
                <span className="callingValue">{result.callB}</span>
              </div>
              <div className="callingBox secondaryCall">
                <span className="callingTitle">👈 {personB?.name || 'Người đó'} xưng/gọi lại là:</span>
                <span className="callingValue">{result.bCallsA}</span>
              </div>
            </div>

            <div className="kinshipDetailText">
              <p><b>📖 Diễn giải phả hệ:</b> {result.description}</p>
              <p><b>🌱 Dấu vết huyết thống:</b> {result.pathInfo}</p>
              <div className="kinshipEtiquetteTip">
                <b>💡 Lễ nghĩa dòng họ:</b> Theo gia lễ họ Vũ làng Mộ Trạch, con cháu luôn tôn kính bề trên theo thế thứ đời, xưng hô mực thước giữ gìn gia phong đạo hiếu.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
