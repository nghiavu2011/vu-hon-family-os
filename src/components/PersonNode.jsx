import { Handle, Position } from '@xyflow/react';
import { formatDate, formatLunar } from '../lib/utils.js';

export default function PersonNode({ data }) {
  const { person, isDim, isFocus, onSelect } = data;

  return (
    <button
      className={`flowPerson ${person.gender || ''} ${isDim ? 'dim' : ''} ${isFocus ? 'focus' : ''}`}
      onClick={() => onSelect(person.id)}
      type="button"
    >
      <Handle type="target" position={Position.Top} />
      <div className="flowHead">
        <img src="/assets/avatar-default.png" loading="lazy" alt="" />
        <div>
          <b>{person.name}</b>
          {person.aka?.length ? <span>{person.aka.join(' · ')}</span> : null}
          <small>Đời {person.gen || '?'} · {person.branch || 'Chưa rõ chi'}</small>
          {person.birthDate ? <small>Sinh: {formatDate(person.birthDate)}</small> : null}
          {person.lunarDeath ? <small>Giỗ: {formatLunar(person.lunarDeath)}</small> : null}
        </div>
      </div>
      <div className="nodeBadges">
        <em>{person.confidence === 'high' ? 'Tin cậy cao' : person.confidence === 'low' ? 'Chữ khó đọc' : 'Cần đối chiếu'}</em>
        <em>{person.privacy === 'family' ? 'Nội bộ' : 'Công khai'}</em>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </button>
  );
}
