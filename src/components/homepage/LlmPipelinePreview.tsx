import React, { useState } from 'react';

interface PipelineStage {
  id: string;
  title: string;
  type: string;
  icon: string;
  overview: string;
  beginner: string;
  technical: string;
  math?: string;
  code?: string;
  analogy: string;
}

const STAGES: PipelineStage[] = [
  {
    id: 'user_input',
    title: 'User Input',
    type: 'Input',
    icon: '👤',
    overview: 'The human user enters raw text prompt or question into the system.',
    beginner: 'You type a message like "Explain quantum physics in plain English."',
    technical: 'Raw UTF-8 string is received by the application API endpoint.',
    analogy: 'Posting a letter into a mailbox.'
  },
  {
    id: 'prompt_prep',
    title: 'Prompt Assembly',
    type: 'Input',
    icon: '📝',
    overview: 'Combines user input with system instructions and chat history.',
    beginner: 'The app wraps your question with hidden instructions (e.g. "Be helpful and concise").',
    technical: 'Constructs the full context window string using model template tags (e.g., `<|im_start|>system...`).',
    analogy: 'Adding a cover letter and reference documents to a job application.'
  },
  {
    id: 'tokenizer',
    title: 'Tokenizer',
    type: 'Process',
    icon: '✂️',
    overview: 'Splits continuous raw text into discrete sub-word tokens.',
    beginner: 'Breaks long words into chunks the computer recognizes (e.g., "unbreakable" → "un", "break", "able").',
    technical: 'Executes Byte-Pair Encoding (BPE) or WordPiece dictionary lookup to map text fragments to vocabulary indices.',
    code: `def tokenize(text: str) -> list[int]:\n    # Lookup in 100,000 token vocabulary\n    return tokenizer.encode(text)`,
    analogy: 'Slicing a loaf of bread into uniform slices for a toaster.'
  },
  {
    id: 'token_ids',
    title: 'Token IDs',
    type: 'Process',
    icon: '🔢',
    overview: 'Converts sub-word string tokens into numerical integer IDs.',
    beginner: 'Replaces words with number codes like [15496, 995, 342].',
    technical: 'Output array of integers representing positions in the model\'s embedding matrix lookup table.',
    analogy: 'Assigning barcoded numbers to items in a warehouse.'
  },
  {
    id: 'embeddings',
    title: 'Input Embeddings',
    type: 'Process',
    icon: '📐',
    overview: 'Converts integer Token IDs into dense high-dimensional vectors.',
    beginner: 'Maps each number to a 4,096-dimensional point in mathematical space where similar meanings are close together.',
    technical: 'Lookup table matrix multiplication $E \\in \\mathbb{R}^{|V| \\times d_{model}}$ yielding shape $[batch, seq\\_len, d_{model}]$.',
    math: 'E(t) = W_{embed}[t]',
    analogy: 'Placing cities on a 3D map where distance represents semantic similarity.'
  },
  {
    id: 'positional_encoding',
    title: 'Positional Encoding',
    type: 'Process',
    icon: '📍',
    overview: 'Adds word order information into the embedding vectors.',
    beginner: 'Transformers process all words at once, so this tag tells the model which word came first, second, third, etc.',
    technical: 'Adds sinusoidal waves or RoPE (Rotary Position Embeddings) to token vectors to encode sequence distance.',
    math: 'PE_{(pos, 2i)} = \\sin(pos / 10000^{2i/d})',
    analogy: 'Adding page numbers to loose pages in a manuscript.'
  },
  {
    id: 'transformer_layers',
    title: 'Transformer Stack',
    type: 'Architecture',
    icon: '🧱',
    overview: 'Passes vectors through N identical transformer layers (e.g., 32 to 96 layers).',
    beginner: 'A stack of deep processing stages where words exchange context and refine their meanings.',
    technical: 'Iteratively refines hidden representations via Self-Attention and Feed-Forward networks.',
    analogy: 'An assembly line where each worker refines a product before handing it to the next.'
  },
  {
    id: 'self_attention',
    title: 'Self-Attention',
    type: 'Mechanism',
    icon: '👁️',
    overview: 'Calculates how much attention each word should pay to every other word in the prompt.',
    beginner: 'In "The cat sat on the mat because it was tired", attention helps the model know "it" refers to the "cat".',
    technical: 'Computes Query ($Q$), Key ($K$), and Value ($V$) matrices to produce attention score weights.',
    math: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
    analogy: 'A group discussion where everyone listens to the relevant speaker.'
  },
  {
    id: 'multi_head_attention',
    title: 'Multi-Head Attention',
    type: 'Mechanism',
    icon: '🎭',
    overview: 'Runs multiple self-attention heads simultaneously to focus on different aspects of text.',
    beginner: 'One head tracks grammar, another tracks pronoun references, and another tracks subject-verb ties.',
    technical: 'Splits $d_{model}$ across $h$ parallel heads (e.g. 32 heads of size 128) and concatenates outputs.',
    analogy: 'A panel of experts analyzing a document from different perspectives simultaneously.'
  },
  {
    id: 'ffn',
    title: 'Feed-Forward Network (FFN)',
    type: 'Architecture',
    icon: '⚙️',
    overview: 'Applies non-linear transformations to store and retrieve factual knowledge.',
    beginner: 'The model\'s "knowledge engine" that recalls facts, definitions, and reasoning patterns.',
    technical: 'Two-layer MLP with SwiGLU or GELU activation functions that expands and contracts hidden dimension ($d_{ff} = 4 \\times d_{model}$).',
    analogy: 'Consulting an encyclopedia after gathering context.'
  },
  {
    id: 'residual_connections',
    title: 'Residual Connections & LayerNorm',
    type: 'Architecture',
    icon: '⚡',
    overview: 'Adds previous layer inputs back to outputs and stabilizes numerical scales.',
    beginner: 'Prevents the model from forgetting earlier information as data passes deep through 80+ layers.',
    technical: '$x_{out} = \\text{LayerNorm}(x + \\text{SubLayer}(x))$ prevents vanishing gradients during deep backprop.',
    analogy: 'Taking notes while reading so you don\'t lose the original context.'
  },
  {
    id: 'logits',
    title: 'Logits Generation',
    type: 'Output',
    icon: '📊',
    overview: 'Projects final layer hidden states into raw unnormalized prediction scores for all vocabulary tokens.',
    beginner: 'Generates a score for every single word in the dictionary for what should come next.',
    technical: 'Matrix multiplication of final hidden state $h_L$ against vocabulary LM head matrix $W_{lm\\_head}$.',
    math: 'z = h_L \\cdot W_{lm\\_head}',
    analogy: 'A scorecard listing votes for candidates in an election.'
  },
  {
    id: 'softmax',
    title: 'Softmax Probabilities',
    type: 'Output',
    icon: '📈',
    overview: 'Converts raw logit scores into a valid probability distribution summing to 100%.',
    beginner: 'Turns scores into percentages (e.g., "Paris": 94%, "London": 3%, "city": 1%).',
    technical: 'Applies exponentiation and normalization: $P(w_i) = \\frac{e^{z_i}}{\\sum_j e^{z_j}}$.',
    math: 'P(y_i | x) = \\frac{e^{z_i}}{\\sum_{k} e^{z_k}}',
    analogy: 'Converting votes into percentage market share.'
  },
  {
    id: 'sampling',
    title: 'Sampling & Decoding',
    type: 'Output',
    icon: '🎲',
    overview: 'Applies Temperature, Top-K, and Top-P (Nucleus) settings to select the next token.',
    beginner: 'Decides whether to pick the strictly most probable token or allow creative variation.',
    technical: 'Modifies logit logits: $z\' = z / T$, truncates candidate set via Top-P cumulative sum, and samples.',
    analogy: 'Rolling a weighted die to select the winning word.'
  },
  {
    id: 'output_token',
    title: 'Output Token',
    type: 'Output',
    icon: '🔤',
    overview: 'The single winning token generated for this step.',
    beginner: 'The model outputs one word snippet (e.g. "Paris").',
    technical: 'Token is appended to the context sequence for the next iteration.',
    analogy: 'Placing a single letter tile on a Scrabble board.'
  },
  {
    id: 'autoregressive_loop',
    title: 'Autoregressive Loop',
    type: 'Loop',
    icon: '🔄',
    overview: 'Feeds the generated token back into the input and repeats the entire pipeline.',
    beginner: 'The model reads its own output and predicts the next token, one by one, until complete.',
    technical: 'KV-cache accelerates subsequent passes by avoiding re-computation of previous token keys and values.',
    analogy: 'A storyteller speaking one word at a time, building a continuous narrative.'
  },
  {
    id: 'final_response',
    title: 'Final Streamed Response',
    type: 'Output',
    icon: '✨',
    overview: 'Decodes generated token IDs back into natural text and streams it to the user.',
    beginner: 'You see the complete answer appear on your screen in real time.',
    technical: 'Detokenizer maps token array to UTF-8 text string stream until `<|endoftext|>` token is emitted.',
    analogy: 'Publishing the completed printed book.'
  }
];

export const LlmPipelinePreview: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(STAGES[2]); // Default Tokenizer

  return (
    <div style={{ margin: '2rem 0', width: '100%' }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', marginBottom: '0.5rem' }}>
          🔄 The Complete LLM Execution Lifecycle
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '700px', margin: '0 auto' }}>
          Click any stage in the interactive 17-step pipeline to inspect how text transforms from raw user input into self-attention vectors and autoregressive output tokens.
        </p>
      </div>

      {/* Horizontal Scrollable Pipeline Track */}
      <div style={{
        display: 'flex',
        gap: '0.6rem',
        overflowX: 'auto',
        padding: '1.2rem 0.5rem',
        backgroundColor: 'var(--bg-dark)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem'
      }}>
        {STAGES.map((stage, idx) => {
          const isSelected = selectedStage.id === stage.id;
          return (
            <React.Fragment key={stage.id}>
              {idx > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  ➔
                </div>
              )}
              <div
                onClick={() => setSelectedStage(stage)}
                style={{
                  minWidth: '130px',
                  padding: '0.8rem 0.6rem',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-card)',
                  border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 15px rgba(139, 92, 246, 0.3)' : 'none'
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{stage.icon}</span>
                <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
                  {stage.title}
                </span>
                <span style={{
                  fontSize: '0.6rem',
                  padding: '0.1rem 0.3rem',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {stage.type}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Stage Detail Inspector */}
      <div style={{
        padding: '1.5rem',
        borderRadius: '12px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-active)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{selectedStage.icon}</span>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Stage Detail ({selectedStage.type})
              </span>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#fff' }}>
                {selectedStage.title}
              </h4>
            </div>
          </div>

          <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1rem' }}>
            {selectedStage.overview}
          </p>

          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            borderLeft: '4px solid var(--color-accent)',
            marginBottom: '1rem'
          }}>
            <strong style={{ color: 'var(--color-accent)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>
              💡 ELI5 (Beginner Explanation)
            </strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              {selectedStage.beginner}
            </p>
          </div>
        </div>

        <div>
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-darker)',
            border: '1px solid var(--border-color)',
            marginBottom: '1rem'
          }}>
            <strong style={{ color: 'var(--color-primary)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>
              ⚙️ Technical Detail
            </strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {selectedStage.technical}
            </p>
          </div>

          {selectedStage.math && (
            <div style={{
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(139, 92, 246, 0.08)',
              border: '1px dashed rgba(139, 92, 246, 0.3)',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              color: '#c084fc',
              marginBottom: '1rem'
            }}>
              <strong style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Math Formulation:</strong>
              {selectedStage.math}
            </div>
          )}

          {selectedStage.code && (
            <pre style={{
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#05070a',
              border: '1px solid var(--border-color)',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              color: '#34d399',
              overflowX: 'auto',
              marginBottom: '1rem'
            }}>
              <code>{selectedStage.code}</code>
            </pre>
          )}

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Real-World Analogy:</strong> {selectedStage.analogy}
          </div>
        </div>
      </div>
    </div>
  );
};
