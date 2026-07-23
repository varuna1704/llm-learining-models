import type { Topic } from '../curriculum';

export const libraryBasicsTopic: Topic = {
  id: 'library_basics',
  title: 'Standard Libraries & Types',
  slug: 'library-basics',
  summary: 'Lightweight overview of core Python utilities: os, pathlib, and typing.',
  rootDiagramId: 'lib_basics_root',
  subDiagrams: {
    lib_basics_root: {
      id: 'lib_basics_root',
      title: 'Python Utilities Overview',
      nodes: [
        {
          id: 'lib_os',
          label: 'os Library',
          x: 50,
          y: 150,
          width: 140,
          height: 70,
          type: 'tool',
          shortExplanation: 'Interacts with the operating system environments and folders.',
          simpleExplanation: 'Python code to talk to your computer, create folders, and check environment details.',
          detailedExplanation: `### 1. Problem
We need to read environment variables (like secret keys) and verify directory existence on different operating systems.

### 2. Analogy
It is like a telephone connecting your Python script to the operating system\'s control room, letting you check settings or order new folders.

### 3. Without It
Your script cannot check configuration settings or create the \`data/\` folder, causing crash errors on boot.

### 4. With It
You can safely query the environment and build portable applications.

### 5. Code
\`\`\`python
import os
# Check environment secret key
api_key = os.getenv("MY_KEY")
# Create folder if missing
os.makedirs("data", exist_ok=True)
\`\`\`

### 6. Project Usage
Used in \`config.py\` to locate directories and fetch secret API keys.

### 7. LLM Connection
- **Python Basics**: Reading environment variables.
- **My Project**: Fetching API tokens inside the configuration.
- **Production AI**: Managing secrets in Docker and Kubernetes clusters.

### 8. Exercise
Write a Python script that checks if a directory named "logs" exists and prints a message.`
        },
        {
          id: 'lib_pathlib',
          label: 'pathlib Library',
          x: 230,
          y: 150,
          width: 140,
          height: 70,
          type: 'tool',
          shortExplanation: 'Object-oriented file path operations.',
          simpleExplanation: 'Python tools to clean up paths and read files easily.',
          detailedExplanation: `### 1. Problem
Standard string concatenation for file paths (like \`"data/" + "notes.json"\`) breaks on Windows due to backslashes (\`\\\` vs \`/\`).

### 2. Analogy
Like using coordinates instead of directions. Instead of saying "turn left, then right", you define a single clean coordinate that is universally correct.

### 3. Without It
You write system-specific code that crashes when your co-workers run it on Mac or Linux.

### 4. With It
Paths are represented as smart objects that automatically format paths correctly for the host OS.

### 5. Code
\`\`\`python
from pathlib import Path
path = Path("data") / "notes.json"
print(path.exists())
\`\`\`

### 6. Project Usage
Used in file handlers to locate notes and configurations cleanly.

### 7. LLM Connection
- **Python Basics**: Path concatenation.
- **My Project**: Guaranteeing cross-platform file saving.
- **Production AI**: Managing dynamic directories in containerized environments.

### 8. Exercise
Create a script that prints the file size of your memory JSON database using Path objects.`
        },
        {
          id: 'lib_typing',
          label: 'typing Module',
          x: 410,
          y: 150,
          width: 140,
          height: 70,
          type: 'tool',
          shortExplanation: 'Adds static type hinting to clarify function parameters.',
          simpleExplanation: 'Adding labels explaining what kinds of data are allowed, helping you find typos early.',
          detailedExplanation: `### 1. Problem
Python is dynamically typed. Functions can receive incorrect types (e.g. sending a list instead of a string), causing runtime crashes.

### 2. Analogy
Like labeling jars in a kitchen. You label one "Sugar" (String) and another "Salt" (Integer) to prevent recipes (Functions) from being ruined.

### 3. Without It
It is hard to understand what variables a function expects without reading the entire code.

### 4. With It
Editors show autocompletion hints and warning squiggles immediately when typing matching errors.

### 5. Code
\`\`\`python
from typing import List, Dict

def parse_notes(notes: List[Dict[str, str]]) -> int:
    return len(notes)
\`\`\`

### 6. Project Usage
Annotations are used inside \`notes.py\`, \`memory.py\`, and \`brain.py\` to specify function schemas.

### 7. LLM Connection
- **Python Basics**: Simple annotations.
- **My Project**: Documenting tool signatures for developer safety.
- **Production AI**: Type-checking massive codebases in CI/CD pipelines.

### 8. Exercise
Annotate a function that accepts an integer age and a string name and returns a formatted welcome statement.`
        }
      ],
      edges: [
        { from: 'lib_os', to: 'lib_pathlib', animated: true },
        { from: 'lib_pathlib', to: 'lib_typing', animated: true }
      ]
    }
  }
};
