[ -f .env ] && source .env

node scripts/esbuild.js
if [ "$SHOULD_TSC_CHECK" = "yes" ]; then
    echo "running tsc"
    npm run tsc
fi
