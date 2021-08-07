import React, { useState } from 'react'
import { 
    MDBContainer,
    MDBBtn,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader,
} from 'mdbreact'
import axios from 'axios'
import { toastMessage } from '../../utils/toast-functions'


const WarehouseModalDeactivate = ({ idWarehouse, openDeactivate, handleModalDeactivate, refreshTable }) => {    
    const [loading, setLoading] = useState(false)
    const API_ENDPOINT = `${process.env.REACT_APP_API}`
    const TOKEN = window.sessionStorage.getItem('access_token')
    const HEADERS  = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
    }

    const deactivate = async () => {
        try {
            const result = await axios({
                method: 'PUT',
                url: `${API_ENDPOINT}/api/v1/warehouse/${idWarehouse}`,
                headers: HEADERS
            })
            console.log(result)
            if(!result) {
                toastMessage('warning', 'Ocurrio un problema')
                return
            }

            toastMessage(
                'success', 
                'El estado fue cambiado correctamente'
            )
            handleModalDeactivate()
            refreshTable()
        } catch (error) {
            console.error(error.message)
            toastMessage('error', 'Ocurrio un error')
        }
    }
    

    return (
        <MDBContainer>
          <MDBModal 
            isOpen={openDeactivate} 
            toggle={handleModalDeactivate} 
            size="lg" 
            centered>
            <MDBModalHeader 
                toggle={handleModalDeactivate}>
                Cambiar el estado del almacén                    
            </MDBModalHeader>
            <MDBModalBody>
                <MDBContainer>                    
                    <h3>¿Esta seguro de cambiar estado el almacén?</h3>
                </MDBContainer>
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn 
                    color="secondary" 
                    onClick={handleModalDeactivate}>
                    Cerrar
                </MDBBtn>
                <MDBBtn 
                    color="primary" 
                    disabled={loading} 
                    onClick={deactivate}>
                    Guardar
                </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
    )
}

export default WarehouseModalDeactivate