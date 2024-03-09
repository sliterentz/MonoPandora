# Install dependencies only when needed
FROM docker.io/node:lts-alpine as dependencies

RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY .npmrc package.json ./
RUN npm install --only=production

# Production image, copy all the files and run next
FROM docker.io/node:lts-alpine as runner
RUN apk add --no-cache dumb-init

ENV NODE_ENV production
ENV PORT 3000
ENV HOST 0.0.0.0
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/src/app

# Copy installed dependencies from dependencies stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copy built application files
COPY ./ ./

# Run the application under "node" user by default
RUN chown -R node:node .
USER node
EXPOSE 3000

# If you are using the custom server implementation:
CMD ["dumb-init", "node", "server/main.js"]

# If you are using the NextJS built-int server:
# CMD ["dumb-init", "npm", "start"]