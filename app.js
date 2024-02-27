const express = require('express');
const app = express();
const expressSitemapXml = require('express-sitemap-xml');
const glob = require('glob');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Function to get URLs for the sitemap
async function getUrls() {
    // Example of adding static URLs
    const urls = [
        '/',
        '/about',  // Add other paths in your application
        '/contact',
        // ... other URLs
    ];

    // If you have dynamic routes, use glob to find them
    // const dynamicUrls = glob.sync('path/to/dynamic/*.html').map(file => '/' + path.basename(file, '.html'));

    // return [...urls, ...dynamicUrls];
    return urls;
}

app.get('/article5', (req, res) => {
    // Lee el contenido de article5.html
    const articleContent = fs.readFileSync(path.join(__dirname, 'public/articles/article_5_Pimenton_es_lo_importante.html'), 'utf8');
    
    // Construye la página HTML completa incrustando el contenido de article5.html
    const fullPage = `
    <nav>
        <!-- Navigation menu here -->
    </nav>
    ${articleContent}
    <article>
        <!-- El resto de tu contenido de artículo aquí -->
    </article>
    `;
    
    res.send(fullPage);
});

// Generate sitemap.xml
app.use(expressSitemapXml(getUrls, 'https://nochorizo.com'));

// Send the main HTML file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
