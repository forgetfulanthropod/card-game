set -x
path=$1
size=$2
f="$(dirname $path)/$(basename $path .png)"
cp "$f.png" "$f.png.bak"
sips --resampleWidth "$size" "$f.png" --out "$f-$size.png"
pngquant 64 --skip-if-larger --strip --ext=.png --force "$f-$size.png"
