/**
 * Dịch vụ Trí Tuệ Nhân Tạo Gia Tộc ("Cụ Đồ Ảo Họ Vũ" / Family AI Archivist)
 * Chạy cục bộ 100% không phụ thuộc API ngoài, am hiểu sử liệu Mộ Trạch và phả hệ dòng họ.
 */

import { calculateKinship } from '../lib/kinship.js';

const HISTORICAL_KNOWLEDGE = {
  vuHon: {
    name: 'Vũ Hồn (武魂)',
    title: 'Đức Thủy tổ dòng họ Vũ - Võ Việt Nam, Thành hoàng làng Mộ Trạch',
    lifespan: '804 – 853 (Hưởng thọ 49 tuổi)',
    origin: 'Thân phụ là cụ Vũ Huy (người Phúc Kiến), thân mẫu là bà Nguyễn Thị Đức (quê thôn Mạn Nhuế, Nam Sách, Hải Dương).',
    feat: 'Đỗ Tiến sĩ khoa thi năm Giáp Dần (834) nhà Đường khi mới 30 tuổi, giữ chức Thứ sử Giao Châu. Cụ là bậc đại danh nho, tinh thông phong thủy địa lý, chọn đất Khả Mộ (sau đổi là Mộ Trạch) lập ấp định cư, mở mang điền trang, khai sáng truyền thống hiếu học.',
    festival: 'Đại lễ Giỗ Thủy tổ cử hành long trọng vào ngày mùng 8 tháng Giêng Âm lịch hàng năm tại Từ đường thôn Mộ Trạch, xã Tân Hồng, huyện Bình Giang, tỉnh Hải Dương.',
  },
  moTrach: {
    title: 'Làng Mộ Trạch - "Lò Tiến Sĩ" Lừng Danh Xứ Đông',
    history: 'Làng Mộ Trạch (xưa gọi là Khả Mộ) có thế đất "Nhạn lạc đầm lầy" linh thiêng. Nơi đây sản sinh ra 36 vị Tiến sĩ Nho học thời phong kiến (trong đó có 29 vị họ Vũ và 1 vị Trạng nguyên Vũ Giới), lập kỷ lục độc nhất vô nhị trong lịch sử khoa bảng Việt Nam.',
    couplet: '« Mộ Trạch danh gia thiên hạ hữu / Thi thư kế thế cổ kim truyền » (Làng Mộ Trạch họ Vũ danh giá nhất thiên hạ / Nối đời chữ nghĩa lưu truyền từ xưa đến nay).',
  },
};

function normalize(text = '') {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

/**
 * Xử lý câu hỏi của con cháu và tạo sinh câu trả lời của Cụ Đồ Ảo
 * @param {string} userQuestion - Câu hỏi con cháu gõ vào
 * @param {Array} people - Dữ liệu danh sách thành viên hiện tại
 * @param {Array} events - Dữ liệu ngày giỗ kỵ nhật
 */
export function askFamilyAi(userQuestion, people = [], events = []) {
  const q = normalize(userQuestion);
  const byId = Object.fromEntries(people.map((p) => [p.id, p]));

  // 1. Hỏi về Thủy tổ Vũ Hồn
  if (q.includes('vu hon') || q.includes('thuy to') || q.includes('to tien') || q.includes('khoi to')) {
    const k = HISTORICAL_KNOWLEDGE.vuHon;
    return `Chào con cháu họ Vũ! Cụ xin truyền lại đôi điều về cội nguồn tiên tổ:\n\n` +
      `👑 **${k.title}** (${k.lifespan})\n\n` +
      `• **Thân thế:** ${k.origin}\n` +
      `• **Công đức:** ${k.feat}\n` +
      `• **Ngày Giỗ Tổ:** ${k.festival}\n\n` +
      `Con cháu muôn phương dù đi đâu làm gì, ngày mùng 8 tháng Giêng hãy nhớ hướng về Từ đường Mộ Trạch thắp nén tâm hương bái tổ nhé!`;
  }

  // 2. Hỏi về Làng Mộ Trạch / Lò tiến sĩ
  if (q.includes('mo trach') || q.includes('lo tien si') || q.includes('khoa bang') || q.includes('cau doi')) {
    const m = HISTORICAL_KNOWLEDGE.moTrach;
    return `Chào con cháu! Về mảnh đất phát tích Mộ Trạch linh thiêng của họ ta:\n\n` +
      `🏛 **${m.title}**\n\n` +
      `• **Lịch sử:** ${m.history}\n` +
      `• **Câu đối truyền đời:**\n` +
      `  *${m.couplet}*\n\n` +
      `Truyền thống họ Vũ ta nghìn đời nay lấy "Thi Thư Kế Thế" (nối đời học hành đỗ đạt) làm trọng. Các bậc cha chú luôn kỳ vọng con cháu đời nay tiếp nối bảng vàng vẻ vang ấy!`;
  }

  // 3. Hỏi về cụ Vũ Hữu Dũng / Vũ Trọng Nghĩa / Chi Vũ Thành
  if (q.includes('dung') || q.includes('nghia') || q.includes('thanh') || q.includes('bao nguyen') || q.includes('nhat minh')) {
    const dung = people.find((p) => p.id === 'vu-huu-dung');
    const nghia = people.find((p) => p.id === 'vu-trong-nghia');
    const thanh = people.find((p) => p.id === 'vu-thanh');

    let reply = `Dạ thưa, về nhánh huyết hệ **Chi Vũ Thành** của gia đình ta:\n\n`;
    if (thanh) {
      reply += `• **Đời 4 - Cụ Vũ Thành:** (1923 – 2008), thân phụ sinh thành ra các bác, các chú.\n`;
    }
    if (dung) {
      reply += `• **Đời 5 - Cụ Vũ Hữu Dũng:** Sinh ngày 13/11/1955, tạ thế ngày 18/07/2026 (Hưởng thọ 72 tuổi). Ngày kỵ nhật giỗ hàng năm là ngày **mùng 5 tháng 6 Âm lịch** (năm Bính Ngọ). Phối ngẫu là bà Phạm Bích Thủy (sinh 1959).\n`;
    }
    if (nghia) {
      reply += `• **Đời 6 - Ông Vũ Trọng Nghĩa:** Sinh ngày 20/11/1985. Cưới vợ là bà Nguyễn Sao Mai (sinh 26/06/1984).\n`;
    }
    reply += `• **Đời 7 - Hai cháu hậu duệ:**\n` +
      `  - Cháu cả (Trưởng nam): **Vũ Bảo Nguyên**, sinh ngày 16/11/2010.\n` +
      `  - Cháu thứ (Em trai): **Vũ Nhật Minh**, sinh ngày 01/10/2015.\n\n` +
      `Đây là trục truyền thừa trực hệ 7 đời vẻ vang của Chi Vũ Thành, phả hệ ghi chép rõ ràng, con cháu thảo hiền.`;
    return reply;
  }

  // 4. Hỏi về Văn khấn cúng giỗ / Nghi lễ
  if (q.includes('van khan') || q.includes('cung gio') || q.includes('nghi le') || q.includes('thap huong')) {
    return `Chào con cháu! Trong việc tế tự gia tiên, lòng thành kính là cốt lõi. Khi cúng giỗ kỵ nhật các cụ:\n\n` +
      `📜 **Bài Văn khấn cúng Giỗ tổ tiên cổ truyền:**\n` +
      `• Con hãy mở mục **"Lịch Giỗ & Văn Khấn"** trên hệ thống (bấm nút *Xem Văn khấn cúng Giỗ*).\n` +
      `• Bài khấn lưu truyền từ làng Mộ Trạch có câu thỉnh: *"Kính lạy Đức Thủy tổ Vũ Hồn cùng liệt vị Tiên linh Cao Tằng Tổ Khảo, Cao Tằng Tổ Tỷ..."*.\n` +
      `• Mâm lễ cúng giỗ chỉ cần hương hoa trà quả, kim ngân trầu cau và mâm cơm gia đình thanh sạch dâng trước án thờ, thỉnh chuông khấn nguyện phù hộ độ trì cho toàn gia cát khánh.`;
  }

  // 5. Hỏi về xưng hô họ tộc
  if (q.includes('xung ho') || q.includes('ong tre') || q.includes('ba co') || q.includes('chu bac') || q.includes('vai ve')) {
    return `Chào con cháu! Về phép xưng hô lễ nghĩa trong dòng họ Việt Nam:\n\n` +
      `🧭 **Nguyên tắc "Kính trên nhường dưới theo thế thứ":**\n` +
      `1. **Cùng đời (Cùng thế hệ):** Bất kể tuổi tác lớn bé, con của nhánh trên (bác) là Anh/Chị; con của nhánh dưới (chú) là Em.\n` +
      `2. **Lệch 1 đời:** Người ngang hàng với cha mẹ mình thì gọi là Bác họ, Chú họ, Cô họ. Con cháu xưng Cháu.\n` +
      `3. **Lệch 2 đời:** Người ngang hàng với ông bà nội mình thì gọi là **Ông trẻ**, **Bà cô họ / Bà trẻ**.\n\n` +
      `💡 Con có thể cuộn lên mục **"Bộ Tra Cứu Xưng Hô Họ Tộc"** trên trang, chọn tên mình và người cần gọi, hệ thống sẽ tính toán chính xác 100% cho con!`;
  }

  // 6. Tìm kiếm thành viên cụ thể trong phả hệ
  const foundPerson = people.find((p) => {
    const pName = normalize(p.name);
    return q.includes(pName) || (p.aka && p.aka.some((a) => q.includes(normalize(a))));
  });

  if (foundPerson) {
    let reply = `Chào con! Cụ tra cứu phả ký thấy thông tin về **${foundPerson.name}** như sau:\n\n`;
    reply += `• **Thế thứ:** Đời thứ ${foundPerson.gen || '?'}\n`;
    reply += `• **Chi nhánh:** ${foundPerson.branch || 'Chưa rõ chi'}\n`;
    if (foundPerson.birthDate || foundPerson.birthYear) {
      reply += `• **Năm sinh:** ${foundPerson.birthDate || foundPerson.birthYear}\n`;
    }
    if (foundPerson.deathDate || foundPerson.deathYear) {
      reply += `• **Năm mất:** ${foundPerson.deathDate || foundPerson.deathYear}\n`;
    }
    if (foundPerson.lunarDeath) {
      reply += `• **Ngày kỵ nhật (Giỗ Âm lịch):** ${foundPerson.lunarDeath}\n`;
    }
    if (foundPerson.fatherId && byId[foundPerson.fatherId]) {
      reply += `• **Thân sinh (Cha):** ${byId[foundPerson.fatherId].name}\n`;
    }
    if (foundPerson.note) {
      reply += `• **Ghi chú tư liệu:** ${foundPerson.note}\n`;
    }
    reply += `\nCon có thể bấm trực tiếp vào tên vị này trên Cây gia phả để xem toàn bộ phả ký chi tiết!`;
    return reply;
  }

  // 7. Câu trả lời mặc định nếu không khớp cụ thể
  return `Cụ Đồ xin chào con cháu họ Vũ!\n\n` +
    `Câu hỏi của con: *" ${userQuestion} "* rất hay. Con có thể hỏi cụ về:\n` +
    `1. 👑 **Thần tích & Lịch sử:** Thủy tổ Vũ Hồn, Làng tiến sĩ Mộ Trạch, Giỗ tổ mùng 8 tháng Giêng.\n` +
    `2. 🌳 **Tra cứu thành viên:** Hỏi về bất kỳ ai (ví dụ: *Cụ Vũ Thành, Cụ Vũ Hữu Dũng, anh Vũ Trọng Nghĩa, cụ Vũ Bá Oanh...*).\n` +
    `3. 🧭 **Xưng hô lễ nghĩa:** Phép xưng hô ông trẻ, bác chú họ, thứ bậc huyết hệ.\n` +
    `4. 📜 **Văn khấn & Ngày giỗ:** Bài văn khấn cúng giỗ, ngày kỵ nhật âm lịch trong gia phả.\n\n` +
    `Con hãy thử chọn một câu hỏi mẫu phía trên hoặc gõ lại tên vị tiền nhân con muốn tìm nhé!`;
}
