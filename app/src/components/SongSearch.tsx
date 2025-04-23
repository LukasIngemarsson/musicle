import { useState, useEffect } from "react";

const SongSearch = () => {
  const [songQuery, setSongQuery] = useState(""); //Song query
  const [artistQuery, setArtistQuery] = useState(""); //Artist query
  const [results, setResults] = useState<any[]>([]); //Search results
  const [loading, setLoading] = useState(false); //Loading state
  const [currentPage, setCurrentPage] = useState(1); //Track page of results
  const resultsPerPage = 5; //Results per page (max 25)

  const containerClass =
    "absolute flex flex-col items-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2";
  const titleClass = "text-3xl p-5 text-white text-center";
  const searchContainerClass = "flex space-x-4 mb-4";
  const inputClass =
    "bg-primary text-neutralbg-primary text-neutral rounded-4xl shadow-md/25\
     p-4 transition duration-250 focus:outline-none focus:ring-2 focus:ring-accent rounded-4xl shadow-md p-4 w-60";
  const loadingTextClass = "text-white";
  const resultsListClass = "text-white";
  const resultItemClass = "my-2";
  const paginationContainerClass = "flex mt-4 items-center";
  const paginationButtonClass =
    "bg-secondary text-white px-4 py-2 mx-1 rounded hover:bg-primary hover:text-accent hover:border-accent border-2 border-transparent transition-colors duration-200";
  const paginationTextClass = "text-white mx-2";

  useEffect(() => {
    const fetchResults = async () => {
      if (!songQuery.trim() && !artistQuery.trim()) return; //Don't fetch if both are empty
      setLoading(true);

      try {
        const query = `${songQuery ? `title:"${songQuery}"` : ""} ${
          artistQuery ? `AND artist:"${artistQuery}"` : ""
        }`;

        const res = await fetch(
          `https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(
            query
          )}&fmt=json`
        );
        const data = await res.json();
        setResults(data.recordings || []); //Set results if available
      } catch (error) {
        console.log("Error fetching data:", error);
        setResults([]); //Clear results on error
      } finally {
        setLoading(false);
      }
    };

    setCurrentPage(1); //page 1 whenever query changes
    const timer = setTimeout(() => fetchResults(), 500); //500ms debounce

    return () => clearTimeout(timer);
  }, [songQuery, artistQuery]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(results.length / resultsPerPage);

  return (
    <div className={containerClass}>
      <h1 className={titleClass}>Search for songs</h1>

      <div className={searchContainerClass}>
        <input
          type="text"
          value={songQuery}
          onChange={(e) => setSongQuery(e.target.value)}
          placeholder="Search for a song..."
          className={inputClass}
        />
        <input
          type="text"
          value={artistQuery}
          onChange={(e) => setArtistQuery(e.target.value)}
          placeholder="Search for an artist..."
          className={inputClass}
        />
      </div>

      {loading && <p className={loadingTextClass}>Loading...</p>}

      {currentResults.length > 0 ? (
        <ul className={resultsListClass}>
          {currentResults.map((recording: any) => (
            <li key={recording.id} className={resultItemClass}>
              <h3>{recording.title}</h3>
              <p>{recording["artist-credit"]?.[0]?.name || "Unknown Artist"}</p>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className={loadingTextClass}>No Results</p>
      )}

      {results.length > resultsPerPage && (
        <div className={paginationContainerClass}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={paginationButtonClass}
          >
            Previous
          </button>
          <span className={paginationTextClass}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={paginationButtonClass}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SongSearch;
