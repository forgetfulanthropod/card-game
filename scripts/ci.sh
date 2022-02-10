set -x

npm i -P
cd client
npm i -P
npm run build
cd ../server
npm i -P
npm run build
