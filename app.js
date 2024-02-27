

const express = require('express');

const app = express();
const expressSitemapXml = require('express-sitemap-xml');
const glob = require('glob');
const path = require('path');

const bodyParser = require('body-parser');
const fs = require('fs');

require('dotenv').config();


const PORT = process.env.PORT || 3000;



// Serve static files from the 'public' directory
app.use(express.static('public'));

/* Send SMS */
app.use(bodyParser.json());

app.post('/send-sms', async (req, res) => {
    const url = "https://api.gateway360.com/api/3.0/sms/send";
    const data = req.body; // Assuming the body of the request to your server contains the data for the SMS API
    const now = new Date();
    const sendAt = now.toISOString().replace('T', ' ').substring(0, 19);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "api_key": process.env.API_KEY_SMSPUBLI, // Use the API key from environment variables
                "report_url": "http://ethics.land/callback/script",
                "concat": 1,
                "messages": [
                    {
                        "from": "NoChorizo",
                        "to": "0034626381615",
                        "text": `Hola Jordi, Has recibido un suscritor nuevo: ${data.email}`,
                        "send_at": sendAt
                    }
                ]
            }),
            
            
            
            //JSON.stringify(data),
        });

        const responseData = await response.json();
        res.send(responseData);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
/******************* */

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
