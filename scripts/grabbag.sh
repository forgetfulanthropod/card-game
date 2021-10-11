for f in *.psd; do
    name=$(basename $f .psd)
    echo converting "$name"'.psd[0]' to $name.png...
    convert "$name"'.psd[0]' -resize 800x "$name-800.png"
done

for f in *-800.png; do
    # name=$(basename $f .psd)
    echo $f
    pngquant 64 --skip-if-larger --strip --ext=.png --force $f
done

for f in *-800.png; do
    name=$(basename $f -800.png)
    sips --resampleWidth 200 $f --out "$name-200.png"
done

for f in *.png; do
    name=$(basename $f .png)
    echo $name
    pngquant 64 --skip-if-larger --strip --ext=.png --force $f
    sips --resampleWidth 800 $f --out "$name-800.png"
    sips --resampleWidth 200 $f --out "$name-200.png"
done
