import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Menu from './Menu'
import Board from './Board'

class Routes extends Component {
	render(){
		return(
			<Router>
				<Route exact path="/" component={Menu}/>
				<Route path="/board/:mode" component={Board}/>
			</Router>
		)
	}
}

export default Routes;