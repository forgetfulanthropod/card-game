if [ -z "$1" ]; then
    echo Filename required. Changes not saved.
    exit 1
fi
mkdir patches
filename=./patches/$1.patch
git diff --patch --staged > $filename
git commit -m 'temp'
git reset --hard HEAD^
echo Changes saved to $filename
echo Apply them with git apply $filename
