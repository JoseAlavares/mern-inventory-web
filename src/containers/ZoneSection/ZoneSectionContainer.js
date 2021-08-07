import React, { Fragment, useState } from 'react'
import { MDBRow, MDBCol } from 'mdbreact'
import Assets from '../../assets/Assets'
import ZoneSectorTable from '../../components/ZoneSectorComponents/ZoneSectorTable'
import ZoneSectorAdd from '../../components/ZoneSectorComponents/ZoneSectorAdd'
import ZoneModalDeactivate from  '../../components/ZoneSectorComponents/ZoneSectorDeactive'
import Header from '../../common-components/Header/Header'
import SideBar from '../../common-components/SideBar/SideBar'

const ZoneSectorContainer = () => {
    const [openAdd, setOpenAdd] = useState(false)
    const [openDeactivate, setOpenDeactivate] = useState(false)
    const [mode, setMode] = useState('')
    const [id, setId] = useState(null)
    const [changeTable, setChangeTable] = useState(false)

    const handleModalAdd = () => {
        setOpenAdd(!openAdd)
    }

    const handleModalDeactivate = () => {
        setOpenDeactivate(!openDeactivate)
    }

    const idZone = (_id) => {
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
                            <h3 className="section-title">Bodegas</h3>
                        </MDBCol>
                        <MDBCol md="4" lg="4" sm="12" xs="12" className="offset-md-4 offset-lg-4 text-right">
                            <button className="btn Ripple-parent add-btn" onClick={handleModalAdd}>
                                <img src={Assets.userImgs.plus} 
                                    className="add-icon" 
                                    alt="plus-icon"
                                ></img><label className="add-btn-text">Agregar</label>
                            </button>
                        </MDBCol>
                    </MDBRow> 
                    <ZoneSectorAdd
                        openAdd={openAdd}
                        idZone={idZone}
                        handleModalAdd={handleModalAdd}
                        refreshTable={refreshTable}
                        />
                    <ZoneModalDeactivate
                        openDeactivate={openDeactivate}
                        idZone={idZone}
                        id={id}
                        handleModalDeactivate={handleModalDeactivate}
                        refreshTable={refreshTable}
                        />
                    <MDBRow>
                        <MDBCol md="12">
                            <ZoneSectorTable
                                handleModalAdd={handleModalAdd}
                                handleModalDeactivate={handleModalDeactivate}
                                idZone={idZone}
                                id={id}
                                changeTable={changeTable}
                                refreshTable={refreshTable}
                                />
                        </MDBCol>
                    </MDBRow>            
                </Fragment>
            </main>
            {/*<Footer/>*/}
        </div>        
    )
}

export default ZoneSectorContainer