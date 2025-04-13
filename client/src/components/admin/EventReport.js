import React, { useState, useEffect } from 'react';
import '../../styles/admin/BookManagement.css';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [bookForBarcode, setBookForBarcode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [bookData, setBookData] = useState({
    Title: '',
    Author: '',
    Genre: '',
    PublicationYear: new Date().getFullYear(),
    ISBN: '',
    CopyCount: 1,
    Publisher: '',
    Description: ''
  });
  
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);
  
  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/books');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        console.error('Invalid book data format');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/bookGenres');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.genres)) {
        setCategories(data.genres);
      } else {
        console.error('Invalid category data format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addCategory = async () => {
    if (!newCategory) return;
    
    try {
      const response = await fetch('/api/bookGenres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ genre: newCategory })
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchCategories();
        setNewCategory('');
        alert('Category added successfully!');
      } else {
        alert('Failed to add category: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('An error occurred while adding the category.');
    }
  };
  
  const deleteCategory = async (category) => {
    if (!window.confirm(`Are you sure you want to delete the "${category}" category?`)) return;
    
    try {
      const response = await fetch(`/api/bookGenres/${encodeURIComponent(category)}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchCategories();
        alert('Category deleted successfully!');
      } else {
        alert('Failed to delete category: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('An error occurred while deleting the category.');
    }
  };
  
  const handleAddBook = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Book added successfully!');
        fetchBooks();
        setShowAddForm(false);
        setBookData({
          Title: '',
          Author: '',
          Genre: '',
          PublicationYear: new Date().getFullYear(),
          ISBN: '',
          CopyCount: 1,
          Publisher: '',
          Description: ''
        });
      } else {
        alert('Failed to add book: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert('An error occurred while adding the book.');
    }
  };
  
  const handleEditBook = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/books/${selectedBook.bookID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Book updated successfully!');
        fetchBooks();
        setIsEditing(false);
        setSelectedBook(null);
      } else {
        alert('Failed to update book: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating book:', error);
      alert('An error occurred while updating the book.');
    }
  };
  
  const deleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Book deleted successfully!');
        fetchBooks();
      } else {
        alert('Failed to delete book: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('An error occurred while deleting the book.');
    }
  };
  
  const startEdit = (book) => {
    setSelectedBook(book);
    setBookData({
      Title: book.title,
      Author: book.author,
      Genre: book.genre,
      PublicationYear: book.year,
      ISBN: book.isbn || '',
      CopyCount: book.copies,
      Publisher: book.publisher || '',
      Description: book.description || ''
    });
    setIsEditing(true);
    setShowAddForm(true);
  };
  
  const generateBarcode = (book) => {
    setBookForBarcode(book);
    setShowBarcodeModal(true);
  };
  
  const printBarcode = () => {
    window.print();
  };
  
  const filteredBooks = books
    .filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.isbn && book.isbn.includes(searchTerm));
      
      const matchesCategory = filterCategory === 'all' || book.genre === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  
  return (
    <div className="book-management">
      <h3>Book Management</h3>
      
      <div className="management-actions">
        <div className="filters">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="action-buttons">
          <button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add New Book'}
          </button>
          <button onClick={() => setShowCategoryModal(true)}>
            Manage Categories
          </button>
        </div>
      </div>
      
      {showAddForm && (
        <form onSubmit={isEditing ? handleEditBook : handleAddBook} className="book-form">
          <h4>{isEditing ? 'Edit Book' : 'Add New Book'}</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="Title"
                value={bookData.Title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                name="Author"
                value={bookData.Author}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Genre</label>
              <select
                name="Genre"
                value={bookData.Genre}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Genre</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Publication Year</label>
              <input
                type="number"
                name="PublicationYear"
                value={bookData.PublicationYear}
                onChange={handleInputChange}
                min="1000"
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>ISBN</label>
              <input
                type="text"
                name="ISBN"
                value={bookData.ISBN}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Number of Copies</label>
              <input
                type="number"
                name="CopyCount"
                value={bookData.CopyCount}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Publisher</label>
              <input
                type="text"
                name="Publisher"
                value={bookData.Publisher}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="Description"
              value={bookData.Description}
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="submit">{isEditing ? 'Update Book' : 'Add Book'}</button>
            {isEditing && (
              <button type="button" onClick={() => {
                setIsEditing(false);
                setShowAddForm(false);
                setSelectedBook(null);
              }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}
      
      {isLoading ? (
        <p>Loading books...</p>
      ) : (
        <table className="books-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Year</th>
              <th>Available Copies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book => (
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.year}</td>
                <td>{book.copies}</td>
                <td className="actions-cell">
                  <button onClick={() => startEdit(book)}>Edit</button>
                  <button onClick={() => generateBarcode(book)}>Barcode</button>
                  <button className="delete-btn" onClick={() => deleteBook(book.bookID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Manage Book Categories</h4>
            
            <div className="category-list">
              <table>
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category}>
                      <td>{category}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteCategory(category)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="add-category">
              <h5>Add New Category</h5>
              <div className="input-group">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                />
                <button onClick={addCategory}>Add</button>
              </div>
            </div>
            
            <button className="close-btn" onClick={() => setShowCategoryModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Barcode Modal */}
      {showBarcodeModal && bookForBarcode && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Book Barcode</h4>
            
            <div className="barcode-container" id="printable-barcode">
              <div className="barcode-info">
                <p><strong>Title:</strong> {bookForBarcode.title}</p>
                <p><strong>Author:</strong> {bookForBarcode.author}</p>
                <p><strong>ID:</strong> {bookForBarcode.bookID}</p>
              </div>
              
              <div className="barcode-image">
                {/* This would be replaced with a real barcode library in production */}
                <div className="mockup-barcode">
                  <div className="barcode-line"></div>
                  <div className="barcode-line"></div>
                  <div className="barcode-line"></div>
                  <div className="barcode-line"></div>
                  <div className="barcode-line"></div>
                  <div className="barcode-line"></div>
                  <div className="barcode-line"></div>
                  <p className="barcode-number">{bookForBarcode.bookID}</p>
                </div>
              </div>
            </div>
            
            <div className="barcode-actions">
              <button onClick={printBarcode}>Print Barcode</button>
              <button onClick={() => setShowBarcodeModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
