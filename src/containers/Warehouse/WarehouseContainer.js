import React, { Fragment, useState } from 'react'
import { MDBRow, MDBCol } from 'mdbreact'
import Assets from '../../assets/Assets'
import WarehouseTable from '../../components/WarehouseComponents/WarehouseTable'
import WarehouseModalEdit from '../../components/WarehouseComponents/WarehouseModalEdit'
import WarehouseModalDeactivate from '../../components/WarehouseComponents/WarehouseModalDeactivate'
import WarehouseSelection from '../../components/WarehouseComponents/WarehouseSelection'
import ZoneSectorAdd from '../../components/ZoneSectorComponents/ZoneSectorAdd'
import ZoneEditModal from '../../components/ZoneComponents/ZoneEditModal'
import ZoneStateModal from '../../components/ZoneComponents/ZoneStateModal'
import Header from '../../common-components/Header/Header'
import SideBar from '../../common-components/SideBar/SideBar'

const WarehouseContainer = () => {
    const [openAdd, setOpenAdd] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openDeactivate, setOpenDeactivate] = useState(false)
    const [openEditZone, setOpenEditZone] = useState(false)
    const [openState, setOpenState] = useState(false)
    const [idWarehouse, setIdWarehouse] = useState(null)
    const [idZone, setIdZone] = useState(null)
    const [changeTable, setChangeTable] = useState(false)

    const handleModalAdd = () => {
        if(idWarehouse) {
            setOpenAdd(!openAdd)
        }        
    }

    const confIdWarehouse = (_id) => {
        setIdWarehouse(_id)
    }

    const refreshTable = () => {
        setChangeTable(!changeTable)
    }

    const handleModalEdit = () => {
        setOpenEdit(!openEdit)
    }

    const handleModalDeactivate = () => {
        setOpenDeactivate(!openDeactivate)
    }

    const handleModalEditZone = () => {
        setOpenEditZone(!openEditZone)
    }

    const confIdZone = (_id) => {
        setIdZone(_id)
    }

    const handleModalZoneState = () => {
        setOpenState(!openState)
    }

    return(
        <div className="flexible-content">
            <Header/>
            <SideBar/>
            <main id="content" className="p-5">
                <Fragment>
                    <MDBRow>
                        <MDBCol md="4" lg="4" sm="12" xs="12">
                            <h3 className="section-title">Almacenes</h3>
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
                    <MDBRow>
                        <MDBCol md="4" lg="4" sm="12" xs="12">
                            <WarehouseSelection                                
                                confIdWarehouse={confIdWarehouse}
                                refreshTable={refreshTable}/>
                        </MDBCol>
                    </MDBRow>
                    <ZoneStateModal
                        idZone={idZone}
                        openState={openState}
                        handleModalZoneState={handleModalZoneState}
                        refreshTable={refreshTable}/>
                    <ZoneEditModal
                        idZone={idZone}
                        idWarehouse={idWarehouse}
                        openEditZone={openEditZone}
                        handleModalEditZone={handleModalEditZone}
                        refreshTable={refreshTable}/>             
                    <ZoneSectorAdd
                        idWarehouse={idWarehouse}
                        openAdd={openAdd}                       
                        handleModalAdd={handleModalAdd}
                        refreshTable={refreshTable}
                        />
                    <WarehouseModalEdit
                        idWarehouse={idWarehouse}
                        openEdit={openEdit}
                        handleModalEdit={handleModalEdit}
                        refreshTable={refreshTable}
                        />
                    <WarehouseModalDeactivate
                        idWarehouse={idWarehouse}
                        openDeactivate={openDeactivate}
                        handleModalDeactivate={handleModalDeactivate}
                        refreshTable={refreshTable}
                        />
                    <MDBRow>
                        <MDBCol md="12">
                            <WarehouseTable
                                handleModalZoneState={handleModalZoneState}
                                handleModalEditZone={handleModalEditZone}
                                handleModalEdit={handleModalEdit}
                                handleModalDeactivate={handleModalDeactivate}
                                changeTable={changeTable}
                                confIdWarehouse={confIdWarehouse}
                                confIdZone={confIdZone}
                                idWarehouse={idWarehouse}
                                />
                        </MDBCol>
                    </MDBRow>            
                </Fragment>
            </main>
        </div>        
    )
}

export default WarehouseContainer