import React, { Fragment, useState, useEffect } from 'react'
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
import axios, { post } from 'axios'
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

const ProductModalAdd = ({ open, handleModal, id, refreshTable }) => {
    const [dataParent, setDataParent] = useState({
        display: 'block',
        required: false
    })
    const [msgErrors, setMsgErrors] = useState([])    
    const [seccionData, setSeccionData] = useState({seccionActive: 1})
    const [showErros, setShowErrors] = useState({})
    const [providers, setProviders] = useState({})
    const [sectors, setSectors] = useState({})
    const [categories, setCategories] = useState([])
    const [unitMeasurements, setUnitMeasurements] = useState({})
    const [parentProducts, setParentProducts] = useState([])
    const [idSector, setIdSector] = useState(null)
    const [idProvider, setIdProvider] = useState(null)
    const [fileName, setFileName] = useState('Selecciona una imagen...')
    const [progressFile, setProgressFile] = useState(0)
    const [input, setInput] = useState({})    
    const [loading, setLoading] = useState(false)
    const [autoParentProduct, setAutoParentProduct] = useState(false)
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
           value =  cleanCharacters(value)
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

    const addChildProduct = async () => {
        setMsgErrors([])
        let formData = new FormData()
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
        if(input.product_code && (input.product_code.length < 8 || input.product_code.length > 14)) errors.push('La longitud del código debe ser mayor a 8 y menor igual a 14')
        if(!input.reception_rule) errors.push('Las reglas de recepción no pueden estar vacias')
        if(!input.time_life) errors.push('El tiempo de vida no puede estar vació')        
        if(!input.minimum_stock) errors.push('El stock mínimo no puede estar vacío')
        if(!file) errors.push('La imagen no puede estar vacia')
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
        formData.append('parent_product_id', input.parent_product_id)
        formData.append('name', input.name)
        formData.append('product_code', input.product_code)
        formData.append('size_id', input.size_id)
        formData.append('flavor', input.flavor)
        formData.append('minimum_stock', input.minimum_stock)
        formData.append('provider_id', input.provider_id)
        formData.append('category_id', input.category_id)
        formData.append('first_margin', input.first_margin)
        formData.append('first_quantity', input.first_quantity)
        formData.append('second_margin', input.second_margin)
        formData.append('second_quantity', input.second_quantity)
        formData.append('third_margin', input.third_margin)
        formData.append('third_quantity', input.third_quantity)
        formData.append('fourth_margin', input.fourth_margin)
        formData.append('fourth_quantity', input.fourth_quantity)        
        formData.append('time_life', input.time_life)        
        formData.append('reception_rule', input.reception_rule)        
        formData.append('image-s3', file)

        //if exists the not required fileds we append this data in the data form
        if(input.suggested_purchase !== null || input.suggested_purchase !== undefined) 
            formData.append('suggested_purchase', input.suggested_purchase)
        
        if(input.fifth_margin !== null || input.fifth_margin !== undefined) 
            formData.append('fifth_margin', input.fifth_margin)
        
        if(input.fifth_quantity !== null || input.fifth_quantity !== undefined)
            formData.append('fifth_quantity', input.fifth_quantity)

        try {
            const result = await post(`${API_ENDPOINT}/api/v1/product`, formData, config)
            
            if(result) {               
                toastMessage('success', 'El producto fue creado correctamente')
                handleModal()
                refreshTable()
            }
            else {
                toastMessage('error', 'Ocurrio un error')
            }
            
        } catch (err) {
            console.error(err.message)
            let message = ""
            let level = ""

            switch(parseInt(err.response.status)) {
                case 404:
                    message = "La ruta no existe"
                    level = "error"
                    break
                case 422:
                    message = "Faltan campos en el formulario"
                    level = "warning"
                    break
                case 409:
                    message = "El nombre o codigo de producto hijo ya existe"
                    level = "warning"
                    break
                default:
                    message = "Error desconocido"
                    level = "error"
            }

            toastMessage(level, message)
        }
        setLoading(false)
        setProgressFile(0)
    }    

    useEffect(() => {
        file = null   
        if(open === true) {
            getProviders()
            getSectors()
            getUnitMeasurements()
            getParentProducts()
        }

        setFileName('Selecciona una imagen...')
        setInput({})
    }, [open])

    const handleSelectProvider = (obj) => {
        setInput({
            ...input,
            provider_id: obj.value,
            provider_name: obj.label,
            first_margin: obj.first_margin,
            second_margin: obj.second_margin,
            third_margin: obj.third_margin,
            fourth_margin: obj.fourth_margin,
            fifth_margin: obj.fifth_margin,
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

    const handleSelectUnits = (obj) => {
        setInput({
            ...input,
            'measurement_id': obj.value,
            'measurement_name': obj.label,

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
                const {data: { data } } = result
                setProviders(data.map(r => {
                    return {
                        value: r.id,
                        label: r.name,
                        first_margin: r.firstProfitMargin,
                        second_margin: r.secondProfitMargin,
                        third_margin: r.thirdProfitMargin,
                        fourth_margin: r.fourthProfitMargin,
                        fifth_margin: r.fifthProfitMargin,
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
                console.log(data)
                let fetchedCategories = data.map(d => {
                    return {value: d.id, label: d.name}
                })
                setCategories(fetchedCategories)
                return fetchedCategories
            }

            toastMessage('error', 'Error 404')
        } catch (err) {
            toastMessage('error', err.message)
        }
    }

    const getUnitMeasurements = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${API_ENDPOINT}/api/v1/unit-measurement`,
                headers: HEADERS
            })
            
            if(!result) {
                toastMessage('error', 'Ocurrio un problema con las unidades de medida')
                return
            }
            const {data: {data}} = result
            setUnitMeasurements(data.map(d => ({value: d.id, label: d.unit})))
        } catch (err) {
            console.log(err.message)
            toastMessage('error', 'Ocurrio un error: '+ err.message)
        }
    }

    const handleInputChangeParentProduct = (newValue, action) => {
        if(newValue) {
            setInput({
                ...input,
                'parent_product_id': newValue.value,
                'parent_product_name': newValue.label,
                'parent_product_new': newValue.__isNew__
            })
        }
    }

    const handleSelectParentProduct = async (value, action) => {
        if(value){
            let providerInputData = {}
            let unitMeasurementInputData = {}
            let productCategoryInputData = {}
            let categoryInputData = {}
            if(value.provider !== undefined){
                
                for(let i = 0; i < providers.length ;i++){
                    if(providers[i].value === value.provider.id){
                        let providerMatch = providers[i]
                        providerInputData = {
                            provider_id: providerMatch.value,
                            provider_name: providerMatch.label,
                            first_margin: providerMatch.first_margin,
                            second_margin: providerMatch.second_margin,
                            third_margin: providerMatch.third_margin,
                            fourth_margin: providerMatch.fourth_margin,
                            fifth_margin: providerMatch.fifth_margin,
                            'parent_product_id': value.value,
                            'parent_product_name': value.label,
                        }    
                        break
                    }else{
                        providerInputData = {
                            'parent_product_id': value.value,
                            'parent_product_name': value.label,
                            provider_id: null,
                            provider_name: null,
                            first_margin: null,
                            second_margin: null,
                            third_margin: null,
                            fourth_margin: null,
                            fifth_margin: null
                        }
                    }
                }
            }else{
                providerInputData = {
                    ...input,
                    'parent_product_id': value.value,
                    'parent_product_name': value.label,
                    provider_id: null,
                    provider_name: null,
                    first_margin: null,
                    second_margin: null,
                    third_margin: null,
                    fourth_margin: null,
                    fifth_margin: null
                }
            }
            if(value.UnitMeasurementId !== undefined){
                for(let i = 0; i < unitMeasurements.length ;i++){
                    if(unitMeasurements[i].value === value.UnitMeasurementId){
                        unitMeasurementInputData = {
                            'measurement_id': unitMeasurements[i].value,
                            'measurement_name': unitMeasurements[i].label,
                        }
                        break
                    }else{
                        unitMeasurementInputData = {
                            'measurement_id': null,
                            'measurement_name':null
                        }
                    }
                }
            }else{
                unitMeasurementInputData = {
                    'measurement_id': null,
                    'measurement_name':null
                }
            }
            if(value.ProductCategory !== undefined && value.ProductCategory.SectorId !== undefined){
                for(let i = 0; i < sectors.length ;i++){
                    if(sectors[i].value === value.ProductCategory.SectorId){
                        productCategoryInputData = {
                            'sector_id': sectors[i].value,
                            'sector_name': sectors[i].label
                        }
                        if(value.ProductCategory!== undefined){
                            let fetchedCategories = await getCategories(sectors[i].value)
                            for(let i = 0; i < fetchedCategories.length ;i++){
                                if(fetchedCategories[i].value === value.ProductCategory.id){
                                    categoryInputData = {
                                        'category_id': fetchedCategories[i].value,
                                        'category_name': fetchedCategories[i].label,
                            
                                    }
                                    break
                                }else{
                                    categoryInputData = {
                                        'category_id': null,
                                        'category_name': null,
                            
                                    }
                                }
                            }
                        }else{
                            categoryInputData = {
                                'category_id': null,
                                'category_name': null
                            }
                        }

                        break
                    }else{
                        productCategoryInputData = {
                            'sector_id': null,
                            'sector_name': null
                        }
                    }
                }
            }else{
                productCategoryInputData = {
                    'sector_id': null,
                    'sector_name': null
                }
                categoryInputData = {
                    'category_id': null,
                    'category_name': null
                }
            }

            setInput({
                ...input,
                ...providerInputData,
                ...unitMeasurementInputData,
                ...productCategoryInputData,
                ...categoryInputData
            })
            providerInputData.provider_id === null ? setAutoParentProduct(false) : setAutoParentProduct(true)
        }
    }

    const resetParentProductInput = () => {
        setInput({
            ...input,
            'parent_product_id': null,
            'parent_product_name': ""
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
            setParentProducts(data.map(d => ({
                    value: d.id, 
                    label: d.genericName,
                    provider: {id: d.ProviderId},
                    UnitMeasurementId: d.UnitMeasurementId,
                    ProductCategory: d.ProductCategory
                })
            ))
        } catch (err) {
            console.error(err.message)
            toastMessage('error', 'Error en los productos padre: '+ err.message)
        }
    }

    const createParentProduct = async () => {
        let errors = []
 
        if(!input.parent_product_name) errors.push('El nombre de producto padre no puede estar vació')
        if(!input.provider_id) errors.push('El proveedor no puede estar vacio')        
        if(!input.measurement_id) errors.push('La unidad de medida no puede estar vacía')
        if(!input.sector_id) errors.push('La familia no puede estar vacía')
        if(!input.category_id) errors.push('La sub-familia no puede estar vacía')

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
        
        try {
            const result = await axios({
                method: 'POST',
                url: `${API_ENDPOINT}/api/v1/parent-product`,
                headers: HEADERS,
                data: {
                    generic_name: input.parent_product_name,
                    generic_sku: (Math.random() * 100).toFixed(0),
                    measurement_id: input.measurement_id,
                    provider_id: input.provider_id,
                    category_id: input.category_id,
                }
            })

            if(!result) {
                toastMessage('warning', 'Ocurrio un problema al crear el producto padre')
                return
            }

            const {data: {data}} = result

            toastMessage('success', 'El producto padre fue creado correctamente')
            let tmpParents = parentProducts
            tmpParents.push({value: data.id, label: data.genericName})
            setParentProducts(tmpParents)
            setInput({
                ...input,
                parent_product_id: data.id,
                parent_product_name: data.genericName
            })
            setAutoParentProduct(true)
        } catch (err) {
            console.error(err.message)
            let message = ""
            let level = ""

            switch(parseInt(err.response.status)) {
                case 404:
                    message = "La ruta no existe"
                    level = "error"
                    break
                case 422:
                    message = "Faltan campos en el formulario"
                    level = "warning"
                    break
                case 409:
                    message = "El nombre o codigo de producto padre ya existe"
                    level = "warning"
                    break
                default:
                    message = "Error desconocido"
                    level = "error"
            }

            toastMessage(level, message)
        }
    }

    const handleSelectSize = (obj) => {
        setInput({
            ...input,
            size_id: obj.value,
            size_name: obj.label
        })
    }

    const formatCreateLabel = (inputValue) => (
        <span>Agregar: {inputValue}</span>
    )    

    return (
        <MDBContainer>
          <MDBModal isOpen={open} toggle={handleModal} size="lg">
            <MDBModalHeader toggle={handleModal}>
                Agregar producto
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
                            })}
                            disabled={autoParentProduct === true ? false : true}
                            >
                                <small style={
                                    autoParentProduct === true
                                    ?
                                        seccionData.seccionActive === 2
                                        ? {color:"blue", fontWeight: "bold"} 
                                        : null
                                    : {color:"#9cadbe"} 
                                }
                                >
                                    Datos de sub producto
                                </small>
                            </MDBNavLink>
                        </MDBNavItem>                        
                        <MDBNavItem>
                            <MDBNavLink to="#!" onClick={() => setSeccionData({
                                seccionActive: 3
                            })}
                            disabled={autoParentProduct === true ? false : true}
                            >
                                <small style={
                                    autoParentProduct === true
                                    ?
                                        seccionData.seccionActive === 3
                                        ? {color:"blue", fontWeight: "bold"} 
                                        : null
                                    : {color:"#9cadbe"} 
                                }
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
                            <label className="parent-label">Nombre generico</label>
                            <CreatableSelect
                                formatCreateLabel={formatCreateLabel}                            
                                onInputChange={handleInputChangeParentProduct}
                                onChange={handleSelectParentProduct}
                                onFocus={resetParentProductInput}
                                options={parentProducts}                                        
                                placeholder="Seleccione una opción"
                                name="parent_product"
                                value={
                                    input.parent_product_id
                                    ? {value: input.parent_product_id, label: input.parent_product_name } 
                                    :  null
                                }
                                />                                
                                
                            <FieldRequired/>
                            <label className="mt-2 parent-label">Proveedor</label>
                            <Select
                                onChange={handleSelectProvider}
                                options={providers}                                        
                                placeholder="Seleccione una opción"
                                name="provider"
                                value={
                                    (input.provider_id) 
                                    ? 
                                        {
                                            value: input.provider_id, 
                                            label: input.provider_name,
                                            first_margin: input.first_margin,
                                            second_margin: input.second_margin,
                                            third_margin: input.third_margin,
                                            fourth_margin: input.fourth_margin,
                                            fifth_margin: input.fifth_margin
                                        }
                                    :
                                        null}/>                                

                            <div>
                                <FieldRequired/>
                                <label className="mt-2 parent-label">Unidad de medida</label>
                                <Select
                                    onChange={handleSelectUnits}
                                    options={unitMeasurements}
                                    placeholder="Seleccione una opción"
                                    value={
                                        input.measurement_id 
                                        ? {value: input.measurement_id, label: input.measurement_name}: 
                                        null
                                    }/>                                

                                <FieldRequired/>
                                <label className="mt-2 parent-label">Familia</label>
                                <Select
                                    onChange={handleSelectSector}
                                    options={sectors}
                                    placeholder="Seleccione una opción"
                                    value={
                                        input.sector_id 
                                        ? {value: input.sector_id, label: input.sector_name} 
                                        : null}/>                                

                                <FieldRequired/>
                                <label className="mt-2 parent-label">Sub familias</label>
                                <Select
                                    onChange={handleSelectCategory}
                                    options={categories}
                                    placeholder="Categoria"
                                    name="category"
                                    value={
                                        input.category_id 
                                        ? {value: input.category_id, label: input.category_name} 
                                        : null}/>

                            </div>
                            {
                                autoParentProduct === false ? 
                                    <MDBRow>
                                        <MDBCol md="4" lg="4" sm="12" xs="12" className="offset-md-8 offset-lg-8 text-right">
                                            <MDBBtn onClick={createParentProduct} className="create-button mr-0" size="sm">Crear</MDBBtn>
                                        </MDBCol>
                                    </MDBRow>
                                : <React.Fragment></React.Fragment>
                            }

                        </Fragment>

                        }                                          
                    </Fragment>                
                    
                    {seccionData.seccionActive === 2 &&    
                    <Fragment>
                        <h4>Sub producto</h4>
                        <br/>
                        <h5>Identificadores</h5>                                                  
                        <MDBInput
                            required
                            className="p-2"
                            label="*Codigo de producto"
                            name="product_code"                                             
                            type="text"
                            onChange={handleInput} 
                            value={input.product_code || ""}/>                        

                        <h5>Datos generales</h5>
                        <MDBInput 
                            className="p-2"
                            label="*Nombre"
                            name="name"                                             
                            type="text"
                            onChange={handleInput}
                            value={input.name || ""}/>                          

                        <MDBInput
                            label="Descripción"
                            name="description"
                            type="textarea"
                            rows="2"
                            value={input.description}
                            onChange={handleInput}/>                        
                        
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
                            data-type="number"
                            type="text"
                            name="minimum_stock"
                            label="*Stock minimo requerido"
                            value={input.minimum_stock}
                            onChange={handleInput}/>                        

                        <MDBInput
                            data-type="number"
                            type="text"
                            name="suggested_purchase"
                            label="Compra minima sugerida"
                            value={input.suggested_purchase}
                            onChange={handleInput}/>                        

                        <div>
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
                        <br />

                        <FieldRequired/>
                        <label className="tam-label">Tamaño</label>                          
                        <Select
                            onChange={handleSelectSize}
                            name="size_id"
                            options={[
                                {value: 1, label: 'Pequeño'},
                                {value: 2, label: 'Mediano'},
                                {value: 3, label: 'Grande'},
                            ]}
                            value={
                                input.size_id 
                                ? {value: input.size_id, label: input.size_name} 
                                : null }/>                        

                        <MDBInput
                            type="text"
                            label="Sabor"
                            name="flavor"
                            onChange={handleInput}/>                        
                    </Fragment>
                    }                    

                    {seccionData.seccionActive === 3 &&
                    <Fragment>   
                        <h5>Margenes de utilidad</h5>
                        <MDBRow>                        
                            <MDBCol sm="6" md="6">
                                <MDBInput
                                    data-type="number"                      
                                    name="first_margin"                                    
                                    onChange={handleInput}
                                    value={input.first_margin || ""}
                                    label="*Nivel 1"/>                                

                            </MDBCol>
                            <MDBCol sm="6" md="6">
                                <MDBInput
                                    data-type="number"                                    
                                    name="first_quantity"
                                    value={input.first_quantity}
                                    onChange={handleInput}
                                    label="*Cantidad de producto 1"/>                                
                            </MDBCol>
                        </MDBRow>                 
                        <MDBRow>                        
                            <MDBCol sm="6" md="6">                                
                                <MDBInput
                                    data-type="number"
                                    name="second_margin"
                                    onChange={handleInput}
                                    value={input.second_margin || ""}
                                    label="*Nivel 2"/>                                
                            </MDBCol>
                            <MDBCol sm="6" md="6">
                                <MDBInput
                                    data-type="number"
                                    name="second_quantity"
                                    value={input.second_quantity}
                                    onChange={handleInput}
                                    label="*Cantidad de producto 2"/>                                
                            </MDBCol>
                        </MDBRow>                 
                        <MDBRow>                        
                            <MDBCol sm="6" md="6">
                                <MDBInput
                                    data-type="number"
                                    name="third_margin"
                                    onChange={handleInput}
                                    value={input.third_margin || ""}
                                    label="*Nivel 3"/>                                
                            </MDBCol>
                            <MDBCol sm="6" md="6">
                                <MDBInput
                                    data-type="number"
                                    name="third_quantity"
                                    value={input.third_quantity}
                                    onChange={handleInput}
                                    label="*Cantidad de producto 3"/>                                
                            </MDBCol>
                        </MDBRow>                 
                        <MDBRow>                        
                            <MDBCol sm="6" md="6">                                
                                <MDBInput
                                    data-type="number"
                                    name="fourth_margin"
                                    onChange={handleInput}
                                    value={input.fourth_margin || ""}
                                    label="*Nivel 4"/>                                
                            </MDBCol>
                            <MDBCol sm="6" md="6">
                                <MDBInput
                                    data-type="number"
                                    name="fourth_quantity"
                                    value={input.fourth_quantity}
                                    onChange={handleInput}
                                    label="*Cantidad de producto 4"/>                                
                            </MDBCol>
                        </MDBRow>                 
                        <MDBRow>                        
                            <MDBCol sm="6" md="6">                                
                                <MDBInput
                                    data-type="number"
                                    name="fifth_margin"
                                    onChange={handleInput}
                                    value={input.fifth_margin || ""}
                                    label="Nivel 5"/>                                
                            </MDBCol>
                            <MDBCol sm="6" md="6">
                                <MDBInput
                                    data-type="number"
                                    name="fifth_quantity"
                                    value={input.fifth_quantity}
                                    onChange={handleInput}
                                    label="Cantidad de producto 5"/>                                
                            </MDBCol>
                        </MDBRow>    
                    </Fragment>
                    }
                </MDBContainer>                
            </MDBModalBody>
            <MDBProgress value={progressFile}/>
            <MDBModalFooter>
                {
                    autoParentProduct === true ? 
                        <React.Fragment>
                            <MDBBtn className="cancel-button" onClick={handleModal}>Cerrar</MDBBtn>
                            <MDBBtn className="agreed-button" disabled={loading} onClick={addChildProduct}>{
                                loading 
                                ?
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                :
                                    "Guardar"
                            }</MDBBtn>
                        </React.Fragment>
                    : <React.Fragment></React.Fragment>
                }
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
    )
}

export default ProductModalAdd