
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies without dev dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

ENV NODE_ENV=production

# Build the application
RUN npm run build

ENTRYPOINT ["node", "dist/index.js"]

CMD []

LABEL org.opencontainers.image.description="Winston AI MCP Server - Model Context Protocol for Winston AI API"
LABEL org.opencontainers.image.source="https://github.com/gowinston-ai/winston-ai-mcp-server"