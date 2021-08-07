import React, { useState, useEffect, Fragment } from 'react'
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
    MDBProgress,
} from 'mdbreact'
import Slider from 'react-input-slider'
import './ProductModal.css'
import axios, { post, put } from 'axios'
import { toastMessage } from '../../utils/toast-functions'
import Select from 'react-select'
let file

const ProductModal = ({ mode, open, handleModal, id, refreshTable }) => {
    const [providers, setProviders] = useState({})
    const [sectors, setSectors] = useState({})
    const [categories, setCategories] = useState([])
    const [idSector, setIdSector] = useState(null)
    const [fileName, setFileName] = useState('Selecciona una imagen .png')
    const [progressFile, setProgressFile] = useState(0)
    const [input, setInput] = useState({})    
    const [loading, setLoading] = useState(false)
    const API_ENDPOINT = `${process.env.REACT_APP_API}`
    const TOKEN = window.sessionStorage.getItem('access_token')
    const HEADERS  = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
    }
    const config = {
        headers: HEADERS,
        onUploadProgress: function(e){
            console.log(Math.round((100 * e.loaded) / e.total))
            setProgressFile(Math.round((100 * e.loaded) / e.total))            
        }
    }

    const handleInput = (event) => {
        console.log(event.target.name)
        const value = event.target.value;
        setInput({
            ...input,
            [event.target.name]: value
        })
    }

    const getFile = (e) => {
        file = e.target.files[0]
        setFileName(file.name)
        const extension = file.type

        if(!["image/png"].includes(extension)) {
            toastMessage('error', 'El formato de la imagen debe ser .png')
            return
        }

        if(file.size / (1024 * 1024) >= 20) {
            toastMessage('error', 'El tamaño de la imagen es mayor a 20 MB')
            return
        }
    }

    const addNewProduct = async () => {
        let formData = new FormData()
        let errors = []

        if(!input.name) errors.push('El campo nombre no puede estar vacio')
        if(!input.sku) errors.push('El campo SKU no puede estar vacio')
        if(!input.product_code) errors.push('El campo codigo de producto no puede estar vacio')        
        if(!input.provider_id) errors.push('El campo proveedor no puede estar vacio')        

        if(errors.length) {
            for(let i=0; i<errors.length; i++) {               
                toastMessage('error', errors[i])
            }
            return
        }

        if(!file) {
            toastMessage('error', 'Favor de adjuntar una imagen .png del producto')
        }

        setLoading(true)

        formData.append('name', input.name)
        formData.append('sku', input.sku)
        formData.append('product_code', input.product_code)
        formData.append('provider_id', input.provider_id)
        formData.append('category_id', input.category_id)
        formData.append('first_margin', input.firstProfitMargin)
        formData.append('first_quantity', input.firstQuantityProduct)
        formData.append('second_margin', input.secondProfitMargin)
        formData.append('second_quantity', input.secondQuantityProduct)
        formData.append('third_margin', input.thirdProfitMargin)
        formData.append('third_quantity', input.thirdQuantityProduct)
        formData.append('fourt_margin', input.fourtProfitMargin)
        formData.append('fourt_quantity', input.fourtQuantityProduct)
        formData.append('reception_rule', input.receptionRule)
        formData.append('time_life', input.timeOfLifeRequired)
        formData.append('min_stock', input.minumumStock)
        formData.append('suggest_amount', input.minumumStock)
        formData.append('image-s3', file)        

        try {
            const result = await post(`${API_ENDPOINT}/api/v1/product`, formData, config)
            
            if(result) {               
                toastMessage('success', 'El sector fue creado correctamente')
                handleModal()
                refreshTable()
            }
            else {
                toastMessage('error', 'Ocurrio un error')
            }
            
        } catch (err) {
            toastMessage('error', err.response.data.message)
        }
        setLoading(false)
        setProgressFile(0)
    }

    const editProduct = async () => {
        let formData = new FormData()
        let errors = []

        if(!input.name) errors.push('El campo nombre no puede estar vacio')
        if(!input.sku) errors.push('El campo SKU no puede estar vacio')
        if(!input.product_code) errors.push('El campo codigo de producto no puede estar vacio')        
        if(!input.provider_id) errors.push('El campo proveedor no puede estar vacio')        

        if(errors.length) {
            for(let i=0; i<errors.length; i++) {               
                toastMessage('error', errors[i])
            }
            return
        }

        setLoading(true)

        formData.append('id', id)
        formData.append('name', input.name)
        formData.append('sku', input.sku)
        formData.append('product_code', input.product_code)
        formData.append('category_id', input.category_id)
        formData.append('provider_id', input.provider_id)

        if(file){
            formData.append('image-s3', file)
        }

        try {
            const result = await put(`${API_ENDPOINT}/api/v1/product`, formData, config)
            
            if(result) {               
                toastMessage('success', 'La información fue actualizada')
                refreshTable()
                handleModal()                
            }
        } catch (error) {           
            toastMessage('error', 'Ocurrio un error')
        }

        setLoading(false)
        setProgressFile(0)
    }

    const deleteProduct = async () => {
        try {
            setLoading(true)
            
            const result = axios({
                method: 'PUT',
                url: `${API_ENDPOINT}/api/v1/product/${id}`,
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
        file = null   
        if(mode && open === true) {
            handleRequest()
            getProviders()
            getSectors()
        }

        setFileName('Selecciona una imagen .png')
        setInput({
            'id': '',
            'name': '',            
            'sku': '',
            'product_code': '',
            'provider_id': '',
            'provider_name': '',
            'sector_id': '',
            'sector_name': '', 
            'category_id': '',
            'category_name': '',               
            'image': '',               
        })
    }, [mode, open])

    const handleRequest = async () => {
        let dataRequest = {}

        if(mode === 'new_product') {
            dataRequest = {
                method: 'POST',
                url: `${API_ENDPOINT}/api/v1/product`,
                headers: HEADERS,
                data: {
                    name: input.name,
                    address: input.sku,
                    email: input.email,
                    telephone: input.telephone,
                    contactName: input.contactName,
                }
            }
        }
        else if(mode === 'get_product'){
            dataRequest = {
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/product/${id}`,
                headers: HEADERS
            }
        }

        if(mode === 'get_product') {
            try {
                const result = await axios(dataRequest)
                const { data: { data } } = result
                        
                setInput({
                    'id': data.id,
                    'name': data.name,            
                    'sku': data.sku,
                    'product_code': data.productCode,
                    'provider_id': data.Provider.id,
                    'provider_name': data.Provider.name,
                    'sector_id': data.ProductCategory.Sector.id,
                    'sector_name': data.ProductCategory.Sector.name, 
                    'category_id': data.ProductCategory.id,
                    'category_name': data.ProductCategory.name,
                    'image': data.image,            
                })

            } catch(err) {
                console.error(err)                
                //toastMessage('error', err.message)
            }
        }
    }

    const handleSelectProvider = (obj) => {
        setInput({
            ...input,
            'provider_id': obj.value,
            'provider_name': obj.label
        })
        
    }

    const handleSelectSector = (obj) => {        
        setIdSector(obj.value)
        setInput({
            ...input,
            'sector_id': obj.value,
            'sector_name': obj.label
        })
        getCategories(obj.value)
    }

    const handleSelectCategory = (obj) => {
        setInput({
            ...input,
            'category_id': obj.value,
            'category_name': obj.label,

        })
    }

    const getProviders = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/provider`,
                headers: HEADERS
            })

            if(result) {
                console.log(result)
                const {data: { data } } = result
                setProviders(data.map(r => {
                    return {
                        value: r.id,
                        label: r.name
                    }
                }))
                return
            }

            toastMessage('error', 'Ocurrio un error')
        } catch (err) {
            toastMessage('error', err.message)
        }
    }

    const getSectors = async () => {
        try {
            const sectors = await axios({
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/sector`,
                headers: HEADERS
            })

            if(sectors) {
                const { data: { data } } = sectors
                setSectors(data.map(d => { return {value: d.id, label: d.name}}))
                return
            }

            toastMessage('error', 'Error 404')
            return
        } catch (err) {
            toastMessage('error', err.response.data.message)            
        }
    }

    const getCategories = async (id) => {
        if(!id) {
            //throw new Error('Error parameter exception')
            console.error('error')
            return
        }

        try {
            const result = await axios({
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/categories-by-sector/${id}`,
                headers: HEADERS
            })

            if(result) {
                const {data: {data}} = result
                setCategories(data.map(d => {
                    return {value: d.id, label: d.name}
                }))
                return
            }

            toastMessage('error', 'Error 404')
        } catch (err) {
            toastMessage('error', err.message)
        }
    }

    const handleSlider = (obj, name) => {
        setInput({
            ...input,
            [name]: obj.x
        })
    }

    return (
        <MDBContainer>
          <MDBModal isOpen={open} toggle={handleModal} size="fluid">
            <MDBModalHeader toggle={handleModal}>
                {mode === 'new_product' 
                    ?
                        "Nuevo producto"
                    :
                        "Editar producto"
                } 
            </MDBModalHeader>
            <MDBModalBody>
                <MDBContainer fluid>
                    <MDBRow>
                        {mode === 'delete_product' 
                        ?
                            <h4>¿Esta seguro que desea desactivar este producto?</h4>
                        :
                                    <MDBCol md="12">
                                        <h4>Identificadores</h4>
                                        <br/>
                                        <div className="d-flex flex-row">
                                            <MDBInput 
                                                className="p-2"
                                                label="SKU"
                                                name="sku"                                             
                                                type="text"
                                                onChange={handleInput} 
                                                validate 
                                                error="wrong"
                                                success="right"
                                                value={input.sku || ""}/>                            
                                            <MDBInput 
                                                className="p-2"
                                                label="Codigo de producto"
                                                name="product_code"                                             
                                                type="text"
                                                onChange={handleInput} 
                                                validate 
                                                error="wrong"
                                                success="right"
                                                value={input.product_code || ""}/>
                                            <MDBInput 
                                                className="p-2"
                                                label="Nombre"
                                                name="name"                                             
                                                type="text"
                                                onChange={handleInput}
                                                value={input.name || ""}/>  
                                        </div>
                                    </MDBCol>                                                                   
                        }
                    </MDBRow>
                    <MDBRow>                        
                        <MDBCol md="12">
                            <h4>Datos generales</h4>
                            <div className="d-flex">                                                             
                                                                
                                <div className="wrapper">                                
                                    <label>Unidade de medida</label>
                                    <Select
                                        options={[
                                            {value: 1, label: 'Litro'}
                                        ]}
                                        placeholder="Seleccione una opción"
                                        name="measurementId"
                                        value={(input.measurement_id) ? {value: input.measurement_id, label: input.measurement_name}: null}/>
                                </div>                                                               
                                <div className="wrapper">                                    
                                    <MDBInput
                                        label="Description"
                                        name="description"
                                        type="textarea"
                                        rows="2"
                                        value={input.description}
                                        onChange={handleModal}/>
                                </div>
                                <div className="wrapper">
                                    <label>Sector</label>
                                    <Select
                                        onChange={handleSelectSector}
                                        options={sectors}
                                        placeholder="Seleccione una opción"
                                        value={(input.sector_id) ? {value: input.sector_id, label: input.sector_name} : null}/>
                                </div>
                                <div className="wrapper">
                                    <label>Proveedor</label>
                                    <Select
                                        onChange={handleSelectProvider}
                                        options={providers}                                        
                                        placeholder="Seleccione una opción"
                                        name="provider"
                                        value={(input.provider_id) ? {value: input.provider_id, label: input.provider_name}: null}/>
                                </div>
                            </div>
                        </MDBCol>
                    </MDBRow>
                            <div className="d-inline-flex div-width">
                                <MDBInput
                                    type="text"
                                    name="timeOfLifeRequired"
                                    label="tiempo de vida requerido"
                                    value={input.timeOfLifeRequired}
                                    onChange={handleInput}/>        
                                <MDBInput
                                    type="text"
                                    name="minumumStock"
                                    label="Stock minimo requerido"
                                    value={input.minumumStock}
                                    onChange={handleInput}/>
                                <MDBInput
                                    type="text"
                                    name="suggestedPurchaseAmount"
                                    label="Compra de dantiadd de producto sugerida"
                                    value={input.suggestedPurchaseAmount}
                                    onChange={handleInput}/>
                                <div className="">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroupFileAddon01">
                                        Upload
                                        </span>
                                    </div>
                                    <div className="custom-file">
                                        <input
                                        type="file"
                                        className="custom-file-input"
                                        id="inputGroupFile01"
                                        aria-describedby="inputGroupFileAddon01"
                                        onChange={getFile}
                                        />
                                        <label className="custom-file-label" htmlFor="inputGroupFile01">
                                        {fileName}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <br/>                                  
                            
                                
                            <br/>  
                            <Select
                                options={[
                                    {value: 1, label: 'Pequeño'},
                                    {value: 1, label: 'Mediano'},
                                    {value: 1, label: 'Grande'},
                                ]}/>
                            <MDBInput
                                type="text"
                                label="Sabor"
                                name="flavor"
                                onChange={handleInput}/>
                            
                            <br/>
                            <Select
                                onChange={handleSelectCategory}
                                options={categories}
                                placeholder="Categoria"
                                name="category"
                                value={(input.category_id) ? {value: input.category_id, label: input.category_name} : null}/>                                    

                        {mode === 'get_product' &&
                            <img height="200px" width="200px" src={input.image}/>
                        }  
                    
                    <MDBRow>
                        <h4>Agregar existencia(opcional)</h4>
                    </MDBRow>
                    <MDBRow>
                        <h4>Margenes de utilidad</h4>
                        <MDBCol sm="12" md="12">
                            <div>
                                <label>Margen de ganancia nivel 1: {input.firstProfitMargin || 0}%</label><br/>
                                <Slider
                                    min={0}
                                    max={100}
                                    name="firstProfitMargin"
                                    axis="x"
                                    x={input.firstProfitMargin || 0}
                                    onChange={(obj) => handleSlider(obj, 'firstProfitMargin')}/>
                            </div>
                        </MDBCol>
                    </MDBRow>                 
                </MDBContainer>                
            </MDBModalBody>
            <MDBProgress value={progressFile}/>
            <MDBModalFooter>
              <MDBBtn color="secondary" className="rounded-btn" onClick={handleModal}>Cerrar</MDBBtn>
              <MDBBtn color="primary" className="rounded-btn" disabled={loading} onClick={() => {
                  if(mode === 'new_product') {
                    addNewProduct()
                  }
                  else if(mode === 'get_product') {
                    editProduct()
                  }
                  else if(mode === 'delete_product') {
                    deleteProduct()
                  }
                }}>{
                    loading 
                    ?
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

    /*return(
        <MDBContainer>
        <MDBBtn onClick={handleModal}>MDBModal</MDBBtn>
        <MDBModal isOpen={open} toggle={handleModal}>
          <MDBModalHeader toggle={handleModal}>MDBModal title</MDBModalHeader>
          <MDBModalBody>
            <MDBContainer fluid className="text-white">
              <MDBRow>
                <MDBCol md="4" className="bg-info">.col-md-4</MDBCol>
                <MDBCol md="4" className="ml-auto bg-info">.col-md-4 .ml-auto</MDBCol>
              </MDBRow>
              <br />
              <MDBRow>
                <MDBCol md="3" className="ml-auto bg-info">.col-md-3 .ml-auto</MDBCol>
                <MDBCol md="2" className="ml-auto bg-info">.col-md-2 .ml-auto</MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md="6" className="ml-5 bg-info">.col-md-6 .ml-5</MDBCol>
              </MDBRow>
              <br />
              <MDBRow>
                <MDBCol sm="9" className="bg-info">
                  Level 1: .col-sm-9
                  <MDBRow>
                    <MDBCol sm="6" className="bg-info">
                      Level 2: .col-8 .col-sm-6
                    </MDBCol>
                    <MDBCol sm="6" className="bg-info">
                      Level 2: .col-4 .col-sm-6
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={handleModal}>Close</MDBBtn>
            <MDBBtn color="primary">Save changes</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    )*/
}

export default ProductModal