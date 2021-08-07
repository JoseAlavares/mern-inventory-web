import React, { Fragment, useState } from 'react'
import { MDBRow, MDBCol } from 'mdbreact'
import Assets from '../../assets/Assets'
import ProviderTable from '../../components/ProviderTable/ProviderTable'
import ProviderModal from '../../components/ProviderModal/ProviderModal'
import ProviderModalDetails from '../../components/ProviderModal/ProviderModalDetails'
import Header from '../../common-components/Header/Header'
import SideBar from '../../common-components/SideBar/SideBar'
import './providerContainer.css'

const ProviderContainer = () => {
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState('')
    const [id, setId] = useState(null)
    const [changeTable, setChangeTable] = useState(false)
    const [openModalDetails, setOpenModalDetails] = useState(false)
    const [providerData, setProviderData] = useState({})

    const handleModal = () => {
        setOpen(!open)
    }

    const handleMode = (data) => {
        setMode(data)
    }

    const idProvider = (_id) => {
        setId(_id)
    }

    const refreshTable = () => {
        setChangeTable(!changeTable)
    }

    const handleModalDetails = (level) => {
        setOpenModalDetails(!openModalDetails)
    }

    const handleModalDetailsData = (data) => {
        setProviderData(data)
    }

    return(
        <div className="flexible-content">
            <Header/>
            <SideBar/>
            <main id="content" className="p-5">
                <Fragment>
                    <MDBRow>
                        <MDBCol md="4" lg="4" sm="12" xs="12">
                            <h3 className="section-title">Proveedor</h3>
                        </MDBCol>
                        <MDBCol md="4" lg="4" sm="12" xs="12" className="offset-md-4 offset-lg-4 text-right">
                            <button className="btn Ripple-parent add-btn" onClick={() => {
                                handleModal()
                                setMode('new_provider')
                            }}>
                                <img src={Assets.providerImgs.plus} 
                                    className="add-icon" 
                                    alt="plus-icon"
                                ></img><label className="add-btn-text">Agregar</label>
                            </button>
                        </MDBCol>
                    </MDBRow> 
                    <ProviderModal
                        open={open}
                        mode={mode}
                        id={id}
                        handleModal={handleModal}
                        refreshTable={refreshTable}                        
                        />
                    <ProviderModalDetails
                        handleModalDetails={handleModalDetails}
                        openModalDetails={openModalDetails}
                        providerData={providerData}
                    />
                    <MDBRow>
                        <MDBCol md="12">
                            <ProviderTable
                                handleModal={handleModal}
                                handleMode={handleMode}
                                idProvider={idProvider}
                                changeTable={changeTable}
                                handleModalDetails={handleModalDetails}
                                handleModalDetailsData={handleModalDetailsData}
                                />
                        </MDBCol>
                    </MDBRow>            
                </Fragment>
            </main>
            {/*<Footer/>*/}
        </div>        
    )
}

export default ProviderContainer