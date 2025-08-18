# 1. Base image
FROM node:18-alpine AS build

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package.json and package-lock.json first (cache dependencies)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the source code
COPY . .

# 6. Expose backend port
EXPOSE 3000

# 7. Start the app
CMD ["npm", "start"]
