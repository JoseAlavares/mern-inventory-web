import React, { useState, useEffect } from 'react'
import {
    MDBModal,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn,
    MDBInput,
} from 'mdbreact'
import { toastMessage } from '../../utils/toast-functions'
import { getPayloadToken } from '../../utils/functions'
import axios from 'axios'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import "./stock-styles.css"

const StockExit = ({ childProductId, warehouseId, openModalExit, handleModalExit, refreshTable }) => {
    const [input, setInput] = useState({})
    const [batches, setBatches] = useState([])
    const [loading, setLoading] = useState(false)
    const [fechaActive, setFechaActive] = useState(false)
    const [radio, setRadio] = useState(1)
    const [show, setShow] = useState('none')
    const API_BACKEND = process.env.REACT_APP_API
    const HEADERS = {
        "Contet-Type": "application/json",
        "Authorization": `Bearer ${window.sessionStorage.getItem('access_token')}`
    }

    const getBatches = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${API_BACKEND}/api/v1/batch/${childProductId}/${warehouseId}`,
                headers: HEADERS
            })

            if(!result) {
                toastMessage('warning', 'Ocurrio un problema con los lotes')
                return
            }

            const {data: {data}} = result
            setBatches(data.map(d => ({value: d.id, label: d.batchCode})))
        } catch (err) {
            console.error(err.message)
            //toastMessage('error', 'Ocurrio un error con los lotes')
        }
    }

    const handleInput = (event) => {
        const value = event.target.value
        const name = event.target.name

        setInput({
            ...input,
            [name]: value
        })
    }
   
    const handleSelectBatches = (obj) => {
        setInput({
            ...input,
            batch_id: obj.value,
            batch_name: obj.label
        })

    }

    const handleRabioBtn = (value) => {
        setRadio(value)
        setInput({
            ...input,
            movement_id: value
        })
    }

    const exitProduct = async () => {
        //console.log(input)
        let errors = new Array()
        
        if(!input.batch_id) errors.push('El campo lote no puede estar vacio')
        if(!input.movement_id) errors.push('El campo tipo de operación no puede estar vacio')
        if(!input.quantity) errors.push('El campo cantidad no puede estar vacio')
        if(!parseFloat(input.quantity)) errors.push('El campo cantidad debe ser numerico')
        if(!input.operation_date) errors.push('El campo fecha no puede estar vacio')

        if(errors.length) {
            for(let i=0;i<errors.length;i++) {
                toastMessage('error', errors[i])
            }
            return
        }
        
        setLoading(true)
        try {
            const result = await axios({
                method: 'POST',
                url: `${API_BACKEND}/api/v1/exit-product`,
                headers: HEADERS,
                data: input
            })

            if(!result) {
                toastMessage('warning', 'Ocurrio u problem en la salida de product')
                return
            }

            toastMessage('success', 'La información fue guardada correctamente')
            handleModalExit()
            refreshTable()
                      
        } catch (err) {
            console.error(err.message)

            if(err.response.status === 404) {
                toastMessage('error', 'El recurso no existe')    
            }
            else if(err.response.status === 422) {
                toastMessage('error', 'Existen campos vacios en el cuerpo de la solicitud')
            }
            else if(err.response.status === 424) {
                toastMessage('error', 'La cantidad deseada excede la cantidad real del lote, verifica la cantidad a retirar')
            }
            else if(err.response.status === 500) {
                toastMessage('error', 'Ocurrio un error')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(openModalExit) {
            setInput({
                //...input,
                user_id: getPayloadToken().sub
            })
            setFechaActive(false)
            getBatches()
        }
    }, [openModalExit])

    return (
        <MDBModal isOpen={openModalExit} toggle={handleModalExit} centered>
            <MDBModalHeader toggle={handleModalExit}>Salida</MDBModalHeader>
            <MDBModalBody>
                <div className="custom-md-form">
					<label className={fechaActive === true ? "date-label active" : "date-label"}>Fecha</label>
					<DatePicker
						selected={input.operation_date || ""}
                        onChange={date => setInput({...input, operation_date: date})}
						onFocus={()=> setFechaActive(true)}
						onBlur={()=> 
							input["operation_date"] !== undefined ? setFechaActive(true) : setFechaActive(false)
						}
						minDate={new Date()}
						className="date-picker"
						// placeholderText="Fecha de entrada"
					/>
				</div>
                <label className="lote-label">Lote</label>
                <Select
                    onChange={handleSelectBatches}
                    options={batches}
                    value={
                        (input.batch_id)
                        ? {value: input.batch_id, label: input.batch_name} 
                        : null}/>

                <MDBInput
                    name="quantity"
                    onChange={handleInput}
                    value={input.quantity}
                    label="Cantidad"/>
                
                <label className="motivo-label">Motivo</label>
                <MDBInput
                    name="movement_id" 
                    checked={radio === 4 ? true: false}
                    onChange={() => {handleRabioBtn(4)}}
                    gap 
                    size="sm" 
                    type="radio"
                    className="motivo-radio-buttons"
                    label="El producto expiró"/>
                <MDBInput
                    name="movement_id"           
                    checked={radio === 5 ? true: false}
                    onChange={() => {
                        handleRabioBtn(5)
                        setShow('none')
                    }}
                    gap 
                    size="sm" 
                    type="radio"
                    className="motivo-radio-buttons"
                    label="Merma"/>
                <MDBInput 
                    name="movement_id" 
                    checked={radio === 6 ? true: false}
                    onChange={() => {
                        handleRabioBtn(6)
                        setShow('none')
                    }}
                    gap 
                    size="sm" 
                    type="radio"
                    className="motivo-radio-buttons"
                    label="Mercancia defectuosa"/>
                <MDBInput
                    name="movement_id"
                    checked={radio === 7 ? true: false}   
                    onChange={() => {
                        handleRabioBtn(7)
                        setShow('none')
                    }}
                    gap 
                    size="sm" 
                    type="radio"
                    className="motivo-radio-buttons"
                    label="Venta"/>
                <MDBInput
                    name="movement_id"
                    checked={radio === 8 ? true: false}   
                    onChange={() => {
                        handleRabioBtn(8)
                        setShow('block')
                    }}                   
                    gap 
                    size="sm" 
                    type="radio"
                    className="motivo-radio-buttons"
                    label="Otro"/>
                <div style={{display: show}}>
                    <MDBInput
                        onChange={handleInput}
                        name="motive"
                        value={input.reason}
                        label="Motivo"/>
                </div>
                
                    
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn className="cancel-button" onClick={handleModalExit}>Cancelar</MDBBtn>
                <MDBBtn className="agreed-button" onClick={exitProduct} disabled={loading}>
                    {loading
                        ?
                            <div className="spinner-border text-success" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        :
                            "Guardar"
                    }
                </MDBBtn>
            </MDBModalFooter>
        </MDBModal>
    )
}

export default StockExit