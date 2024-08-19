import { useEffect, useState } from "react";
import { BOOKS_BY_GENRE } from "../queries";
import { useQuery } from "@apollo/client";

const Books = () => {
  const [allGenres, setAllGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const { result, error, data, refetch, loading } = useQuery(BOOKS_BY_GENRE);
  let books = [];

  useEffect(() => {
    if (allGenres.length === 0) {
      const genres = books.reduce((genresFound, book) => {
        //console.log("genresFound ", genresFound);
        //console.log("book ", book);
        const bookGenres = book.genres;
        //console.log("bookGenres", bookGenres);
        bookGenres.forEach((genre) => {
          if (genresFound.indexOf(genre) === -1) {
            genresFound.push(genre);
          }
        });

        return genresFound;
      }, []);

      setAllGenres(genres);
    }
  }, [data]);

  if (loading) {
    return <div>loading books...</div>;
  }

  if (data) {
    books = data.allBooks;
  }

  const filterBooks = (event) => {
    console.log(event);
    const genreFilter = event.target.innerText;
    setSelectedGenre(genreFilter);

    refetch({ genre: genreFilter });
  };

  return (
    <div>
      <h2>books</h2>
      <div>
        books in genre <b>{selectedGenre}</b>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {allGenres.map((genre) => (
          <button key={genre} onClick={filterBooks}>
            {genre}
          </button>
        ))}
        <button
          onClick={() => {
            setSelectedGenre("all genres");
            refetch({ genre: "" });
          }}
        >
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
