type SongCardProps = {
  title: string;
  artist: string;
  cover: string;
};

function SongCard({ title, artist, cover }: SongCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md/50 p-4 w-64 transform transition duration-300 hover:scale-105 hover:shadow-xl/25">
      <div className="relative w-full h-40 rounded-md overflow-hidden">
        <img
          src={cover}
          alt={`${title} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <h2 className="text-xl font-semibold mt-3">{title}</h2>
      <p className="text-gray-600">{artist}</p>
    </div>
  );
}

export default SongCard;
