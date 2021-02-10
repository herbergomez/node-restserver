// =========================
// Puerto
// =========================

process.env.PORT = process.env.PORT || 3000;


// =========================
// Entorno
// =========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;


//=========================
//Vencimiento del token
//=========================
process.env.CADUCIDAD_TOKEN = '48h';

//=========================
//Seed de autenticacion
//=========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=========================
//CLIENT ID DE GOOGLE SIGN
//=========================
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '491947786969-8d673thhjc3jap365liqshscps6lv9qt.apps.googleusercontent.com';