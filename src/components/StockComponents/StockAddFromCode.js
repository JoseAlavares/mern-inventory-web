import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { toastMessage } from '../../utils/toast-functions'
import {
	MDBContainer,
	MDBModal,
	MDBModalHeader,
	MDBModalBody,
	MDBModalFooter,
	MDBBtn,
	MDBInput,
	MDBNav,
    MDBNavItem,
    MDBNavLink,
} from 'mdbreact'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { getPayloadToken } from '../../utils/functions'
import "react-datepicker/dist/react-datepicker.css"
import "./stock-styles.css"

const StockAddFromCode = ({warehouseId, childProductId, productBatchId, openModalCode, handleModalCode, refreshTable}) => {	
    const [warehouses, setWarehoueses] = useState([])
	const [zones, setZones] = useState([])
	const [zoneDetails, setZoneDetails] = useState([])
    const [tabSection, setTabSection] = useState(1)
    const [existsProduct, setExistsProduct] = useState(false)
	const [input, setInput] = useState({})
	const [fechaActive, setFechaActive] = useState(false)
    const [caducidadActive, setCaducidadActive] = useState(false)
    const [dataProduct, setDataProduct] = useState({})
	const [loading, setloading] = useState(false)
	const API_BACKEND = process.env.REACT_APP_API
    const HEADERS = {
        "Contet-Type": "application/json",
        "Authorization": `Bearer ${window.sessionStorage.getItem('access_token')}`
    }

	const handleInput = (event) => {
		const value = event.target.value
		setInput({
			...input,
			[event.target.name]: value
		})
    }
    
    const getWarehouses = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${API_BACKEND}/api/v1/warehouse`,
                headers: HEADERS
            })

            const {data: {data}} = result
            setWarehoueses(data.map(d => ({
                value: d.id,
                label: d.name
            })))
        } catch (err) {
            console.error(err.message)
            let level = "",
            msg = ""

            switch(parseInt(err.response.status)) {
                case 404:
                    level = "warning"
                    msg = "No existen almacenes"
                    break
                
                case 500:
                    level = "error"
                    msg = "Error en el servidor"
                    break

                default:
                    level = "error"
                    msg = "Error desconocido"
                    break
            }

            toastMessage(level, msg)
        }
    }

	const getZones = async (idWarehouse) => {
		try {
			const result = await axios({
				method: 'GET',
				url: `${API_BACKEND}/api/v1/warehouse-zones/${idWarehouse}`,
				headers: HEADERS
			})
			const {data: {data}} = result
			setZones(data.map(d =>({
				value: d.id,
				label: d.name
			})))
		} catch(err) {
			console.error(err.message)
			toastMessage(
				'error',
				'Ocurrio un error al obtener las bodegas'
			)
		}
	}

	const getZoneDetails = async (idZone) => {
		try {
			const result = await axios({
				method: 'GET',
				url: `${API_BACKEND}/api/v1/section/${idZone}`,
				headers: HEADERS
			})

			const {data: {data}} = result
			setZoneDetails(data.map(d => ({
				value: d.id,
				label: d.name
			})))
		} catch (err) {
			console.error(err.message)
			toastMessage(
				'error',
				'Ocurrio un problema al obtener las areas'
			)
		}
	}

	const handleSelectWarehouse = (obj) => {
		setInput({
			...input,
			id_warehouse: obj.value,
			name_warehouse: obj.label
		})

		getZones(obj.value)
	}

	const handleSelectZones = (obj) => {
		setInput({
			...input,
			id_zone: obj.value,
			name_zone: obj.label
		})

		getZoneDetails(obj.value)
	}

	const handleSelectZoneDetail = (obj) => {
		setInput({
			...input,
			id_zone_detail: obj.value,
			name_zone_detail: obj.label
		})
	}
	
	const addStock = async () => {
		let errors = new Array()

		if(!input.quantity) errors.push('El campo cantidad no puede estar vacio')
		if(!input.arrival_date) errors.push('El campo fecha de entrada no puede estar vacio')
		if(!input.id_zone_detail) errors.push('El campo area no puede estar vacio')
		
		if(!dataProduct.id_child_product)
			throw new Error('El producto hijo no existe')		

		if(errors.length) {
			for(let i=0;i<errors.length;i++) {
				toastMessage('warning', errors[i])
			}
			return
		}

		input.id_child_product = dataProduct.id_child_product	

		setloading(true)
		try {
			const result = await axios({
				method: 'POST',
				url: `${API_BACKEND}/api/v1/inventory`,
				headers: HEADERS,
				data: input
			})

			if(!result) {
				toastMessage('warning', 'Ocurrio un problema')
				return
			}

			toastMessage('success', 'La información fue guardada correctamente')
			handleModalCode()
			refreshTable()								
		} catch (err) {
			console.error(err.message)
			toastMessage('error', 'Ocurrio un error')
		}
		setloading(false)
    }
    
    const searchBycode = async () => {
        try{
            const result = await axios({
                method: 'GET',
                url: `${API_BACKEND}/api/v1/child/product/${input.product_code}`,
                headers: HEADERS
            })

            const {data: {data}} = result

            if(data) {
                setDataProduct({
                    id_child_product: data.id,
                    name: data.name,
                    thumbnail: data.imageThumbnail
                })

                setExistsProduct(true)

            }
        } catch(err) {
            console.error(err.message)
            let level = "",
            msg = ""

            switch(parseInt(err.response.status)) {
                case 404:
                    level = "warning"
                    msg = "El producto no existe"
                    break
                case 500:
                    level = "error"
                    msg = "Error en el servidor"
                    break
                default:
                    level = "error"
                    msg = "Error desconocido"
                    break
            }

            toastMessage(level, msg)
        }
    }

	useEffect(() => {		
		setInput({})
        setTabSection(1)
        setDataProduct({})
        setExistsProduct(false)

		if(openModalCode) {
			setInput({
				...input,
				//warehouse_id: warehouseId,
				//child_id: childProductId,
				//inventory_id: productBatchId,
				user_id: getPayloadToken().sub
			})
			getWarehouses()
			setFechaActive(false)
			setCaducidadActive(false)
		} 		
	}, [openModalCode])

	return (
		<MDBContainer>
			<MDBModal isOpen={openModalCode} toggle={handleModalCode} centered>
				<MDBModalHeader toggle={handleModalCode}>
					Entrada
				</MDBModalHeader>
				<MDBModalBody>
					<MDBContainer>
						<MDBNav className="nav-tabs nav-justified">
							<MDBNavItem>
								<MDBNavLink to="#!" onClick={() => setTabSection(1)}>
									<small>Datos generales</small>
								</MDBNavLink>
							</MDBNavItem>
							<MDBNavItem>
								<MDBNavLink to="#!" onClick={() => setTabSection(2)}>
									<small>Ubicación</small>
								</MDBNavLink>
							</MDBNavItem>
						</MDBNav>
						{tabSection === 1 &&
						<Fragment>
							<MDBInput
                                name="product_code"
								label="Codigo de barras"
								onChange={handleInput}
								value={input.product_code || ""}/>
                            <MDBBtn size="sm" onClick={searchBycode}>
                                Buscar
                            </MDBBtn>
                            {existsProduct === true &&
                            <Fragment>
                                <div style={{margin: 20, display: "flex"}}>                                    
                                    <img 
                                        src={dataProduct.thumbnail || ""} 
                                        alt={dataProduct.name} 
                                        width="100" 
                                        height="100"
                                        style={{marginRight: 10}}/>
                                    <h5>
                                        {dataProduct.name || ""}
                                    </h5>
                                </div>
                                
                                <MDBInput
                                    label="Cantidad"
                                    onChange={handleInput}
                                    name="quantity"
                                    value={input.quantity || ""}/>

                                <div className="custom-md-form">
                                    <label className={fechaActive === true ? "date-label active" : "date-label"}>Fecha</label>
                                    <DatePicker
                                        selected={input.arrival_date || ""}
                                        onChange={date => setInput({...input, arrival_date: date})}
                                        onFocus={()=> setFechaActive(true)}
                                        onBlur={()=> 
                                            input["arrival_date"] !== undefined ? setFechaActive(true) : setFechaActive(false)
                                        }
                                        minDate={new Date()}
                                        className="date-picker"
                                        // placeholderText="Fecha de entrada"
                                    />
                                </div>
                                <div className="custom-md-form">
                                    <label className={caducidadActive === true ? "date-label active" : "date-label"}>Caducidad</label>
                                    <DatePicker
                                        selected={input.expiration_date || ""}
                                        onChange={date => setInput({...input, expiration_date: date})}
                                        onFocus={()=> setCaducidadActive(true)}
                                        onBlur={()=> 
                                            input["expiration_date"] !== undefined ? setCaducidadActive(true) : setCaducidadActive(false)
                                        }
                                        minDate={new Date()}
                                        className="date-picker"
                                    />	
                                </div>					

                                <MDBInput
                                    onChange={handleInput}
                                    label="Precio de compra"
                                    name="purchase_cost"
                                    value={input.purchase_cost || ""}/>
                            </Fragment>
                            }
						</Fragment>}
						
						{tabSection === 2 &&
						<Fragment>
							<label>Almacén</label>
							<Select
								options={warehouses}
								onChange={handleSelectWarehouse}
								value={
									input.id_warehouse
									? {value: input.id_warehouse, label: input.name_warehouse}
									: null
								}/>

							<label>Bodega</label>
							<Select
								options={zones}
								onChange={handleSelectZones}
								value={
									input.id_zone 
									? {value: input.id_zone, label: input.name_zone}
									: null
								}/>
							
							<label>Area</label>
							<Select
								options={zoneDetails}
								onChange={handleSelectZoneDetail}
								value={
									input.id_zone_detail 
									? {value: input.id_zone_detail, label: input.name_zone_detail}
									: null
								}/>
						</Fragment>}
					</MDBContainer>
				</MDBModalBody>
				<MDBModalFooter>
					<MDBBtn className="cancel-button" onClick={handleModalCode}>
						Cancelar
					</MDBBtn>
					<MDBBtn className="agreed-button" onClick={addStock} disabled={loading}>
						{loading 
						? 
							<div className="spinner-border text-success" role="status">
								<span className="sr-only">Loading...</span>
							</div>
						: 
							"Agregar"
						}
					</MDBBtn>
				</MDBModalFooter>
			</MDBModal>
		</MDBContainer>		
	)
}

export default StockAddFromCode
