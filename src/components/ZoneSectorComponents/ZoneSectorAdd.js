import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toastMessage } from '../../utils/toast-functions'
import {
	MDBContainer,
    MDBModal,
    MDBCol,
    MDBRow,
	MDBModalHeader,
	MDBModalBody,
	MDBModalFooter,
	MDBBtn,
    MDBInput,
    MDBTable,
    MDBTableHead,
    MDBTableBody   
} from 'mdbreact'
import Select from 'react-select'
import { toast } from 'react-toastify'

let counter = 1

const ZoneSectorAdd = ({ idWarehouse, openAdd, handleModalAdd, refreshTable}) => {
        
    let numbers = new Array()    
    const [coincidenceData, setCoincidenceData] =  useState({
        message: '',
        show: false
    })
    const [loading, setLoading] = useState(false)
    const [zones, setZones] = useState([])
    const [dataGrid, setDataGrid] = useState([])
    const [input, setInput] = useState({})
    const [idZone, setIdZone] = useState(null)
	const API_BACKEND = process.env.REACT_APP_API
    const HEADERS = {
        "Contet-Type": "application/json",
        "Authorization": `Bearer ${window.sessionStorage.getItem('access_token')}`
    }	

    const letters = [
        {value: 'A', label: 'A'}, 
        {value: 'B', label: 'B'}, 
        {value: 'C', label: 'C'}, 
        {value: 'D', label: 'D'}, 
        {value: 'E', label: 'E'}, 
        {value: 'F', label: 'F'}, 
        {value: 'G', label: 'G'}, 
        {value: 'H', label: 'H'}, 
        {value: 'I', label: 'I'}, 
        {value: 'J', label: 'J'}, 
        {value: 'K', label: 'K'}, 
        {value: 'L', label: 'L'}, 
        {value: 'M', label: 'M'}, 
        {value: 'N', label: 'N'}, 
    ]
    
    for(let i=1;i<=30;i++) {
        numbers.push({value: i, label: i.toString()})
    }

    const SectorRow = ({number, name, id}) => {        
        var record

        if(id && (typeof id) === "number")
            record = id
        else
            record = name

        return (
            <tr>
                <td>{number}</td>
                <td>{name}</td>
                <td>
                    <MDBBtn 
                        size="sm"
                        color="danger"
                        onClick={() => removeRow(record)}>
                        X
                    </MDBBtn>
                </td>
            </tr>
        )
    }

	const handleInput = (event) => {
		const value = event.target.value
		setInput({
			...input,
			[event.target.name]: value
		})
	}	

	useEffect(() => {		
		setInput({})		
        setDataGrid([])
        if(counter > 1) {
            counter=1
        }

		if(openAdd) {
            getZones()
            //getZoneSector()
			setInput({
				...input,			
			})			
		} 		
    }, [openAdd])
    
    const addNewSections = async () => {
        if(!dataGrid.length) {
            setCoincidenceData({
                ...coincidenceData,
                message: 'Debe existir al menos una sección',
                show: true
            })

            setInterval(() => setCoincidenceData({
                show: false
            }), 2000)

            return
        }

        try {
            const result = await axios({
                method: 'POST',
                url: `${API_BACKEND}/api/v1/section`,
                headers: HEADERS,
                data: {
                    id_zone: input.id_zone,
                    fields: dataGrid.filter(data => data.new === true)
                }
            })

            if(!result) {
                setCoincidenceData({
                    ...coincidenceData,
                    message: 'Ocurrio un problema'
                })
            }

            toastMessage('success', 'La información fue guardada correctamente')
            handleModalAdd()
            refreshTable()
        } catch (err) {
            console.error(err.message)
            toastMessage('error', 'Ocurrio un error')
        }
    }

    const deleteRecord = async (record) => {
        //the record is the id in the database
        const id = record
        try {
            const result = await axios({
                url: `${API_BACKEND}/api/v1/section/${id}`,
                method: 'PUT',
                headers: HEADERS 
            })

            setDataGrid(dataGrid.filter(d => d.id !== id))
            toastMessage('success', 'El area fue eliminada correctamente')
        } catch (err) {
            console.error(err.message)
            if(err.response.status === 500) {
                toastMessage('error', 'Ocurrio un error')
            }
            else if(err.response.status === 404) {
                toastMessage('error', 'Esta area no existe')
            }
            else if(err.response.status === 422) {
                toastMessage('error', 'Existen campos vacios en el formulario')
            }
        }
    } 

    const removeRow = async (record) => {
        if((typeof record) === "number")
            await deleteRecord(record)
        else if((typeof record) === "string")
            setDataGrid(dataGrid.filter(item => item.name !== record))
        else
            throw new Error("El parametro pasado a la función debe ser string o numerico")
    }

    const addSection = () => {
        const coincidence = dataGrid
            .filter(item => item.name === `${input.letter}${input.number}`)

        if(coincidence.length) {
            setCoincidenceData({
                ...coincidenceData,
                message: 'No pueden existir dos secciones con el mismo nombre',
                show: true
            })
            
            setInterval(() => setCoincidenceData({
                ...coincidenceData,
                show: false,                
            }), 1800)

            return
        }

        const section = {
            number: counter++,
            name: `${input.letter}${input.number}`,
            id: counter,
            new: true
        }
        

        setDataGrid([
            ...dataGrid,
            section
        ])
    }

    const handleSelectLetter = (obj) => {
        setInput({
            ...input,
            letter: obj.value
        })
    }

    const handleSelectNumber = (obj) => {
        setInput({
            ...input,
            number: obj.value
        })
    }

    const handleSelectZones = (obj) => {
        getZoneSector(obj.value)
        setInput({
            ...input,
            id_zone: obj.value,
            zone_name: obj.label
        })
    }

    const getZones = async () => {
        try {
            if(idWarehouse) {
                const result = await axios({
                    method: 'GET',
                    url: `${API_BACKEND}/api/v1/warehouse-zones/${idWarehouse}`,
                    headers: HEADERS
                })

                const {data: {data}} = result
                setZones(data.map(d => ({
                    value: d.id,
                    label: d.name
                })))
            }
        } catch (err) {
            console.error(err.response)
            toastMessage('error', 'Ocurrio un error')
        }
    }

    const getZoneSector = async (id) => {
        try {
            if(id) {
                const result = await axios({
                    url: `${API_BACKEND}/api/v1/section/${id}`,
                    method: 'GET',
                    headers: HEADERS
                })

                const {data: {data}} = result                
                const sectors = data.map(s => ({
                    id: s.id,
                    name: s.name,
                    number: counter++
                }))

                setDataGrid([
                    ...dataGrid,
                    ...sectors
                ])
            }            
        } catch (err) {
            console.error(err.message)
            if(err.response && err.response.status === 500) {
                toastMessage('error', 'Ocurrio un error favor de comunicarse a soporte tecnico')
            }
            else if(err.response && err.response.status === 422) {
                toastMessage('error', 'Existen campos vacios en el formulario')
            }

            setDataGrid([])
        }
    }

	return (
		<MDBContainer>
          <MDBModal isOpen={openAdd} toggle={handleModalAdd} centered size="lg" >
            <MDBModalHeader toggle={handleModalAdd}>
                 Nueva section
            </MDBModalHeader>
            <MDBModalBody className="">
                <MDBContainer>                
                    <MDBRow>                        
                        <MDBCol lg="4" md="4" sm="4" xs="4">
                            <label>Bodega</label>
                            <Select
                                options={zones}
                                onChange={handleSelectZones}
                                value={input.id_zone ? {value: input.id_zone, label: input.zone_name} : null}
                                />

                            <label>Letra</label>
                            <Select
                                label="Caracter"
                                options={letters}
                                onChange={handleSelectLetter}
                                value={input.letter ? {value: input.letter, label: input.letter} : null}
                                />

                            <label>Numero</label>
                            <Select
                                label="Numero"
                                options={numbers}
                                onChange={handleSelectNumber}
                                value={input.number ? {value: input.number, label: input.number} : null}
                                />
                            
                            <MDBInput
                                label="Capacidad"
                                name="capacity"
                                type="text"
                                value={input.capacity || ""}
                                onChange={handleInput}
                                />
                            
                            {
                                coincidenceData.show
                                ? 
                                <label style={{color: 'red', fontSize: 10}}>
                                    {coincidenceData.message}
                                </label> 
                                :
                                null
                            }
                            <MDBBtn onClick={addSection}>Agregar</MDBBtn>
                        </MDBCol>
                        <MDBCol lg="8" md="8" sm="8" xs="8">
                            <MDBTable responsive>
                                <MDBTableHead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {
                                        dataGrid.map(d => (
                                            <SectorRow 
                                                key={d.number}
                                                id={d.id} 
                                                name={d.name} 
                                                number={d.number}/>
                                        ))
                                    }
                                </MDBTableBody>
                            </MDBTable>
                        </MDBCol>
                    </MDBRow>                        
                        
                </MDBContainer>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn className="cancel-button" onClick={handleModalAdd}>Cancelar</MDBBtn>
              <MDBBtn className="agreed-button" disabled={loading} onClick={addNewSections}>
              {
                    loading ?
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    :
                        "Guardar"
                }</MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>	
	)
}

export default ZoneSectorAdd
