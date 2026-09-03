export default function StatsBar({ people, events, places }) {
  const branches = new Set(people.map((person) => person.branch).filter(Boolean));
  const needReview = people.filter((person) => person.confidence !== 'high').length;

  const stats = [
    ['族', people.length, 'Nhân danh'],
    ['枝', branches.size, 'Chi / Nhánh'],
    ['祀', events.length, 'Ngày giỗ'],
    ['地', places.length, 'Địa danh'],
    ['未', needReview, 'Cần kiểm chứng'],
  ];

  return (
    <div className="statsWrap wrap">
      <div className="stats">
        {stats.map(([icon, number, label]) => (
          <div className="stat" key={label}>
            <div className="statIcon">{icon}</div>
            <div>
              <b>{number}</b>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
