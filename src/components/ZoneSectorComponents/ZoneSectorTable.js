import React, { useEffect, useState } from 'react'
import { MDBDataTableV5 } from 'mdbreact'
import axios from 'axios'
import { toastMessage } from '../../utils/toast-functions'
import Assets from '../../assets/Assets'

const columns = [{
    label: 'Nombre de bodega',
    field: 'name',
    width: 150,
    attributes: {
        'aria-controls': 'DataTable',
        'aria-label': '#',
    },
},
{
    label: 'Estatus',
    field: 'active',
    sort: 'disabled',
    width: 150,
},
{
    label: 'Agregar sección',
    field: 'add',
    sort: 'disabled',
    width: 150
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

const ZoneSectorTable = ({ idZone, handleModalAdd, handleModalDeactivate, changeTable, refreshTable }) => {
    const [gridStructure, setGridStructure] = useState({columns: columns})
    const API_BACKEND = `${process.env.REACT_APP_API}/api/v1`
    const HEADERS = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.sessionStorage.getItem('access_token')}`
    }

    const generateStructure = (data) => {
        const dataGrid = data.map(zone => {            
            zone.edit = (
                <div 
                    className="edit-icon-container text-center"
                    >
                    <img src={Assets.userImgs.edit} 
                        className="edit-icon" 
                        alt="edit-icon"
                    ></img>
                </div>
            )

            zone.add = (
                <div onClick={() => configureModalAdd(zone.id)}
                    className="edit-icon-container text-center"
                    >
                    <img src={Assets.userImgs.plus} 
                        className="edit-icon" 
                        alt="edit-icon"
                    ></img>
                </div>
            )

            zone.enable =  (
                <div onClick={() => configureModalDeactivate(zone.id)}
                    className="disable-icon-container text-center"
                    >
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
            
            delete zone.WarehouseFloor
            return {...zone}
        })

        return dataGrid
    }

    const getZones = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${API_BACKEND}/warehouse-zones/1`,
                headers: HEADERS
            })

            if(!result) {
                toastMessage('warning', 'Ocurrio un problema')
                return
            }

            const {data: {data}} = result
            const dataGrid = generateStructure(data)
            setGridStructure({
                ...gridStructure,
                rows: dataGrid
            })
        } catch (err) {
            console.error(err.mesage)
            toastMessage('error', 'Error en el servidor')
        }
    }

    useEffect(() => {
        getZones()
    }, [changeTable])

    const configureModalAdd = (id) => {
        handleModalAdd()
        idZone(id)
    }

    const configureModalDeactivate = (id) => {
        idZone(id)
        handleModalDeactivate()        
    }

    return (
        <MDBDataTableV5
                hover 
                entriesOptions={[5, 20, 25]} 
                entries={5} 
                pagesAmount={4} 
                data={gridStructure}/>
    )
}

export default ZoneSectorTable