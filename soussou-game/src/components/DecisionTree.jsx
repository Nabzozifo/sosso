import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Construit un arbre générique à partir de explorationResult
function buildTreeFromExploration(explorationResult) {
  if (explorationResult?.morphological_tree) {
    return explorationResult.morphological_tree;
  }
  const s = explorationResult?.morphological_decomposition?.structure || {};
  const order = ['thousands','hundreds','tens','units'];
  const children = order
    .filter(k => s[k] && Number(s[k]) > 0)
    .map(k => ({
      key: k,
      value: Number(s[k]),
      label: k,
      children: [],
    }));
  return {
    value: explorationResult?.number ?? 0,
    label: 'root',
    children,
  };
}

// Mesure récursive: largeur (en unités) et profondeur
function measureSubtree(node) {
  if (!node?.children || node.children.length === 0) {
    return { widthUnits: 1, depth: 1 };
  }
  let widthUnits = 0;
  let maxDepth = 0;
  for (const child of node.children) {
    const m = measureSubtree(child);
    widthUnits += m.widthUnits;
    maxDepth = Math.max(maxDepth, m.depth);
  }
  return { widthUnits, depth: maxDepth + 1 };
}

// Calcule positions en x/y pour chaque nœud avec centrage par largeur de sous-arbre
function layoutSubtree(node, xCenter, level, unitSpacing, levelHeight, positions) {
  const children = node.children || [];
  const isLeaf = children.length === 0;
  positions.push({ node, x: xCenter, y: level * levelHeight + 40, level });
  if (isLeaf) return;
  const measures = children.map(measureSubtree);
  const totalUnits = measures.reduce((sum, m) => sum + m.widthUnits, 0);
  let cursorUnits = -totalUnits/2;
  children.forEach((child, i) => {
    const childUnits = measures[i].widthUnits;
    const childCenterUnits = cursorUnits + childUnits/2;
    const childX = xCenter + childCenterUnits * unitSpacing;
    layoutSubtree(child, childX, level + 1, unitSpacing, levelHeight, positions);
    cursorUnits += childUnits;
  });
}

const DecisionTree = ({ explorationResult }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 600, height: 360 });
  const treeData = useMemo(() => buildTreeFromExploration(explorationResult), [explorationResult]);
  const measured = useMemo(() => measureSubtree(treeData), [treeData]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = Math.max(320, Math.floor(entry.contentRect.width));
        const h = Math.max(260, measured.depth * 120);
        setSize({ width: w, height: h });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [measured.depth]);

  // Calcul layout
  const unitSpacing = Math.max(80, size.width / Math.max(4, measured.widthUnits + 1));
  const levelHeight = Math.max(110, size.height / Math.max(3, measured.depth));
  const positions = [];
  layoutSubtree(treeData, size.width / 2, 0, unitSpacing, levelHeight, positions);

  // Créer index des positions pour dessiner les arêtes
  const nodesByRef = new Map();
  positions.forEach(p => nodesByRef.set(p.node, p));

  // Générer les arêtes parent→enfant
  const edges = [];
  positions.forEach(p => {
    const parent = p.node;
    const children = parent.children || [];
    children.forEach(child => {
      const cPos = nodesByRef.get(child);
      if (cPos) {
        edges.push({ from: p, to: cPos });
      }
    });
  });

  // Utilitaires d’affichage
  const labelFor = (node) => {
    if (node.label && node.label !== 'root') {
      const l = node.label.toLowerCase();
      if (l.includes('thousand') || l.includes('mill')) return 'Milliers';
      if (l.includes('hundred') || l.includes('cent')) return 'Centaines';
      if (l.includes('ten') || l.includes('diz')) return 'Dizaines';
      if (l.includes('unit') || l.includes('uni')) return 'Unités';
      return node.label;
    }
    return 'Nombre';
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
        className="rounded-xl border border-emerald-200 bg-white"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Lignes courbes animées */}
        {edges.map((e, i) => {
          const x1 = e.from.x, y1 = e.from.y + 20;
          const x2 = e.to.x, y2 = e.to.y - 20;
          const path = `M ${x1},${y1} C ${x1},${(y1+y2)/2} ${x2},${(y1+y2)/2} ${x2},${y2}`;
          return (
            <motion.path
              key={`edge-${i}`}
              d={path}
              fill="none"
              stroke="#10b981"
              strokeWidth={3}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.6 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
            />
          );
        })}

        {/* Nœuds */}
        {positions.map((p, i) => {
          const isRoot = p.level === 0;
          const fill = isRoot ? '#fef3c7' : '#ecfeff';
          const stroke = isRoot ? '#f59e0b' : '#06b6d4';
          return (
            <motion.g
              key={`node-${i}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <circle cx={p.x} cy={p.y} r={isRoot ? 26 : 20} fill={fill} stroke={stroke} strokeWidth={3} />
              {/* Etiquette principale */}
              <text x={p.x} y={p.y - (isRoot ? 34 : 28)} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#374151">
                {labelFor(p.node)}
              </text>
              {/* Valeur */}
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={isRoot ? 16 : 14} fontWeight="bold" fill="#111827">
                {String(p.node.value ?? '')}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

export default DecisionTree;