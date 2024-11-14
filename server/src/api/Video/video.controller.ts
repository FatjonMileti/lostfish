import express from "express";
import {createReadStream, stat} from "fs";
import {promisify} from "util";

const filename = `${__dirname}/LostFish.mp4`;
const fileInfo = promisify(stat)

export const videoController = async (req: express.Request, res: express.Response) => {
  try {
    const {size} = await fileInfo(filename);

    res.writeHead(200, {
      'Content-Length': size,
      'Content-Type': 'video/mp4'
    })
    createReadStream(filename).pipe(res);
  } catch (error) {
    console.error("File not found:", error);
    res.status(404).send("Video not found");
  }
}