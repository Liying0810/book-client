import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);

  // Search for books from Google Books API
  const searchBooks = async () => {
    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      setSearchResults(res.data.items || []);
    } catch (error) {
      console.error("❌ Search failed:", error.message);
    }
  };

  // Save selected book to backend
const saveBook = async (book) => {
  const title = book?.volumeInfo?.title || 'No title';
  const authors = Array.isArray(book?.volumeInfo?.authors)
    ? book.volumeInfo.authors
    : ['Unknown author'];
  const description = book?.volumeInfo?.description || 'No description';
  const thumbnail = book?.volumeInfo?.imageLinks?.thumbnail || '';

  const bookData = { title, authors, description, thumbnail, note: '' };

  console.log("🧪 Save button clicked for:", title);
  console.log("📦 Sending book data:", bookData);

  try {
    const res = await axios.post('https://book-api-server-bm8l.onrender.com/api/books', bookData);
    console.log("✅ Saved:", res.data);
    await loadSavedBooks();
  } catch (error) {
    console.error('❌ Save failed:', error.response?.data || error.message);
  }
};





  // Load saved books from backend
  const loadSavedBooks = async () => {
    try {
      const res = await axios.get('https://book-api-server-bm8l.onrender.com/api/books');
      console.log('📚 Loaded saved books:', res.data);
      setSavedBooks(res.data);
    } catch (error) {
      console.error('❌ Save failed:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    loadSavedBooks();
  }, []);

  // Debug render
  console.log("Rendering savedBooks:", savedBooks);

  return (
    <div style={{ padding: 20 }}>
      <h2>Book Search</h2>
      <input
        id="search"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title..."
      />
      <button onClick={searchBooks}>Search</button>

<h3>Results</h3>
{searchResults.length === 0 ? (
  <p>No search results.</p>
) : (
  <ul>
    {searchResults.map((book) => {
      const title = book.volumeInfo?.title || 'No title';
      const authors = book.volumeInfo?.authors?.join(', ') || 'Unknown author';

      return (
        <li key={book.id}>
          <b>{title}</b> by {authors}
          <button onClick={() => {
            console.log("🧪 Save button clicked for:", title);
            saveBook(book);
          }}>
            Save
          </button>
        </li>
      );
    })}
  </ul>
)}


      <h3>Saved Books</h3>
      {Array.isArray(savedBooks) && savedBooks.length === 0 ? (
        <p>⚠️ No books saved yet.</p>
      ) : (
        <ul>
          {savedBooks.map((book) => (
            <li key={book._id}>
              <b>{book.title || 'Untitled'}</b> by {book.authors?.join(', ') || 'Unknown author'} – {book.note || 'No note'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;


