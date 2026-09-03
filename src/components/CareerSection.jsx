export default function CareerSection() {
  return (
    <section className="section wrap" id="career">
      <div className="panel pad">
        <h2>Hướng nghiệp thế hệ trẻ</h2>
        <p className="sub">Mở rộng gia phả thành mạng lưới mentor, học bổng, thực tập, review CV, định hướng ngành nghề cho con cháu.</p>
        <div className="careerGrid">
          <div className="miniCard"><h3>Mentor nội tộc</h3><p>Người đi trước đăng ký lĩnh vực có thể tư vấn: kiến trúc, AI, tài chính, luật, giáo dục...</p></div>
          <div className="miniCard"><h3>Hồ sơ thế hệ trẻ</h3><p>Lưu sở thích, môn mạnh, ngành quan tâm, portfolio, nhu cầu hỗ trợ.</p></div>
          <div className="miniCard"><h3>Cơ hội & khuyến học</h3><p>Thực tập, học bổng, vinh danh, quỹ sách, khóa học, kết nối nghề nghiệp.</p></div>
        </div>
      </div>
    </section>
  );
}
