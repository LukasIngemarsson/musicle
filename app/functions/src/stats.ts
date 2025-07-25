import {
  onCall,
  CallableRequest,
  HttpsError,
} from "firebase-functions/v2/https";

import { callSpotifyApi } from "./spotify";
import { ArtistData, TrackData } from "../../src/types";

import { spotifyClientSecretVar } from "./config";

/**
 * time_range:
 * Over what time frame the affinities are computed.
 * Valid values:
 * long_term (calculated from ~1 year of data and
 * including all new data as it becomes available),
 * medium_term (approximately last 6 months),
 * short_term (approximately last 4 weeks).
 * Default: medium_term
 */
export const getTopTracks = onCall(
  { secrets: [spotifyClientSecretVar] },
  async (req: CallableRequest<{ userId: string; timeRange: string }>) => {
    const { userId, timeRange } = req.data;

    if (!userId || typeof userId !== "string") {
      throw new HttpsError("invalid-argument", "Invalid or missing userId.");
    }
    if (!timeRange || typeof timeRange !== "string") {
      throw new HttpsError("invalid-argument", "Invalid or missing timeRange.");
    }

    try {
      const res = await callSpotifyApi({
        endpoint: "/v1/me/top/tracks",
        method: "GET",
        queryParams: {
          limit: 20,
          time_range: timeRange,
        },
        userId: userId,
      });

      const topTracks: TrackData[] = [];
      for (const item of res.items) {
        topTracks.push({
          uri: item.uri,
          name: item.name,
          artist: item.artists[0].name,
          album: item.album?.name,
          albumCoverUrl: item.album?.images?.[0]?.url,
          isrc: item.external_ids.isrc,
        } as TrackData);
      }

      return { topTracks: topTracks };
    } catch (e: any) {
      throw new HttpsError(
        "internal",
        `Failed to get top tracks: ${e.message}`
      );
    }
  }
);

export const getTopArtists = onCall(
  { secrets: [spotifyClientSecretVar] },
  async (req: CallableRequest<{ userId: string; timeRange: string }>) => {
    const { userId, timeRange } = req.data;

    if (!userId || typeof userId !== "string") {
      throw new HttpsError("invalid-argument", "Invalid or missing userId.");
    }
    if (!timeRange || typeof timeRange !== "string") {
      throw new HttpsError("invalid-argument", "Invalid or missing timeRange.");
    }

    try {
      const res = await callSpotifyApi({
        endpoint: "/v1/me/top/artists",
        method: "GET",
        queryParams: {
          limit: 10,
          time_range: timeRange,
        },
        userId: userId,
      });

      let topArtists: ArtistData[] = [];
      for (const item of res.items) {
        topArtists.push({
          uri: item.uri,
          name: item.name,
          image: item.images[0].url,
          genres: item.genres,
          numFollowers: item.followers.total,
        } as ArtistData);
      }

      return { topArtists: topArtists };
    } catch (e: any) {
      throw new HttpsError(
        "internal",
        `Failed to get top artists: ${e.message}`
      );
    }
  }
);
