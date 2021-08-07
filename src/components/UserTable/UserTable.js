import React, { Fragment, useState, useEffect } from 'react'
import { MDBDataTableV5 } from 'mdbreact'
import Assets from '../../assets/Assets'
import axios from 'axios'
import { toastMessage } from '../../utils/toast-functions'
import './userTable.css'

const columns = [{
    label: 'Nombre',
    field: 'name',
    width: 270,
},
{
    label: 'Correo',
    field: 'email',
    width: 200,
},
{
    label: 'Rol',
    field: 'rol_name',
    sort: 'asc',
    width: 100,
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
    label: '',
    field: 'enable',
    sort: 'disabled',
    width: 150,
}]

const UserTable = ({ handleModal, handleMode, idUser, changeTable }) => {
    const [gridStructure, setGridStructure] = useState({columns: columns})

    useEffect(() => {
        getUsers()
    }, [changeTable])

    const handleActions = (id, mode) => {
        handleModal()
        handleMode(mode)
        idUser(id)
    } 

    const generateStructure = (data) => {        
        const dataGrid = data.map(u => {            
            u.edit = (
                <div 
                    className="edit-icon-container text-center"
                    onClick={() => handleActions(u.id, 'get_user')}>
                    <img src={Assets.userImgs.edit} 
                        className="edit-icon" 
                        alt="edit-icon"
                    ></img>
                </div>
            )
            u.enable =  (
                <div 
                    className="disable-icon-container text-center"
                    onClick={() => handleActions(u.id, 'delete_user')}>
                        {u.active === true ? 'Inhabilitar' : 'Habilitar'}
                        <img src={
                                u.active === true 
                                ? Assets.userImgs.disableRed 
                                : Assets.userImgs.disable
                            } 
                            className="disable-icon" 
                            alt="disable-icon"
                        ></img>
                </div>
            )
            u.rol_name = u.Rol.name
            u.active = (
                (u.active === true) 
                ? <p className="active-status">Activo</p> 
                : <p className="inactive-status">Inactivo</p>
            )
            delete u.Rol
            delete u.RolId
            return {...u}
        })

        return dataGrid
    }

    const getUsers = async () => {
        try {            
            const _users = await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API}/api/v1/user`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.sessionStorage.getItem('access_token')}`
                }
            })
            
            const { data: {data} } = _users            
            const newData = generateStructure(data)
            setGridStructure({
                ...gridStructure,
                rows: newData
            })
            
        } catch(err) {
            console.error(err.message)
            toastMessage('error', err.message)
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

export default UserTable