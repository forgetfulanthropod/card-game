set -x
cp "$1.png" "$1.png.bak"
sips --resampleWidth "$2" "$1.png" --out "$1-$2.png"
pngquant 64 --skip-if-larger --strip --ext=.png --force "$1-$2.png"
