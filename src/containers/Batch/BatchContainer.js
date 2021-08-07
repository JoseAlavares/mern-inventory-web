import React, { Fragment } from 'react'
import { MDBRow, MDBCol } from 'mdbreact'
import Header from '../../common-components/Header/Header'
import SideBar from '../../common-components/SideBar/SideBar'
import BatchTable from '../../components/Batch/BatchTable'

const BatchContainer = () => {
    return(
        <div className="flexible-content">
            <Header/>
            <SideBar/>
            <main id="content" className="p-5">
                <Fragment>                    
                    <MDBRow>
                        <MDBCol md="12">
                            <h3>Lotes de producto</h3>
                            <BatchTable/>
                        </MDBCol>
                    </MDBRow>            
                </Fragment>
            </main>            
        </div>        
    )
}

export default BatchContainer