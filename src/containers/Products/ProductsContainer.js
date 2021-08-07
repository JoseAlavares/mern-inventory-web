import React, { Fragment, useState } from 'react'
import { MDBRow, MDBCol, MDBBtn } from 'mdbreact'
import Assets from '../../assets/Assets'
import ProductTable from '../../components/ProductTable/ProductTable'
import ProductModal from '../../components/ProductModal/ProductModal'
import Header from '../../common-components/Header/Header'
import SideBar from '../../common-components/SideBar/SideBar'
import TechnicalCard from '../../common-components/TechnicalCard/TechnicalCard'
import ProductModalState from '../../components/ProductModal/ProductModalState'
import ProductModalEdit from '../../components/ProductModal/ProductModalEdit'
import ProductModalAdd from '../../components/ProductModal/ProductModalAdd'
import './productsContainer.css'

const ProductContainer = () => {
    const [open, setOpen] = useState(false)
    const [openState, setOpenState] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [mode, setMode] = useState('')
    const [id, setId] = useState(null)
    const [changeTable, setChangeTable] = useState(false)
    const [techinalCardContent, setTechinalCardContent] = useState({})

    const handleModal = () => {
        setOpen(!open)
    }

    const handleMode = (data) => {
        setMode(data)
    }

    const idProduct = (_id) => {
        setId(_id)
    }

    const refreshTable = () => {
        setChangeTable(!changeTable)
    }

    const handleModalState = () => {
        setOpenState(!openState)
    }
    
    const handleModalEdit = () => {
        setOpenEdit(!openEdit)
    }

    return(
        <div className="flexible-content">
            <Header/>
            <SideBar/>
            <main id="content" className="p-5">
                <Fragment>
                    <MDBRow>
                        <MDBCol md="4" lg="4" sm="12" xs="12">
                            <h3 className="section-title">Productos</h3>
                        </MDBCol>
                        <MDBCol md="4" lg="4" sm="12" xs="12" className="offset-md-4 offset-lg-4 text-right">
                            <button className="btn Ripple-parent add-btn" onClick={() => {
                                handleModal()
                                setMode('new_product')
                            }}>
                                <img src={Assets.productsImgs.plus} 
                                    className="add-icon" 
                                    alt="plus-icon"
                                ></img><label className="add-btn-text">Agregar</label>
                            </button>
                        </MDBCol>
                    </MDBRow>
                    <ProductModalAdd
                        open={open}
                        id={id}
                        handleModal={handleModal}
                        refreshTable={refreshTable}
                        />
                    <ProductModalState
                        open={openState}
                        id={id}
                        handleModal={handleModalState}
                        refreshTable={refreshTable}/>
                    <ProductModalEdit
                        open={openEdit}
                        id={id}
                        handleModal={handleModalEdit}
                        refreshTable={refreshTable}/>
                    <MDBRow>
                        <MDBCol sm="8" md="8" lg="8">
                            <ProductTable
                                handleModal={handleModal}
                                handleMode={handleMode}
                                idProduct={idProduct}
                                changeTable={changeTable}
                                handleModalState={handleModalState}
                                handleModalEdit={handleModalEdit}
                                setTechinalCardContent={setTechinalCardContent}
                                />
                        </MDBCol>
                        <MDBCol sm="4" md="4" lg="4">
                            <TechnicalCard
                                techinalCardContent={techinalCardContent}/>
                        </MDBCol>
                    </MDBRow>            
                </Fragment>
            </main>            
        </div>        
    )
}

export default ProductContainer