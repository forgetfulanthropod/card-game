echo $(pwd)
if [ "$ESBUILD_DONT_SERVE" = "yes" ];
then
    node scripts/esbuild.js watch
else
    bash scripts/run-parallel.sh "npx serve -s ./build -p 3000 --no-clipboard" "node scripts/esbuild.js watch"
fi