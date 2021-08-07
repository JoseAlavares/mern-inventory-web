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
    MDBTable,
    MDBTableBody,
    MDBTableHead,
} from 'mdbreact'
import axios from 'axios'
import { toastMessage } from '../../utils/toast-functions'


const ZoneAddModal = ({ openAdd, handleModalAdd, refreshTable }) => {    
    const [input, setInput] = useState({})
    const [loading, setLoading] = useState(false)
    const [levels, setLevels] = useState([])
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

    const addNewZone = async () => {
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
                method: 'POST',
                url: `${API_ENDPOINT}/api/v1/zone`,
                headers: HEADERS,
                data: {
                    name: input.name,
                    levels: levels
                }
            })

            if(result) {
                toastMessage('success', 'El almacén fue creado correctamente')
                refreshTable()
                handleModal()                
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
        setInput({})
        setLevels([])
    }, [open])

    

    return (
        <MDBContainer>
          <MDBModal isOpen={openAdd} toggle={handleModalAdd} size="lg" centered>
            <MDBModalHeader toggle={handleModalAdd}>
                Nuevo almacén                    
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
                                                        
                            <MDBBtn size="sm" onClick={addNewZone}>Agregar</MDBBtn>
                        </MDBCol>                                          
                    </MDBRow>                    
                </MDBContainer>
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn 
                    color="secondary" 
                    onClick={handleModal}>
                    Cerrar
                </MDBBtn>
                <MDBBtn 
                    color="primary" 
                    disabled={loading} 
                    onClick={addNewWarehouse}>
                    Guardar
                </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
    )
}

export default ZoneAddModal