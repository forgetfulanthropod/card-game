ffprobe -i input.mp4 -show_streams -select_streams a -loglevel error
# In case there's no audio it ouputs nothing. If there is an audio stream then you get something like:
# https://stackoverflow.com/a/21447100
