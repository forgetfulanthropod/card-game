echo $(pwd)
if [ "$ESBUILD_DONT_SERVE" = "yes" ];
then
    node scripts/esbuild.js watch
else
    bash scripts/run-parallel.sh "npm run serve" "node scripts/esbuild.js watch"
fi
