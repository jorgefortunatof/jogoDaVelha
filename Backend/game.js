const Moves = require('./models/moves');

//ARMAZENA AS JOGADAS
async function store (move){

    if (! await Moves.findOne(move)){
        await Moves.create(move)
        console.log('== Nova jogada adicionada! ==')
        return true
    }else{
        console.log('XX Já existe essa jogada! XX')
        return false
    }
}

//JOGADA DO PC
function pcTurn(list){
    if(list.includes(null)){
        let pos = Math.floor(Math.random() * 9)
        while(list[pos] != null){
            pos = Math.floor(Math.random() * 9)
        }
        return pos
    }
  }

//VE QUEM GANHOU
function checkIfOver(list, player){
    let over = false

    const rows = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for(const x of rows){
        if(list[x[0]] === list[x[1]] && list[x[1]] === list[x[2]] && list[x[0]] === player){
            over = true
        }
    }

    if(over === true){
        console.log(`player: ${player} ganhou`)
        return player
    }else if(!list.includes(null)){
        console.log(`Deu Velha`)
        return "V"
    }
	return false
}

async function pcSmartTurn(list){
    let m = await Moves.findOne({moves: {$in : [list]}})
    return m
}

async function deleteMove(move){
    try{
        await Moves.deleteOne(move)
        .then(console.log("JOGADA DELETADA"))
    }catch(err){
        console.log(err)
    }
    
}


//JOGA CONTRA SI MESMO
let game = {

async playing() {
    let count = 0
    let over = false
    let board = Array(9).fill(null)

    let move = {
        moves: [[]]
    }

    
    //JOGA ALEATORIO E PEGA JOGADAS QUE "O" GANHA OU DA VELHA
    while(count < 10000){

        while(true){
            console.log(board)
            //jogada play1 = "O"
            //TRAVA NO PCTURN
            board[pcTurn(board)] = "X"
            move.moves.push(board.slice())
            over = checkIfOver(board, "X")
            

            if (!over){
                //jogada play2 = "X"
                board[pcTurn(board)] = "O"
                move.moves.push(board.slice())
                over = checkIfOver(board, "O")
            }

            //SE GANHOU BREAK SE NAO RESETA
            if(over){
                if(over === "V"){
                    break
                }else{
                    move.moves = []
                    board = Array(9).fill(null)
                    over = false
                }
            }  
        }

        //ARMAZENA E RESETA O JOGO
        let response = await store(move)
        move.moves = []
        board = Array(9).fill(null)
        over = false

        if (response){
            count++
        }
        

        console.log(count)
    }
    

},

async deleteBadMoves(){
    let count = 0
    let over = false
    let board = Array(9).fill(null)

    let move = {
        moves: [[]]
    }


    while(count < 10000){

        while(true){
            board[pcTurn(board)] = "X"
            move.moves.push(board.slice())
            over = checkIfOver(board, "X")
            

            if (!over){
                console.log(board)
                
                try{
                    var objmoves = await pcSmartTurn(board)
                    let pos = objmoves.moves.map( x => x.join(',') === board.join(',') ?
                       objmoves.moves.indexOf(x) : null).filter(x => x != null)[0]
                    
                    board = objmoves.moves[pos + 1]

                }catch(err){
                    console.log('jogada-aleatoria')
                    board[pcTurn(board)] = "O"
                }

                move.moves.push(board.slice())
                over = checkIfOver(board, "O")
            }

            //SE PERDEU APAGA A JOGADA
            if(over){
                if(over === "X"){
                    //APAGAR O BAGULHO
                    await deleteMove(objmoves)

                    break
                }else{
                    move.moves = []
                    board = Array(9).fill(null)
                    over = false
                }
            }  
        }

        //ARMAZENA E RESETA O JOGO
        move.moves = []
        board = Array(9).fill(null)
        over = false
        count++
        
        console.log(count)
    }
}

}

module.exports = game