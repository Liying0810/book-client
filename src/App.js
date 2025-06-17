import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);

  const searchBooks = async () => {
    const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    setSearchResults(res.data.items || []);
  };

const saveBook = async (book) => {
  try {
    const bookData = {
      title: book.volumeInfo.title || 'No title',
      authors: book.volumeInfo.authors || ['Unknown author'],
      description: book.volumeInfo.description || 'No description',
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
      note: ''
    };

    const res = await axios.post('https://book-api-server.onrender.com/api/books', bookData);
    console.log('✅ Book saved:', res.data);
    await loadSavedBooks();
  } catch (error) {
    console.error('❌ Save failed:', error.message);
  }
};

const loadSavedBooks = async () => {
  try {
    const res = await axios.get('https://book-api-server.onrender.com/api/books');
    console.log('📚 Loaded saved books:', res.data);
    setSavedBooks(res.data);
  } catch (error) {
    console.error('❌ Failed to load saved books:', error.message);
  }
};


  useEffect(() => {
    loadSavedBooks();
  }, []);

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
      <ul>
        {searchResults.map((book) => (
          <li key={book.id}>
            <b>{book.volumeInfo.title}</b> by {book.volumeInfo.authors?.join(', ')}
            <button onClick={() => saveBook(book)}>Save</button>
          </li>
        ))}
      </ul>

<h3>Saved Books</h3>
{savedBooks.length === 0 ? (
  <p>⚠️ No books saved yet.</p>
) : (
  <ul>
    {savedBooks.map((book) => (
      <li key={book._id}>
        <b>{book.title || 'Untitled'}</b> by {book.authors?.join(', ') || 'Unknown author'} – {book.note || "No note"}
      </li>
    ))}
  </ul>
)}

    </div>
  );
}

export default App;

