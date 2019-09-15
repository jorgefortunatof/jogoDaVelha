import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import './Menu.css'

class Menu extends Component{
	render(){
		return(
			<div className="background">
				<div className="container-box">
					<h1>JOGO DA VELHA</h1>
					<h2>Escolha o Modo de Jogo!</h2>
					<div className="buttons-container">
						<Link className="button" to="/board/single">
							SinglePlayer
						</Link>
						<Link className="button" to="/board/mult">
							MultPlayer
						</Link>
					</div>
				</div>
			</div>
		)
	}
}

export default Menu;