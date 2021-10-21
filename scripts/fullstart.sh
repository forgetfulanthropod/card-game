# https://apple.stackexchange.com/a/58151

wd=$(pwd)
osascript -e "
tell application \"Terminal\"
    activate
    do script \"cd $wd; npm start\" in front window
    my makeTab()
    do script \"cd $wd; npm run serve\" in front window
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
