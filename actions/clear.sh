rm -rf ./shared
cp -r ../shared ./shared

for f in $(echo shared/*.ts); do
    if [ "$OSTYPE" = "linux-gnu" ]; then
        sed -i "1s/^/\/\/ READ-ONLY COPY of from root\/shared\n/" $f
    else
        sed -i. "1s/^/\/\/ READ-ONLY COPY of from root\/shared\n/"  $f
    fi
    chmod 0444 $f
done
rm -rf lib
