FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies first to leverage cache
COPY package*.json ./
RUN npm install --production && npm cache clean --force

# Copy source
COPY . .

# Default command
CMD [ "npm", "start" ]
