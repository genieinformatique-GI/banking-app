FROM node:22 AS base
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/bank-of-blockchain/package.json ./artifacts/bank-of-blockchain/
COPY lib/db/package.json ./lib/db/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-spec/package.json ./lib/api-spec/
RUN pnpm install --frozen-lockfile
COPY . .
ENV PORT=3000
ENV BASE_PATH=/
ENV FRONTEND_PORT=3000
RUN pnpm --filter @workspace/bank-of-blockchain run build
RUN pnpm --filter @workspace/api-server run build
FROM node:22-slim AS production
RUN npm install -g pnpm
WORKDIR /app
COPY --from=base /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=base /app/artifacts/bank-of-blockchain/dist/public ./artifacts/bank-of-blockchain/dist/public
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-lock.yaml ./
COPY --from=base /app/artifacts/api-server/package.json ./artifacts/api-server/
COPY --from=base /app/lib ./lib
RUN pnpm install --frozen-lockfile --prod
ENV NODE_ENV=production
ENV FRONTEND_DIST_PATH=/app/artifacts/bank-of-blockchain/dist/public
EXPOSE 3000
CMD ["node", "artifacts/api-server/dist/index.cjs"]
