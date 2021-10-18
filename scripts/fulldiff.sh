f=$(mktemp)
git diff >$f.diff
code $f.diff
