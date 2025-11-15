# Stage1 for build porject
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i

COPY . .
RUN npm run build

# Stage2 for production/runtime
FROM node:24-alpine

WORKDIR /app

# Copy file important for production
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 8085

CMD ["npm", "start"]