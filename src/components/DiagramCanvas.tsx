import React, { useState, useRef, useEffect } from 'react';
import type { SubDiagram, DiagramNode } from '../data/curriculum';

interface DiagramCanvasProps {
  subDiagram: SubDiagram;
  selectedNode: DiagramNode | null;
  onSelectNode: (node: DiagramNode | null) => void;
  breadcrumbs: string[];
  onNavigateBreadcrumb: (index: number) => void;
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  subDiagram,
  selectedNode,
  onSelectNode,
  breadcrumbs,
  onNavigateBreadcrumb,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset pan/zoom on diagram change
  useEffect(() => {
    resetZoom();
  }, [subDiagram.id]);

  const resetZoom = () => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    // Find boundary of nodes to center them
    if (subDiagram.nodes.length === 0) {
      setZoom(1);
      setPan({ x: 50, y: 50 });
      return;
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    subDiagram.nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x + n.width);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y + n.height);
    });

    const graphW = maxX - minX;
    const graphH = maxY - minY;
    
    const margin = 60;
    const scaleX = (width - margin * 2) / graphW;
    const scaleY = (height - margin * 2) / graphH;
    
    const newZoom = Math.min(1.5, Math.max(0.6, Math.min(scaleX, scaleY)));
    const panX = (width - graphW * newZoom) / 2 - minX * newZoom;
    const panY = (height - graphH * newZoom) / 2 - minY * newZoom;

    setZoom(newZoom);
    setPan({ x: panX, y: panY });
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Only drag if left click on the background canvas, not on nodes
    const target = e.target as SVGElement;
    if (target.closest('.node-group')) return;

    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const zoomFactor = 1.1;
    const nextZoom = e.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
    
    // Bound zoom between 0.3x and 3x
    const boundedZoom = Math.min(3, Math.max(0.3, nextZoom));
    
    // Zoom toward mouse pointer
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = mouseX - pan.x;
    const dy = mouseY - pan.y;

    setPan({
      x: mouseX - dx * (boundedZoom / zoom),
      y: mouseY - dy * (boundedZoom / zoom)
    });
    setZoom(boundedZoom);
  };

  // Helper for generating smart Bezier curve connections
  const getSmartEdgePath = (fromId: string, toId: string) => {
    const fromNode = subDiagram.nodes.find(n => n.id === fromId);
    const toNode = subDiagram.nodes.find(n => n.id === toId);

    if (!fromNode || !toNode) return '';

    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;

    let startX = fromNode.x + fromNode.width / 2;
    let startY = fromNode.y + fromNode.height / 2;
    let endX = toNode.x + toNode.width / 2;
    let endY = toNode.y + toNode.height / 2;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Connect horizontally
      if (dx > 0) {
        startX = fromNode.x + fromNode.width;
        endX = toNode.x;
      } else {
        startX = fromNode.x;
        endX = toNode.x + toNode.width;
      }
    } else {
      // Connect vertically
      if (dy > 0) {
        startY = fromNode.y + fromNode.height;
        endY = toNode.y;
      } else {
        startY = fromNode.y;
        endY = toNode.y + toNode.height;
      }
    }

    const controlOffset = Math.min(100, Math.max(40, Math.abs(endX - startX) / 2));
    if (Math.abs(dx) > Math.abs(dy)) {
      return `M ${startX} ${startY} C ${startX + (dx > 0 ? controlOffset : -controlOffset)} ${startY}, ${endX + (dx > 0 ? -controlOffset : controlOffset)} ${endY}, ${endX} ${endY}`;
    } else {
      return `M ${startX} ${startY} C ${startX} ${startY + (dy > 0 ? controlOffset : -controlOffset)}, ${endX} ${endY + (dy > 0 ? -controlOffset : controlOffset)}, ${endX} ${endY}`;
    }
  };

  const getSmartLabelPosition = (fromId: string, toId: string) => {
    const fromNode = subDiagram.nodes.find(n => n.id === fromId);
    const toNode = subDiagram.nodes.find(n => n.id === toId);

    if (!fromNode || !toNode) return { x: 0, y: 0 };

    // Simple midpoint calculation
    const midX = (fromNode.x + fromNode.width / 2 + toNode.x + toNode.width / 2) / 2;
    const midY = (fromNode.y + fromNode.height / 2 + toNode.y + toNode.height / 2) / 2;

    return { x: midX, y: midY };
  };

  return (
    <div className="canvas-wrapper" ref={containerRef}>
      <div className="canvas-instruction">
        🖱️ Drag canvas to pan • Scroll to zoom • Click nodes to explore
      </div>

      {/* SVG Canvas */}
      <svg
        className="canvas-svg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={(e) => {
          if ((e.target as SVGElement).tagName === 'svg') {
            onSelectNode(null);
          }
        }}
      >
        <defs>
          {/* Arrowhead marker definition */}
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--text-muted)" />
          </marker>
        </defs>

        {/* Group with pan & zoom transformation */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Connection Lines (Edges) */}
          {subDiagram.edges.map((edge, index) => {
            const path = getSmartEdgePath(edge.from, edge.to);
            const labelPos = getSmartLabelPosition(edge.from, edge.to);
            
            return (
              <g key={index}>
                <path
                  d={path}
                  fill="none"
                  stroke={edge.animated ? 'var(--color-primary)' : 'var(--text-muted)'}
                  strokeWidth={edge.animated ? 2 : 1.5}
                  markerEnd="url(#arrow)"
                  className={`svg-connection-line ${edge.animated ? 'animated' : ''}`}
                  opacity={selectedNode ? (selectedNode.id === edge.from || selectedNode.id === edge.to ? 0.9 : 0.25) : 0.6}
                  style={{
                    transition: 'opacity var(--transition-fast)'
                  }}
                />
                {edge.label && (
                  <g 
                    transform={`translate(${labelPos.x}, ${labelPos.y})`}
                    opacity={selectedNode ? (selectedNode.id === edge.from || selectedNode.id === edge.to ? 1 : 0.15) : 0.8}
                  >
                    <rect
                      x="-65"
                      y="-9"
                      width="130"
                      height="16"
                      rx="3"
                      fill="var(--bg-darker)"
                      stroke="var(--border-color)"
                      strokeWidth="0.5"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="var(--text-secondary)"
                      fontSize="9px"
                      fontWeight="500"
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Diagram Nodes */}
          {subDiagram.nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className={`node-group node-${node.type} ${isSelected ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node);
                }}
              >
                {/* Node Box */}
                <rect
                  width={node.width}
                  height={node.height}
                  className="node-rect"
                />

                {/* Node Type Stripe Header */}
                <rect
                  x="1.5"
                  y="1.5"
                  width={node.width - 3}
                  height="12"
                  fill={`var(--color-node-${node.type})`}
                  className="node-badge"
                  opacity="0.9"
                />
                
                <text
                  x={node.width / 2}
                  y="8"
                  textAnchor="middle"
                  className="node-type-text"
                >
                  {node.type}
                </text>

                {/* Node Label Text */}
                <text
                  x={node.width / 2}
                  y={node.height / 2 + 6}
                  textAnchor="middle"
                  className="node-title-text"
                >
                  {node.label}
                </text>

                {/* Zoom In/Sub-diagram Indicator */}
                {node.childDiagramId && (
                  <text
                    x={node.width - 15}
                    y={node.height - 8}
                    textAnchor="middle"
                    className="node-subdiagram-indicator"
                  >
                    🔍
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Control Buttons */}
      <div className="canvas-controls">
        <button className="btn" onClick={() => setZoom(z => Math.min(3, z * 1.2))} style={{ padding: '0.4rem 0.6rem' }}>+</button>
        <button className="btn" onClick={() => setZoom(z => Math.max(0.3, z / 1.2))} style={{ padding: '0.4rem 0.6rem' }}>-</button>
        <button className="btn" onClick={resetZoom} style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}>Center View</button>
      </div>

      {/* Breadcrumb path for sub-diagrams */}
      {breadcrumbs.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1.5rem',
            backgroundColor: 'rgba(24, 27, 40, 0.85)',
            backdropFilter: 'var(--glass-blur)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 5,
          }}
        >
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="breadcrumb-separator">/</span>}
              <span
                onClick={() => onNavigateBreadcrumb(idx)}
                style={{
                  cursor: idx < breadcrumbs.length - 1 ? 'pointer' : 'default',
                  color: idx < breadcrumbs.length - 1 ? 'var(--color-accent)' : 'var(--text-primary)',
                  textDecoration: idx < breadcrumbs.length - 1 ? 'underline' : 'none',
                }}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
