const router = require('express').Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/auth");
const Application = require('../models/application');

router.get('/' , [ auth , isAdmin ] , async (req , res) => {
    const applications = await Application.findAll();
    return res.send(applications);
})

router.delete('/:id' , [ auth , isAdmin ] , async (req , res) => {
    const id = req.params.id;
    await Application.destroy({
        where: { id }
    })
    return res.send({ message: 'Supprimé avec succès' });
})

module.exports = router;