for f in *.psd; do
    name=$(basename $f .psd)
    echo converting "$name"'.psd[0]' to $name.png...
    convert "$name"'.psd[0]' -resize 800x "$name-800.png"
done
