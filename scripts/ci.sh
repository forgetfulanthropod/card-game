set -x

pnpm i -P
cd client
pnpm i -P
pnpm run build
cd ../server
pnpm i -P
pnpm run build
