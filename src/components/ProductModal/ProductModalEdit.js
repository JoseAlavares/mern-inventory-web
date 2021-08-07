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
    MDBNav,
    MDBNavItem,
    MDBNavLink,
    MDBAlert
} from 'mdbreact'
import './ProductModal.css'
import axios, { put } from 'axios'
import { toastMessage } from '../../utils/toast-functions'
import { cleanCharacters, onlyNumbers } from '../../utils/functions'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import './ProductModal.css'
let file

const FieldRequired = () => (
    <span 
        style={{
            color: 'red', 
            fontWeight: 'bold'}}>
        *
    </span>
)

const ProductModalEdit = ({ open, handleModal, id, refreshTable }) => {
    const [msgErrors, setMsgErrors] = useState([])
    const [seccionData, setSeccionData] = useState({seccionActive: 1})
    const [parentProducts, setParentProducts] = useState([])
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
        var value = event.target.value

        if(event.target.getAttribute('data-type') === 'number') {
            value = cleanCharacters(value)
        }

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

    const editProduct = async () => {
        let formData = new FormData()
        //let errors = 0
        let errors = []

        const firstMargin = onlyNumbers(input.first_margin) ? parseFloat(input.first_margin) : 0
        const firstQuantity = onlyNumbers(input.first_quantity) ? parseFloat(input.first_quantity) : 0
        const secondMargin = onlyNumbers(input.second_margin) ? parseFloat(input.second_margin) : 0
        const secondQuantity = onlyNumbers(input.second_quantity) ? parseFloat(input.second_quantity) : 0
        const thirdMargin = onlyNumbers(input.third_margin) ? parseFloat(input.third_margin) : 0
        const thirdQuantity = onlyNumbers(input.third_quantity) ? parseFloat(input.third_quantity) : 0
        const fourthMargin = onlyNumbers(input.fourth_margin) ? parseFloat(input.fourth_margin) : 0
        const fourthQuantity = onlyNumbers(input.fourth_quantity) ? parseFloat(input.fourth_quantity) : 0
        
        if(!input.name) errors.push('El nombre no puede estar vacio')
        if(!input.product_code) errors.push('El codigo de producto no puede estar vacio')
        if(input.product_code.length < 8 || input.product_code.length > 14) errors.push('La longitud del código debe ser mayor a 8 y menor igual a 14')
        if(!input.reception_rule) errors.push('Las reglas de recepción no pueden estar vacias')
        if(!input.time_life) errors.push('El tiempo de vida no puede estar vació')        
        if(!input.minimum_stock) errors.push('El stock mínimo no puede estar vacío')
        if(!input.size_id) errors.push('El tamaño no puede estar vació')
        if(!parseFloat(input.minimum_stock)) errors.push('El stock mínimo debe ser un valor numerico')
        if(parseFloat(input.minimum_stock) <= 0) errors.push('El stock mínimo debe ser mayor a cero')        
        //Margins and quantities
        if(firstMargin <= 0 || firstMargin > 100) errors.push('El margen de utilidad 1 debe ser mayor a cero y menor a 100')
        if(firstQuantity <= 0) errors.push('La cantidad de producto 1 debe ser mayor a cero')
        if(firstQuantity > 10000) errors.push('La cantidad de producto 1 excede el limite preestablecido de 10,000.00')

        if(secondMargin <= 0 || secondMargin > 100) errors.push('El margen de utilidad 2 debe ser mayor a cero y menor a 100')
        if(secondQuantity <= 0) errors.push('La cantidad de producto 2 debe ser mayor a cero')
        if(secondQuantity > 10000) errors.push('La cantidad de producto 2 excede el limite preestablecido de 10,000.00')
        
        if(thirdMargin <= 0 || thirdMargin > 100) errors.push('El margen de utilidad 3 debe ser mayor a cero y menor a 100')
        if(thirdQuantity <= 0) errors.push('La cantidad de producto 3 debe ser mayor a cero')
        if(thirdQuantity > 10000) errors.push('La cantidad de producto 3 excede el limite preestablecido de 10,000.00')
        
        if(fourthMargin <= 0 || fourthMargin > 100) errors.push('El margen de utilidad 4 debe ser mayor a cero y menor a 100')
        if(fourthQuantity <= 0) errors.push('La cantidad de producto 4 debe ser mayor a cero')
        if(fourthQuantity > 10000) errors.push('La cantidad de producto 4 excede el limite preestablecido de 10,000.00')

        if(errors.length) {            
            console.error('Errores en el formulario')
            console.table(errors)
            setMsgErrors(errors.map(e => {
                return (
                    <p key={e} style={{fontSize: 10, margin: 5, padding: 0}}>* {e}</p>
                )
            }))
            setTimeout(() => setMsgErrors([]), 1000 * 60 * 5)
            return
        }

        setLoading(true)

        formData.append('id', id)
        formData.append('name', input.name)
        formData.append('product_code', input.product_code)
        formData.append('size_id', input.size_id)
        formData.append('flavor', input.flavor)
        formData.append('minimum_stock', input.minimum_stock)
        formData.append('first_margin', input.first_margin)
        formData.append('first_quantity', input.first_quantity)
        formData.append('second_margin', input.second_margin)
        formData.append('second_quantity', input.second_quantity)
        formData.append('third_margin', input.third_margin)
        formData.append('third_quantity', input.third_quantity)
        formData.append('fourth_margin', input.fourth_margin)
        formData.append('fourth_quantity', input.fourth_quantity)        
        formData.append('time_life', input.time_life)
        formData.append('suggested_purchase', input.suggested_purchase)
        formData.append('reception_rule', input.reception_rule)
        formData.append('parent_product_id', input.parent_product_id)

        if(input.fifth_margin) formData.append('fifth_margin', input.fifth_margin)
        if(input.fifth_quantity) formData.append('fifth_quantity', input.fifth_quantity)

        if(file){
            formData.append('image-s3', file)
        }

        try {
            const result = await put(`${API_ENDPOINT}/api/v1/product`, formData, config)
            
            if(result) {               
                toastMessage('success', 'La información fue actualizada')
                handleModal()   
                refreshTable()                             
            }
        } catch (error) {           
            toastMessage('error', 'Ocurrio un error')
        }

        setLoading(false)
        setProgressFile(0)
    }

    useEffect(() => {
        file = null   
        if(open === true) {
            handleRequest()
            getParentProducts()
            setMsgErrors([])
        }        
    }, [open])

    const handleRequest = async () => {
        const dataRequest = {
            method: 'GET',
            url: `${API_ENDPOINT}/api/v1/product/${id}`,
            headers: HEADERS
        }

        try {
            const result = await axios(dataRequest)
            const { data: { data } } = result
            console.log(data)
            setInput({
                'id': data.id,
                'name': data.name,            
                'sku': data.sku,
                'minimum_stock': data.minimumStock,
                'suggested_purchase': data.suggestedPurchaseAmount,
                'reception_rule': data.receptionRule,
                'size_id': data.SizeCatalog.id,
                'size_name': data.SizeCatalog.name,
                'flavor': data.flavor,
                'product_code': data.productCode,
                'provider_id': data.ParentProduct.Provider.id,
                'provider_name': data.ParentProduct.Provider.name,
                'sector_id': data.ParentProduct.ProductCategory.Sector.id,
                'sector_name': data.ParentProduct.ProductCategory.Sector.name, 
                'category_id': data.ParentProduct.ProductCategory.id,
                'category_name': data.ParentProduct.ProductCategory.name,
                'measurement_id': data.ParentProduct.UnitMeasurement.id,
                'measurement_name': data.ParentProduct.UnitMeasurement.unit,
                'time_life': data.timeOfLifeRequired,
                'first_margin': data.firstProfitMargin,
                'first_quantity': data.firstQuantityProduct,
                'second_margin': data.secondProfitMargin,
                'second_quantity': data.secondQuantityProduct,
                'third_margin': data.thirdProfitMargin,
                'third_quantity': data.thirdQuantityProduct,
                'fourth_margin': data.fourthProfitMargin,
                'fourth_quantity': data.fourthQuantityProduct,
                'fifth_margin': data.fifthProfitMargin,
                'fifth_quantity': data.fifthQuantityProduct,
                'image': data.image,            
                'parent_product_id': data.ParentProduct.id,
                'parent_product_name': data.ParentProduct.genericName
            })

        } catch(err) {
            console.error(err.message)                
            //toastMessage('error', err.message)
        }
    }

    const handleSelectSize = (obj) => {
        setInput({
            ...input,
            size_id: obj.value,
            size_name: obj.label
        })
    }

    /*const handleInputChangeParentProduct = (newValue, action) => {
        //if(newValue) {
            setInput({
                ...input,
                'parent_product_id': newValue.value,
                'parent_product_name': newValue.label,
                //'parent_product_new': newValue.__isNew__
            })
        //}
    }*/

    const handleSelectParentProduct = (value, action) => {
        setInput({
            ...input,
            'parent_product_id': value.value,
            'parent_product_name': value.label,
        })
    }

    const getParentProducts = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/parent-products`,
                headers: HEADERS
            })

            if(!result) {
                toastMessage('error', 'No existen productos padre')
                return
            }

            const {data: {data}} = result
            setParentProducts(data.map(d => { return {
                value: d.id, 
                label: d.genericName} 
            }))
        } catch (err) {
            console.error(err.message)
            toastMessage('error', 'Error en los productos padre: '+ err.message)
        }
    }

    const formatCreateLabel = (inputValue) => (
        <span>Agregar: {inputValue}</span>
    )

    return (
        <MDBContainer>
            <MDBModal isOpen={open} toggle={handleModal} size="lg">
                <MDBModalHeader toggle={handleModal}>
                    Editar producto
                </MDBModalHeader>
                <MDBModalBody>
                    <MDBContainer fluid>
                        <MDBNav className="nav-tabs nav-justified">
                            <MDBNavItem>
                                <MDBNavLink to="#!" onClick={() => setSeccionData({
                                        seccionActive: 1
                                })}>
                                    <small style={
                                        seccionData.seccionActive === 1 
                                        ? {color:"blue", fontWeight: "bold"} 
                                        : null}
                                    >
                                        Datos generales
                                    </small>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to="#!" onClick={() => setSeccionData({
                                    seccionActive: 2
                                })}>
                                    <small style={
                                        seccionData.seccionActive === 2
                                        ? {color:"blue", fontWeight: "bold"} 
                                        : null}
                                    >
                                        Datos de sub producto
                                    </small>
                                </MDBNavLink>
                            </MDBNavItem>                        
                            <MDBNavItem>
                                <MDBNavLink to="#!" onClick={() => setSeccionData({
                                    seccionActive: 3
                                })}>
                                    <small style={
                                        seccionData.seccionActive === 3
                                        ? {color:"blue", fontWeight: "bold"} 
                                        : null}
                                    >
                                        Margenes de ganancia
                                    </small>                                
                                </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>                        
                    <Fragment>
                        {msgErrors.length > 0 &&
                            <MDBAlert color="danger">
                                <h5>Errores en el formulario</h5>
                                {msgErrors}
                            </MDBAlert>
                        }
                        {seccionData.seccionActive === 1 &&
                        <Fragment>
                            <h4>Producto padre</h4>
                            
                            <FieldRequired/>
                            <label>Nombre generico</label>
                            <CreatableSelect
                                //formatCreateLabel={formatCreateLabel}
                                //onInputChange={handleInputChangeParentProduct}
                                onChange={handleSelectParentProduct}
                                options={parentProducts}                                        
                                placeholder="Seleccione una opción"
                                name="parent_product"
                                value={(input.parent_product_id) ? {value: input.parent_product_id, label: input.parent_product_name } :  null}/>                            
                            <br/>
                        </Fragment>}

                        {seccionData.seccionActive === 2 &&
                        <Fragment>
                            
                            <h4>Identificadores</h4>                           
                            <MDBInput 
                                className="p-2"
                                label="*Codigo de producto"
                                name="product_code"                                             
                                type="text"
                                onChange={handleInput} 
                                validate 
                                error="wrong"
                                success="right"
                                value={input.product_code || ""}/>                            

                            
                            <MDBInput 
                                className="p-2"
                                label="*Nombre"
                                name="name"                                             
                                type="text"
                                onChange={handleInput}
                                value={input.name || ""}/>
                
                            <h4>Datos generales</h4>                                                    

                            
                            <MDBInput
                                label="*Reglas de recepción"
                                name="reception_rule"
                                type="textarea"
                                rows="2"
                                value={input.reception_rule}
                                onChange={handleInput}/>                            
                            
                            
                            <MDBInput
                                type="text"
                                name="time_life"
                                label="*Tiempo de vida requerido"
                                value={input.time_life}
                                onChange={handleInput}/>
                            
                            
                            <MDBInput
                                type="text"
                                name="minimum_stock"
                                label="*Stock mínimo requerido"
                                value={input.minimum_stock}
                                onChange={handleInput}/>
                            
                            <MDBInput
                                type="text"
                                name="suggested_purchase"
                                label="Compra de cantidad de producto sugerida"
                                value={input.suggested_purchase}
                                onChange={handleInput}/>
                            
                            <div>
                                <FieldRequired/>
                                <label className="img-label">Imagen</label> 
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
                            <br/>
                            <div className="img-wrapper">
                                <img alt="product_image" src={input.image}/>   
                            </div>                             
                            
                            <FieldRequired/>
                            <label>Tamaño</label>                           
                            <Select
                                onChange={handleSelectSize}
                                options={[
                                    {value: 1, label: 'Pequeño'},
                                    {value: 2, label: 'Mediano'},
                                    {value: 3, label: 'Grande'},
                                ]}
                                placeholder="Seleccióne una opción"
                                value={(input.size_id) 
                                    ? {value: input.size_id, label: input.size_name} 
                                    : null}/>
                            
                            
                            <MDBInput
                                type="text"
                                label="Sabor"
                                name="flavor"
                                value={input.flavor}
                                onChange={handleInput}/>
                        </Fragment>}

                        {seccionData.seccionActive === 3 &&
                        <Fragment>
                            <h4>Margenes de utilidad</h4>
                            <MDBRow>                        
                                <MDBCol sm="6" md="6">  
                                                              
                                    <MDBInput
                                        data-type="number"
                                        name="first_margin"
                                        label="*Nivel 1"
                                        onChange={handleInput}
                                        value={input.first_margin || ""}/>                                    
                                </MDBCol>
                                <MDBCol sm="6" md="6">
                                    
                                    <MDBInput
                                        data-type="number"
                                        name="first_quantity"
                                        value={input.first_quantity || ""}
                                        onChange={handleInput}
                                        label="*Cantidad de producto 1"/>                                    
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>                        
                                <MDBCol sm="6" md="6">   
                                                             
                                    <MDBInput
                                        data-type="number"
                                        name="second_margin"
                                        label="*Nivel 2"
                                        onChange={handleInput}
                                        value={input.second_margin || ""}/>                                        
                                </MDBCol>
                                <MDBCol sm="6" md="6">
                                    
                                    <MDBInput
                                        data-type="number"
                                        name="second_quantity"
                                        value={input.second_quantity || ""}
                                        onChange={handleInput}
                                        label="*Cantidad de producto 2"/>                                    
                                </MDBCol>
                            </MDBRow>                 
                            
                            <MDBRow>                        
                                <MDBCol sm="6" md="6">
                                                             
                                    <MDBInput
                                        data-type="number"
                                        name="third_margin"
                                        label="*Nivel 3"
                                        onChange={handleInput}
                                        value={input.third_margin || ""}/>                                    
                                </MDBCol>
                                <MDBCol sm="6" md="6">
                                    
                                    <MDBInput
                                        data-type="number"
                                        name="third_quantity"
                                        value={input.third_quantity || ""}
                                        onChange={handleInput}
                                        label="*Cantidad de producto 3"/>                                    
                                </MDBCol>
                            </MDBRow>                 
                            <MDBRow>                        
                                <MDBCol sm="6" md="6">
                                                             
                                    <MDBInput
                                        data-type="number"
                                        name="fourth_margin"
                                        label="*Nivel 4"
                                        onChange={handleInput}
                                        value={input.fourth_margin || ""}/>                                    
                                </MDBCol>
                                <MDBCol sm="6" md="6">
                                    
                                    <MDBInput
                                        className="was-validated"                                        
                                        data-type="number"                                        
                                        name="fourth_quantity"
                                        value={input.fourth_quantity || ""}
                                        onChange={handleInput}
                                        label="*Cantidad de producto 4"/>                                    
                                </MDBCol>
                            </MDBRow>                 
                            <MDBRow>                        
                                <MDBCol sm="6" md="6">                            
                                    
                                    <MDBInput
                                        data-type="number"                                        
                                        name="fifth_margin"
                                        value={input.fifth_margin || ""}
                                        onChange={handleInput}
                                        label="Nivel 5"/>                                    
                                </MDBCol>
                                <MDBCol sm="6" md="6">
                                    
                                    <MDBInput
                                        data-type="number"
                                        name="fifth_quantity"
                                        value={input.fifth_quantity || ""}
                                        onChange={handleInput}
                                        label="Cantidad de producto 5"/>                                    
                                </MDBCol>
                            </MDBRow>
                        </Fragment>}
                    </Fragment>                    
                </MDBContainer>                
            </MDBModalBody>
            <MDBProgress value={progressFile}/>
            <MDBModalFooter>
                <MDBBtn className="cancel-button" onClick={handleModal}>Cerrar</MDBBtn>
                <MDBBtn className="agreed-button" disabled={loading} onClick={editProduct}>{
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
}

export default ProductModalEdit