[ -f .env ] && source .env
echo $(pwd)
# lint=$([ "$b" == 5 ] && echo "$c" || echo "$d")
serveString=$([ "$SHOULD_SERVE" = "yes" ] && echo "npm run serve" || echo "")
tscString=$([ "$SHOULD_TSC_WATCH" = "yes" ] && echo "npm run tsc-watch" || echo "")

echo serveString is $serveString
echo tscString is $tscString

bash scripts/run-parallel.sh \
    "node scripts/esbuild.js watch" \
    "$serveString" \
    "$tscString"
