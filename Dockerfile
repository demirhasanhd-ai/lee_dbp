FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8081
ENV DBP_DATA_DIR=/app/data
ENV DBP_SQLITE_PATH=/app/data/dbp.sqlite
ENV DBP_BACKUP_DIR=/app/data/backups
ENV DBP_PDF_CACHE_DIR=/app/data/generated-pdfs

RUN apk add --no-cache python3 py3-reportlab \
  && npm install --omit=dev --no-audit --no-fund --package-lock=false cheerio@1.2.0 \
  && npm cache clean --force
COPY package.json ./package.json
COPY server.mjs ./server.mjs
COPY --from=build /app/dist ./dist
COPY --from=build /app/local-preview/program-data-local.js ./seed/program-data-local.js
COPY scripts/generate_public_course_pdfs.py ./scripts/generate_public_course_pdfs.py
COPY data/courses ./data/courses
COPY public/fonts/noto-sans ./public/fonts/noto-sans
COPY public/oku-logo.png ./public/oku-logo.png
COPY public/sdg ./public/sdg
RUN mkdir -p /app/data /app/data/backups /app/data/generated-pdfs && chown -R node:node /app/data

VOLUME ["/app/data"]
USER node
EXPOSE 8081
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8081/dbp/ || exit 1
CMD ["node", "server.mjs"]
