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
    MDBTabPane,
    MDBNav,
    MDBNavItem,
    MDBNavLink,
    MDBTabContent
} from 'mdbreact'
import axios from 'axios'
import { toastMessage } from '../../utils/toast-functions'
import { cleanCharacters } from '../../utils/functions'
import './providerModal.css'

const ProviderModal = ({ mode, open, handleModal, id, refreshTable }) => {
    const [input, setInput] = useState({})
    const [loading, setLoading] = useState(false)
    const [activeItem, setActiveItem] = useState("1")
    const API_ENDPOINT = `${process.env.REACT_APP_API}`
    const TOKEN = window.sessionStorage.getItem('access_token')
    const HEADERS  = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
    }

    const toggle = tab => {
        if(activeItem !== tab) {
            setActiveItem(tab)
        }
      };

    const handleInput = (event) => {
        var value = event.target.value

        if(event.target.getAttribute('data-type') === 'number') {
            value = cleanCharacters(value)
        }

        setInput({
            ...input,
            [event.target.name]: value
        })
    }

    const addNewProvider = async () => {
        let errors = []

        if(!input.name) errors.push('El campo nombre no puede estar vacio')
        if(!input.address) errors.push('El campo dirección no puede estar vacio')
        if(!input.email) errors.push('El campo correo no puede estar vacio')
        if(!input.telephone) errors.push('El campo telefono no puede estar vacio')
        if(!input.contactName) errors.push('El campo contacto no puede estar vacio')
        if(!input.receptionRule) errors.push('El campo reglas de recepción no puede estar vacio')
        if(!input.bossName) errors.push('El campo nombre del jefe no puede estar vacio')
        if(!input.telephoneBoss) errors.push('El campo telefono del jefe no puede estar vacio')
        if(!input.emailBoss) errors.push('El campo correo del jefe no puede estar vacio')
        if(!input.bankData) errors.push('El campo datos bancarios del jefe no puede estar vacio')
        if(!parseFloat(input.first_margin)) errors.push('El campo margen nivel 1 no puede menor o igual a cero')
        if(!parseFloat(input.second_margin)) errors.push('El campo margen nivel 2 no puede menor o igual a cero')
        if(!parseFloat(input.third_margin)) errors.push('El campo margen nivel 3 no puede menor o igual a cero')
        if(!parseFloat(input.fourth_margin)) errors.push('El campo margen nivel 4 no puede menor o igual a cero')
        if(!parseFloat(input.fifth_margin)) errors.push('El campo margen nivel 5 no puede menor o igual a cero')

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
                url: `${API_ENDPOINT}/api/v1/provider`,
                headers: HEADERS,
                data: {
                    name: input.name,
                    address: input.address,
                    email: input.email,
                    telephone: input.telephone,
                    contactName: input.contactName,
                    receptionRule: input.receptionRule,
                    code: input.code,
                    bossName: input.bossName,
                    telephoneBoss: input.telephoneBoss,
                    emailBoss: input.emailBoss,
                    bankData: input.bankData,
                    first_margin: input.first_margin,
                    second_margin: input.second_margin,
                    third_margin: input.third_margin,
                    fourth_margin: input.fourth_margin,
                    fifth_margin: input.fifth_margin
                }
            })

            if(result) {               
                toastMessage('success', 'El sector fue creado correctamente')
                handleModal()
                refreshTable()
            }
        } catch (err) {
            toastMessage('error', err.response.data.message)
        }
        setLoading(false)
    }

    const editProvider = async () => {
        let errors = []

        if(!input.name) errors.push('El campo nombre no puede estar vacio')
        if(!input.address) errors.push('El campo dirección no puede estar vacio')
        if(!input.email) errors.push('El campo correo no puede estar vacio')
        if(!input.telephone) errors.push('El campo telefono no puede estar vacio')
        if(!input.contactName) errors.push('El campo contacto no puede estar vacio')
        if(!input.receptionRule) errors.push('El campo reglas de recepción no puede estar vacio')
        if(!input.bossName) errors.push('El campo nombre del jefe de recepción no puede estar vacio')
        if(!input.emailBoss) errors.push('El campo correo del jefe de recepción no puede estar vacio')
        if(!input.telephoneBoss) errors.push('El campo telefono del jefe de recepción no puede estar vacio')
        if(!input.bankData) errors.push('El campo datos bancarios de recepción no puede estar vacio')
        if(!parseFloat(input.first_margin)) errors.push('El campo margen nivel 1 no puede menor o igual a cero')
        if(!parseFloat(input.second_margin)) errors.push('El campo margen nivel 2 no puede menor o igual a cero')
        if(!parseFloat(input.third_margin)) errors.push('El campo margen nivel 3 no puede menor o igual a cero')
        if(!parseFloat(input.fourth_margin)) errors.push('El campo margen nivel 4 no puede menor o igual a cero')
        if(!parseFloat(input.fifth_margin)) errors.push('El campo margen nivel 5 no puede menor o igual a cero')

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
                url: `${API_ENDPOINT}/api/v1/provider`,
                headers: HEADERS,
                data: {
                    id: id,
                    name: input.name,
                    address: input.address,
                    email: input.email,
                    telephone: input.telephone,
                    contactName: input.contactName,
                    receptionRule: input.receptionRule,
                    bossName: input.bossName,
                    telephoneBoss: input.telephoneBoss,
                    emailBoss: input.emailBoss,
                    bankData: input.bankData,
                    first_margin: input.first_margin,
                    second_margin: input.second_margin,
                    third_margin: input.third_margin,
                    fourth_margin: input.fourth_margin,
                    fifth_margin: input.fifth_margin
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

    const deleteProvider = async () => {    
        try {
            setLoading(true)

            const result = axios({
                method: 'DELETE',
                url: `${API_ENDPOINT}/api/v1/provider/${id}`,
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
            name: '',            
            address: '',
            email: '',
            telephone: '',
            contactName: '',
            bossName: '',
            telephoneBoss: '',
            emailBoss: '',
            bankData: ''
        })
    }, [mode, open])

    const handleRequest = async () => {
        let dataRequest = {}

        if(mode === 'new_provider') {
            dataRequest = {
                method: 'POST',
                url: `${API_ENDPOINT}/api/v1/provider`,
                headers: HEADERS,
                data: {
                    name: input.name,
                    address: input.address,
                    email: input.email,
                    telephone: input.telephone,
                    contactName: input.contactName,
                    receptionRule: input.receptionRule,
                    bossName: input.bossName,
                    telephoneBoss: input.telephoneBoss,
                    emailBoss: input.emailBoss,
                    bankData: input.bankData,
                    first_margin: input.first_margin,
                    second_margin: input.second_margin,
                    third_margin: input.third_margin,
                    fourth_margin: input.fourth_margin,
                    fifth_margin: input.fifth_margin
                }
            }
        }
        else if(mode === 'get_provider'){
            dataRequest = {
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/provider/${id}`,
                headers: HEADERS
            }
        }

        if(mode === 'get_provider') {
            try {
                const result = await axios(dataRequest)
                const { data: { data } } = result
                        
                setInput({
                    name: data.name,            
                    address: data.address,
                    email: data.email,
                    telephone: data.telephone,
                    contactName: data.contactName,
                    receptionRule: data.receptionRule,
                    bossName: data.bossName,
                    telephoneBoss: data.telephoneBoss,
                    emailBoss: data.emailBoss,
                    bankData: data.bankData,
                    first_margin: data.firstProfitMargin,
                    second_margin: data.secondProfitMargin,
                    third_margin: data.thirdProfitMargin,
                    fourth_margin: data.fourthProfitMargin,
                    fifth_margin: data.fifthProfitMargin
                })
                            
            } catch(err) {
                console.error(err)                
                toastMessage('error', err.message)
            }
        }
    }

    /*const handleSlider = (obj, name) => {
        setInput({
            ...input,
            [name]: obj.x
        })
    }*/

    return (
        <MDBContainer>
          <MDBModal isOpen={open} toggle={handleModal} centered className={mode === 'delete_provider' ? "provider-modal-disabled" : "provider-modal"}>
            <MDBModalHeader toggle={handleModal}>
                {mode === 'new_provider' 
                    ?
                        <p className="provider-modal-title">Agregar proveedor</p>
                    :
                        <p className="provider-modal-title">{(mode === 'delete_provider') ? "Inhabilitar proveedor" : "Editar proveedor"}</p>
                } 
            </MDBModalHeader>
            <MDBModalBody className={mode === 'delete_provider' ? "provider-modal-body-disabled" : "provider-modal-body"}>
                <MDBContainer>
                        {mode === 'delete_provider' ?
                            <MDBRow>
                                <MDBCol lg="12" md="12" sm="12" xs="12">
                                    <h4>¿Esta seguro que desea inhabilitar este proveedor?</h4>
                                </MDBCol>
                            </MDBRow>
                        :
                            <React.Fragment>
                                <MDBNav className="nav-tabs">
                                    <MDBNavItem>
                                        <MDBNavLink link to="#" active={activeItem === "1"} onClick={() => toggle("1")} role="tab" className="section-title-provider-modal">
                                            Datos del proveedor
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink link to="#" active={activeItem === "2"} onClick={() => toggle("2")} role="tab" className="section-title-provider-modal">
                                            Datos del jefe
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink link to="#" active={activeItem === "3"} onClick={() => toggle("3")} role="tab" className="section-title-provider-modal">
                                            Margenes de utilidad
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink link to="#" active={activeItem === "4"} onClick={() => toggle("4")} role="tab" className="section-title-provider-modal">
                                            Reglas de recepción
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    </MDBNav>
                                    <MDBTabContent activeItem={activeItem} >
                                    <MDBTabPane tabId="1" role="tabpanel">
                                        <MDBRow>
                                            <MDBCol lg="12" md="12" sm="12" xs="12" className="provider-modal-input">
                                                <MDBInput 
                                                    label="Nombre"
                                                    name="name"
                                                    group 
                                                    type="text"
                                                    onChange={handleInput}
                                                    value={input.name || ""}
                                                    />
                                                <MDBInput 
                                                    label="Dirección"
                                                    name="address"
                                                    group 
                                                    type="text"
                                                    onChange={handleInput} 
                                                    validate 
                                                    error="wrong"
                                                    success="right"
                                                    value={input.address || ""}/>                            
                                                <MDBInput 
                                                    label="Correo"
                                                    name="email"
                                                    group 
                                                    type="text"
                                                    onChange={handleInput} 
                                                    validate 
                                                    error="wrong"
                                                    success="right"
                                                    value={input.email || ""}/>                            
                                                <MDBInput 
                                                    label="Telefono"
                                                    name="telephone"
                                                    group 
                                                    type="text"
                                                    onChange={handleInput} 
                                                    validate 
                                                    error="wrong"
                                                    success="right"
                                                    value={input.telephone || ""}/>                            
                                                <MDBInput 
                                                    label="Contacto"
                                                    name="contactName"
                                                    group 
                                                    type="text"
                                                    onChange={handleInput} 
                                                    validate 
                                                    error="wrong"
                                                    success="right"
                                                    value={input.contactName || ""}/>
                                                <p className="recepcion-label">Datos bancarios</p>
                                                <MDBInput
                                                    name="bankData"
                                                    type="textarea"
                                                    rows="3"
                                                    onChange={handleInput}
                                                    placeholder="Datos bancarios"
                                                    value={input.bankData || ""}/>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBTabPane>
                                    <MDBTabPane tabId="2" role="tabpanel">
                                        <MDBRow>
                                            <MDBCol lg="12" md="12" sm="12" xs="12" className="provider-modal-input">
                                                <MDBInput
                                                    label="Nombre"
                                                    name="bossName"
                                                    type="text"
                                                    onChange={handleInput}
                                                    placeholder="Nombre completo"
                                                    value={input.bossName || ""}/>
                                                <MDBInput
                                                    label="Telefono"
                                                    name="telephoneBoss"
                                                    type="text"
                                                    onChange={handleInput}
                                                    placeholder="Telefono del jefe"
                                                    value={input.telephoneBoss || ""}/>
                                                <MDBInput
                                                    label="Correo"
                                                    name="emailBoss"
                                                    type="text"
                                                    onChange={handleInput}
                                                    placeholder="Correo del jeje"
                                                    value={input.emailBoss || ""}/>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBTabPane>
                                    <MDBTabPane tabId="3" role="tabpanel">
                                        <MDBRow>
                                            <MDBCol lg="12" md="12" sm="12" xs="12" className="provider-modal-input">
                                                <MDBInput
                                                    data-type="number"
                                                    name="first_margin"
                                                    label="Nivel 1"
                                                    onChange={handleInput}
                                                    value={input.first_margin || ""}/> 
                                                <MDBInput
                                                    data-type="number"
                                                    name="second_margin"
                                                    label="Nivel 2"
                                                    onChange={handleInput}
                                                    value={input.second_margin || ""}/>   
                                                <MDBInput
                                                    data-type="number"
                                                    name="third_margin"
                                                    label="Nivel 3"
                                                    onChange={handleInput}
                                                    value={input.third_margin || ""}/>  
                                                <MDBInput
                                                    data-type="number"
                                                    name="fourth_margin"
                                                    label="Nivel 4"
                                                    onChange={handleInput}
                                                    value={input.fourth_margin || ""}/>
                                                <MDBInput
                                                    data-type="number"
                                                    name="fifth_margin"
                                                    label="Nivel 5"
                                                    onChange={handleInput}
                                                    value={input.fifth_margin || ""}/>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBTabPane>
                                    <MDBTabPane tabId="4" role="tabpanel">
                                        <MDBRow>
                                            <MDBCol lg="12" md="12" sm="12" xs="12" className="provider-modal-input mt-4">
                                                <p className="recepcion-label">Describe detalladamente cómo se debe hacer la recepción</p>
                                                <MDBInput 
                                                    name="receptionRule"
                                                    group 
                                                    type="textarea"
                                                    onChange={handleInput} 
                                                    validate 
                                                    error="wrong"
                                                    success="right"
                                                    rows="2"
                                                    placeholder="Describe detalladamente cómo se debe hacer la recepción"
                                                    value={input.receptionRule || ""}/>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBTabPane>
                                    </MDBTabContent>
                            </React.Fragment>
                        }
                </MDBContainer>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn className="cancel-button" onClick={handleModal}>Cancelar</MDBBtn>
              <MDBBtn className="agreed-button" disabled={loading} onClick={() => {
                  if(mode === 'new_provider') {
                    addNewProvider()
                  }
                  else if(mode === 'get_provider') {
                    editProvider()
                  }
                  else if(mode === 'delete_provider') {
                    deleteProvider()
                  }
                }}>{
                    loading ?
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    :
                        mode === "delete_provider"
                            ? "Sí"
                            : "Guardar"
                }</MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
    )
}

export default ProviderModal