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
COPY lib/auditTrail.mjs ./lib/auditTrail.mjs
COPY lib/auditLabels.mjs ./lib/auditLabels.mjs
COPY lib/serverSession.mjs ./lib/serverSession.mjs
COPY lib/runtimeLogging.mjs ./lib/runtimeLogging.mjs
COPY lib/thesisSdg.mjs ./lib/thesisSdg.mjs
COPY lib/thesisBibliometrics.mjs ./lib/thesisBibliometrics.mjs
COPY lib/thesisPublicationMatcher.mjs ./lib/thesisPublicationMatcher.mjs
COPY lib/thesisAwardCandidates.mjs ./lib/thesisAwardCandidates.mjs
COPY lib/thesisAwardPublications.mjs ./lib/thesisAwardPublications.mjs
COPY lib/scimagoQuartiles.mjs ./lib/scimagoQuartiles.mjs
COPY lib/scopusBibliometrics.mjs ./lib/scopusBibliometrics.mjs
COPY lib/trDizinBibliometrics.mjs ./lib/trDizinBibliometrics.mjs
COPY lib/publicDataRefreshPlan.mjs ./lib/publicDataRefreshPlan.mjs
COPY lib/data/public-route-aliases.json ./lib/data/public-route-aliases.json
COPY lib/data/thesis-award-candidates-2023-2025.json ./lib/data/thesis-award-candidates-2023-2025.json
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
