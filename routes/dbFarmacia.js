var express = require('express');
var router = express.Router();

router.get('/homeAlmacen', (req,res) => {
    res.status(200).json({
        msg: "esta funcionando"
    })
})
// esto es para las rutas
module.exports = router;