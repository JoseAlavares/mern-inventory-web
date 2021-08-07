import React, { Fragment, useState, useEffect } from 'react'
import { MDBDataTableV5, MDBBadge, MDBBtn } from 'mdbreact'
import Assets from '../../assets/Assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import './categoryTable.css'

const CategoryTable = ({ handleModal, handleMode, idCategory, changeTable }) => {
    const [gridStructure, setGridStructure] = useState({})

    useEffect(() => {
        getCategories()
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
                    field: 'active',
                    width: 200,
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
            rows: data.map(c => {
                //u.rol_name = u.Rol.name
                c.edit = 
                    <div 
                        className="edit-icon-container"
                        onClick={() => { 
                            handleModal()
                            handleMode('get_category')
                            idCategory(c.id)
                        }}
                    >
                    <img src={Assets.categoryImgs.edit} 
                        className="edit-icon" 
                        alt="edit-icon"
                    ></img>
                </div>
                c.enable =  <div 
                                className="disable-icon-container"
                                onClick={() => {
                                    handleModal()
                                    handleMode('delete_category')
                                    idCategory(c.id)
                                }}
                            >
                            {c.active === true ? 'Inhabilitar' : 'Habilitar'}
                                <img src={c.active === true ? Assets.categoryImgs.disableRed : Assets.categoryImgs.disable} 
                                    className="disable-icon" 
                                    alt="disable-icon"
                                ></img>
                            </div>
                c.active = (c.active === true) 
                    ? <p className="active-status">Activo</p> 
                    : <p className="inactive-status">Inactivo</p>                               
                
                return {...c}
            }) 
        }

    }

    const getCategories = async () => {
        try {
            const _users = await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API}/api/v1/category`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.sessionStorage.getItem('access_token')}`
                }
            })
    
            if(_users) {                
                const { data: {data} } = _users
                const newData = generateStructure(data)
                setGridStructure(newData)
            }
        } catch(err) {
            toast.error(err.response.data.message || err.message, {
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

export default CategoryTable