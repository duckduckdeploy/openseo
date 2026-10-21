import { agentSetupPrompt } from '@openseo/shared';
import { GITHUB_URL, MCP_URL, SITE_URL } from '@/lib/site';

/** The prompt that has an agent connect itself, pointed at this site's own install. */
export const setupPrompt = agentSetupPrompt({ mcpUrl: MCP_URL, docsUrl: `${SITE_URL}/docs/mcp` });

const cloneTarget = `${GITHUB_URL}.git`;

export const selfHostClone = `git clone ${cloneTarget} openseo
cd openseo`;

/** The whole stack with Docker: database, API, dashboard and site. */
export const selfHostDocker = `git clone ${cloneTarget} openseo
cd openseo
cp .env.example .env
# In .env, set two secrets:
#   AUTH_SECRET=     any 32+ random characters
#   ENCRYPTION_KEY=  output of: openssl rand -base64 32
docker compose up -d --build
# Dashboard http://localhost:3200 · site http://localhost:3101`;
