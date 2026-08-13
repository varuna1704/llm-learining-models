import fs from 'fs';
import path from 'path';

const modelDir = path.resolve('public', 'models', 'Xenova', 'all-MiniLM-L6-v2');
const onnxDir = path.join(modelDir, 'onnx');

// Ensure directories exist
fs.mkdirSync(onnxDir, { recursive: true });

const filesToDownload = [
  { url: 'https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/onnx/model_quantized.onnx', dest: path.join(onnxDir, 'model_quantized.onnx') },
  { url: 'https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/tokenizer.json', dest: path.join(modelDir, 'tokenizer.json') },
  { url: 'https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/tokenizer_config.json', dest: path.join(modelDir, 'tokenizer_config.json') },
  { url: 'https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/vocab.txt', dest: path.join(modelDir, 'vocab.txt') },
  { url: 'https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/special_tokens_map.json', dest: path.join(modelDir, 'special_tokens_map.json') }
];

async function downloadFile(url, dest) {
  console.log(`Downloading ${url} ...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: status ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
  console.log(`Saved to ${dest}`);
}

async function main() {
  try {
    for (const item of filesToDownload) {
      if (!fs.existsSync(item.dest)) {
        await downloadFile(item.url, item.dest);
      } else {
        console.log(`File already exists, skipping: ${item.dest}`);
      }
    }
    console.log('All model files downloaded successfully!');
  } catch (err) {
    console.error('Error downloading model files:', err);
    process.exit(1);
  }
}

main();
