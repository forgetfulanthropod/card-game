# echo "starting esbuild"
# osascript -e 'tell application "Terminal" to do script "npm start"'
# echo "starting emulate"
# osascript -e 'tell application "Terminal" to do script "npm run emulate"'
# echo "starting client tsc"
# osascript -e 'tell application "Terminal" to do script "npm run tsc-watch"'
# cd actions
# echo "starting backend tsc"
# osascript -e 'tell application "Terminal" to do script "npm run start"'

# https://apple.stackexchange.com/a/58151

wd=$(pwd)
osascript -e "
tell application \"Terminal\"
    activate
    do script \"cd $wd; npm start\" in front window
    my makeTab()
    do script \"cd $wd; npm run emulate\" in front window
    my makeTab()
    do script \"cd $wd; npm run tsc-watch\" in front window
    my makeTab()
    do script \"cd $wd/actions; npm run start\" in front window
end tell

on makeTab()
    tell application \"System Events\" to keystroke \"t\" using {command down}
    delay 0.2
end makeTab
"
