import React, { Fragment } from 'react';
import {
    Route,
    Switch,
    useHistory
} from "react-router-dom"
import HomeContainer from './containers/Home/HomeContainer'
import AuthenticationContainer from './containers/Authentication/AuthenticationContainer'
import { ToastContainer } from 'react-toastify'
import { TokenProvider } from './context/TokenContext'
import CategoryContainer from './containers/Category/CategoryContainer'
import SectorContainer from './containers/Sector/SectorContainer'
import ProviderContainer from './containers/Provider/ProviderContainer'
import ProductsContainer from './containers/Products/ProductsContainer'
import StockContainer from './containers/Stock/StockContainer'
import StockAddContainer from './containers/Stock/StockAddContainer'
import BatchContainer from './containers/Batch/BatchContainer'
import WarehouseContainer from './containers/Warehouse/WarehouseContainer'
import Section from './containers/ZoneSection/ZoneSectionContainer'

//Styles
import './index.css';

//
import Usercontainer from './containers/User/UserContainer'

function App() {
    const history = useHistory()
    
    const logout = () => {
        window.sessionStorage.clear()
        history.push('/auth')
    }

    let open = XMLHttpRequest.prototype.open

    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("load", (event) => event.target.status === 401 ? logout() : null, false)        
        open.apply(this, arguments)
    }

    return (
        <Fragment>                        
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                />                
            <Switch>
                <TokenProvider>
                    <Route path="/" exact component={HomeContainer}/>
                    <Route path="/home" exact component={HomeContainer}/>
                    <Route path="/auth" exact component={AuthenticationContainer}/>
                    <Route path="/user" exact component={Usercontainer}/>
                    <Route path="/category" exact component={CategoryContainer}/>
                    <Route path="/sector" exact component={SectorContainer}/>
                    <Route path="/provider" exact component={ProviderContainer}/>
                    <Route path="/product" exact component={ProductsContainer}/>
                    <Route path="/stock" exact component={StockContainer}/>
                    <Route path="/stock/:idChildProduct/:idInventory" exact component={StockContainer}/>
                    <Route path="/stock-add" exact component={StockAddContainer}/>
                    <Route path="/batch/:idChildProduct/:idInventory" exact component={BatchContainer}/>
                    <Route path="/warehouse" exact component={WarehouseContainer}/>
                    <Route path="/section" exact component={Section}/>
                </TokenProvider>                                
            </Switch>
        </Fragment>       
    )
}

export default App;
