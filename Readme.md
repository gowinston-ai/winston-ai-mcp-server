[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/gowinston-ai-winston-ai-mcp-server-badge.png)](https://mseep.ai/app/gowinston-ai-winston-ai-mcp-server)

# Winston AI MCP Server ⚡️

![npm version](https://badge.fury.io/js/winston-ai-mcp.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js CI](https://github.com/gowinston-ai/winston-ai-mcp-server/actions/workflows/CI.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

> **Model Context Protocol (MCP) Server for Winston AI** - the most accurate AI Detector. Detect AI-generated content, plagiarism, and compare texts with ease.



## 🚀 Quick Start

Add this URL to your MCP client and sign in with your [Winston AI](https://app.gowinston.ai) account:

```
https://api.gowinston.ai/mcp/v1
```

That's it. No API key, no install. Credits are taken from your app.gowinston.ai account.

## 🔌 Connect your MCP client

Your client signs you in with OAuth 2.1 the first time you connect.

### Claude

Go to **Customize > Connectors**, click **+**, then **Add custom connector**. Enter `Winston AI` as the name and `https://api.gowinston.ai/mcp/v1` as the URL, then sign in.

### ChatGPT

Turn on **Developer mode** in ChatGPT settings, then add a custom connector with the URL `https://api.gowinston.ai/mcp/v1` and **OAuth** as the authentication. Custom connectors require a paid ChatGPT plan.

### Claude Code

```bash
claude mcp add --transport http winston-ai https://api.gowinston.ai/mcp/v1
```



### Cursor

Add to your `mcp.json`:

```json
{
  "mcpServers": {
    "winston-ai": {
      "url": "https://api.gowinston.ai/mcp/v1"
    }
  }
}
```



### VS Code

Add to your `.vscode/mcp.json`:

```json
{
  "servers": {
    "winston-ai": {
      "type": "http",
      "url": "https://api.gowinston.ai/mcp/v1"
    }
  }
}
```



### Other MCP clients

Use the URL `https://api.gowinston.ai/mcp/v1` with the **Streamable HTTP** transport. Any client that supports [MCP authorization](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization) will sign you in automatically.

### Using an API key instead

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



## 🧰 Tools


| Tool                   | What it does                                                                                              | Inputs                                                                                                                                   | Credit cost                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `ai-text-detection`    | Detects whether text was written by a human or AI, with a confidence score and the most AI-like sentences | `text` (required, 300 to 150,000 characters, 600+ recommended), `file` (optional, .pdf, .doc or .docx), `website` (optional, public URL) | 1 credit per word                       |
| `ai-image-detection`   | Detects AI-generated images using metadata, watermark detection, and a machine learning model             | `url` (required, public JPG, JPEG, PNG or WEBP image, at least 256x256 pixels)                                                           | 300 credits per image                   |
| `plagiarism-detection` | Checks text against billions of web pages and lists the original sources                                  | `text` (required, 100 to 120,000 characters), `language` (optional, default `en`), `country` (optional, default `us`)                    | 2 credits per word                      |
| `text-compare`         | Compares two texts and returns a similarity score with word-level matches                                 | `first_text` (required, up to 120,000 characters), `second_text` (required, up to 120,000 characters)                                    | 0.5 credit per total word in both texts |


If you provide several inputs to `ai-text-detection`, `website` takes priority over `file`, and `file` takes priority over `text`.

## 🔐 Authentication

Every request must send a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

**OAuth 2.1** is the easiest way to connect. Sign in with your [Winston AI](https://app.gowinston.ai) account and your MCP client gets an access token for you. There's no API key to copy or store. Credits are taken from your app.gowinston.ai account, not the API platform.

If you want, you can also use a standard API key from [dev.gowinston.ai](https://dev.gowinston.ai) as the Bearer token.

Never send the token in the request body or URL. Only the `Authorization` header is supported.

How the OAuth 2.1 flow works

MCP clients that support [MCP authorization](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization) handle this for you:

1. A request without a token receives `401 Unauthorized` with a `WWW-Authenticate` header pointing to the protected resource metadata.
2. The client reads `[https://api.gowinston.ai/.well-known/oauth-protected-resource](https://api.gowinston.ai/.well-known/oauth-protected-resource)`, which lists `https://app.gowinston.ai` as the authorization server and `mcp:use` as the required scope.
3. The client opens your browser so you can sign in to Winston AI and approve access.
4. The client receives an access token and sends it as `Authorization: Bearer <token>` on every request.



## 🧪 Test with cURL

MCP clients get an OAuth token automatically. For quick tests with cURL, the simplest option is a standard API key from [dev.gowinston.ai](https://dev.gowinston.ai). Replace `your-winston-ai-api-key` with it.

#### List tools

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



#### Call a tool: AI Text Detection

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

To call another tool, change `name` and `arguments` using the [Tools](#-tools) table. More examples are in the [MCP server documentation](https://docs.gowinston.ai/api-reference/mcp-server).

## 🩺 Troubleshooting

- `401 Unauthorized`: The token is missing, invalid, or expired. Sign in again from your MCP client, or check that the `Authorization` header is `Bearer <token>`.
- `403 Forbidden`: The token doesn't have the `mcp:use` scope. Disconnect and sign in again so your client requests it.
- **Out of credits**: Top up your account on [app.gowinston.ai](https://app.gowinston.ai). If you use an API key, top up on [dev.gowinston.ai](https://dev.gowinston.ai).
- **Your client doesn't support OAuth**: Use an API key in the `Authorization` header. See [Using an API key instead](#using-an-api-key-instead).



## 💻 Self-hosting & development

You can also run the server locally over stdio. This requires Node.js 18+ and a Winston AI API key ([get one here](https://dev.gowinston.ai)).

### Running with npx 🔋

```
env WINSTONAI_API_KEY=your-api-key npx -y winston-ai-mcp
```



### Adding the local server to your MCP client

Add it to your MCP client's configuration, such as Cursor (`mcp.json`), Claude Desktop (`claude_desktop_config.json`), and others:

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



### Running from source 💻

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



### Docker 📦

```bash
# Build the image
docker build -t winston-ai-mcp .

# Run the container
docker run -e WINSTONAI_API_KEY=your_api_key winston-ai-mcp
```



### Available scripts 📋

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the MCP server
- `npm run mcp-start` - Compile TypeScript to JavaScript and Start the MCP server
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier
LICENSE) file for details.



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