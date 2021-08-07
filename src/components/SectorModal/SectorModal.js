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
import './sectorModal.css'

const SectorModal = ({ mode, open, handleModal, id, refreshTable }) => {
    const [input, setInput] = useState({})
    const [loading, setLoading] = useState(false)
    const API_ENDPOINT = `${process.env.REACT_APP_API}`
    const TOKEN = window.sessionStorage.getItem('access_token')
    const HEADERS  = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
    }

    const handleInput = (event) => {
        console.log(event.target.name)
        const value = event.target.value;
        setInput({
            ...input,
            [event.target.name]: value
        })
    }

    const addNewSector = async () => {
        let errors = []

        if(!input.name) errors.push('El campo nombre no puede estar vacio')
        if(!input.description) errors.push('El campo descripción no puede estar vacio')

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
                url: `${API_ENDPOINT}/api/v1/sector`,
                headers: HEADERS,
                data: {
                    name: input.name,
                    description: input.description
                }
            })

            if(result) {               
                toastMessage('success', 'El sector fue creado correctamente')
                handleModal()
                refreshTable()
            }
        } catch (err) {
            
        }
        setLoading(false)
    }

    const editSector = async () => {
        let errors = []

        if(!input.name) errors.push('El campo nombre no puede estar vacio')
        if(!input.description) errors.push('El campo descripción no puede estar vacio')

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
                url: `${API_ENDPOINT}/api/v1/sector`,
                headers: HEADERS,
                data: {
                    id: id,
                    name: input.name,
                    description: input.description
                }
            })

            if(result) {               
                toastMessage('success', 'La información fue actualizada')
                handleModal()
                refreshTable()
            }
        } catch (error) {           
            toastMessage('error', 'Ocurrio un error')
        }

        setLoading(false)
    }

    const deleteSector = async () => {        
        try {
            setLoading(true)

            const result = axios({
                method: 'DELETE',
                url: `${API_ENDPOINT}/api/v1/sector/${id}`,
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
        }

        setInput({
            ['name']: '',
            ['description']: ''
        })
    }, [mode, open])

    const handleRequest = async () => {
        let dataRequest = {}

        if(mode === 'new_sector') {
            dataRequest = {
                method: 'POST',
                url: `${API_ENDPOINT}/api/v1/sector`,
                headers: HEADERS,
                data: {
                    id: id,
                    name: input.user,
                    email: input.email
                }
            }
        }
        else if(mode === 'get_sector'){
            dataRequest = {
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/sector/${id}`,
                headers: HEADERS
            }
        }

        if(mode === 'get_sector') {
            try {
                const result = await axios(dataRequest)
                const { data: { data } } = result
                        
                setInput({
                    ['name']: data.name,
                    ['description']: data.description
                })
                            
            } catch(err) {
                console.error(err)                
                toastMessage('error', err.message)
            }
        }
    }

    return (
        <MDBContainer>
          <MDBModal isOpen={open} toggle={handleModal} centered>
            <MDBModalHeader toggle={handleModal}>
                {mode === 'new_sector' 
                    ?
                        <p>Nueva familia</p>
                    :
                        <p>{(mode ==='delete_sector') ? "Inhabilitar familia" : "Editar familia"}</p>
                } 
            </MDBModalHeader>
            <MDBModalBody>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol md="12">
                        {mode === 'delete_sector' &&
                            <h4>¿Esta seguro que desea inhabilitar esta familia?</h4>
                        ||
                            <form>
                                <div className="grey-text">
                                    <MDBInput 
                                        label="Nombre"
                                        name="name" 
                                        group 
                                        type="text"
                                        onChange={handleInput}
                                        value={input.name || ""}/>
                                    <MDBInput 
                                        label="Descripción"
                                        name="description"
                                        group 
                                        type="text"
                                        onChange={handleInput} 
                                        validate 
                                        error="wrong"
                                        success="right"
                                        value={input.description || ""}/>                            
                                </div>                            
                            </form>
                        }
                        
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn className="cancel-button" onClick={handleModal}>Cancelar</MDBBtn>
              <MDBBtn className="agreed-button" disabled={loading} onClick={() => {
                  if(mode === 'new_sector') {
                    addNewSector()
                  }
                  else if(mode === 'get_sector') {
                    editSector()
                  }
                  else if(mode === 'delete_sector') {
                    deleteSector()
                  }
                }}>{
                    loading && 
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    ||
                        mode === 'delete_sector'
                        ? "Sí"
                        : "Guardar"
                }</MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
    )
}

export default SectorModal