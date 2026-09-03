import { useState } from 'react';

const BRANCH_LINEAGES = [
  {
    id: 'vu-thanh',
    name: '👑 Chi Vũ Thành (7 Đời)',
    badge: 'Mẫu Tiêu Biểu · 7 Thế Hệ',
    desc: 'Mô hình phả hệ hoàn chỉnh 7 đời liền mạch từ Thủy tổ ngành đến các thế hệ con cháu kế nghiệp hiện tại.',
    nodes: [
      { name: 'Vũ Bá Oanh', gen: 'Thủy tổ', years: 'Khởi đầu ngành' },
      { name: 'Vũ Văn Rũi', gen: 'Đời 2', years: 'Cụ thôn Rũi (Bà Nguyễn Thị Nhài)' },
      { name: 'Vũ Ngọc Điền', gen: 'Đời 3', years: '1887 – 1960' },
      { name: 'Vũ Thành', gen: 'Đời 4', years: '1923 – 2008' },
      { name: 'Vũ Hữu Dũng', gen: 'Đời 5', years: '1955 – 2026' },
      { name: 'Vũ Trọng Nghĩa', gen: 'Đời 6', years: 'Sinh 1985' },
      { name: 'Vũ Bảo Nguyên & Vũ Nhật Minh', gen: 'Đời 7', years: '2010 · 2015' },
    ],
  },
  {
    id: 'vu-dien',
    name: '🏛 Chi Vũ Điền (6 Đời)',
    badge: 'Chi Nhánh Tiêu Biểu · 6 Thế Hệ',
    desc: 'Nhánh phả hệ con cháu định cư và lập nghiệp qua nhiều thế hệ tại Hà Nội.',
    nodes: [
      { name: 'Vũ Bá Oanh', gen: 'Thủy tổ', years: 'Khởi đầu ngành' },
      { name: 'Vũ Văn Rũi', gen: 'Đời 2', years: 'Cụ thôn Rũi (Bà Nguyễn Thị Nhài)' },
      { name: 'Vũ Ngọc Điền', gen: 'Đời 3', years: '1887 – 1960' },
      { name: 'Vũ Điền', gen: 'Đời 4', years: '1917 – 1984' },
      { name: 'Vũ Việt Hồng', gen: 'Đời 5', years: 'Sinh 1945' },
      { name: 'Vũ Quang & Vũ Thị Hồng Hạnh', gen: 'Đời 6', years: '1977 · 1979' },
    ],
  },
  {
    id: 'khoi-thuy',
    name: '🌿 Khởi Thủy 6 Đại Ngành',
    badge: 'Khởi Nguyên Đại Tộc',
    desc: 'Cội nguồn phát dương từ Thủy tổ ngành phân bố sang 6 chi lớn đời thứ hai.',
    nodes: [
      { name: 'Vũ Bá Oanh', gen: 'Thủy tổ', years: 'Khởi đầu ngành' },
      { name: 'Vũ Văn Rũi', gen: 'Trưởng chi', years: 'Chi thôn Rũi' },
      { name: 'Vũ Văn Kháng', gen: 'Chi thứ 2', years: 'Đời 2' },
      { name: 'Vũ Hỷ', gen: 'Chi thứ 3', years: 'Đời 2' },
      { name: 'Vũ Thái', gen: 'Chi thứ 4', years: 'Đời 2' },
      { name: 'Vũ Văn Kềnh', gen: 'Chi thứ 5', years: 'Đời 2' },
      { name: 'Vũ Văn Loan', gen: 'Chi thứ 6', years: 'Đời 2' },
    ],
  },
];

export default function LineagePreview({ onOpenContribution }) {
  const [activeBranchId, setActiveBranchId] = useState('vu-thanh');

  const currentBranch = BRANCH_LINEAGES.find((b) => b.id === activeBranchId) || BRANCH_LINEAGES[0];

  return (
    <section className="section wrap" id="lineage">
      <div className="panel lineagePreview">
        <div className="inner">
          <div className="lineageHeaderRow">
            <div>
              <h3>Trục Truyền Thừa Huyết Hệ Các Phân Chi</h3>
              <p className="sub">
                {currentBranch.desc}
              </p>
            </div>
            <div className="lineageHeaderAction">
              <span className="lineageBadge">{currentBranch.badge}</span>
              {onOpenContribution && (
                <button
                  type="button"
                  className="btn smallBtn branchContributeBtn"
                  onClick={onOpenContribution}
                  title="Đóng góp bổ sung phả ký cho chi nhánh của bạn"
                >
                  ✍️ Đóng góp phả ký chi của bạn
                </button>
              )}
            </div>
          </div>

          {/* Bộ chọn nhánh trực quan mang tính đại chúng toàn tộc */}
          <div className="branchLineageTabs">
            <span className="tabPromptLabel">Chọn trục hiển thị:</span>
            {BRANCH_LINEAGES.map((branch) => (
              <button
                key={branch.id}
                type="button"
                className={`branchTabBtn ${activeBranchId === branch.id ? 'active' : ''}`}
                onClick={() => setActiveBranchId(branch.id)}
              >
                {branch.name}
              </button>
            ))}
          </div>

          <div className="lineageRow">
            {currentBranch.nodes.map((item, index) => (
              <span className="lineagePiece" key={item.name}>
                <span className="lineageNode">
                  <b>{item.name}</b>
                  <span className="genTag">{item.gen}</span>
                  <span className="yearTag">{item.years}</span>
                </span>
                {index < currentBranch.nodes.length - 1 && <span className="arrow">➔</span>}
              </span>
            ))}
          </div>

          <div className="lineageFooterNote">
            <span>💡 <i>Ghi chú:</i> Hệ thống xây dựng cấu trúc mở để bất kỳ bà con chi phái nào cũng có thể tra cứu và đóng góp hoàn thiện sơ đồ huyết hệ của chi mình.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
