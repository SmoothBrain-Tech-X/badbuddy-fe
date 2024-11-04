# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN yarn global add pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN SKIP_ENV_VALIDATION=1 pnpm run build

# Use a smaller image for the final build
FROM node:18-alpine AS final

# Set the working directory
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=base /app ./

# Expose the port the app runs on
EXPOSE 3000

CMD ["server.js"]