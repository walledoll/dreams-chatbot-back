# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Копируем исходники
COPY . .

# Устанавливаем Prisma CLI и генерируем клиент
RUN npm install -g prisma
RUN npx prisma generate

# Собираем (если нужен build)
RUN npm run build

# --- Production stage ---
FROM node:20-alpine AS runner

WORKDIR /app

# Копируем только production-зависимости и бандл
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Запуск с миграцией и сервером
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]