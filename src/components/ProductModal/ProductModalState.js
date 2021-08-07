import React from 'react'
import {
    MDBContainer,
    MDBModal,
    MDBModalBody,
    MDBModalHeader,
    MDBModalFooter,
    MDBBtn
} from 'mdbreact'
import axios from 'axios'
import './ProductModal.css'
import { toastMessage } from '../../utils/toast-functions'


const ProductModalState = ({open, id, handleModal, refreshTable}) => {
    const API_ENDPOINT = `${process.env.REACT_APP_API}`
    const TOKEN = window.sessionStorage.getItem('access_token')
    const HEADERS  = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
    }

    const changeState = async () => {
        try {
            const result = await axios({
                method: 'PUT',
                url: `${API_ENDPOINT}/api/v1/product/${id}`,
                headers: HEADERS
            })

            if(result) {
                toastMessage('success', 'El producto cambio de estado')
                refreshTable()
                handleModal()
                return
            }
        
            toastMessage('error', 'Ocurrio un problema')                        
        } catch (err) {
            console.error(err.message)
            toastMessage('error', 'Ocurrio un error: ' + err.message)
        }
    }

    return (
        <MDBModal isOpen={open} toggle={handleModal} size="sm" centered>
            <MDBModalHeader toggle={handleModal}>
                Cambiar de estado el producto
            </MDBModalHeader>
            <MDBModalBody>
                <MDBContainer>
                    <p>¿Esta seguro de cambiar el estado del producto?</p>
                </MDBContainer>
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn onClick={handleModal} className="cancel-button">Cerrar</MDBBtn>
                <MDBBtn onClick={changeState} className="agreed-button">Cambiar</MDBBtn>
            </MDBModalFooter>
        </MDBModal>
    )
}

export default ProductModalState