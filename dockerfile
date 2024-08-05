# Use an official Node.js runtime as a parent image
FROM node:18 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Use a smaller base image for the runtime
FROM node:18-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy built application from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Copy package.json and package-lock.json to the working directory
COPY --from=build /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port on which the app will run
EXPOSE 3000

# Run the application
CMD ["node", "dist/main.js"]
