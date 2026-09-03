/**
 * Thuật toán bố cục Cây gia phả chuẩn phân cấp (Hierarchical Tree Layout)
 * Tối ưu hóa độ gọn gàng và thẩm mỹ:
 * - Cân bằng nhánh trung tâm (Center-weighted ordering): Đặt nhánh nhiều đời nhất vào giữa, các nhánh ngắn ở hai bên giúp loại bỏ đường nối kéo dài.
 * - Căn chỉnh vợ chồng sát cạnh nhau.
 * - Khoảng cách tối ưu, đường cong mềm mại trang nghiêm.
 */

const CARD_WIDTH = 250;
const SPOUSE_GAP = 20;
const SIBLING_GAP = 36;
const BRANCH_GAP = 50;
const LEVEL_HEIGHT = 220;

function normalizeSearchText(text = '') {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

export function buildFlowGraph({ people, searchText = '', branch = '' }) {
  const byId = Object.fromEntries(people.map((person) => [person.id, person]));
  const normalizedSearch = normalizeSearchText(searchText);

  function personMatches(person) {
    const text = [
      person.name,
      person.branch,
      person.note,
      person.place,
      ...(person.aka || []),
    ].join(' ');
    const norm = normalizeSearchText(text);

    const branchOk = !branch || person.branch === branch;
    const searchOk = !normalizedSearch || norm.includes(normalizedSearch);
    return branchOk && searchOk;
  }

  function shouldShow(person) {
    if (person.excludeFromTree) return false;
    if (!searchText && !branch) return true;
    if (personMatches(person)) return true;

    // Hiển thị tổ tiên nếu con cháu khớp
    let cursor = person;
    while (cursor && cursor.fatherId) {
      cursor = byId[cursor.fatherId];
      if (cursor && personMatches(cursor)) return true;
    }

    // Hiển thị con cái nếu cha mẹ khớp
    return people.some((candidate) => {
      const isChild = candidate.fatherId === person.id || candidate.motherId === person.id;
      return isChild && personMatches(candidate);
    });
  }

  const visiblePeople = people.filter((p) => !p.excludeFromTree && shouldShow(p));
  const visibleIds = new Set(visiblePeople.map((person) => person.id));

  // Đếm tổng số hậu duệ của 1 người để sắp xếp cân bằng
  function countDescendants(personId) {
    const children = getChildrenOfCouple(personId);
    let count = children.length;
    children.forEach((c) => {
      count += countDescendants(c.id);
    });
    return count;
  }

  // Lấy danh sách con cái của một cá nhân/cặp vợ chồng
  function getChildrenOfCouple(personId) {
    const person = byId[personId];
    if (!person) return [];

    const spouseIds = person.spouseIds || [];
    const parentIds = new Set([personId, ...spouseIds]);

    const children = [];
    const addedChildIds = new Set();

    visiblePeople.forEach((p) => {
      const isDirectChild = (p.fatherId && parentIds.has(p.fatherId)) || (p.motherId && parentIds.has(p.motherId));
      const isListedChild = (person.childrenIds || []).includes(p.id) || spouseIds.some((sId) => (byId[sId]?.childrenIds || []).includes(p.id));

      if ((isDirectChild || isListedChild) && !addedChildIds.has(p.id) && visibleIds.has(p.id)) {
        addedChildIds.add(p.id);
        children.push(p);
      }
    });

    return children;
  }

  // Sắp xếp con cái cân bằng (Center-weighted): Nhánh nặng nhất nằm ở giữa
  function getOrderedChildren(personId) {
    const children = getChildrenOfCouple(personId);
    if (children.length <= 2) return children;

    // Sắp xếp theo số lượng hậu duệ giảm dần
    const sorted = [...children].sort((a, b) => countDescendants(b.id) - countDescendants(a.id));

    // Đưa nhánh lớn nhất vào giữa, các nhánh nhỏ xen kẽ trái phải
    const balanced = [];
    sorted.forEach((item, idx) => {
      if (idx % 2 === 0) {
        balanced.push(item);
      } else {
        balanced.unshift(item);
      }
    });
    return balanced;
  }

  // Tìm các gốc (Roots)
  const rootPeople = visiblePeople.filter((p) => {
    const fatherVisible = p.fatherId && visibleIds.has(p.fatherId);
    const motherVisible = p.motherId && visibleIds.has(p.motherId);
    return !fatherVisible && !motherVisible;
  });

  const processedRoots = new Set();
  const primaryRoots = [];

  rootPeople.forEach((p) => {
    if (processedRoots.has(p.id)) return;
    processedRoots.add(p.id);
    (p.spouseIds || []).forEach((sId) => processedRoots.add(sId));
    primaryRoots.push(p);
  });

  const nodePositions = new Map();
  const visited = new Set();

  // Đo độ rộng cây con
  function measureSubtree(personId) {
    const person = byId[personId];
    if (!person) return CARD_WIDTH;

    const visibleSpouses = (person.spouseIds || []).filter((sId) => visibleIds.has(sId));
    const coupleWidth = CARD_WIDTH + visibleSpouses.length * (CARD_WIDTH + SPOUSE_GAP);

    const children = getChildrenOfCouple(personId);
    if (children.length === 0) {
      return coupleWidth;
    }

    let childrenWidth = 0;
    children.forEach((c, idx) => {
      childrenWidth += measureSubtree(c.id);
      if (idx < children.length - 1) childrenWidth += SIBLING_GAP;
    });

    return Math.max(coupleWidth, childrenWidth);
  }

  // Bố cục cây con
  function layoutCoupleAndChildren(personId, startX, genLevel) {
    const person = byId[personId];
    if (!person || visited.has(personId)) return;
    visited.add(personId);

    const visibleSpouses = (person.spouseIds || []).filter((sId) => visibleIds.has(sId) && !visited.has(sId));
    visibleSpouses.forEach((sId) => visited.add(sId));

    const totalSubtreeWidth = measureSubtree(personId);
    const coupleWidth = CARD_WIDTH + visibleSpouses.length * (CARD_WIDTH + SPOUSE_GAP);

    // Căn giữa cặp vợ chồng trong khung subtree
    const centerX = startX + totalSubtreeWidth / 2;
    const personX = centerX - coupleWidth / 2;
    const personY = (genLevel - 1) * LEVEL_HEIGHT;

    nodePositions.set(person.id, { x: personX, y: personY });

    visibleSpouses.forEach((sId, idx) => {
      const spouseX = personX + CARD_WIDTH + SPOUSE_GAP + idx * (CARD_WIDTH + SPOUSE_GAP);
      nodePositions.set(sId, { x: spouseX, y: personY });
    });

    // Bố trí các con theo thứ tự cân bằng
    const children = getOrderedChildren(personId);
    if (children.length > 0) {
      let childrenTotalWidth = 0;
      children.forEach((c, i) => {
        childrenTotalWidth += measureSubtree(c.id);
        if (i < children.length - 1) childrenTotalWidth += SIBLING_GAP;
      });

      let currentChildX = startX;
      if (childrenTotalWidth < totalSubtreeWidth) {
        currentChildX = centerX - childrenTotalWidth / 2;
      }

      children.forEach((child) => {
        const childW = measureSubtree(child.id);
        layoutCoupleAndChildren(child.id, currentChildX, child.gen || (genLevel + 1));
        currentChildX += childW + SIBLING_GAP;
      });
    }
  }

  // Đặt các nhánh gốc
  let currentStartX = 0;
  primaryRoots.forEach((root) => {
    const rootW = measureSubtree(root.id);
    layoutCoupleAndChildren(root.id, currentStartX, root.gen || 1);
    currentStartX += rootW + BRANCH_GAP;
  });

  // Bất kỳ node nào còn sót
  visiblePeople.forEach((p) => {
    if (!nodePositions.has(p.id)) {
      const genLevel = p.gen || 1;
      const y = (genLevel - 1) * LEVEL_HEIGHT;
      nodePositions.set(p.id, { x: currentStartX, y });
      currentStartX += CARD_WIDTH + SIBLING_GAP;
    }
  });

  // Căn chỉnh trục X về tâm 0
  const allX = [...nodePositions.values()].map((p) => p.x);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const centerXOffset = (minX + maxX) / 2;

  const nodes = visiblePeople.map((person) => {
    const pos = nodePositions.get(person.id) || { x: 0, y: 0 };
    const isFocus = searchText || branch ? personMatches(person) : false;

    return {
      id: person.id,
      type: 'person',
      position: {
        x: Math.round(pos.x - centerXOffset),
        y: pos.y,
      },
      data: {
        person,
        isFocus,
        isDim: (searchText || branch) && !isFocus,
      },
    };
  });

  const edges = [];
  visiblePeople.forEach((person) => {
    const parentId = person.fatherId || person.motherId;
    if (parentId && visibleIds.has(parentId)) {
      edges.push({
        id: `parent-${parentId}-${person.id}`,
        source: parentId,
        target: person.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#8f1f16', strokeWidth: 2.2 },
      });
    }

    (person.spouseIds || []).forEach((spouseId) => {
      if (visibleIds.has(spouseId) && person.id < spouseId) {
        edges.push({
          id: `spouse-${person.id}-${spouseId}`,
          source: person.id,
          target: spouseId,
          type: 'straight',
          style: { stroke: '#c79a42', strokeWidth: 2, strokeDasharray: '6 6' },
        });
      }
    });
  });

  return { nodes, edges };
}
