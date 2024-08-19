import { ALL_BOOKS, ME, BOOKS_BY_GENRE } from "../queries";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

const Recommend = () => {
  const [tableBooks, setTableBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const { result, error, data, refetch, loading } = useQuery(BOOKS_BY_GENRE, {
    variables: {
      genre: "",
    },
  });
  const resultMe = useQuery(ME);
  let books = [];

  useEffect(() => {
    console.log("useEffect triggered by result.data", resultMe.data);
    if (resultMe.data) {
      console.log("Recommend me data", resultMe.data.me.favoriteGenre);
      const favoriteGenre = resultMe.data.me.favoriteGenre;
      setSelectedGenre(favoriteGenre);

      console.log("selectedGenre", selectedGenre);
      refetch({ genre: favoriteGenre });
    }
  }, [resultMe.data]);

  if (loading) {
    return <div>loading books...</div>;
  }

  if (data) {
    books = data.allBooks;
  }

  return (
    <div>
      <h2>books</h2>
      <div>
        books in your favorite genre <b>{selectedGenre}</b>
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
    </div>
  );
};

export default Recommend;