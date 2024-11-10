import { useEffect, useMemo, useState } from "react";
import data from "./data/books.json";
import "./App.css";

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem(key)) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        setValue(event.newValue ? JSON.parse(event.newValue) : initialState);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialState]);

  return [value, setValue];
};

function App() {
  const [books, setBooks] = useState(data.library);
  const [count, setCount] = useState(books.length);
  const [readList, setReadList] = useStorageState("readList", []);

  const handleCountChange = (event) => {
    setCount(event.target.value);
  };

  const handleGenreChange = (event) => {
    event.target.value !== "All"
      ? setBooks(
          data.library.filter((item) => item.book.genre === event.target.value)
        )
      : setBooks(data.library);
  };

  const handleAddRead = (read) => {
    if (!readList.find((book) => book.ISBN === read.ISBN)) {
      setReadList([...readList, read]);
    }
  };

  const handleRemoveRead = (read) => {
    const newReadList = readList.filter((book) => book.ISBN !== read.ISBN);
    setReadList(newReadList);
  };

  useEffect(() => {
    setCount(books.length);
  }, [books]);

  const genresList = useMemo(() => {
    const genres = [...new Set(data.library.map((item) => item.book.genre))];
    return ["All", ...genres];
  }, []);

  const isRead = (isbn) => {
    return readList.find((book) => book.ISBN === isbn) ? true : false;
  };

  return (
    <>
      <header>
        <h1>React Reading List Project</h1>
      </header>

      <main>
        {/* Available books display */}
        <form>
          <label htmlFor="booksLimit">Number of results</label>
          <input
            type="range"
            id="booksLimit"
            min={1}
            max={books.length}
            value={count}
            onChange={(e) => handleCountChange(e)}
          />

          <label htmlFor="genre">Genre</label>
          <select
            name="genreSelector"
            id="genre"
            onChange={(e) => handleGenreChange(e)}
          >
            {genresList.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </form>
        <div className="content">
          <article>
            <h2>{count} book(s) available</h2>
            <div className="books-container">
              <ul>
                {books.slice(0, count).map((item) => (
                  <li
                    className={`book-card ${
                      isRead(item.book.ISBN)
                        ? "disabled-book"
                        : "available-book"
                    }`}
                    key={item.book.ISBN}
                  >
                    <img
                      className="cover-image"
                      src={item.book.cover}
                      alt={`Cover image for: ${item.book.title}`}
                    />
                    <button
                      disabled={isRead(item.book.ISBN)}
                      onClick={() => handleAddRead(item.book)}
                    >
                      Add to read
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </article>
          <aside className="read-list">
            {/* Selected books list */}
            <h2>Reading List</h2>
            <div className="books-container">
              <ul>
                {readList.map((read) => (
                  <li key={read.ISBN} className="book-card">
                    <img
                      className="cover-image"
                      src={read.cover}
                      alt={`Cover image for: ${read.title}`}
                    />
                    <button onClick={() => handleRemoveRead(read)}>
                      Remove read
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default App;
