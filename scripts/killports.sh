for port in "$@"; do
    thepid=$(lsof -nP -iTCP -sTCP:LISTEN | grep $port | tr -s ' ' | cut -d ' ' -f 2)
    if [ -z "$thepid" ]; then
        echo "no process on port $port"
    else
        echo "killing process on port $port"
        kill -9 $thepid
    fi
    thepid=''
done
