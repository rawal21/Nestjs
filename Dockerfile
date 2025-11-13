# ---------- STAGE 1: Build ----------
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build the NestJS app
RUN npm run build


# ---------- STAGE 2: Run ----------
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy only the compiled dist and necessary files
COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist

# Expose port (change if needed)
EXPOSE 3000

# Run the app
CMD ["node", "dist/main.js"]
