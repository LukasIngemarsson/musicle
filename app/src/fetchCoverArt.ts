/* 
Fetches covers for songs; each cover is mapped to its cover image URL.
Initially, and if no cover is found, we return default-cover.jpg.

Uses musicbrainz api to get an ID for a song.
The ID is used in coverartarchive api (by musicbrainz) to get a cover.
*/

export const getSongCovers = async (
  songs: { title: string; artist: string }[]
) => {
  const covers: { [key: string]: string } = {};

  songs.forEach((song) => {
    covers[`${song.title}-${song.artist}`] = "/src/assets/default-cover.jpg"; //Default init
  });

  for (let song of songs) {
    //Try finding actual cover.
    const coverUrl = await fetchCoverArt(song.title, song.artist);
    covers[`${song.title}-${song.artist}`] = coverUrl;
  }

  return covers;
};

const fetchCoverArt = async (
  //Get cover for singular song.
  title: string,
  artist: string
): Promise<string> => {
  //Promise says "I'll give you a value later."
  const musicBrainzRes = await fetch(
    `https://musicbrainz.org/ws/2/release/?query=title:"${title}"%20AND%20artist:"${artist}"&fmt=json`
  );
  const musicBrainzData = await musicBrainzRes.json();
  const release = musicBrainzData.releases?.[0]; //Pick first result

  if (!release) return "/src/assets/default-cover.jpg";

  const coverRes = await fetch(
    `https://coverartarchive.org/release/${release.id}`
  );
  const coverData = await coverRes.json();
  const frontImage = coverData.images?.find((img: any) => img.front);

  return frontImage?.image;
};
