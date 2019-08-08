const fs = require('fs');
const path = require('path');
const recursiveReaddir = require('recursive-readdir');
const { orderBy } = require('natural-orderby');

const config = require('../../../config.json');

/**
 * Returns list of playable tracks in a given folder. Track is an object
 * containing 'title', 'subtitle' and 'hash'.
 * @param {Number} id Work identifier. Currently, RJ/RE code.
 * @param {String} dir Work directory (relative).
 */
const getTrackList = (id, dir) => recursiveReaddir(
  path.join(config.rootDir, dir),
)
  .then((files) => {
    // Filter out any files not matching these extensions
    const filteredFiles = files.filter((file) => {
      const ext = path.extname(file);

      return (ext === '.mp3' || ext === '.ogg' || ext === '.opus' || ext === '.wav' || ext === '.flac');
    });

    // Sort by folder and title
    const sortedFiles = orderBy(filteredFiles.map((file) => {
      const shortFilePath = file.replace(path.join(config.rootDir, dir, '/'), '');
      const dirName = path.dirname(shortFilePath);

      return {
        title: path.basename(file),
        subtitle: dirName === '.' ? null : dirName,
      };
    }), [v => v.subtitle, v => v.title]);

    // Add hash to each file
    const sortedHashedFiles = sortedFiles.map(
      (file, index) => ({
        title: file.title,
        subtitle: file.subtitle,
        hash: `${id}/${index}`,
      }),
    );

    return sortedHashedFiles;
  })
  .catch((err) => { throw new Error(`Failed to get tracklist from disk: ${err}`); });

/**
 * Returns list of directory names (relative) that contain an RJ code.
 */
const getFolderList = () => new Promise((resolve, reject) => {
  fs.readdir(config.rootDir, (err, folders) => {
    if (err) {
      return reject(err);
    }

    if (!folders) {
      return reject(new Error(`Could not read from ${config.rootDir}`));
    }

    return resolve(folders.filter(folder => folder.match(/RJ\d{6}/)));
  });
});

/**
 * Deletes a work's cover image from disk.
 * @param {String} rjcode Work RJ code (only the 6 digits, zero-padded).
 */
const deleteCoverImageFromDisk = rjcode => new Promise((resolve, reject) => {
  fs.unlink(path.join(config.rootDir, 'Images', `RJ${rjcode}.jpg`), (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

/**
 * Saves cover image to disk.
 * @param {ReadableStream} stream Image data stream.
 * @param {String} rjcode Work RJ code (only the 6 digits, zero-padded).
 */
const saveCoverImageToDisk = (stream, rjcode) => new Promise((resolve, reject) => {
  // TODO: don't assume image is a jpg?
  try {
    stream.pipe(
      fs.createWriteStream(path.join(config.rootDir, 'Images', `RJ${rjcode}.jpg`))
        .on('close', () => resolve()),
    );
  } catch (err) {
    reject(err);
  }
});

module.exports = {
  getTrackList,
  getFolderList,
  deleteCoverImageFromDisk,
  saveCoverImageToDisk,
};
