import React, { Fragment, useState } from 'react'
import { MDBRow, MDBCol, MDBContainer, MDBBtn } from 'mdbreact'
import Header from '../../common-components/Header/Header'
import SideBar from '../../common-components/SideBar/SideBar'
import StockTable from '../../components/StockComponents/StockTable'
import StockAdd from '../../components/StockComponents/StockAdd'
import StockAddFromCode from '../../components/StockComponents/StockAddFromCode'
import StockExit from '../../components/StockComponents/StockExit'
import './stockContainer.css'

const StockContainer = () => {
    const [openAdd, setOpenAdd] = useState(false)    
    const [openModalExit, setOpenModalExit] = useState(false)
    const [openModalCode, setOpenModalCode] = useState(false)
    const [changeTable, setChangeTable] = useState(false)
    const [childProductId, setChildProductId] = useState(null)    
    const [warehouseId, setWarehouseId] = useState(null)
    const [productBatchId, setProductBatchId] = useState(null)  

    const handleModalAdd = () => {
        setOpenAdd(!openAdd)
    }

    const handleModalCode = () => {
        setOpenModalCode(!openModalCode)
    }

    const refreshTable = () => {
        setChangeTable(!changeTable)
    }

    const handleChildProductId = (id) => {
        setChildProductId(id)
    }
    
    const handleWarehouseId = (id) => {
        setWarehouseId(id)
    }

    const handleProductBatchId = (id) => {
        setProductBatchId(id)
    }

    const handleModalExit = () => {
        setOpenModalExit(!openModalExit)
    }    

    return(
        <div className="flexible-content">
            <Header/>
            <SideBar/>
            <main id="content" className="p-5">
                <Fragment> 
                    <MDBRow>
                        <MDBCol md="4" lg="4" sm="12" xs="12">
                            <h3 className="section-title">Inventario</h3>
                        </MDBCol>
                    </MDBRow>                   
                    <MDBContainer>
                        <MDBBtn onClick={() => setOpenModalCode(true)}>abrir</MDBBtn>
                        <StockAdd
                            warehouseId={warehouseId}
                            childProductId={childProductId}
                            productBatchId={productBatchId}
                            handleModalAdd={handleModalAdd}
                            refreshTable={refreshTable}
                            openAdd={openAdd}/>

                        <StockExit
                            warehouseId={warehouseId}
                            childProductId={childProductId}
                            handleModalExit={handleModalExit}
                            refreshTable={refreshTable}
                            openModalExit={openModalExit}/>

                        <StockAddFromCode
                            warehouseId={warehouseId}
                            childProductId={childProductId}
                            productBatchId={productBatchId}
                            handleModalCode={handleModalCode}
                            refreshTable={refreshTable}
                            openModalCode={openModalCode}/>
                        <MDBRow>
                            <MDBCol md="12" lg="12">
                                <StockTable
                                    handleWarehouseId={handleWarehouseId}
                                    handleModalAdd={handleModalAdd}
                                    handleModalExit={handleModalExit}
                                    handleChildProductId={handleChildProductId}
                                    handleProductBatchId={handleProductBatchId}
                                    changeTable={changeTable}/>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>                    
                </Fragment>
            </main>
            {/*<Footer/>*/}
        </div>        
    )
}

export default StockContainer