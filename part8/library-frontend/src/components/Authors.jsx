import { ALL_AUTHORS, ALL_BOOKS } from "../queries";
import { useQuery, useMutation } from "@apollo/client";
import { EDIT_AUTHOR_BORN_YEAR } from "../queries";

const Authors = () => {
  let authors = [];

  const result = useQuery(ALL_AUTHORS);

  const [editAuthorBornYear] = useMutation(EDIT_AUTHOR_BORN_YEAR, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
  });

  const submit = async (event) => {
    event.preventDefault();

    console.log("setting born year");

    const name = event.target.name.value;
    const setBornTo = Number(event.target.born.value);

    editAuthorBornYear({ variables: { name, setBornTo } });

    event.target.name.value = "";
    event.target.born.value = "";
  };

  if (result.loading) {
    return <div>loading authors...</div>;
  }

  if (result.data) {
    authors = result.data.allAuthors;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set Birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select name="name">
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input type="number" name="born" />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
