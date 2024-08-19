import { useEffect, useState } from "react";
import { ALL_BOOKS } from "../queries";
import { useQuery } from "@apollo/client";

const Books = () => {
  const [tableBooks, setTableBooks] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const result = useQuery(ALL_BOOKS);

  useEffect(() => {
    console.log("useEffect triggered by result.data", result.data);
    if (result.data) {
      const books = result.data.allBooks;
      setTableBooks(books);

      //setTableBooks(books);
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
  }, [result.data]);

  const filterBooks = (event) => {
    console.log(event);
    const genreFilter = event.target.innerText;
    setSelectedGenre(genreFilter);
    const filteredBooks = result.data.allBooks.filter((book) =>
      book.genres.includes(genreFilter),
    );
    setTableBooks(filteredBooks);
    console.log("filtered books ", filteredBooks);
  };

  if (result.loading) {
    return <div>loading books...</div>;
  }

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
          {tableBooks.map((a) => (
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
            setTableBooks(result.data.allBooks);
          }}
        >
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
