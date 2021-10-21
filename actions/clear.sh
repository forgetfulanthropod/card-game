rm -rf ./shared
cp -r ../shared ./shared
for f in $(fd -e ts . shared); do
    sed -i. "1s/^/\/\/ READ-ONLY COPY of from root\/shared\n/" $f
    gchmod 0444 $f
done
rm -rf lib
