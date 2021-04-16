import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import history from './history'
import { bindActionCreators } from 'redux'
import LoginPage from './pages/Login'
import Main from './pages/Main'

const MainRoutes = props => (
    <ConnectedRouter history={history}>
        <Switch>
        <Route exact path="/" component={LoginPage} />
        <PrivateRoute path="/dashboard" auth={props.web3Account.accountAddress} component={Main} />
        </Switch>
    </ConnectedRouter>
)
const PrivateRoute = props => {
    const { auth, component: Component, ...rest } = props
    return(
        <Route {...rest} render={props => (auth ? <Component {...props} /> : <Redirect to="/" />)} />
    )
}


const mapStateToProps = ({web3Account}) => ({ web3Account })


const mapDispatchToProps = dispatch => bindActionCreators({  }, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(MainRoutes)
