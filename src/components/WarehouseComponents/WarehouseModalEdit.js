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


const WarehouseModalEdit = ({ idWarehouse, openEdit, handleModalEdit, refreshTable }) => {    
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

    const editWarehouse = async () => {    
        if(!input.name){
            toastMessage('error', 'El campo nombre no puede estar vacio')
            return
        }

        setLoading(true)
        try {
            const result = await axios({
                method: 'PUT',
                url: `${API_ENDPOINT}/api/v1/warehouse`,
                headers: HEADERS,
                data: {
                    name: input.name,
                    id: idWarehouse
                }
            })

            if(result) {
                toastMessage('success', 'La información fue gardada correctamente')
                handleModalEdit()
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

    
    useEffect(() => {    
        //setInput({})    
        if(openEdit)    
            getDataWarehouse()
    }, [openEdit])

    const getDataWarehouse = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/warehouse/${idWarehouse}`,
                headers: HEADERS
            })

            const {data: {data}} = result
            setInput({
                ...input,
                name: data.name
            })
        } catch(err) {
            console.error(err.message)
            toastMessage('error', 'Error al intentar obtener los datos del almacen')
        }
    } 

    return (
        <MDBContainer>
          <MDBModal 
            isOpen={openEdit} 
            toggle={handleModalEdit} 
            size="lg" centered>
            <MDBModalHeader 
                toggle={handleModalEdit}>
                Nuevo almacen                    
            </MDBModalHeader>
            <MDBModalBody>
                <MDBContainer>                    
                    <MDBRow>
                        <MDBCol md="12">
                            <h5>Datos del almacen</h5>
                            <MDBInput 
                                label="Nombre del almacen"
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
                    onClick={handleModalEdit}>
                    Cerrar
                </MDBBtn>
                <MDBBtn 
                    color="primary" 
                    disabled={loading} 
                    onClick={editWarehouse}>
                    Guardar
                </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
    )
}

export default WarehouseModalEdit