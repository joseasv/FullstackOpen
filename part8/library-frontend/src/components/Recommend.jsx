import { ALL_BOOKS, ME } from "../queries";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

const Recommend = () => {
  const [tableBooks, setTableBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const result = useQuery(ALL_BOOKS);
  const resultMe = useQuery(ME);

  useEffect(() => {
    console.log("useEffect triggered by result.data", result.data);
    if (result.data && resultMe.data) {
      console.log("Recommend books data ", result.data.allBooks);
      const books = result.data.allBooks;
      console.log("Recommend me data", resultMe.data.me.favoriteGenre);
      const favoriteGenre = resultMe.data.me.favoriteGenre;
      setSelectedGenre(favoriteGenre);

      console.log("selectedGenre", selectedGenre);
      const filteredBooks = books.filter((book) =>
        book.genres.includes(favoriteGenre),
      );
      console.log(filteredBooks);
      setTableBooks(filteredBooks);
    }
  }, [result.data]);

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
          {tableBooks.map((a) => (
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