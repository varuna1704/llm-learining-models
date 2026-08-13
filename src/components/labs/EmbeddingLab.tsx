import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

interface VectorWord {
  word: string;
  x: number;
  y: number;
  category: 'monarch' | 'animal' | 'technology' | 'custom';
}

const INITIAL_WORDS: VectorWord[] = [
  { word: 'king', x: 20, y: 80, category: 'monarch' },
  { word: 'queen', x: 35, y: 75, category: 'monarch' },
  { word: 'prince', x: 25, y: 60, category: 'monarch' },
  { word: 'cat', x: 80, y: 20, category: 'animal' },
  { word: 'kitten', x: 85, y: 30, category: 'animal' },
  { word: 'dog', x: 70, y: 25, category: 'animal' },
  { word: 'computer', x: 30, y: 20, category: 'technology' },
  { word: 'software', x: 40, y: 30, category: 'technology' },
  { word: 'algorithm', x: 25, y: 35, category: 'technology' }
];

export const EmbeddingLab: React.FC = () => {
  const [words, setWords] = useState<VectorWord[]>(INITIAL_WORDS);
  const [wordA, setWordA] = useState('king');
  const [wordB, setWordB] = useState('queen');
  const [customWord, setCustomWord] = useState('');

  const getWordObj = (name: string) => words.find(w => w.word.toLowerCase() === name.toLowerCase());

  const objA = getWordObj(wordA) || words[0];
  const objB = getWordObj(wordB) || words[1];

  // Calculate Euclidean Distance & Simulated Cosine Similarity
  const dx = objA.x - objB.x;
  const dy = objA.y - objB.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const similarity = Math.max(0, (100 - distance) / 100);

  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWord.trim()) return;
    const newWord: VectorWord = {
      word: customWord.trim().toLowerCase(),
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 80) + 10,
      category: 'custom'
    };
    setWords(prev => [...prev, newWord]);
    setCustomWord('');
    markLabCompleted('embedding');
  };

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
          📐 Interactive Embedding Space Playground
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Embeddings translate words into high-dimensional vectors. Similar concepts cluster close together.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* 2D Vector Map Canvas */}
        <div style={{
          position: 'relative',
          height: '350px',
          backgroundColor: 'var(--bg-darker)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          {/* Axis Labels */}
          <span style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            Dimension X (Syntactic Role) ➔
          </span>
          <span style={{ position: 'absolute', top: '12px', left: '8px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            ▲ Dimension Y (Semantic Category)
          </span>

          {/* Grid lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <line x1={`${objA.x}%`} y1={`${100 - objA.y}%`} x2={`${objB.x}%`} y2={`${100 - objB.y}%`} stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4 2" />
          </svg>

          {/* Scatter Points */}
          {words.map((w, idx) => {
            const isSelected = w.word === objA.word || w.word === objB.word;
            let bgColor = '#8b5cf6';
            if (w.category === 'animal') bgColor = '#10b981';
            if (w.category === 'technology') bgColor = '#06b6d4';
            if (w.category === 'custom') bgColor = '#ec4899';

            return (
              <div
                key={idx}
                onClick={() => {
                  setWordA(w.word);
                  markLabCompleted('embedding');
                }}
                style={{
                  position: 'absolute',
                  left: `${w.x}%`,
                  bottom: `${w.y}%`,
                  transform: 'translate(-50%, 50%)',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '15px',
                  backgroundColor: bgColor,
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 12px #fff' : '0 2px 6px rgba(0,0,0,0.5)',
                  border: isSelected ? '2px solid #fff' : 'none',
                  zIndex: isSelected ? 5 : 2
                }}
              >
                {w.word}
              </div>
            );
          })}
        </div>

        {/* Cosine Similarity Calculator Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.75rem' }}>
              📊 Similarity Calculator
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Word A:</label>
                <select
                  value={wordA}
                  onChange={(e) => setWordA(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', backgroundColor: 'var(--bg-card)', color: '#fff', border: '1px solid var(--border-color)' }}
                >
                  {words.map(w => <option key={w.word} value={w.word}>{w.word}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Word B:</label>
                <select
                  value={wordB}
                  onChange={(e) => setWordB(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', backgroundColor: 'var(--bg-card)', color: '#fff', border: '1px solid var(--border-color)' }}
                >
                  {words.map(w => <option key={w.word} value={w.word}>{w.word}</option>)}
                </select>
              </div>
            </div>

            {/* Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cosine Similarity:</span>
                <strong style={{ color: 'var(--color-accent)' }}>{(similarity * 100).toFixed(1)}%</strong>
              </div>

              <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${similarity * 100}%`, backgroundColor: 'var(--color-accent)', transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                <span>Euclidean Distance: {distance.toFixed(2)} units</span>
                <span>Dim Size: 4,096</span>
              </div>
            </div>
          </div>

          {/* Vector Math Example */}
          <div style={{ padding: '0.8rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', fontSize: '0.8rem' }}>
            <strong style={{ color: '#c084fc', display: 'block', marginBottom: '0.2rem' }}>💡 Vector Algebra Formula:</strong>
            <code>vec("king") - vec("man") + vec("woman") ≈ vec("queen")</code>
          </div>

          {/* Custom Word Form */}
          <form onSubmit={handleAddCustomWord} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Add custom word to vector space..."
              value={customWord}
              onChange={(e) => setCustomWord(e.target.value)}
              style={{ flexGrow: 1, padding: '0.5rem 0.75rem', borderRadius: '6px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};
