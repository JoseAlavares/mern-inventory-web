import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom'
import { MDBRow, MDBCol, MDBBtn, MDBContainer } from 'mdbreact'
import Header from '../../common-components/Header/Header'
import SideBar from '../../common-components/SideBar/SideBar'
import StockAdd from '../../components/StockComponents/StockAdd'

const StockContainer = () => {
    const history = useHistory()

    return(
        <div className="flexible-content">
            <Header/>
            <SideBar/>
            <main id="content" className="p-5">
                <Fragment>                    
                    <MDBRow>
                        <h3>Agregar existencia</h3>
                        <MDBContainer>
                            <StockAdd/>
                        </MDBContainer>
                    </MDBRow>                    
                </Fragment>
            </main>
            {/*<Footer/>*/}
        </div>        
    )
}

export default StockContainer