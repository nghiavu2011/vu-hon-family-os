/**
 * Thuật toán tính toán quan hệ họ tộc & xưng hô theo phong tục Việt Nam
 */

// Lấy danh sách tổ tiên trực hệ (đường cha/mẹ) kèm khoảng cách đời
export function getAncestorsPath(personId, peopleMap) {
  const path = [];
  let curr = peopleMap.get(personId);
  let distance = 0;

  while (curr) {
    path.push({ person: curr, distance });
    if (curr.fatherId && peopleMap.has(curr.fatherId)) {
      curr = peopleMap.get(curr.fatherId);
    } else if (curr.motherId && peopleMap.has(curr.motherId)) {
      curr = peopleMap.get(curr.motherId);
    } else {
      break;
    }
    distance++;
  }
  return path;
}

// Tìm tổ tiên chung gần nhất (LCA)
export function findLowestCommonAncestor(idA, idB, people) {
  const peopleMap = new Map(people.map((p) => [p.id, p]));
  const pathA = getAncestorsPath(idA, peopleMap);
  const pathB = getAncestorsPath(idB, peopleMap);

  for (const a of pathA) {
    for (const b of pathB) {
      if (a.person.id === b.person.id) {
        return {
          commonAncestor: a.person,
          distA: a.distance,
          distB: b.distance,
        };
      }
    }
  }
  return null;
}

/**
 * Tính toán quan hệ xưng hô từ A đối với B
 * @param {string} idA - ID của Người xưng (Tôi)
 * @param {string} idB - ID của Người được gọi
 * @param {Array} people - Danh sách thành viên
 */
export function calculateKinship(idA, idB, people) {
  if (!idA || !idB) return null;
  if (idA === idB) {
    return {
      relation: 'Chính bản thân bạn',
      callB: 'Tôi / Bản thân',
      bCallsA: 'Tôi / Bản thân',
      description: 'Hai người là một cá nhân.',
      pathInfo: 'Cùng một vị trí trên cây phả hệ.',
    };
  }

  const peopleMap = new Map(people.map((p) => [p.id, p]));
  const personA = peopleMap.get(idA);
  const personB = peopleMap.get(idB);

  if (!personA || !personB) return null;

  // Kiểm tra quan hệ vợ chồng trực tiếp
  if (personA.spouseIds && personA.spouseIds.includes(idB)) {
    const callB = personB.gender === 'female' ? 'Vợ / Bà nhà' : 'Chồng / Ông nhà';
    const bCallsA = personA.gender === 'female' ? 'Vợ / Bà nhà' : 'Chồng / Ông nhà';
    return {
      relation: 'Phối ngẫu (Vợ chồng)',
      callB,
      bCallsA,
      description: `${personA.name} và ${personB.name} là vợ chồng.`,
      pathInfo: 'Hôn phối trực tiếp',
    };
  }

  const lca = findLowestCommonAncestor(idA, idB, people);

  if (!lca) {
    // Không tìm thấy chung nhánh trực hệ gần, xét theo thế hệ (gen)
    const deltaGen = (personA.gen || 0) - (personB.gen || 0);
    if (deltaGen > 0) {
      return {
        relation: `Bề trên đồng tộc (Cách ${deltaGen} đời)`,
        callB: deltaGen === 1 ? 'Bác / Chú / Cô trong họ' : deltaGen === 2 ? 'Ông / Bà trong họ' : 'Cụ / Tiền nhân trong họ',
        bCallsA: deltaGen === 1 ? 'Cháu trong họ' : 'Cháu chắt trong họ',
        description: `Cùng dòng tộc họ Vũ, thuộc thế hệ tiền bối (Đời ${personB.gen || '?'} so với Đời ${personA.gen || '?'}).`,
        pathInfo: `Khác nhánh ghi chép, cách nhau ${deltaGen} thế hệ.`,
      };
    } else if (deltaGen < 0) {
      const absGen = Math.abs(deltaGen);
      return {
        relation: `Hậu bối đồng tộc (Kém ${absGen} đời)`,
        callB: absGen === 1 ? 'Cháu trong họ' : 'Cháu chắt trong họ',
        bCallsA: absGen === 1 ? 'Bác / Chú / Cô' : 'Ông / Bà / Cụ',
        description: `Cùng dòng tộc họ Vũ, thuộc hàng con cháu hậu bối (Đời ${personB.gen || '?'} so với Đời ${personA.gen || '?'}).`,
        pathInfo: `Khác nhánh ghi chép, kém ${absGen} thế hệ.`,
      };
    } else {
      return {
        relation: 'Đồng bối trong họ (Cùng đời)',
        callB: 'Anh / Chị / Em trong họ',
        bCallsA: 'Anh / Chị / Em trong họ',
        description: `Cùng đời thứ ${personA.gen || '?'}, là anh chị em đồng tộc.`,
        pathInfo: 'Cùng thế hệ trong tộc họ Vũ.',
      };
    }
  }

  const { commonAncestor, distA, distB } = lca;
  const genderB = personB.gender || 'male';

  // 1. Trực hệ: B là tổ tiên trực hệ của A (distB === 0)
  if (distB === 0) {
    if (distA === 1) {
      return {
        relation: genderB === 'female' ? 'Mẹ đẻ' : 'Cha đẻ',
        callB: genderB === 'female' ? 'Mẹ / U / Mẫu thân' : 'Cha / Bố / Thân phụ',
        bCallsA: 'Con',
        description: `${personB.name} là bậc sinh thành ra ${personA.name}.`,
        pathInfo: 'Huyết thống trực hệ 1 đời.',
      };
    }
    if (distA === 2) {
      return {
        relation: genderB === 'female' ? 'Bà nội' : 'Ông nội',
        callB: genderB === 'female' ? 'Bà nội' : 'Ông nội',
        bCallsA: 'Cháu nội',
        description: `${personB.name} là ông/bà nội của ${personA.name}.`,
        pathInfo: 'Huyết thống trực hệ 2 đời.',
      };
    }
    if (distA === 3) {
      return {
        relation: genderB === 'female' ? 'Cụ bà (Cố nội)' : 'Cụ ông (Cố nội)',
        callB: genderB === 'female' ? 'Cụ bà' : 'Cụ ông',
        bCallsA: 'Chắt nội',
        description: `${personB.name} là Cụ cố của ${personA.name}.`,
        pathInfo: 'Huyết thống trực hệ 3 đời.',
      };
    }
    return {
      relation: `Tiền nhân đời thứ ${personB.gen || 1} (Cách ${distA} đời)`,
      callB: `Cụ tổ / Đức tiền bối (${personB.name})`,
      bCallsA: 'Hậu duệ / Cháu chắt',
      description: `${personB.name} là Thủy tổ/Viễn tổ trực hệ của ${personA.name}.`,
      pathInfo: `Cách ${distA} đời trực hệ (qua gốc ${commonAncestor.name}).`,
    };
  }

  // 2. Trực hệ: A là tổ tiên trực hệ của B (distA === 0)
  if (distA === 0) {
    if (distB === 1) {
      return {
        relation: 'Con đẻ',
        callB: 'Con',
        bCallsA: personA.gender === 'female' ? 'Mẹ' : 'Cha',
        description: `${personB.name} là con của ${personA.name}.`,
        pathInfo: 'Huyết thống trực hệ 1 đời.',
      };
    }
    if (distB === 2) {
      return {
        relation: 'Cháu nội',
        callB: 'Cháu',
        bCallsA: personA.gender === 'female' ? 'Bà nội' : 'Ông nội',
        description: `${personB.name} là cháu nội của ${personA.name}.`,
        pathInfo: 'Huyết thống trực hệ 2 đời.',
      };
    }
    return {
      relation: `Hậu duệ (Cách ${distB} đời)`,
      callB: 'Cháu / Hậu duệ',
      bCallsA: `Cụ / Ông (${personA.name})`,
      description: `${personB.name} là hậu duệ đời sau của ${personA.name}.`,
      pathInfo: `Hậu duệ cách ${distB} thế hệ.`,
    };
  }

  // 3. Anh chị em ruột (Chung cha mẹ: distA === 1 && distB === 1)
  if (distA === 1 && distB === 1) {
    const callB = genderB === 'female' ? 'Chị gái / Em gái' : 'Anh trai / Em trai';
    return {
      relation: 'Anh chị em ruột',
      callB,
      bCallsA: personA.gender === 'female' ? 'Chị gái / Em gái' : 'Anh trai / Em trai',
      description: `Cùng là con của ${commonAncestor.name}.`,
      pathInfo: `Chung thân sinh (${commonAncestor.name}).`,
    };
  }

  // 4. Bàng hệ cùng thế hệ (distA === distB): Anh chị em họ
  if (distA === distB) {
    const callB = genderB === 'female' ? 'Chị họ / Em họ' : 'Anh họ / Em họ';
    return {
      relation: distA === 2 ? 'Anh chị em họ (Đồng chi, chung Ông/Bà)' : `Anh chị em đồng tộc (Chung cụ ${commonAncestor.name})`,
      callB,
      bCallsA: personA.gender === 'female' ? 'Chị họ / Em họ' : 'Anh họ / Em họ',
      description: `Cùng thế hệ đời thứ ${personA.gen || '?'}, chung gốc là ${commonAncestor.name}.`,
      pathInfo: `Chung tổ phụ ${commonAncestor.name} (cách ${distA} đời).`,
    };
  }

  // 5. Bàng hệ lệch 1 đời (distA - distB === 1): B là bề trên
  if (distA - distB === 1) {
    const callB = genderB === 'female' ? 'Cô họ / Dì họ' : 'Bác họ / Chú họ';
    return {
      relation: genderB === 'female' ? 'Cô/Dì họ (Hàng cha chú)' : 'Bác/Chú họ (Hàng cha chú)',
      callB,
      bCallsA: 'Cháu họ',
      description: `${personB.name} ngang hàng với cha mẹ của ${personA.name}.`,
      pathInfo: `Chung gốc ${commonAncestor.name}, B ở bề trên cách 1 thế hệ.`,
    };
  }

  // 6. Bàng hệ lệch 1 đời (distB - distA === 1): B là hàng cháu
  if (distB - distA === 1) {
    return {
      relation: 'Cháu họ (Hàng con cháu)',
      callB: 'Cháu họ',
      bCallsA: personA.gender === 'female' ? 'Cô họ / Dì họ' : 'Bác họ / Chú họ',
      description: `${personB.name} là con của anh chị em họ của ${personA.name}.`,
      pathInfo: `Chung gốc ${commonAncestor.name}, B ở hàng cháu.`,
    };
  }

  // 7. Bàng hệ lệch 2 đời: Ông trẻ/Bà cô tổ hoặc Cháu tôn họ
  if (distA - distB === 2) {
    const callB = genderB === 'female' ? 'Bà cô họ / Bà trẻ' : 'Ông chú họ / Ông bác họ / Ông trẻ';
    return {
      relation: genderB === 'female' ? 'Bà cô/Bà trẻ họ' : 'Ông trẻ/Ông bác họ',
      callB,
      bCallsA: 'Cháu gọi bằng ông/bà',
      description: `${personB.name} ngang hàng với ông bà nội của ${personA.name}.`,
      pathInfo: `Chung gốc ${commonAncestor.name}, B ở thế hệ ông bà.`,
    };
  }

  if (distB - distA === 2) {
    return {
      relation: 'Cháu tôn họ (Hàng cháu nội của anh em họ)',
      callB: 'Cháu họ',
      bCallsA: personA.gender === 'female' ? 'Bà cô / Bà trẻ' : 'Ông trẻ / Ông bác',
      description: `${personB.name} là hàng cháu nội ngang hàng với ${personA.name}.`,
      pathInfo: `Chung gốc ${commonAncestor.name}, B ở hàng cháu đời thứ hai.`,
    };
  }

  // Khác biệt nhiều đời
  const delta = distA - distB;
  if (delta > 0) {
    return {
      relation: `Bề trên đồng tộc (Cách ${delta} đời)`,
      callB: delta >= 3 ? 'Cụ họ / Đức tiền bối' : 'Ông/Bà họ',
      bCallsA: 'Cháu chắt trong họ',
      description: `${personB.name} thuộc hàng tiền bối của ${personA.name} qua gốc ${commonAncestor.name}.`,
      pathInfo: `Chung gốc ${commonAncestor.name}.`,
    };
  } else {
    return {
      relation: `Hậu bối đồng tộc (Kém ${Math.abs(delta)} đời)`,
      callB: 'Cháu chắt họ',
      bCallsA: Math.abs(delta) >= 3 ? 'Cụ trong họ' : 'Ông/Bà trong họ',
      description: `${personB.name} là hàng con cháu hậu duệ của nhánh chung ${commonAncestor.name}.`,
      pathInfo: `Chung gốc ${commonAncestor.name}.`,
    };
  }
}
