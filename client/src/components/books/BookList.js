import React from "react";

const BookList = ({
  books,
  handleLoan,
  navigateToHome,
  userData,
  navigateToAddBook,
}) => {
  const backgroundStyle = {
    backgroundImage: "url('/images/listTest.jpg')", // Correct absolute path
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "200vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "20px",
    overflowY: "auto", // Allow scrolling if content overflows
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Horizontal layout
    gap: "10px",
    width: "100%",
    maxWidth: "1200px",
  };

  const cardStyle = {
    backgroundColor: "white", // White background for the card
    borderRadius: "15px", // Rounded corners
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    padding: "10px", // Add padding inside the card
    textAlign: "center", // Center-align text
  };

  const imageStyle = {
    width: "100%", // Full width of the card
    height: "300px", // Adjust height to match the screenshot
    objectFit: "cover", // Ensure the image fits nicely
    borderRadius: "8px", // Rounded corners for the image
  };

  const buttonStyle = {
    padding: "15px 30px", // Larger padding for bigger buttons
    fontSize: "16px", // Larger font size
    borderRadius: "8px", // Rounded corners
    border: "none", // Remove border
    cursor: "pointer", // Pointer cursor on hover
    margin: "10px", // Add spacing between buttons
  };

  const addBookButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#28a745", // Green color for "Add Book"
    color: "white", // White text
  };

  const backButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007bff", // Blue color for "Back to Menu"
    color: "white", // White text
  };

  const handleLoanClick = (book) => {
    if (book.userHasHold || book.otherUserHasHold) {
      alert(`Placing order for hold on book: "${book.title}".`);
    } else {
      alert(`Checking out a loan for book: "${book.title}".`);
    }
  };

  return (
    <div style={backgroundStyle}>
      <h2 style={{ color: "white" }}>Available Books</h2>

      {/* Add Book Button for Admins */}
      {userData?.Role === "Admin" && (
        <button onClick={navigateToAddBook} style={addBookButtonStyle}>
          Add Book
        </button>
      )}

      <div style={gridStyle}>
        {books.map((book) => {
          let bookClass = "book-item";
          if (book.copies === 0) {
            bookClass += " out-of-stock";
          } else if (book.userHasHold || book.otherUserHasHold) {
            bookClass += " on-hold";
          }

          return (
            <div key={book.bookID} style={cardStyle} className={bookClass}>
              <img
                src={`/images/books/${book.bookID}.jpg`}
                alt={book.title}
                style={imageStyle}
                onError={(e) => (e.target.src = "/images/default-book.jpg")} // Fallback image
              />
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Genre: {book.genre}</p>
              <div className="button-group">
                {/* Loan Button */}
                <button
                  onClick={() => handleLoanClick(book)}
                  disabled={book.copies === 0}
                  style={{
                    ...buttonStyle,
                    backgroundColor:
                      book.userHasHold || book.otherUserHasHold
                        ? "#f7d774"
                        : "#007bff", // Yellow if on hold, blue otherwise
                    color: "white",
                  }}
                >
                  {book.userHasHold || book.otherUserHasHold ? "Hold" : "Loan"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back to Menu Button */}
      <button onClick={navigateToHome} style={backButtonStyle}>
        Back to Menu
      </button>
    </div>
  );
};

export default BookList;
