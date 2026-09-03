import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useEdgesState,
  useNodesState,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import PersonNode from './PersonNode.jsx';
import { buildFlowGraph } from '../lib/tree.js';
import { getBranches, stripVietnamese } from '../lib/utils.js';
import { recordSearchQuery } from '../services/analyticsService.js';

const nodeTypes = { person: PersonNode };

function FamilyTreeInner({ people, onSelect }) {
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const branches = useMemo(() => getBranches(people), [people]);

  const graph = useMemo(() => {
    const result = buildFlowGraph({
      people,
      searchText: stripVietnamese(search),
      branch,
    });

    return {
      nodes: result.nodes.map((node) => ({
        ...node,
        data: { ...node.data, onSelect },
      })),
      edges: result.edges,
    };
  }, [people, search, branch, onSelect]);

  const [nodes, , onNodesChange] = useNodesState(graph.nodes);
  const [edges, , onEdgesChange] = useEdgesState(graph.edges);
  const { fitView } = useReactFlow();

  // React Flow state initializers are not automatically replaced; graph is used as key below.
  const graphKey = `${search}-${branch}-${graph.nodes.length}-${graph.edges.length}`;

  const handleFit = useCallback(() => {
    setTimeout(() => fitView({ padding: 0.18, duration: 500 }), 50);
  }, [fitView]);

  return (
    <div className="flowShell" id="tree">
      <div className="sectionHead wrap">
        <div>
          <h2>Cây Phả Hệ Tộc Họ Trực Quan</h2>
          <p className="sub">Bản đồ huyết hệ tương tác: Phóng to/thu nhỏ, tìm kiếm danh tính tiền nhân và tra cứu hồ sơ thế thứ các đời.</p>
        </div>
      </div>

      <div className="flowPanel">
        <ReactFlow
          key={graphKey}
          nodes={graph.nodes}
          edges={graph.edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.12}
          maxZoom={1.6}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        >
          <Background gap={26} size={1} color="rgba(105,67,33,.24)" />
          <MiniMap pannable zoomable nodeStrokeWidth={3} />
          <Controls />
          <Panel position="top-left" className="flowToolbar">
            <input
              value={search}
              onChange={(event) => {
                const val = event.target.value;
                setSearch(val);
                if (val.trim().length >= 3) {
                  recordSearchQuery(val);
                }
              }}
              placeholder="🔍 Tìm: Vũ Thành, Dũng, Nghĩa..."
              className="treeSearchInput"
            />
            <select value={branch} onChange={(event) => setBranch(event.target.value)} className="treeBranchSelect">
              <option value="">Tất cả chi nhánh (Toàn tộc)</option>
              {branches.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button className="btn primary" onClick={handleFit} type="button">🎯 Fit Cây</button>

            <div className="quickBranchPills">
              <button
                type="button"
                className={`branchPill ${branch === '' ? 'active' : ''}`}
                onClick={() => { setBranch(''); handleFit(); }}
              >
                Toàn họ
              </button>
              <button
                type="button"
                className={`branchPill ${branch === 'Chi Vũ Thành' ? 'active' : ''}`}
                onClick={() => { setBranch('Chi Vũ Thành'); handleFit(); }}
              >
                Chi Vũ Thành (7 đời)
              </button>
              <button
                type="button"
                className={`branchPill ${branch === 'Chi Vũ Ngọc Điền' ? 'active' : ''}`}
                onClick={() => { setBranch('Chi Vũ Ngọc Điền'); handleFit(); }}
              >
                Chi Vũ Ngọc Điền
              </button>
              <button
                type="button"
                className={`branchPill ${branch === 'Chi Vũ Điền' ? 'active' : ''}`}
                onClick={() => { setBranch('Chi Vũ Điền'); handleFit(); }}
              >
                Chi Vũ Điền
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

export default function FamilyTree(props) {
  return (
    <ReactFlowProvider>
      <FamilyTreeInner {...props} />
    </ReactFlowProvider>
  );
}
