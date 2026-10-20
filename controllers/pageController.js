const fs = require('fs/promises');
const path = require('path');
const routeValidation = require('../config/routeValidation.json');
const allowedLocationPattern = new RegExp(routeValidation.text.allowedPattern, 'u');
const dataFilePath = path.join(__dirname, '..', 'data', 'routes.json');

async function readItems() {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const items = JSON.parse(fileContent);

    if (!Array.isArray(items)) {
        throw new Error('Файл маршрутов должен содержать JSON-массив.');
    }

    return items;
}

async function writeItems(items) {
    const fileContent = `${JSON.stringify(items, null, 2)}\n`;
    await fs.writeFile(dataFilePath, fileContent, 'utf8');
}

function getAuthQuery(req) {
    return req.query.auth === '1' ? '?auth=1' : '';
}

async function showIndex(req, res, next) {
    try {
        const items = await readItems();
        res.render('index', {
            title: 'Список маршрутов',
            items,
            user: req.user,
            authQuery: getAuthQuery(req),
        });
    } catch (error) {
        next(error);
    }
}

async function showItem(req, res, next) {
    try {
        const items = await readItems();
        const id = Number(req.params.id);
        const item = items.find((route) => route.id === id);

        if (!item) {
            return next();
        }

        res.render('item', {
            title: 'Информация о маршруте',
            item,
            user: req.user,
            authQuery: getAuthQuery(req),
        });
    } catch (error) {
        next(error);
    }
}

function showAddForm(req, res) {
    res.render('add', {
        title: 'Добавить маршрут',
        user: req.user,
        authQuery: getAuthQuery(req),
        error: null,
        formData: {},
        validationRules: routeValidation,
    });
}

async function addItem(req, res, next) {
    const formData = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
        ? req.body
        : {};
    const origin = validateTextField(formData.origin, 'Начальная точка');
    const destination = validateTextField(formData.destination, 'Конечная точка');
    const distanceKm = validateNumberField(
        formData.distanceKm,
        'Расстояние',
        routeValidation.numbers.distanceKm,
    );
    const durationMin = validateNumberField(
        formData.durationMin,
        'Продолжительность',
        routeValidation.numbers.durationMin,
    );
    const trafficDelayMin = validateNumberField(
        formData.trafficDelayMin,
        'Задержка из-за пробок',
        routeValidation.numbers.trafficDelayMin,
    );
    const errors = [
        origin.error,
        destination.error,
        distanceKm.error,
        durationMin.error,
        trafficDelayMin.error,
    ].filter(Boolean);

    if (!routeValidation.trafficLevels.includes(formData.traffic)) {
        errors.push('Выберите допустимый уровень пробок.');
    }

    if (errors.length > 0) {
        return res.status(400).render('add', {
            title: 'Добавить маршрут',
            user: req.user,
            authQuery: getAuthQuery(req),
            error: errors.join(' '),
            formData,
            validationRules: routeValidation,
        });
    }

    try {
        const items = await readItems();
        const item = {
            id: items.length > 0 ? Math.max(...items.map((route) => route.id)) + 1 : 1,
            origin: origin.value,
            destination: destination.value,
            distanceKm: distanceKm.value,
            durationMin: durationMin.value,
            traffic: formData.traffic,
            trafficDelayMin: trafficDelayMin.value,
            createdAt: createUniqueCreatedAt(items),
        };

        items.push(item);
        await writeItems(items);

        const redirectUrl = req.query.auth === '1' ? '/?auth=1' : '/';
        res.redirect(redirectUrl);
    } catch (error) {
        next(error);
    }
}

function validateTextField(value, label) {
    if (typeof value !== 'string') {
        return { value: '', error: `Поле «${label}» обязательно для заполнения.` };
    }

    const normalized = value.trim();
    const characterCount = Array.from(normalized).length;
    const rules = routeValidation.text;

    if (normalized.length === 0) {
        return { value: normalized, error: `Поле «${label}» не может быть пустым или состоять только из пробелов.` };
    }

    if (characterCount < rules.minLength || characterCount > rules.maxLength) {
        return {
            value: normalized,
            error: `Поле «${label}» должно содержать от ${rules.minLength} до ${rules.maxLength} символов.`,
        };
    }

    if (!allowedLocationPattern.test(normalized)) {
        return {
            value: normalized,
            error: `Поле «${label}» содержит недопустимые символы.`,
        };
    }

    return { value: normalized, error: null };
}

function createUniqueCreatedAt(items) {
    const existingTimestamps = new Set(items.map((route) => route.createdAt));
    let timestamp = Date.now();
    let createdAt = new Date(timestamp).toISOString();

    while (existingTimestamps.has(createdAt)) {
        timestamp += 1;
        createdAt = new Date(timestamp).toISOString();
    }

    return createdAt;
}

function validateNumberField(value, label, rules) {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        return { value: null, error: `Поле «${label}» обязательно для заполнения.` };
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
        return { value: null, error: `Поле «${label}» должно содержать число.` };
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return { value: null, error: `Поле «${label}» должно содержать число.` };
    }

    if (number < rules.min) {
        return { value: null, error: `Поле «${label}» не может быть меньше ${rules.min}.` };
    }

    if (rules.integer && !Number.isInteger(number)) {
        return { value: null, error: `Поле «${label}» должно содержать целое число.` };
    }

    if (!rules.integer && rules.step > 0) {
        const stepCount = number / rules.step;
        if (Math.abs(stepCount - Math.round(stepCount)) > 1e-9) {
            return { value: null, error: `Поле «${label}» должно быть кратно шагу ${rules.step}.` };
        }
    }

    return { value: number, error: null };
}

module.exports = {
    showIndex,
    showItem,
    showAddForm,
    addItem,
};
