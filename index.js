import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import flash from 'express-flash';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';

import path from 'path';
import os from 'os';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const FileStore = require('session-file-store')(session);

const app = express();

import { default as conn } from './db/conn.js';

const mysql = require('mysql2');

import { default as recipesRoutes } from './routes/recipeRoutes.js';
import { default as authRoutes } from './routes/authRoutes.js';

import RecipeController from './controllers/RecipeController.js';

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const log = console.log;
const error = console.error;

app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(favicon(__dirname + '/favicon.ico'));

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json())

app.use(
    session({
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: path.join(os.tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 3600000,
            expires: new Date(Date.now() + 3600000),
            httpOnly: true
        }
    })
);

app.use(flash());

app.use(cookieParser());

app.use(express.static('public'));

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session;
    }

    next()
});

app.use('/recipes', recipesRoutes);
app.use('/', authRoutes);

app.get('/', RecipeController.startPage);

app.use(function (req, res) {
    res.status(404).render(__dirname + '/views/404.hbs', { host, port });
});

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DIALECT
});

connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_SCHEMA}`, async (err) => {
    if (err) {
        error('Erro ao criar o banco de dados:', err);
        return;
    }

    connection.end();

    try {
        conn.authenticate();
        log('Conexão estabelecida com o banco de dados.');

        await conn.sync();
        log('Modelo sincronizado com o banco de dados.');

        app.listen(port, () => {
            log(`Servidor iniciado na porta ${port}.`);
        });
    } catch (err) {
        error('Erro ao conectar ou sincronizar o modelo com o banco de dados:', err);
    }
});