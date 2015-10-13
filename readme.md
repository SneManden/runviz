# Running visualizer
A "small" project for visualizing workouts / runs, using a game-like interface.

## Usage
Run a (e.g. local) server at root directory and view in a browser.

Quick and dirty:
```
python -m SimpleHTTPServer
```

## Modifications
I drew the character based on my own appearance. The repository already
includes a plain template, that can easily be modified to draw the character
you like (or perhaps add an array of characters and turn this into a running
game or marathon simulator? whoa).

The template is by *Chumbucket*; I found it many years ago when I started
fiddling around in GameMaker.
(See [male_movement_source.png](assets/male_movement_source.png))

## Retrieve your own workouts
I used a python script to parse all my `.tcx` files from workouts
(tracked with a Garmin Forerunner 410 and downloaded using
[ant-downloader](https://github.com/braiden/python-ant-downloader)).

I found the files to contain erronous tag / formatting, which explains the
pre-processing. See [getWorkoutData.py](getWorkoutData.py).

## Dependencies
The following dependencies are also included in this repository.

 * Uses [pixi.js](https://github.com/pixijs/pixi.js) for rendering.
 * Uses [stats.js](http://github.com/mrdoob/stats.js) for fps-benchmarks
