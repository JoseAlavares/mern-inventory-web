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
import Select from 'react-select'
import { toastMessage } from '../../utils/toast-functions'
import './categoryModal.css'

const CategoryModal = ({ mode, open, handleModal, id, refreshTable }) => {
    const [input, setInput] = useState({})
    const [sectors, setSectors] = useState([])
    const [loading, setLoading] = useState(false)
    const API_ENDPOINT = `${process.env.REACT_APP_API}`
    const TOKEN = window.sessionStorage.getItem('access_token')
    const HEADERS  = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
    }

    const handleInput = (event) => {
        const value = event.target.value
        setInput({
            ...input,
            [event.target.name]: value
        })
    }

    const addNewCategory = async () => {
        let errors = []

        if(!input.sector_id) errors.push('El campo sector no puede estar vacio')
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
                url: `${API_ENDPOINT}/api/v1/category`,
                headers: HEADERS,
                data: {
                    name: input.name,
                    description: input.description,
                    sector_id: input.sector_id,
                    code: input.code,
                }
            })

            if(result) {
                toastMessage('success', 'La categoria fue creadoa correctamente')                
                handleModal()
                refreshTable()
            }
        } catch (err) {
            toastMessage('error', err.message)
        }

        setLoading(false)
    }

    const deleteCategory = async () => {
        try {
            setLoading(true)

            const result = await axios({
                method: "PUT",
                url: `${API_ENDPOINT}/api/v1/category/${id}`,
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

    const editCategory = async () => {
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
                url: `${API_ENDPOINT}/api/v1/category`,
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

    useEffect(() => {
        if(mode && open === true) {
            handleRequest()  
            getSectors()          
        }

        setInput({
            'name': '',
            'description': '',
            'sector_id': ''
        })
    }, [mode, open])

    const handleRequest = async () => {
        let dataRequest = {}

        if(mode === 'new_category') {
            dataRequest = {
                method: 'POST',
                url: `${API_ENDPOINT}/api/v1/category`,
                headers: HEADERS,
                data: {
                    name: input.user,
                    description: input.description,
                    sector_id: input.sector_id
                }
            }
        }
        else if(mode === 'get_category'){
            dataRequest = {
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/category/${id}`,
                headers: HEADERS
            }
        }
        else if(mode === "delete_category") {
            dataRequest = {
                method: 'DELETE',
                url: `${API_ENDPOINT}/api/v1/category/${id}`,
                headers: HEADERS
            }
        }

        if(mode === 'get_category') {
            try {
                const result = await axios(dataRequest)                
                const { data: { data } } = result
                        
                setInput({
                    name: data.name,
                    description: data.description,
                    sector_id: data.sector_id,
                    code: data.code,
                })
                            
            } catch(err) {
                toastMessage('error', err.message)                
            }
        }
    }

    const getSectors = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/sector`,
                headers: HEADERS
            })
            
            if(result) {
                const {data: { data }} = result
                //console.log(result)    
                setSectors(data.map(d => {
                    return {id: d.id, label: d.name}
                }))
                return
            }

            toastMessage('error', 'Error 404')
        } catch (err) {
            toastMessage('error', err.message)
        }
    }

    const handleSelectSector = (obj) => {
        setInput({
            ...input,
            'sector_id': obj.id
        })
    }

    const formatCreateLabel = (inputValue) => (
        <span>Agregar: {inputValue}</span>
    )

    return (
        <MDBContainer>
          <MDBModal isOpen={open} toggle={handleModal} centered>
            <MDBModalHeader toggle={handleModal}>
                {mode === 'new_category' 
                    ?
                        <p>Nueva sub familia</p>
                    :
                        <p>{(mode === "get_category") ? "Editar sub familia" : "Desactivar sub familia"}</p>
                } 
            </MDBModalHeader>
            <MDBModalBody>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol md="12">
                        {mode !== "delete_category" ?
                            <form>
                                <div className="">
                                    <Select
                                        formatCreateLabel={formatCreateLabel}
                                        options={sectors}
                                        onChange={handleSelectSector}
                                        placeholder="Selecciona una familia..."/>
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
                                        type="textarea"                                
                                        onChange={handleInput} 
                                        validate 
                                        error="wrong"
                                        success="right"
                                        value={input.description || ""}/>                                    
                                </div>                            
                            </form>

                        :
                            <h4>¿Esta seguro de ihhabilitar esta sub familia?</h4>
                        }
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn className="cancel-button" onClick={handleModal}>Cancelar</MDBBtn>
                <MDBBtn className="agreed-button" disabled={loading} onClick={() => {
                    if(mode === 'new_category') {
                        addNewCategory()
                    }
                    else if(mode === 'get_category') {
                        editCategory()
                    }
                    else if(mode === "delete_category") {
                        deleteCategory()
                    }
                }}>{
                    loading 
                    ?
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    :                        
                    mode === "delete_category"
                        ? "Sí"
                        : "Guardar"
                }</MDBBtn>
            </MDBModalFooter>
        </MDBModal>
    </MDBContainer>
    )
}

export default CategoryModal