const fs = require('fs');
const path = require('path');

const logsDirectory = path.join(__dirname, '..', 'logs');
const logFile = path.join(logsDirectory, 'requests.log');

// Создаём папку logs, если её ещё нет
fs.mkdirSync(logsDirectory, { recursive: true });

function requestLogger(req, res, next) {
    const startedAt = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startedAt;

        const logLine =
            `[${new Date().toISOString()}] ` +
            `${req.method} ${req.originalUrl} ` +
            `${res.statusCode} (${duration} ms)`;

        // Оставляем вывод в консоль
        console.log(logLine);

        // И дописываем эту же строку в файл
        fs.appendFile(logFile, `${logLine}\n`, (error) => {
            if (error) {
                console.error('Не удалось записать лог в файл:', error.message);
            }
        });
    });

    next();
}

module.exports = requestLogger;