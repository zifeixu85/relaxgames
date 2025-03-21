// JSON-LD structured data for SEO
document.addEventListener('DOMContentLoaded', function() {
    // Website Schema
    const websiteSchema = document.createElement('script');
    websiteSchema.type = 'application/ld+json';
    websiteSchema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "RelaxGames",
        "url": "https://relaxgames.online",
        "description": "Discover a collection of fun and relaxing online games. Play instantly without download on any device!",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://relaxgames.online/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    });
    document.head.appendChild(websiteSchema);

    // Check if we're on a game page
    if (window.location.pathname.includes('/games/')) {
        // Extract game name from URL
        const gamePath = window.location.pathname;
        const gameName = gamePath.split('/').pop().replace('.html', '')
            .split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        // Game Schema
        const gameSchema = document.createElement('script');
        gameSchema.type = 'application/ld+json';
        gameSchema.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoGame",
            "name": gameName,
            "description": document.querySelector('meta[name="description"]')?.content || `Play ${gameName} online for free. No download required.`,
            "playMode": "SinglePlayer",
            "applicationCategory": "Game",
            "gamePlatform": "Web Browser",
            "genre": getGameGenre(gameName),
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            }
        });
        document.head.appendChild(gameSchema);
    }

    // Helper function to get game genre based on game name
    function getGameGenre(gameName) {
        const gameName_lower = gameName.toLowerCase();
        if (gameName_lower.includes('bubble') || gameName_lower.includes('match')) return "Puzzle";
        if (gameName_lower.includes('fashion') || gameName_lower.includes('beauty')) return "Fashion";
        if (gameName_lower.includes('restaurant') || gameName_lower.includes('shop')) return "Simulation";
        if (gameName_lower.includes('dance')) return "Action";
        if (gameName_lower.includes('doctor') || gameName_lower.includes('salon')) return "Simulation";
        return "Casual";
    }
}); 