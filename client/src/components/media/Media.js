import React, { useState, useEffect, useRef } from "react";

// Update the Media component to accept userData as a prop
const Media = ({ navigateToHome, isLoggedIn, navigateToLogin, userData, initialCategory, navigateToLanding }) => {
  // State for media items from database
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [displayedItems, setDisplayedItems] = useState([]);
  const initialRenderRef = useRef(true);

  // Define fetchMediaItems outside of useEffect so it can be used elsewhere
  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/media');
      const data = await response.json();

      if (data.success) {
        setMediaItems(data.media);
      } else {
        setError(data.error || 'Failed to fetch media items');
      }
    } catch (err) {
      console.error('Error fetching media items:', err);
      setError('An error occurred while fetching media items');
    } finally {
      setLoading(false);
    }
  };

  // Fetch media data from database
  useEffect(() => {
    fetchMediaItems();
  }, []);

  // Use the initialCategory prop on mount
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Filter media items by category
  useEffect(() => {
    if (mediaItems.length > 0) {
      let items = [...mediaItems];
      
      if (selectedCategory !== "all") {
        // Map UI categories to database enum values
        const categoryMap = {
          "music": "Music",
          "movies": "Movie", // This is working correctly
          "videogames": "VideoGame" // Updated to match the enum value in your database
        };
        
        const dbCategory = categoryMap[selectedCategory];
        items = items.filter(item => 
          item.Type && item.Type === dbCategory
        );
      }
      
      setDisplayedItems(items);
      
      // Only apply animation on initial render or category change
      if (!initialRenderRef.current) {
        // Add a class to the container to trigger a CSS animation
        const container = document.querySelector('#media-grid');
        if (container) {
          container.classList.remove('fade-in-items');
          // Force a reflow to restart animation
          void container.offsetWidth;
          container.classList.add('fade-in-items');
        }
      } else {
        initialRenderRef.current = false;
      }
    }
  }, [selectedCategory, mediaItems]);

  // Apple-inspired styling
  const styles = {
    container: {
      padding: "0",
      maxWidth: "100%",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: "#1d1d1f",
      overflowX: "hidden",
    },
    hero: {
      height: "70vh",
      backgroundImage: "linear-gradient(to bottom, #000000, #212121)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "#ffffff",
      position: "relative",
      marginBottom: "60px",
      textAlign: "center",
    },
    heroTitle: {
      fontSize: "56px",
      fontWeight: "600",
      margin: "0",
      letterSpacing: "-0.02em",
      opacity: "0",
      transform: "translateY(20px)",
      animation: "fadeInUp 1s forwards",
    },
    heroSubtitle: {
      fontSize: "24px",
      fontWeight: "400",
      maxWidth: "600px",
      margin: "20px 0 0 0",
      opacity: "0",
      transform: "translateY(20px)",
      animation: "fadeInUp 1s forwards 0.3s",
    },
    navContainer: {
      position: "sticky",
      top: "70px",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(20px)",
      zIndex: "100",
      padding: "20px 0",
      marginBottom: "40px",
      borderBottom: "1px solid #f5f5f7",
    },
    nav: {
      display: "flex",
      justifyContent: "center",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "0 20px",
    },
    navButton: {
      backgroundColor: "transparent",
      border: "none",
      fontSize: "17px",
      fontWeight: "400",
      padding: "8px 18px",
      margin: "0 5px",
      cursor: "pointer",
      borderRadius: "20px",
      transition: "all 0.2s ease",
      color: "#1d1d1f",
    },
    activeNavButton: {
      backgroundColor: "#1d1d1f",
      color: "#ffffff",
      fontWeight: "500",
    },
    contentSection: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 24px 100px 24px",
    },
    sectionTitle: {
      fontSize: "32px",
      fontWeight: "600",
      margin: "0 0 40px 0",
      textAlign: "center",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "35px",
      marginBottom: "40px",
    },
    card: {
      borderRadius: "18px",
      overflow: "hidden",
      backgroundColor: "#fff",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
      opacity: "1", // Start visible
      transform: "translateY(0)", // Start in final position
      cursor: "pointer",
      animation: "none", // Remove JS animation
    },
    cardImage: {
      width: "100%",
      height: "300px",
      objectFit: "cover",
      borderTopLeftRadius: "18px",
      borderTopRightRadius: "18px",
      transition: "transform 0.5s ease",
    },
    cardContent: {
      padding: "20px",
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "600",
      margin: "0 0 8px 0",
      color: "#1d1d1f",
    },
    cardInfo: {
      fontSize: "14px",
      color: "#86868b",
      margin: "0 0 5px 0",
    },
    button: {
      display: "inline-block",
      backgroundColor: "#0071e3",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 22px",
      fontSize: "17px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginTop: "15px",
      textAlign: "center",
    },
    backButton: {
      display: "block",
      width: "max-content",
      margin: "60px auto 0 auto",
      backgroundColor: "transparent",
      border: "1px solid #86868b",
      color: "#1d1d1f",
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "17px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    "@keyframes fadeInUp": {
      from: {
        opacity: "0",
        transform: "translateY(20px)",
      },
      to: {
        opacity: "1",
        transform: "translateY(0)",
      },
    },
    loginMessage: {
      fontSize: "18px",
      fontWeight: "400",
      color: "#86868b",
      marginTop: "10px",
      textAlign: "center",
    },
    loginLink: {
      color: "#0071e3",
      textDecoration: "none",
      fontWeight: "500",
      cursor: "pointer",
    },
    disabledButton: {
      display: "inline-block",
      backgroundColor: "#000000", // Change to black instead of blue
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 22px",
      fontSize: "17px",
      fontWeight: "500",
      cursor: "pointer", // Change cursor to pointer
      marginTop: "15px",
      textAlign: "center",
      opacity: "0.9",
    },
  };

  // Add CSS styles for animations to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .fade-in-items .media-card {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.5s forwards;
      }
      
      .fade-in-items .media-card:nth-child(1) { animation-delay: 0.1s; }
      .fade-in-items .media-card:nth-child(2) { animation-delay: 0.15s; }
      .fade-in-items .media-card:nth-child(3) { animation-delay: 0.2s; }
      .fade-in-items .media-card:nth-child(4) { animation-delay: 0.25s; }
      .fade-in-items .media-card:nth-child(5) { animation-delay: 0.3s; }
      .fade-in-items .media-card:nth-child(6) { animation-delay: 0.35s; }
      .fade-in-items .media-card:nth-child(7) { animation-delay: 0.4s; }
      .fade-in-items .media-card:nth-child(8) { animation-delay: 0.45s; }
      .fade-in-items .media-card:nth-child(9) { animation-delay: 0.5s; }
      .fade-in-items .media-card:nth-child(10) { animation-delay: 0.55s; }
      .fade-in-items .media-card:nth-child(11) { animation-delay: 0.6s; }
      .fade-in-items .media-card:nth-child(12) { animation-delay: 0.65s; }
      .fade-in-items .media-card:nth-child(13) { animation-delay: 0.7s; }
      .fade-in-items .media-card:nth-child(14) { animation-delay: 0.75s; }
      .fade-in-items .media-card:nth-child(15) { animation-delay: 0.8s; }
      .fade-in-items .media-card:nth-child(16) { animation-delay: 0.85s; }
      .fade-in-items .media-card:nth-child(17) { animation-delay: 0.9s; }
      .fade-in-items .media-card:nth-child(18) { animation-delay: 0.95s; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add a loading state for images
  const [imageLoadingStatus, setImageLoadingStatus] = useState({});

  // Handle image loading status
  const handleImageLoad = (id) => {
    setImageLoadingStatus(prev => ({
      ...prev,
      [id]: 'loaded'
    }));
  };

  const handleImageError = (id, e) => {
    setImageLoadingStatus(prev => ({
      ...prev,
      [id]: 'error'
    }));
    e.target.onerror = null; // Prevent any further error handling
    // Use a data URI instead of an image file to prevent infinite loops
    e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgMzAwIDQ1MCIgZmlsbD0ibm9uZSI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiNmMGYwZjAiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOTk5Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==";
  };

  // Enhance styling for image container
  const additionalStyles = {
    imageContainer: {
      position: "relative",
      height: "300px",
      overflow: "hidden",
      borderTopLeftRadius: "18px",
      borderTopRightRadius: "18px",
      backgroundColor: "#f5f5f7",
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    loadingSpinner: {
      border: "4px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      borderTop: "4px solid #0071e3",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite",
    }
  };

  // Add the spinner animation
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Map of Wikipedia image URLs for media items
  const wikipediaImageUrls = {
    "Abbey Road": "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
    "Thriller": "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
    "Back in Black": "https://upload.wikimedia.org/wikipedia/commons/9/92/ACDC_Back_in_Black.png",
    "The Dark Side of the Moon": "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
    "OK Computer": "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
    "Blue": "https://upload.wikimedia.org/wikipedia/en/e/e1/Bluealbumcover.jpg",
    "The Shawshank Redemption": "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg",
    "The Godfather": "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
    "Pulp Fiction": "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg",
    "The Dark Knight": "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg",
    "Inception": "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
    "Parasite": "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
    "The Legend of Zelda: Breath of the Wild": "https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
    "Red Dead Redemption 2": "https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg",
    "The Witcher 3: Wild Hunt": "https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg",
    "God of War": "https://upload.wikimedia.org/wikipedia/en/a/a7/God_of_War_4_cover.jpg",
    "Elden Ring": "https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg",
    "Hades": "https://upload.wikimedia.org/wikipedia/en/c/cc/Hades_cover_art.jpg"
  };

  // Function to handle borrowing a media item
  const handleBorrow = async (mediaItem) => {
    try {
      const response = await fetch('/api/borrowMedia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: userData.UserID, // Use the actual user ID from props
          ItemType: mediaItem.Type,
          ItemID: mediaItem.MediaID,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Successfully borrowed "${mediaItem.Title}".`);
        // Refresh the media items to update available copies
        fetchMediaItems(); // Now this is defined properly
      } else {
        alert(`Failed to borrow "${mediaItem.Title}": ${data.error}`);
      }
    } catch (error) {
      console.error('Error borrowing media item:', error);
      alert('An error occurred while borrowing the media item.');
    }
  };

  const handleHold = async (mediaItem) => {
    try {
      const response = await fetch("/api/holdMedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserID: userData.UserID,
          MediaID: mediaItem.MediaID,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Successfully placed a hold on "${mediaItem.Title}".`);
        fetchMediaItems(); 
      } else {
        alert(`Failed to place a hold on "${mediaItem.Title}": ${data.error}`);
      }
    } catch (error) {
      console.error("Error placing hold on media:", error);
      alert("An error occurred while placing the hold.");
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Explore Our Media Collection</h1>
        <p style={styles.heroSubtitle}>
          Discover our curated selection of music, movies, and video games
        </p>
        
        {/* Add login prompt for users who aren't logged in */}
        {!isLoggedIn && (
          <p style={{
            ...styles.heroSubtitle, 
            fontSize: "18px",
            marginTop: "30px",
            opacity: "0",
            transform: "translateY(20px)",
            animation: "fadeInUp 1s forwards 0.6s"
          }}>
            Please{" "}
            <span 
              onClick={navigateToLogin} 
              style={styles.loginLink}
            >
              log in
            </span>{" "}
            to borrow items from our collection
          </p>
        )}
      </div>

      {/* Navigation */}
      <div style={styles.navContainer}>
        <div style={styles.nav}>
          <button
            style={selectedCategory === "all" ? {...styles.navButton, ...styles.activeNavButton} : styles.navButton}
            onClick={() => setSelectedCategory("all")}
          >
            All Media
          </button>
          <button
            style={selectedCategory === "music" ? {...styles.navButton, ...styles.activeNavButton} : styles.navButton}
            onClick={() => setSelectedCategory("music")}
          >
            Music
          </button>
          <button
            style={selectedCategory === "movies" ? {...styles.navButton, ...styles.activeNavButton} : styles.navButton}
            onClick={() => setSelectedCategory("movies")}
          >
            Movies
          </button>
          {/* Optional: You can remove or hide this button until your database supports video games */}
          <button
            style={selectedCategory === "videogames" ? {...styles.navButton, ...styles.activeNavButton} : styles.navButton}
            onClick={() => setSelectedCategory("videogames")}
          >
            Video Games
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div style={styles.contentSection}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div style={additionalStyles.loadingSpinner}></div>
            <p style={{ marginTop: '20px' }}>Loading media items...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>
            {error}
          </div>
        ) : (
          <div id="media-grid" className="fade-in-items" style={styles.grid}>
            {displayedItems.map((item) => (
              <div
                key={item.MediaID}
                className="media-card"
                style={styles.card}
                onMouseOver={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <div style={additionalStyles.imageContainer}>
                  {/* Show loading spinner until image loads */}
                  {imageLoadingStatus[item.MediaID] !== 'loaded' && imageLoadingStatus[item.MediaID] !== 'error' && (
                    <div style={additionalStyles.loadingOverlay}>
                      <div style={additionalStyles.loadingSpinner}></div>
                    </div>
                  )}
                  
                  <img
                    src={wikipediaImageUrls[item.Title] || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgMzAwIDQ1MCIgZmlsbD0ibm9uZSI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiNmMGYwZjAiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOTk5Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg=="}
                    alt={item.Title}
                    style={styles.cardImage}
                    onLoad={() => handleImageLoad(item.MediaID)}
                    onError={(e) => handleImageError(item.MediaID, e)}
                  />
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{item.Title}</h3>
                  <p style={styles.cardInfo}>Author: {item.Author}</p>
                  <p style={styles.cardInfo}>Genre: {item.Genre}</p>
                  <p style={styles.cardInfo}>Year: {item.PublicationYear}</p>
                  
                  {/* Conditional button rendering based on login status and availability */}
                  {isLoggedIn ? (
                    item.AvailableCopies > 0 ? (
                      <button style={styles.button} onClick={() => handleBorrow(item)}>Borrow</button>
                    ) : (
                      <button style={{...styles.button, backgroundColor: '#f7d774', color: '#000'}} 
                        onClick={() => handleHold(item)}>Hold</button>
                    )
                  ) : (
                    <div>
                      <button 
                        style={styles.disabledButton}
                        onClick={navigateToLogin}
                        disabled={false}
                      >
                        Login to Borrow
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Login message at the bottom for users who aren't logged in */}
        {!isLoggedIn && (
          <div style={{ textAlign: "center", margin: "40px 0" }}>
            <p style={styles.loginMessage}>
              Want to borrow these items?{" "}
              <span 
                onClick={navigateToLogin} 
                style={styles.loginLink}
              >
                Log in to your account
              </span>
            </p>
          </div>
        )}

        <button 
          style={styles.backButton}
          onClick={isLoggedIn ? navigateToHome : navigateToLanding}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Media;
