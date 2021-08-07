import React, { useState, useEffect } from 'react'
import { 
    MDBContainer,
    MDBBtn,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader,
    MDBInput,
    MDBRow,
    MDBCol
} from 'mdbreact'
import axios from 'axios'
import { toastMessage } from '../../utils/toast-functions'
import Select from 'react-select'
import './userModal.css'


const UserModal = ({ mode, open, handleModal, id, refreshTable }) => {
    const [rols, setRols] = useState([])
    const [input, setInput] = useState({})
    const [loading, setLoading] = useState(false)
    const API_ENDPOINT = `${process.env.REACT_APP_API}`
    const TOKEN = window.sessionStorage.getItem('access_token')
    const HEADERS  = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
    }

    const handleInput = (event) => {
        const value = event.target.value;
        setInput({
            ...input,
            [event.target.name]: value
        })
    }

    const addNewUser = async () => {
        let errors = []

        if(!input.name) errors.push('El campo nombre no puede estar vacio')
        if(!input.email) errors.push('El campo correo no puede estar vacio')
        if(!input.password) errors.push('El campo contraseña no puede estar vacio')
        if(!input.rol_id) errors.push('El campo rol no puede estar vacio')

        if(errors.length) {
            for(let i=0; i<errors.length; i++) {
                toastMessage('error', errors[i])
            }
            return
        }

        setLoading(true)
        try {
            const result = await axios({
                method: 'POST',
                url: `${API_ENDPOINT}/api/v1/user`,
                headers: HEADERS,
                data: {
                    name: input.name,
                    email: input.email,
                    password: input.password,
                    rol: input.rol_id
                }
            })

            if(result) {
                toastMessage('success', 'El usuario fue creado correctamente')
                handleModal()
                refreshTable()
            }
        } catch (err) {
            console.error(err.message)
            let message = ''
            const status = err.response.status
            
            if(status === 409) {
                message = 'Ya existe un usuario con el mismo nombre o correo'
            }
            else if(status === 404) {
                message = 'No existe el recurso'
            }
            else {
                message = 'Ocurrio un error en el servidor'
            }

            toastMessage('error', message)
        }
        setLoading(false)
    }

    const editUser = async () => {
        let errors = []

        if(!input.name) errors.push('El campo nombre no puede estar vacio')
        if(!input.email) errors.push('El campo correo no puede estar vacio')
        if(!input.rol_id) errors.push('El campo rol no puede estar vacio')

        if(errors.length) {
            for(let i=0; i<errors.length; i++) {
                toastMessage('error', errors[i])
            }
            return
        }

        setLoading(true)
        try {
            const result = await axios({
                method: 'PUT',
                url: `${API_ENDPOINT}/api/v1/user`,
                headers: HEADERS,
                data: {
                    id: id,
                    name: input.name,
                    email: input.email,
                    rol: input.rol_id
                }
            })

            if(result) {
                toastMessage('success', 'La información fue actualizada')
                handleModal()
                refreshTable()
            }
        } catch (error) {
            console.error(error.message)
            console.error(error.stack)
            toastMessage('error', 'Ocurrio un error')
        }

        setLoading(false)
    }

    const deleteUser = async () => {
        try {
            setLoading(true)

            const result = await axios({
                method: 'DELETE',
                url: `${API_ENDPOINT}/api/v1/user/${id}`,
                headers: HEADERS
            })

            if(result) 
                toastMessage('success', 'La información fue actualizada correctamente')
            else
                toastMessage('error', 'Ocurrio un error')            
        } catch (err) {
            console.error(err.message)
            console.error(err.stack)
            toastMessage('error', err.message)
        } finally {
            setLoading(false)
            handleModal()
            refreshTable()
        }
    }

    useEffect(() => {        
        if(mode && open === true) {
            handleRequest()    
            getRols()
        }

        setInput({
            'name': '',
            'email': '',
            'rol_id': '',
            'rol_name': ''
        })
    }, [mode, open])

    const handleRequest = async () => {
        let dataRequest = {}

        if(mode === 'new_user') {
            dataRequest = {
                method: 'POST',
                url: `${API_ENDPOINT}/api/v1/user`,
                headers: HEADERS,
                data: {
                    id: id,
                    name: input.user,
                    email: input.email,
                    rol: input.rol_id
                }
            }
        }
        else if(mode === 'get_user'){
            dataRequest = {
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/user/${id}`,
                headers: HEADERS
            }
        }

        if(mode === 'get_user') {
            try {
                const result = await axios(dataRequest)
                const { data: { data } } = result
                        
                setInput({
                    'name': data.name,
                    'email': data.email,
                    'rol_id': data.RolId,
                    'rol_name': data.Rol.name
                })
                            
            } catch(err) {
                console.error(err.stack)
                toastMessage('error', err.message)
            }
        }
    }

    const handleSelect = (obj) => {
        setInput({
            ...input,
            'rol_id': obj.id,
            'rol_name': obj.label
        })
    }
    
    const getRols = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/rol`,
                headers: HEADERS
            })

            if(result) {
                const { data: { data } } = result                                
                setRols(data.map(rol => {
                    return {
                        id: rol.id, 
                        label: rol.name
                    } 
                }))
            }

            return
        } catch (err) {
            toastMessage('error', err.message)
        }
    }

    return (
        <MDBContainer>
          <MDBModal isOpen={open} toggle={handleModal} centered>
            <MDBModalHeader toggle={handleModal}>
                {mode === 'new_user' 
                    ?
                        <p>Nuevo usuario</p>
                    :
                        <p>{(mode === 'delete_user') ? "Desactivar usuario" : "Editar usuario"}</p>
                } 
            </MDBModalHeader>
            <MDBModalBody>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol md="12">
                        {mode === 'delete_user'
                        ?
                            <h4>¿Esta seguro de desactivar este usuario?</h4>
                        :
                            <form>
                                <div className="grey-text">
                                        <Select
                                            onChange={handleSelect}
                                            options={rols}
                                            name="rol"
                                            value={(input.rol_id) ? {value: input.rol_id, label: input.rol_name} : null}
                                        />
                                        <MDBInput 
                                            label="Nombre completo"
                                            name="name"
                                            group 
                                            type="text"
                                            onChange={handleInput}
                                            value={input.name || ""}/>
                                        <MDBInput 
                                            label="Correo electronico"
                                            name="email" 
                                            group 
                                            type="email"
                                            onChange={handleInput} 
                                            validate 
                                            error="wrong"
                                            success="right"
                                            value={input.email || ""}/>
                                        {
                                            mode === 'new_user'
                                            ?
                                                <MDBInput 
                                                    label="Contraseña" 
                                                    name="password"
                                                    group 
                                                    type="password"
                                                    onChange={handleInput}                                        
                                                    value={input.password || ""}/>
                                            :
                                                null
                                        }                                
                                </div>                            
                            </form>                        
                        }
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn className="cancel-button" onClick={handleModal}>Cerrar</MDBBtn>
              <MDBBtn className="agreed-button" disabled={loading} onClick={() => {
                  if(mode === 'new_user') {
                    addNewUser()
                  }
                  else if(mode === 'get_user') {
                      editUser()
                  }
                  else if(mode === 'delete_user') {
                      deleteUser()
                  }
                }}>{loading 
                    ? 
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    :
                        (mode === 'delete_user') ? "Desactivar" : "Guardar"
                }</MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
    )
}

export default UserModal