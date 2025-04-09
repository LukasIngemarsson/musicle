import SongCard from "../components/SongCard";
import markoolioCover from "../assets/markoolio.jpg";

function Home() {
  const centerContainerCSS =
    "absolute flex flex-row gap-5 items-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2";

  const titleCSS =
    "text-3xl text-white text-center transition-transform duration-200 ease-in-out hover:scale-110";

  const markoolioSong = {
    title: "Vi drar till fjällen",
    artist: "Markoolio",
    cover: markoolioCover,
  };

  return (
    <div className={centerContainerCSS}>
      <h1 className={titleCSS}>KALLES TRE FAVORITLÅTAR</h1>
      <SongCard {...markoolioSong} />
      <SongCard {...markoolioSong} />
      <SongCard {...markoolioSong} />
    </div>
  );
}

export default Home;
