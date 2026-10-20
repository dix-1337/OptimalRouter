function pageAuth(req, res, next) {
    if (req.query.auth === '1') {
        req.user = {
            name: 'Авторизованный пользователь',
            role: 'user',
        };
    } else {
        req.user = {
            name: 'Гость',
            role: 'guest',
        };
    }

    next();
}

module.exports = pageAuth;