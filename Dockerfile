FROM node:12

# Add non-root user
RUN useradd -m non-root

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# To avoid "express" run in dev mode
ENV NODE_ENV=production

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4000

# Switch user
USER non-root
CMD [ "node", "server.js" ]
