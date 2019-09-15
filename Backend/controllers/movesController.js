const Moves = require('../models/moves');

module.exports = {
    async index (req, res){
        const {move} = req.body
        const moves = await Moves.findOne({moves: {$in : [move]}})

        return res.json(moves)
    },

    async delete(req, res){
        const {move} = req.body
        try{
            await Moves.deleteOne({moves: move})
            .then(
                () => {
                console.log('Deletou')
                return res.json({ok: 'ok'})
            }
        )}catch(err){
            console.log(err)
        }
        
    }
}