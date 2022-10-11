#  Dockerfile for Node Express Backend
FROM node:17-alpine

WORKDIR /app

# Copy app source code
COPY . .

# Install Dependencies
RUN npm install

# Exports
EXPOSE 1337

CMD ["npm","run","dev"]