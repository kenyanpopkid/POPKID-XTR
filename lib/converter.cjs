const fs = require('fs');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const { spawn } = require('child_process');

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      const tempIn = path.join(__dirname, '../scs', `${Date.now()}.${ext}`);
      const tempOut = `${tempIn}.${ext2}`;
      await fs.promises.writeFile(tempIn, buffer);

      const ff = spawn(ffmpegPath, ['-y', '-i', tempIn, ...args, tempOut]);

      ff.stderr.on('data', data => console.error('[ffmpeg stderr]', data.toString()));
      ff.on('error', reject);

      ff.on('close', async (code) => {
        try {
          await fs.promises.unlink(tempIn);
          if (code !== 0) return reject(new Error(`ffmpeg exited with code ${code}`));
          const data = await fs.promises.readFile(tempOut);
          await fs.promises.unlink(tempOut);
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });

    } catch (e) {
      reject(e);
    }
  });
}

function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-ac', '2',
    '-b:a', '128k',
    '-ar', '44100',
    '-f', 'mp3'
  ], ext, 'mp3');
}

function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10'
  ], ext, 'opus');
}

function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-ab', '128k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow'
  ], ext, 'mp4');
}

module.exports = {
  toAudio,
  toPTT,
  toVideo,
  ffmpeg,
};
