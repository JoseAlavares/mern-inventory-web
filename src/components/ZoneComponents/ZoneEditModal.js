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
    MDBCol,    
} from 'mdbreact'
import axios from 'axios'
import { toastMessage } from '../../utils/toast-functions'

const ZoneEditModal = ({ idZone, idWarehouse, openEditZone, handleModalEditZone, refreshTable }) => {    
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

    const editZone = async () => {
        let errors = []

        if(!input.name) errors.push('El campo nombre no puede estar vacio')        

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
                url: `${API_ENDPOINT}/api/v1/zone`,
                headers: HEADERS,
                data: {
                    name: input.name,
                    id: idZone
                }
            })

            if(result) {
                toastMessage('success', 'El almacén fue creado correctamente')
                handleModalEditZone()
                refreshTable()                
            }
        } catch (err) {
            console.error(err.message)
            let message = ''
            const status = err.response.status
                        
            if(status === 404) {
                message = 'No existe el recurso'
            }
            else {
                message = 'Ocurrio un error en el servidor'
            }

            toastMessage('error', message)
        }
        setLoading(false)
    }

    const handleRequest = async () => {
        if(idZone) {
            try {
                const result = await axios({
                    url: `${API_ENDPOINT}/api/v1/zone/${idZone}`,
                    method: 'GET',
                    headers: HEADERS
                })

                const {data: {data}} = result
                setInput({
                    ...input,
                    name: data.name
                })
            } catch (err) {
                console.error(err.message)

                if(err.response.status === 404) {
                    toastMessage('error', 'No existe la bodega')
                }
                else if(err.response.status === 500) {
                    toastMessage('error', 'Ocurrio un error en el servidor')
                }
                else if(err.response.status === 422) {
                    toastMessage('warning', 'El servicio rechazo la solicitud por campos requeridos')
                }
            }
        }
        else {
            console.error('No existe el id de la bodega')
        }
    }

    useEffect(() => {  
        if(openEditZone)  
            handleRequest()
    }, [openEditZone])

    return (
        <MDBContainer>
          <MDBModal isOpen={openEditZone} toggle={handleModalEditZone} size="lg" centered>
            <MDBModalHeader toggle={handleModalEditZone}>
                Editar bodega                    
            </MDBModalHeader>
            <MDBModalBody>
                <MDBContainer>                    
                    <MDBRow>
                        <MDBCol md="12" lg="12">
                            <h5>Datos de la bodega</h5>
                            <MDBInput 
                                label="Nombre de la bodega"
                                name="name"
                                type="text"
                                onChange={handleInput}
                                value={input.name || ""}/>                                                    
                        </MDBCol>                                          
                    </MDBRow>                    
                </MDBContainer>
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn 
                    color="secondary" 
                    onClick={handleModalEditZone}>
                    Cerrar
                </MDBBtn>
                <MDBBtn 
                    color="primary" 
                    disabled={loading} 
                    onClick={editZone}>
                    Guardar
                </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
    )
}

export default ZoneEditModal