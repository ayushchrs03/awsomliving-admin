FROM node:20-alpine

WORKDIR /app

ENV PORT=4000

# ----------------------
# 1. Copy root/package.json and install client deps
# ----------------------
COPY package*.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force

# ----------------------
# 2. Copy client code and build
# ----------------------
COPY . .
RUN npm run build

# ----------------------
# 3. Copy server package.json and install server deps
# ----------------------
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force

# ----------------------
# 4. Copy server code
# ----------------------
COPY server/ ./

# ----------------------
# 5. Expose and run
# ----------------------
EXPOSE ${PORT}
CMD ["node", "index.js"]
