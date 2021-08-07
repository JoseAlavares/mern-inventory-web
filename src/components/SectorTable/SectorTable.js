import React, { Fragment, useState, useEffect } from 'react'
import { MDBDataTableV5, MDBBadge, MDBBtn } from 'mdbreact'
import Assets from '../../assets/Assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import './sectorTable.css'

const SectorTable = ({ handleModal, handleMode, idSector, changeTable }) => {
    const [gridStructure, setGridStructure] = useState({})

    useEffect(() => {
        getSectors()
    }, [changeTable])    

    const generateStructure = (data) => {
        return {
            columns: [{
                    label: 'Nombre',
                    field: 'name',
                    width: 270,
                },
                {
                    label: 'Descripción',
                    field: 'description',
                    width: 200,
                },
                {
                    label: 'Estatus',
                    field: 'status',
                    sort: 'asc',
                    width: 100,
                },
                {
                    label: 'Editar',
                    field: 'edit',
                    sort: 'disabled',
                    width: 150,
                },
                {
                    label: '',
                    field: 'enable',
                    sort: 'disabled',
                    width: 150,
                }               
            ],
            rows: data.map(sector => {                
                sector.status = (sector.active === true) 
                    ? <p className="active-status">Activo</p> 
                    : <p className="inactive-status">Inactivo</p>
                sector.edit = 
                    <div 
                        className="edit-icon-container"
                        onClick={() => { 
                            handleModal()
                            handleMode('get_sector')
                            idSector(sector.id)
                        }}
                        >
                        <img src={Assets.sectorImgs.edit} 
                            className="edit-icon" 
                            alt="edit-icon"
                        ></img>
                    </div>
                sector.enable =  <div 
                                    className="disable-icon-container"
                                    onClick={() => {
                                        handleModal()
                                        handleMode('delete_sector')
                                        idSector(sector.id)
                                    }}
                                >
                                    {sector.active === true ? 'Inhabilitar' : 'Habilitar'}
                                <img src={sector.active === true ? Assets.sectorImgs.disableRed : Assets.sectorImgs.disable} 
                                    className="disable-icon" 
                                    alt="disable-icon"
                                ></img>
                            </div>
                
                return {...sector}
            }) 
        }

    }

    const getSectors = async () => {
        try {
            const _users = await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API}/api/v1/sector`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.sessionStorage.getItem('access_token')}`
                }
            })
    
            if(_users) {                
                const { data: {data} } = _users
                console.log(data)
                const newData = generateStructure(data)
                setGridStructure(newData)
            }
        } catch(err) {
            toast.error(err.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
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

export default SectorTable