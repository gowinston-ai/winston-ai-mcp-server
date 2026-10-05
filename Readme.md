# Winston AI MCP Server ⚡️

[![npm version](https://badge.fury.io/js/winston-ai-mcp.svg)](https://badge.fury.io/js/winston-ai-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/gowinston-ai/winston-ai-mcp-server/actions/workflows/CI.yml/badge.svg)](https://github.com/gowinston-ai/winston-ai-mcp-server/actions/workflows/CI.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **Model Context Protocol (MCP) Server for Winston AI** - the most accurate AI Detector. Detect AI-generated content, plagiarism, and compare texts with ease.

## ✨ Features

### 🔍 AI Text Detection
- **Human vs AI Classification**: Determine if text was written by a human or AI
- **Confidence Scoring**: Get percentage-based confidence scores
- **Sentence-level Analysis**: Identify the most AI-like sentences in your text
- **Multi-language Support**: Works with text in various languages
- **Credit cost**: 1 credit per word

### 🖼️ AI Image Detection
- **Image Analysis**: Detect AI-generated images using advanced ML models
- **Metadata Verification**: Analyze image metadata and EXIF data
- **Watermark Detection**: Identify AI watermarks and their issuers
- **Multiple Formats**: Supports JPG, JPEG, PNG, and WEBP formats
- **Credit cost**: 300 credits per image

### 📝 Plagiarism Detection
- **Internet-wide Scanning**: Check against billions of web pages
- **Source Identification**: Find and list original sources
- **Detailed Reports**: Get comprehensive plagiarism analysis
- **Academic & Professional Use**: Perfect for content verification
- **Credit cost**: 2 credits per word

### 🔄 Text Comparison
- **Similarity Analysis**: Compare two texts for similarities
- **Word-level Matching**: Detailed breakdown of matching content
- **Percentage Scoring**: Get precise similarity percentages
- **Bidirectional Analysis**: Compare both directions
- **Credit cost**: 1/2 credit per total words found in both texts

## 🚀 Quick Start

### Prerequisites

To use the hosted server, you only need a [Winston AI](https://app.gowinston.ai) account. See [Remote MCP Server via HTTP](#remote-mcp-server-via-http-).

To run the server locally:
- Node.js 18+ 
- Winston AI API Key ([Get one here](https://dev.gowinston.ai))

## 🛠️ Development

### Running with npx 🔋
```
env WINSTONAI_API_KEY=your-api-key npx -y winston-ai-mcp
```

### Running the MCP Server locally via stdio 💻

Create a `.env` file in your project root:

```env
WINSTONAI_API_KEY=your_actual_api_key_here
```


```bash
# Clone the repository
git clone https://github.com/gowinston-ai/winston-ai-mcp-server.git
cd winston-ai-mcp-server

# Install dependencies
npm install

# Build the project and start the server
npm run mcp-start
```

## 📦 Docker Support

Build and run with Docker:

```bash
# Build the image
docker build -t winston-ai-mcp .

# Run the container
docker run -e WINSTONAI_API_KEY=your_api_key winston-ai-mcp
```

## 📋 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the MCP server
- `npm run mcp-start` - Compile TypeScript to JavaScript and Start the MCP server
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

## 🔧 Configuration

### For Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "winston-ai-mcp": {
      "command": "npx",
      "args": ["-y", "winston-ai-mcp"],
      "env": {
        "WINSTONAI_API_KEY": "your-api-key"
      }
    }
  }
}
```

### For Cursor IDE

Add to your Cursor configuration:

```json
{
  "mcpServers": {
    "winston-ai-mcp": {
      "command": "npx",
      "args": ["-y", "winston-ai-mcp"],
      "env": {
        "WINSTONAI_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Remote MCP Server via HTTP 🌐

The hosted server is at `https://api.gowinston.ai/mcp/v1` over HTTPS **Streamable HTTP**
(JSON responses). Popular MCP clients, such as Cursor, ChatGPT, Claude, and others, should use that URL and
transport. You can also call it with curl.

### Authentication

Every request must send a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

**OAuth 2.1** is the easiest way to connect. Sign in with your [Winston AI](https://app.gowinston.ai) account and your MCP client gets an access token for you. There's no API key to copy or store. Credits are taken from your app.gowinston.ai account, not the API platform.

If you want, you can also use a standard API key from [https://dev.gowinston.ai](https://dev.gowinston.ai) as the Bearer token.

Never send the token in the request body or URL. Only the `Authorization` header is supported.

#### How the OAuth 2.1 flow works

MCP clients that support [MCP authorization](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization) handle this for you:

1. A request without a token receives `401 Unauthorized` with a `WWW-Authenticate` header pointing to the protected resource metadata.
2. The client reads [`https://api.gowinston.ai/.well-known/oauth-protected-resource`](https://api.gowinston.ai/.well-known/oauth-protected-resource), which lists `https://app.gowinston.ai` as the authorization server and `mcp:use` as the required scope.
3. The client opens your browser so you can sign in to Winston AI and approve access.
4. The client receives an access token and sends it as `Authorization: Bearer <token>` on every request.

Possible errors:

- `401`: Missing, invalid, or expired token.
- `403`: Valid token without the `mcp:use` scope.

### Connect from an MCP client

Add the hosted server URL to your MCP client, such as Cursor, ChatGPT, Claude, and others. The client signs you in with OAuth 2.1 the first time you connect. For clients configured with JSON, it looks like this:

```json
{
  "mcpServers": {
    "winston-ai": {
      "url": "https://api.gowinston.ai/mcp/v1"
    }
  }
}
```

If you want, you can also use a standard API key from [dev.gowinston.ai](https://dev.gowinston.ai) by passing it in the `Authorization` header:

```json
{
  "mcpServers": {
    "winston-ai": {
      "url": "https://api.gowinston.ai/mcp/v1",
      "headers": {
        "Authorization": "Bearer your-winston-ai-api-key"
      }
    }
  }
}
```

### cURL examples

#### Example: List tools

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json, text/event-stream' \
--header 'Authorization: Bearer your-winston-ai-api-key' \
--data '{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}'
```

#### Example: AI Text Detection

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json, text/event-stream' \
--header 'Authorization: Bearer your-winston-ai-api-key' \
--data '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "ai-text-detection",
    "arguments": {
      "text": "Your text to analyze (minimum 300 characters)"
    }
  }
}'
```

#### Example: AI Image Detection

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json, text/event-stream' \
--header 'Authorization: Bearer your-winston-ai-api-key' \
--data '{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "ai-image-detection",
    "arguments": {
      "url": "https://example.com/image.jpg"
    }
  }
}'
```

#### Example: Plagiarism Detection

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json, text/event-stream' \
--header 'Authorization: Bearer your-winston-ai-api-key' \
--data '{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "plagiarism-detection",
    "arguments": {
      "text": "Text to check for plagiarism (minimum 100 characters)"
    }
  }
}'
```

**Note:** Replace `your-winston-ai-api-key` in the `Authorization` header with your OAuth 2.1 access token. If you want, you can also use a standard API key from [https://dev.gowinston.ai](https://dev.gowinston.ai).

## 📋 API Reference

### AI Text Detection
```typescript
{
  "text": "Your text to analyze (600+ characters recommended)",
  "file": "(optional) A file to scan. If you supply a file, the API will scan the content of the file. The file must be in plain .pdf, .doc or .docx format.",
  "website": "(optional) A website URL to scan. If you supply a website, the API will fetch the content of the website and scan it. The website must be publicly accessible."
}
```

### AI Image Detection
```typescript
{
  "url": "https://example.com/image.jpg"
}
```

### Plagiarism Detection
```typescript
{
  "text": "Text to check for plagiarism",
  "language": "en", // optional, default: "en"
  "country": "us"   // optional, default: "us"
}
```

### Text Comparison
```typescript
{
  "first_text": "First text to compare",
  "second_text": "Second text to compare"
}
```

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Winston AI MCP NPM Package**: [https://www.npmjs.com/package/winston-ai-mcp](https://www.npmjs.com/package/winston-ai-mcp)
- **Winston AI Website**: [https://gowinston.ai](https://gowinston.ai)
- **API Documentation**: [https://dev.gowinston.ai](https://dev.gowinston.ai)
- **MCP Server Documentation**: [https://docs.gowinston.ai/api-reference/mcp-server](https://docs.gowinston.ai/api-reference/mcp-server)
- **MCP Authorization (OAuth 2.1)**: [https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization)
- **MCP Protocol**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- **GitHub Repository**: [https://github.com/gowinston-ai/winston-ai-mcp-server](https://github.com/gowinston-ai/winston-ai-mcp-server)

## ⭐ Support

If you find this project helpful, please give it a star on GitHub!

---

**Made with ❤️ by the Winston AI Team**
