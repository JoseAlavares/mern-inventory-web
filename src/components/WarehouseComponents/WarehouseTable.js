import React, { Fragment, useState, useEffect } from 'react'
import { MDBDataTableV5 } from 'mdbreact'
import Assets from '../../assets/Assets'
import axios from 'axios'
import { toastMessage } from '../../utils/toast-functions'

const columns = [{
    label: 'Nombre',
    field: 'name',
    width: 150,
},
{
    label: 'Estatus',
    field: 'active',
    sort: 'disabled',
    width: 150,
},
{
    label: 'Editar',
    field: 'edit',
    sort: 'disabled',
    width: 150,
},
{
    label: 'Habilitar',
    field: 'enable',
    sort: 'disabled',
    width: 150
}
]

const WarehouseTable = ({ idWarehouse, handleModalDeactivate, handleModalEdit, handleModalEditZone, handleModalZoneState, confIdWarehouse, confIdZone, changeTable }) => {
    const [gridStructure, setGridStructure] = useState({columns: columns})
    const API_BACKEND = process.env.REACT_APP_API
    const HEADERS = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.sessionStorage.getItem('access_token')}`
    }
    
    useEffect(() => {
        getZones()
    }, [changeTable])

    const handleActionsEditZone = (id) => {
        handleModalEditZone()
        confIdZone(id)
    } 

    const handleActionsDeactivate = (id) => {
        handleModalZoneState()
        confIdZone(id)
    }
    
    const generateStructure = (data) => {        
        const dataGrid = data.map(zone => {            
            zone.edit = (
                <div 
                    className="edit-icon-container text-center"
                    onClick={() => handleActionsEditZone(zone.id)}>
                    <img src={Assets.userImgs.edit} 
                        className="edit-icon" 
                        alt="edit-icon"
                    ></img>
                </div>
            )
            zone.enable =  (
                <div 
                    className="disable-icon-container text-center"
                    onClick={() => handleActionsDeactivate(zone.id)}>
                        {zone.active === true ? 'Inhabilitar' : 'Habilitar'}
                        <img src={
                                zone.active === true 
                                ? Assets.userImgs.disableRed 
                                : Assets.userImgs.disable
                            } 
                            className="disable-icon" 
                            alt="disable-icon"
                        ></img>
                </div>
            )

            zone.active = (
                (zone.active === true) 
                ? <p className="active-status">Activo</p> 
                : <p className="inactive-status">Inactivo</p>
            )
            
            return {...zone}
        })

        return dataGrid
    }

   const getZones = async () => {
        try {        
            if(idWarehouse) {    
                const result = await axios({
                    method: 'GET',
                    url: `${API_BACKEND}/api/v1/warehouse-zones/${idWarehouse}`,
                    headers: HEADERS
                })

                const {data: {data}} = result
                if(Array.isArray(data)) {
                    const newData = generateStructure(data)
                    setGridStructure({
                        ...gridStructure,
                        rows: newData
                    })
                }
            }

        } catch (err) {
            console.error(err.response)
            if(!err.response.status === 422 || !err.response.status === 404) {
                toastMessage('error', 'Ocurrio un error')
            }
            
            setGridStructure({
                ...gridStructure,
                rows: []
            })
        }
    }

    return(        
        <Fragment>
            <MDBDataTableV5
                hover 
                entriesOptions={[5, 20, 25]} 
                entries={5} 
                pagesAmount={4} 
                data={gridStructure}/>
        </Fragment>
    )
}

export default WarehouseTable