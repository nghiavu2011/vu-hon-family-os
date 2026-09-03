import { useState } from 'react';

export default function FloatingContact({ onOpenAi }) {
  const [expanded, setExpanded] = useState(false);
  const phoneNumber = '0985578385';
  const displayPhone = '0985.578.385';
  const zaloUrl = `https://zalo.me/${phoneNumber}`;

  return (
    <aside className="floatingContactWrapper" aria-label="Liên hệ Ban Liên lạc Dòng họ">
      {expanded && (
        <div className="contactCardPopup">
          <div className="contactCardHead">
            <img src="/assets/seal-vu.png" alt="" className="contactSeal" />
            <div>
              <strong>Ban Liên Lạc Họ Vũ - Võ</strong>
              <span>Trực tiếp hỗ trợ con cháu 24/7</span>
            </div>
            <button
              type="button"
              className="closePopupBtn"
              onClick={() => setExpanded(false)}
            >
              ✕
            </button>
          </div>
          <p className="contactCardDesc">
            Quý bà con, cô bác và kiều bào cần tra cứu mộ phần, bổ sung gia phả hoặc kết nối xin liên hệ:
          </p>
          <div className="contactButtons">
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contactActionBtn zaloAction"
            >
              <span className="btnIcon">💬</span>
              <span>Chat Zalo: <b>{displayPhone}</b></span>
            </a>
            <a
              href={`tel:${phoneNumber}`}
              className="contactActionBtn phoneAction"
            >
              <span className="btnIcon">📞</span>
              <span>Gọi điện: <b>{displayPhone}</b></span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="floatingBadgeRow">
        {onOpenAi && (
          <button
            type="button"
            className="floatingAiBtn"
            onClick={onOpenAi}
            title="Trò chuyện với Cụ Đồ Ảo Họ Vũ (Trợ lý AI)"
          >
            <span className="aiFloatingIcon">🧙</span>
            <span className="aiFloatingLabel">Cụ Đồ Ảo</span>
          </button>
        )}

        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="floatingZaloBtn"
          title="Chat Zalo với Ban Liên Lạc họ Vũ"
        >
          <div className="pulsingRing" />
          <span className="zaloIconText">Zalo</span>
          <span className="floatingPhoneLabel">{displayPhone}</span>
        </a>

        <button
          type="button"
          className="floatingToggleBtn"
          onClick={() => setExpanded(!expanded)}
          title="Thông tin Ban Liên Lạc"
        >
          {expanded ? '✕' : '📞 Ban Liên Lạc'}
        </button>
      </div>
    </aside>
  );
}
