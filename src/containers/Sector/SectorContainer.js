import React, { Fragment, useState } from 'react'
import { MDBRow, MDBCol, MDBBtn } from 'mdbreact'
import Assets from '../../assets/Assets'
import SectorTable from '../../components/SectorTable/SectorTable'
//import CategoryModal from '../../components/CategoryModal/CategoryModal'
import SectorModal from '../../components/SectorModal/SectorModal'
import Header from '../../common-components/Header/Header'
import SideBar from '../../common-components/SideBar/SideBar'

const SectorContainer = () => {
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState('')
    const [id, setId] = useState(null)
    const [changeTable, setChangeTable] = useState(false)

    const handleModal = () => {
        setOpen(!open)
    }

    const handleMode = (data) => {
        setMode(data)
    }

    const idSector = (_id) => {
        setId(_id)
    }

    const refreshTable = () => {
        setChangeTable(!changeTable)
    }

    return(
        <div className="flexible-content">
            <Header/>
            <SideBar/>
            <main id="content" className="p-5">
                <Fragment>
                    <MDBRow>
                        <MDBCol md="4" lg="4" sm="12" xs="12">
                            <h3 className="section-title">Familia</h3>
                        </MDBCol>
                        <MDBCol md="4" lg="4" sm="12" xs="12" className="offset-md-4 offset-lg-4 text-right">
                            <button className="btn Ripple-parent add-btn" onClick={() => {
                                handleModal()
                                setMode('new_sector')
                            }}>
                                <img src={Assets.sectorImgs.plus} 
                                    className="add-icon" 
                                    alt="plus-icon"
                                ></img><label className="add-btn-text">Agregar</label>
                            </button>
                        </MDBCol>
                    </MDBRow> 
                    <SectorModal
                        open={open}
                        mode={mode}
                        id={id}
                        handleModal={handleModal}
                        refreshTable={refreshTable}
                        />
                    <MDBRow>
                        <MDBCol md="12">
                            <SectorTable
                                handleModal={handleModal}
                                handleMode={handleMode}
                                idSector={idSector}
                                changeTable={changeTable}
                                />
                        </MDBCol>
                    </MDBRow>            
                </Fragment>
            </main>            
        </div>        
    )
}

export default SectorContainer