import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChatTutor } from './ChatTutor';

const mockSearchIndex = {
  embeddings: {
    "token": [0.1, 0.2, 0.3],
    "term_b": [0.4, 0.5, 0.6]
  },
  searchIndex: [
    {
      type: 'glossary',
      title: 'Attention',
      content: 'attention mechanism focusing on inputs',
      targetId: 'token'
    },
    {
      type: 'node',
      title: 'Tokenization',
      content: 'tokens are chunks of text',
      targetId: 'term_b',
      topicSlug: 'token-embeddings-attention',
      subDiagramId: 'tea_flow_root',
      nodeLabel: 'Tokenization',
      shortExplanation: 'BPE chunks',
      simpleExplanation: 'letters to blocks',
      detailedExplanation: 'tiktoken tiktoken tiktoken',
      topicTitle: 'Tokenization, Embeddings & Attention'
    }
  ],
  idfs: {
    "attention": 0.5,
    "tokens": 0.5
  },
  documentVectors: [
    { targetId: "token", tfMap: { "attention": 5 } },
    { targetId: "term_b", tfMap: { "tokens": 5 } }
  ]
};

describe('ChatTutor Component', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockSearchIndex)
      })
    ));
  });

  it('renders chat tutor and submits search', async () => {
    const onNavigateToNode = vi.fn();
    const onNavigateToGlossary = vi.fn();

    render(
      <ChatTutor
        onNavigateToNode={onNavigateToNode}
        onNavigateToGlossary={onNavigateToGlossary}
      />
    );

    // Verify welcome message is in the document
    expect(screen.getByText(/I am your Semantic AI Tutor/)).toBeTruthy();

    // Input query
    const input = screen.getByPlaceholderText(/Ask a question/);
    fireEvent.change(input, { target: { value: 'Attention' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: '➜' });
    fireEvent.click(submitBtn);

    // Wait for the simulated delay and check response
    await waitFor(() => {
      expect(screen.getByText(/View Glossary: Token/)).toBeTruthy();
    }, { timeout: 1000 });
  });
});
