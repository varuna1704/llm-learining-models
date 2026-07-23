import type { Topic } from '../curriculum';

export const workedExamplesTopic: Topic = {
  id: 'worked_examples',
  title: 'Worked Examples & SDKs',
  slug: 'worked-examples',
  summary: 'Worked-example chapters in story-driven style for requests, pydantic, python-dotenv, and the Anthropic SDK.',
  rootDiagramId: 'examples_root',
  subDiagrams: {
    examples_root: {
      id: 'examples_root',
      title: 'Worked Example Pipelines',
      nodes: [
        {
          id: 'ex_dotenv',
          label: 'python-dotenv',
          x: 50,
          y: 150,
          width: 140,
          height: 70,
          type: 'tool',
          shortExplanation: 'Loads configurations and API secrets from a local hidden file.',
          simpleExplanation: 'Reads secret passwords from a hidden file so they stay safe.',
          detailedExplanation: `### 1. Learning Objective
Securely load environment secrets without committing them to public Git repositories.

### 2. Concept
\`python-dotenv\` reads key-value pairs from a local \`.env\` file and injects them directly into standard environment variables.

### 3. Why do we need it?
Hardcoding API keys in code is a critical security vulnerability. It leads to stolen keys and massive usage bills.

### 4. Real-Life Analogy
Like keeping your wallet inside a safe. You do not leave your money on the kitchen counter (hardcoded in code); you keep it locked away and fetch it only when you need to buy something.

### 5. Without It
You run the risk of accidentally committing your Anthropic API key to GitHub where bots will scrape and steal it in seconds.

### 6. Install
\`\`\`bash
pip install python-dotenv
\`\`\`

### 7. Syntax
\`\`\`python
import os
from dotenv import load_dotenv
load_dotenv() # Injects vars
key = os.getenv("SECRET_KEY")
\`\`\`

### 8. Example
\`\`\`python
# Loading client credentials safely
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError("Missing API key!")
print("Safe load complete.")
\`\`\`

### 9. Behind the Scenes
\`load_dotenv()\` scans the folder for a file named \`.env\`. It parses key-value lines and loads them into the system environment (\`os.environ\`) so standard calls can fetch them.

### 10. Project Usage
Used in \`config.py\` to securely bootstrap directories and API client keys.

### 11. Code Walkthrough
- \`load_dotenv()\` runs on boot.
- \`os.getenv("KEY", default)\` retrieves the value with an optional fallback.

### 12. Visual Flow
\`\`\`
.env file (Git ignored) ↓ load_dotenv() ↓ system environment ↓ os.getenv() ↓ Python execution
\`\`\``
        },
        {
          id: 'ex_requests',
          label: 'requests',
          x: 230,
          y: 150,
          width: 140,
          height: 70,
          type: 'tool',
          shortExplanation: 'Performs external HTTP network queries in standard Python.',
          simpleExplanation: 'Allows your Python program to speak to websites and retrieve live data.',
          detailedExplanation: `### 1. Learning Objective
Send HTTP requests and fetch remote API data in Python.

### 2. Concept
\`requests\` is a clean, developer-friendly library to send GET, POST, and other HTTP requests to query APIs.

### 3. Why do we need it?
Local programs cannot download live data without talking to internet servers.

### 4. Real-Life Analogy
Like calling a restaurant to ask for the menu. You dial the number (URL), ask for information (HTTP GET), and they read it out to you (HTTP Response).

### 5. Without It
Your AI assistant is fully isolated, unable to check the weather, fetch web pages, or interact with cloud tools.

### 6. Install
\`\`\`bash
pip install requests
\`\`\`

### 7. Syntax
\`\`\`python
import requests
r = requests.get("https://api.site.com/data")
data = r.json()
\`\`\`

### 8. Example
\`\`\`python
# Fetching current temperature
import requests
r = requests.get("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true")
if r.status_code == 200:
    temp = r.json()["current_weather"]["temperature"]
    print("Temp:", temp)
\`\`\`

### 9. Behind the Scenes
Sends socket connection packets across TCP to resolve DNS, establish handshake, transmit headers, and parse response payloads (like JSON text).

### 10. Project Usage
Used in external web-search tools and API integrations.

### 11. Code Walkthrough
- \`requests.get()\` initiates connection.
- \`r.status_code\` verifies success (200 OK).
- \`r.json()\` parses the JSON body into a dictionary.

### 12. Visual Flow
\`\`\`
Python Script → HTTP GET → Web Server → JSON Response → Python Dict
\`\`\``
        },
        {
          id: 'ex_pydantic',
          label: 'Pydantic',
          x: 410,
          y: 150,
          width: 140,
          height: 70,
          type: 'tool',
          shortExplanation: 'Performs strict data validation and parsing using Python type hints.',
          simpleExplanation: 'Checks if your lists, files, and variables contain the correct types of information.',
          detailedExplanation: `### 1. Learning Objective
Define strict object validation schemas using Pydantic classes.

### 2. Concept
Pydantic uses standard Python type annotations to validate data structures and raise clean errors if values do not match specifications.

### 3. Why do we need it?
APIs and databases often return bad or incomplete data. Pydantic guarantees that data matches your internal models before processing.

### 4. Real-Life Analogy
Like an airport security checkpoint. If you don't have a valid passport (Correct schema types), you are turned away before entering the plane (Execution code).

### 5. Without It
You must write dozens of manual checking conditions (\`if type(x) != str...\`) to validate JSON variables.

### 6. Install
\`\`\`bash
pip install pydantic
\`\`\`

### 7. Syntax
\`\`\`python
from pydantic import BaseModel
class User(BaseModel):
    id: int
    name: str
user = User(id=1, name="Varuna")
\`\`\`

### 8. Example
\`\`\`python
# Strict user schema validation
from pydantic import BaseModel, ValidationError

class Note(BaseModel):
    id: int
    content: str

try:
    bad_note = Note(id="abc", content="Hi") # Int validation fails
except ValidationError as e:
    print("Schema error:", e)
\`\`\`

### 9. Behind the Scenes
Pydantic compiles validation loops in core C code. When initializing models, it performs type coercion and checks constraint bounds.

### 10. Project Usage
Crucial for validating structured tool returns and structured LLM JSON payloads.

### 11. Code Walkthrough
- Subclassing \`BaseModel\` defines the schemas.
- Automatic type casting: Pydantic will convert a string \`"123"\` to integer \`123\` if defined as \`int\`.

### 12. Visual Flow
\`\`\`
Unvalidated Dict → Pydantic Model → Type Check → Strict Valid Object
\`\`\``
        },
        {
          id: 'ex_sdk',
          label: 'Anthropic SDK',
          x: 590,
          y: 150,
          width: 140,
          height: 70,
          type: 'tool',
          shortExplanation: 'The official library to invoke Claude models and send messages.',
          simpleExplanation: 'The official client code that lets your python app text Claude directly.',
          detailedExplanation: `### 1. Learning Objective
Send structured chats and configurations to Anthropic's Claude models.

### 2. Concept
The \`anthropic\` library provides official client wrappers, request formats, and tool definitions to talk to frontier models.

### 3. Why do we need it?
Writing raw URL requests to Anthropic servers requires complex header and body formatting. The SDK handles this cleanly.

### 4. Real-Life Analogy
Like using an official postal box instead of printing labels, buying stamps, and walking to the shipping terminal yourself. The SDK wraps all connection details.

### 5. Without It
You would spend days handling connection dropouts, raw stream readers, and API error codes by hand.

### 6. Install
\`\`\`bash
pip install anthropic
\`\`\`

### 7. Syntax
\`\`\`python
from anthropic import Anthropic
client = Anthropic()
response = client.messages.create(
    model="claude-3-5-sonnet-latest",
    max_tokens=100,
    messages=[{"role": "user", "content": "Hi"}]
)
\`\`\`

### 8. Example
\`\`\`python
# Simple greeting script
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
msg = client.messages.create(
    model="claude-3-5-sonnet-latest",
    max_tokens=50,
    messages=[{"role": "user", "content": "Explain RAG in one sentence."}]
)
print(msg.content[0].text)
\`\`\`

### 9. Behind the Scenes
Serializes message payload lists, manages connection pooling across HTTPS, applies request timeouts, and returns structured Python response classes.

### 10. Project Usage
Defined inside \`brain.py\` as the core engine powering the chatbot.

### 11. Code Walkthrough
- \`Anthropic()\` initializes the connection client.
- \`client.messages.create()\` posts requests to the endpoint.

### 12. Visual Flow
\`\`\`
User Script → SDK Payload → HTTP POST → Anthropic Servers → Claude Response → SDK Object
\`\`\``
        }
      ],
      edges: [
        { from: 'ex_dotenv', to: 'ex_sdk', animated: true },
        { from: 'ex_requests', to: 'ex_sdk', animated: true },
        { from: 'ex_pydantic', to: 'ex_sdk', animated: true }
      ]
    }
  }
};
