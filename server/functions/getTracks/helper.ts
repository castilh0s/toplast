import * as cheerio from "cheerio";
import { IUserGetTopTracksParams } from "@toplast/lastfm/lib/modules/user/params.interface";
import LastFm from "@toplast/lastfm";
import axios from "axios";
import config from "../utils/config";

const lastFm = new LastFm(config.get("LAST_FM_API_KEY"));

async function getImage(url: string): Promise<string> {
  const { data } = await axios(url);
  const { children } = cheerio(".cover-art", data)[0];

  for (const element of children) {
    if (element.name === "img") {
      return element.attribs?.src;
    }
  }

  return config.DEFAULT_IMAGE;
}

export async function getTracks(
  params: IUserGetTopTracksParams,
): Promise<unknown> {
  const tracksPromise = await (
    await lastFm.user.getTopTracks(params)
  ).toptracks.track.map(async ({ name, playcount, artist, url }) => ({
    name,
    playcount,
    artist: artist.name,
    image: await getImage(url),
  }));

  return Promise.all(tracksPromise);
}
