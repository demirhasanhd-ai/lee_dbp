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
ENV SCIMAGO_CSV_PATH=/app/reference/scimago/scimagojr-2025.csv

COPY package*.json ./
RUN apk add --no-cache python3 py3-reportlab \
  && npm ci --omit=dev --no-audit --no-fund \
  && npm cache clean --force
COPY server.mjs ./server.mjs
COPY lib/ ./lib/
COPY scripts/check-project-modules.mjs ./scripts/check-project-modules.mjs
RUN node scripts/check-project-modules.mjs
COPY --from=build /app/dist ./dist
COPY scripts/generate_public_course_pdfs.py ./scripts/generate_public_course_pdfs.py
COPY scripts/generate_thesis_award_top5_pdf.py ./scripts/generate_thesis_award_top5_pdf.py
COPY public/fonts/noto-sans ./public/fonts/noto-sans
COPY public/oku-logo.png ./public/oku-logo.png
COPY public/sdg ./public/sdg
COPY data/scimago/scimagojr-2025.csv ./reference/scimago/scimagojr-2025.csv
RUN mkdir -p /app/data /app/data/backups /app/data/generated-pdfs && chown -R node:node /app/data

VOLUME ["/app/data"]
USER node
EXPOSE 8081
HEALTHCHECK --interval=30s --timeout=5s --start-period=180s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8081/dbp/api/dbp/health || exit 1
CMD ["node", "server.mjs"]
