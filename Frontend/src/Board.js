import React, {Component} from 'react'
import api from './api.js'
import './Board.css'
import {Link} from 'react-router-dom'


//SUBCOMPONENTES
class Status extends Component{
  render(){
    return(
      <div className="status">
        <p>
            {this.props.turn}
        </p>
      </div>
    )
  }
}
class Square extends Component{
  render(){
    return(
      <button 
      className={`square ${this.props.className}`}
      onClick={() => {this.props.onClick()}}
      >
      {this.props.value}
      </button>
    );
  }
}


//COMPONENTE
class Board extends Component{

  constructor({props, match}){
    super(props)
    
    this.state = {
      pos : Array(9).fill(null),
      turn : 'X',
      status: "Vez do X",
      over: "",
      mode: match.params.mode,
      moves: [[]]
    };
  }

  //ATUALIZA ATRAVÉS DO STATE
  async handleClick(i){

    let new_pos = this.state.pos.slice()

    //POSIÇÃO FOR VAZIA
    if(new_pos[i] == null && !this.state.over){

      //JOGADOR
      new_pos[i] = this.state.turn
      
      //SETA SE ACABOU 
      let over = this.checkIfOver(new_pos, this.state.turn)

			//VE QUE MODO ESTA
			if(!over){
				if (this.state.mode === "mult"){
					this.altPlayer()
					this.checkIfOver(new_pos, this.state.turn)
				}else{
					//SE JOGADOR 1 NÃO GANHOU
					//PC
          new_pos = await this.pcTurn(new_pos)
					this.checkIfOver(new_pos, "O")
        }

			}else if (over === "X" && this.state.mode === "single"){
        //DELETA JOGADA RUIM
        this.deleteBadMove()
      }


      //ATUALIZA O STATE
      this.setState({
        pos: new_pos
      })

    //ACABOU
    }else if (this.state.over){
      //REINICIA JOGO
      this.reset()
    }

  }

  
  //JOGADA DO PC
  async pcTurn(list){
		
    //CONFERE SE TEM UMA JOGADA
    const promise = await api.post('/move', {"move": list})
    .catch((err) => {console.log(err)})

		if(promise.data !== null){
      const moves = promise.data.moves
      const pos = moves.map( x => x.join(',') === list.join(',') ? moves.indexOf(x) : null).filter(x => x != null)[0]
      this.setState({moves: moves})

      console.log('jogada normal')
      return moves[pos + 1]
		}else{
      console.log('jogada aleatoria')
      this.deleteBadMove()

			if(list.includes(null)){
				let pos = Math.floor(Math.random() * 9)
				while(list[pos] != null){
					pos = Math.floor(Math.random() * 9)
				}

        list[pos] = "O"
        
				return list
			}
		}
  }


  //MANDA DELETAR A JOGADA DO BANCO DE DADOS
  async deleteBadMove(){
    try{
      let promise = await api.post('/badmove', {move: this.state.moves})
      console.log(promise)
    }catch(err){
      console.log(err)
    }
    
  }


  //RESETA O JOGO
  reset(){
    this.setState({
      pos: Array(9).fill(null),
      over: false,
      turn: 'X',
      status: 'Vez do X'
    })
  }


  //ALTERNA PLAYER (2-JOGADORES)
  altPlayer(){
    if(this.state.turn === "X"){
      this.setState({
          turn: "O",
          status: "Vez do O"
      })
    }else{
      this.setState({
          turn: "X",
          status: "Vez do X"
      })
    }
  }


  //VE QUEM GANHOU E ATUALIZA O STATE
  checkIfOver(list, player){
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
			this.setState({
				over: player,
				status: `${player} GANHOU`
			})
			return player
    }else if(!list.includes(null)){
			this.setState({
				over: "V",
				status: "DEU VELHA"
			})
			return 'V'
    }
		return ''
  }



  renderSquare(i){
    let classname = ""
    if(this.state.pos[i] === "X"){
      classname = "icon-x"
    }else if(this.state.pos[i] === "O"){
      classname = "icon-o"
    }

    return(
      <Square
      className={classname +` square-${i}`}
      value={this.state.pos[i]}  //STATE PARA ATUALIZAR
      onClick={() => {this.handleClick(i)
      }}
      />
    );
  }


  renderStatus(){
    return(
      <Status turn={this.state.status} />
    );
  }
  

  render(){
    return(

      <div id="game">
				{this.renderStatus()}
				<div className="table">
						{this.renderSquare(0)}
						{this.renderSquare(1)}
						{this.renderSquare(2)}
						{this.renderSquare(3)}
						{this.renderSquare(4)}
						{this.renderSquare(5)}
						{this.renderSquare(6)}
						{this.renderSquare(7)}
						{this.renderSquare(8)}
				</div>

        <div className="container-button">
          <Link to="/">
            <button>Voltar</button>
          </Link>
        </div>
      </div>

    );
  }
}

export default Board;