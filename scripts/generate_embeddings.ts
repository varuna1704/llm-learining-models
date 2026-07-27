import { pipeline } from '@xenova/transformers';
import fs from 'fs';
import path from 'path';
import { CURRICULUM_FULL } from '../src/data/curriculum_full.js';
import { GLOSSARY } from '../src/data/curriculum.js';

interface SearchItem {
  type: 'topic' | 'node' | 'glossary';
  title: string;
  content: string;
  targetId: string;
  topicSlug?: string;
  subDiagramId?: string;
  nodeLabel?: string;
  shortExplanation?: string;
  simpleExplanation?: string;
  detailedExplanation?: string;
  topicTitle?: string;
}

async function generateEmbeddingsAndIndex() {
  console.log('Initializing feature-extraction pipeline with Xenova/all-MiniLM-L6-v2...');
  
  // Disable local model loading check because we want to load it from the Hugging Face hub
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  console.log('Pipeline loaded. Building static search index...');

  const searchIndex: SearchItem[] = [];

  // 1. Index Glossary
  Object.values(GLOSSARY).forEach(term => {
    searchIndex.push({
      type: 'glossary',
      title: term.term,
      content: `${term.term} ${term.definition} ${term.details}`.toLowerCase(),
      targetId: term.id
    });
  });

  // 2. Index Topics & Nodes
  CURRICULUM_FULL.forEach(topic => {
    searchIndex.push({
      type: 'topic',
      title: topic.title,
      content: `${topic.title} ${topic.summary}`.toLowerCase(),
      targetId: topic.id,
      topicSlug: topic.slug,
      subDiagramId: topic.rootDiagramId
    });

    Object.entries(topic.subDiagrams).forEach(([subId, sub]) => {
      sub.nodes.forEach(node => {
        searchIndex.push({
          type: 'node',
          title: node.label,
          content: `${node.label} ${node.shortExplanation} ${node.simpleExplanation} ${node.detailedExplanation}`.toLowerCase(),
          targetId: node.id,
          topicSlug: topic.slug,
          subDiagramId: subId,
          nodeLabel: node.label,
          shortExplanation: node.shortExplanation,
          simpleExplanation: node.simpleExplanation,
          detailedExplanation: node.detailedExplanation,
          topicTitle: topic.title
        });
      });
    });
  });

  console.log(`Generated ${searchIndex.length} search items. Computing TF-IDF properties...`);

  // Compute TF-IDF
  const N = searchIndex.length;
  const dfs: { [word: string]: number } = {};
  const documentVectors: { targetId: string; tfMap: { [word: string]: number } }[] = [];

  searchIndex.forEach(item => {
    const titleWords = item.title.toLowerCase().split(/[^a-z0-9]/).filter(w => w.length > 0);
    const contentWords = item.content.split(/[^a-z0-9]/).filter(w => w.length > 0);

    const tfMap: { [word: string]: number } = {};

    // Add title words with a boost factor of 5
    titleWords.forEach(w => {
      tfMap[w] = (tfMap[w] || 0) + 5;
    });

    // Add content words
    contentWords.forEach(w => {
      tfMap[w] = (tfMap[w] || 0) + 1;
    });

    // Record document frequencies
    Object.keys(tfMap).forEach(w => {
      dfs[w] = (dfs[w] || 0) + 1;
    });

    documentVectors.push({
      targetId: item.targetId,
      tfMap
    });
  });

  const idfs: { [word: string]: number } = {};
  Object.keys(dfs).forEach(word => {
    idfs[word] = Math.log(1 + N / (1 + dfs[word]));
  });

  console.log('TF-IDF computed. Generating 384-dimensional dense vectors...');

  const embeddings: { [id: string]: number[] } = {};

  async function getEmbedding(text: string): Promise<number[]> {
    const cleanText = text.replace(/\s+/g, ' ').trim().toLowerCase();
    const output = await embedder(cleanText, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }

  // Generate vectors for each search item
  for (const item of searchIndex) {
    let textToEmbed = '';
    if (item.type === 'glossary') {
      const term = GLOSSARY[item.targetId];
      textToEmbed = `Glossary: ${term.term}\nDefinition: ${term.definition}\nDetails: ${term.details}`;
    } else if (item.type === 'topic') {
      const topic = CURRICULUM_FULL.find(t => t.id === item.targetId)!;
      textToEmbed = `Topic: ${topic.title}\nSummary: ${topic.summary}`;
    } else if (item.type === 'node') {
      let foundNode;
      for (const topic of CURRICULUM_FULL) {
        for (const sub of Object.values(topic.subDiagrams)) {
          const n = sub.nodes.find(node => node.id === item.targetId);
          if (n) foundNode = n;
        }
      }
      if (foundNode) {
        textToEmbed = `Node: ${foundNode.label}\nSummary: ${foundNode.shortExplanation}\nExplanation: ${foundNode.detailedExplanation}\nAnalogy: ${foundNode.simpleExplanation}`;
      } else {
        textToEmbed = item.content;
      }
    }
    
    embeddings[item.targetId] = await getEmbedding(textToEmbed);
    console.log(`- Generated vector for ${item.type}: ${item.title}`);
  }

  const outputPath = path.resolve(process.cwd(), 'public/search_index.json');
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const result = {
    embeddings,
    searchIndex,
    idfs,
    documentVectors
  };

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`\nSuccess! Search index and embeddings saved to: ${outputPath}`);

  // Delete the old embeddings.json if it exists to avoid confusion
  const oldPath = path.resolve(process.cwd(), 'public/embeddings.json');
  if (fs.existsSync(oldPath)) {
    fs.unlinkSync(oldPath);
    console.log('Removed obsolete public/embeddings.json');
  }
}

generateEmbeddingsAndIndex().catch((err) => {
  console.error('Error generating search index:', err);
  process.exit(1);
});
