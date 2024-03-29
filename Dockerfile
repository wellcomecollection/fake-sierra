FROM public.ecr.aws/docker/library/node:16-slim as production
WORKDIR /app

COPY yarn.lock package.json ./
RUN yarn install --production --frozen-lockfile && yarn cache clean

COPY tsconfig.json index.ts ./
COPY src ./src

ENV NODE_ENV=production
ENV PORT=8000

CMD ["yarn", "start"]

# Use the multi-stage build to install devDependencies separately
FROM production as testing

ENV NODE_ENV=development
RUN yarn install --frozen-lockfile && yarn cache clean

COPY jest.config.js .
COPY tests ./tests

CMD ["yarn", "start"]

