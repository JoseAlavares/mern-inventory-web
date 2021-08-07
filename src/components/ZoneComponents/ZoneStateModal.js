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

const ZoneStateModal = ({ idZone, openState, handleModalZoneState, refreshTable }) => {    
    const [input, setInput] = useState({})
    const [loading, setLoading] = useState(false)
    const API_ENDPOINT = `${process.env.REACT_APP_API}`
    const TOKEN = window.sessionStorage.getItem('access_token')
    const HEADERS  = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
    }

    const changeActive = async () => {        

        setLoading(true)
        try {
            const result = await axios({
                method: 'PUT',
                url: `${API_ENDPOINT}/api/v1/zone/${idZone}`,
                headers: HEADERS,                
            })

            if(result) {
                toastMessage('success', 'La bodega fue desactivada correctamente')
                handleModalZoneState()
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

    return (
        <MDBContainer>
          <MDBModal isOpen={openState} toggle={handleModalZoneState} size="lg" centered>
            <MDBModalHeader toggle={handleModalZoneState}>
                Cambiar estado de bodega                    
            </MDBModalHeader>
            <MDBModalBody>
                <MDBContainer>                    
                    <MDBRow>
                        <MDBCol md="12" lg="12">
                            <h5>¿Desea cambiar el estado de la bodega?</h5>                            
                        </MDBCol>                                          
                    </MDBRow>                    
                </MDBContainer>
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn 
                    color="secondary" 
                    onClick={handleModalZoneState}>
                    Cerrar
                </MDBBtn>
                <MDBBtn 
                    color="primary" 
                    disabled={loading} 
                    onClick={changeActive}>
                    Guardar
                </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
    )
}

export default ZoneStateModal