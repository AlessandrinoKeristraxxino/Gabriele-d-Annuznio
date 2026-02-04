/**
 * =========================================================================
 * WEB SERVER LOCALE PER IL PROGETTO "GABRIELE D'ANNUNZIO"
 * =========================================================================
 * Questo script utilizza il modulo HTTP di Node.js per creare un server
 * locale in grado di servire file statici (HTML, CSS, JS, Immagini).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configurazione delle variabili di rete
const CONFIG = {
    PORT: 3000,
    HOSTNAME: '127.0.0.1',
    ROOT_DIR: path.join(__dirname, '../../') // Risale dalla cartella js/server alla root
};

// Mappatura completa dei MIME types per una corretta interpretazione dei file
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.js':   'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.pdf':  'application/pdf'
};

/**
 * Funzione per gestire le risposte in caso di errore
 */
const sendErrorResponse = (response, statusCode, message) => {
    response.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(`
        <html>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1>Errore ${statusCode}</h1>
                <p>${message}</p>
                <hr>
                <small>Server Progetto d'Annunzio</small>
            </body>
        </html>
    `);
};

// Creazione dell'istanza del server
const server = http.createServer((req, res) => {
    // 1. Normalizzazione dell'URL di richiesta
    let urlPath = req.url === '/' ? '/index.html' : req.url;
    
    // 2. Costruzione del percorso assoluto del file nel file system
    let absoluteFilePath = path.join(CONFIG.ROOT_DIR, urlPath);

    // 3. Estrazione dell'estensione per il Content-Type
    const ext = path.extname(absoluteFilePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    console.log(`[REQUEST]: ${req.method} ${req.url} --> Serving: ${absoluteFilePath}`);

    // 4. Verifica esistenza e lettura del file
    fs.stat(absoluteFilePath, (err, stats) => {
        if (err || !stats.isFile()) {
            console.error(`[ERROR]: File non trovato: ${absoluteFilePath}`);
            sendErrorResponse(res, 404, "Risorsa non trovata nel Vate-Server.");
            return;
        }

        // Lettura del file e invio stream
        const stream = fs.createReadStream(absoluteFilePath);
        
        res.writeHead(200, { 'Content-Type': contentType });
        
        stream.on('error', (streamErr) => {
            console.error(`[ERROR]: Errore durante lo streaming del file: ${streamErr}`);
            sendErrorResponse(res, 500, "Errore interno del server.");
        });

        stream.pipe(res);
    });
});

// Avvio del listener
server.listen(CONFIG.PORT, CONFIG.HOSTNAME, () => {
    console.log('\x1b[36m%s\x1b[0m', '-------------------------------------------------------');
    console.log('\x1b[32m%s\x1b[0m', ` SERVER ATTIVO: http://${CONFIG.HOSTNAME}:${CONFIG.PORT}`);
    console.log('\x1b[36m%s\x1b[0m', '-------------------------------------------------------');
    console.log(` Root Directory: ${CONFIG.ROOT_DIR}`);
    console.log(' Premi CTRL + C per arrestare il processo.');
    console.log('-------------------------------------------------------');
});