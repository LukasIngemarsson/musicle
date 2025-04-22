import { useEffect, useState } from "react";
import SongCard from "../components/SongCard";
import Carousel from "../components/Carousel";
import { getSongCovers } from "../fetchCoverArt";

const initialSongs = [
  { title: "Here Comes the Sun", artist: "The Beatles" },
  { title: "Africa", artist: "Weezer" },
  { title: "Bohemian Rhapsody", artist: "Queen" },
  { title: "Doesn't Exist", artist: "No Name" }, //Testing no cover.
];

function Home() {
  const [songs] = useState(initialSongs);
  const [covers, setCovers] = useState<{ [key: string]: string }>(() => {
    const initialCovers: { [key: string]: string } = {};
    songs.forEach((song) => {
      initialCovers[`${song.title}-${song.artist}`] =
        "/src/assets/default-cover.jpg";
    });
    return initialCovers;
  });

  useEffect(() => {
    const fetchCovers = async () => {
      const fetchedCovers = await getSongCovers(songs);
      setCovers((prevCovers) => ({
        ...prevCovers,
        ...fetchedCovers,
      }));
    };

    fetchCovers();
  }, [songs]);

  return (
    <div className="absolute flex flex-col items-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <h1 className="text-3xl text-white text-center">Kalles Senaste</h1>
      <Carousel>
        {songs.map((song) => (
          <SongCard
            key={`${song.title}-${song.artist}`}
            title={song.title}
            artist={song.artist}
            cover={covers[`${song.title}-${song.artist}`]}
          />
        ))}
      </Carousel>
    </div>
  );
}

export default Home;
