const jwt = require('jsonwebtoken');

//===========================
// Verificar token
//===========================

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //Obtenemos header llamado token
    //console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    })
};

let verificaAdminROLE = (req, res, next) => {
    let usuario = req.usuario;
    //console.log(token);
    if (!usuario) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No existe el usuario'
            }
        });
    }
    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no tiene el permiso correcto para ejecutar la operacion solicitada.'
            }
        });
    }
    next();
};

module.exports = {
    verificaToken,
    verificaAdminROLE
}