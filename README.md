<p align="center">
  <img width="192" height="192" src="static/android-chrome-192x192.png" style="box-shadow: 0px 3px 8px #000">
</p>
A self-hosted web media player for listening to your DLsite voice works.

## Features
- Automatically scrapes metadata from HVDB
- Browse works by circle, tag or VA
- Queue functionality: mix and match tracks from many different works, in whichever order you want

## Quick Start
Requires both Node.js and npm installed in your system to run. Assuming you've downloaded from the releases page:
```bash
# Install dependencies
npm install --only=prod

# Change `rootDir` in `config.json` to the
# directory where you keep your voice works.

# Each folder must have an RJ code somewhere
# in its name for the scanner to detect it.

# Scan works into the database
npm run scan

# Start the server
npm start

# App is now available at http://0.0.0.0:8888
```

If you instead cloned this repository or just want more details, read below:
## Instructions
### Build from source
```bash
# Install dependencies
npm install

# Build app bundle
npm run build

# Start the production server
npm start

# App is now available at http://0.0.0.0:8888
```

### Configuration
You must change `rootDir` in the `config.json` to point to the directory where you keep your voice works. Each work must be a folder containing an RJ code anywhere in its name.

After this is done, you may run the initial scan:
```bash
npm run scan
```
This will create a file named `db.sqlite3`, containing metadata scraped from HVDB for each work found by the scanner. This file can safely be deleted if you wish to rebuild the database. It will also create a folder called `Images` inside your `rootDir` containing work cover images.

Subsequent runs of the scan command will do two things:
- Look for new works add them to the database
- Remove works which have been deleted from disk since last scan

It is important to note that the scanner is *not* recursive. That is to say, inside of the `rootDir` directory, every folder must contain a single work. If you have subdirectories for circles, VAs or anything like that the scanner will fail to find anything.

## Disclaimer
At the moment, although this works well enough for regular usage, you can expect to find small quirks and bugs.

This was developed on macOS and tested on Chrome for Android. It should run on Linux. I have no clue about Windows.
