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


const WarehouseModalAdd = ({ open, handleModal, refreshTable }) => {    
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

    const addNewWarehouse = async () => {
        let errors = []

        if(!input.name) errors.push('El campo nombre no puede estar vacio')
        if(!levels.length) errors.push('Debe existir al menos un nivel por cada almacén')

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
                url: `${API_ENDPOINT}/api/v1/warehouse`,
                headers: HEADERS,
                data: {
                    name: input.name,
                    levels: levels
                }
            })

            if(result) {
                toastMessage('success', 'El almacén fue creado correctamente')
                handleModal()
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
        setInput({})
        setLevels([])
    }, [open])

    const addFloorLevel = () => {        
        let errors = new Array()

        if(!input.floor_name) errors.push('El campo nombre de nivel no puede estar vacio')
        if(!input.number_zones) errors.push('El campo numero de zonas no puede estar vacio')
        if(!Number.isInteger(parseInt(input.number_zones))) errors.push('El campo numero de zonas debe ser numerico')

        if(errors.length) {
            for(let i=0;i<errors.length; i++) {
                toastMessage('error', errors[i])
            }
            return
        }

        setLevels([
            ...levels,
            {floor_name: input.floor_name, number_zones: input.number_zones}
        ])
        setInput({
            ...input,
            floor_name: "",
            number_zones: ""
        })
        
    }

    const removeFloorLevel = (floorName) => {        
        const tmpLevels = levels.filter(l => l.floor_name !== floorName)
        setLevels([
            ...tmpLevels
        ])
    }

    return (
        <MDBContainer>
          <MDBModal isOpen={open} toggle={handleModal} size="lg" centered>
            <MDBModalHeader toggle={handleModal}>
                Nuevo almacén                    
            </MDBModalHeader>
            <MDBModalBody>
                <MDBContainer>                    
                    <MDBRow>
                        <MDBCol md="5">
                            <h5>Datos del almacén</h5>
                            <MDBInput 
                                label="Nombre del almacén"
                                name="name"
                                type="text"
                                onChange={handleInput}
                                value={input.name || ""}/>
                            
                            <h5>Niveles del almacén</h5>
                            <MDBInput
                                label="Nombre del nivel o piso"
                                name="floor_name"
                                type="text"
                                onChange={handleInput}
                                value={input.floor_name || ""}/>  

                            <MDBInput
                                label="Numero de zonas por piso o nivel"
                                name="number_zones"
                                type="text"
                                onChange={handleInput}
                                value={input.number_zones || ""}/>
                            
                            <MDBBtn size="sm" onClick={addFloorLevel}>Agregar</MDBBtn>
                        </MDBCol>
                        <MDBCol md="7">
                            <MDBTable responsive> 
                                <MDBTableHead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Cantidad</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {levels.map(l => (
                                            <tr>
                                                <td>{l.floor_name}</td>
                                                <td>{l.number_zones}</td>
                                                <td>
                                                    <MDBBtn 
                                                        size="sm" 
                                                        color="red" 
                                                        onClick={() => removeFloorLevel(l.floor_name)}>
                                                        X
                                                    </MDBBtn>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </MDBTableBody>
                            </MDBTable>
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

export default WarehouseModalAdd