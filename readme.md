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

`getWorkoutData.py` (a python 3.4 script, mind) accepts a single argument:
the path to an XML-file (see expected format below) or a directory containing
such files. Output is a json file containing total time and distance for each
workout.

### Expected format
My workout files have the following format (`.tcx` container):
```
<?xml version='1.0' encoding='UTF-8'?>
<TrainingCenterDatabase xmlns:ext="http://www.garmin.com/xmlschemas/ActivityExtension/v2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
  <Activities>
    <Activity Sport="Running">
      <Id>2015-10-11T11:56:16Z</Id>
      <Lap StartTime="2015-10-11T11:56:16Z">
        <TotalTimeSeconds>4144.29</TotalTimeSeconds>
        <DistanceMeters>15150.4990234</DistanceMeters>
        ...
      </Lap>
      <Lap...></Lap>
      ...
      <Lap...></Lap>
      <Creator xsi:type="Device_t">
        <Name>Forerunner 410 Software Version 2.30</Name>
        <UnitId>3858869739</UnitId>
        <ProductID>1250</ProductID>
        <Version>
          <VersionMajor>2</VersionMajor>
          <VersionMinor>30</VersionMinor>
          <BuildMajor>0</BuildMajor>
          <BuildMinor>0</BuildMinor>
        </Version>
      </Creator>
    </Activity>
  </Activities>
</TrainingCenterDatabase>
```
The `xmlns:ext="..."` parts are stripped in preprocessing (mentioned earlier).

## Dependencies
The following dependencies are also included in this repository.

 * Uses [pixi.js](https://github.com/pixijs/pixi.js) for rendering.
 * Uses [stats.js](http://github.com/mrdoob/stats.js) for fps-benchmarks
