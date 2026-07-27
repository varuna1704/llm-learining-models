import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DiagramCanvas } from './DiagramCanvas';
import type { SubDiagram } from '../data/curriculum';

const mockSubDiagram: SubDiagram = {
  id: 'test_sub',
  title: 'Test Sub-diagram',
  nodes: [
    {
      id: 'node_a',
      label: 'Node A',
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      type: 'concept',
      shortExplanation: 'Explanation A',
      detailedExplanation: 'Detail A',
      simpleExplanation: 'Simple A'
    },
    {
      id: 'node_b',
      label: 'Node B',
      x: 200,
      y: 0,
      width: 100,
      height: 50,
      type: 'concept',
      shortExplanation: 'Explanation B',
      detailedExplanation: 'Detail B',
      simpleExplanation: 'Simple B'
    }
  ],
  edges: [
    { from: 'node_a', to: 'node_b', label: 'Edge A-B', animated: true }
  ]
};

describe('DiagramCanvas Component', () => {
  it('renders nodes and edge paths correctly', () => {
    const onSelectNode = vi.fn();
    const onNavigateBreadcrumb = vi.fn();
    const onZoomChange = vi.fn();
    const onPanChange = vi.fn();

    const { container } = render(
      <DiagramCanvas
        subDiagram={mockSubDiagram}
        selectedNode={null}
        onSelectNode={onSelectNode}
        breadcrumbs={['Root']}
        onNavigateBreadcrumb={onNavigateBreadcrumb}
        zoom={1}
        onZoomChange={onZoomChange}
        pan={{ x: 0, y: 0 }}
        onPanChange={onPanChange}
      />
    );

    // Verify nodes are rendered
    expect(container.textContent).toContain('Node A');
    expect(container.textContent).toContain('Node B');

    // Verify edge path is rendered (SVG path element)
    const paths = Array.from(container.querySelectorAll('path'));
    expect(paths.length).toBeGreaterThan(0);

    // Verify Bezier path calculation generates a valid path attribute containing C (Cubic Bezier)
    const bezierPath = paths.find(p => p.getAttribute('d')?.includes('C'));
    expect(bezierPath).toBeTruthy();
    const dAttribute = bezierPath!.getAttribute('d');
    expect(dAttribute).toContain('M'); // Moves to start point
  });
});
