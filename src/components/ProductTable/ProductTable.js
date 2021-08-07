import React, { useState, useEffect } from 'react'
import { 
    MDBDataTableV5,  
    MDBIcon,
    MDBCard,
    MDBCardBody,
    MDBDropdown,
    MDBDropdownItem,
    MDBDropdownToggle,
    MDBDropdownMenu,
} from 'mdbreact'
//import { toast } from 'react-toastify'
import { toastMessage } from '../../utils/toast-functions'
import axios from 'axios'
import './productTable.css'

const ProductTable = ({ handleModal, handleMode, idProduct, changeTable , handleModalState, handleModalEdit, setTechinalCardContent }) => {
    const [gridStructure, setGridStructure] = useState({})

    useEffect(() => {
        getProducts()
    }, [changeTable])    

    const configModal = (id, mode) => {
        idProduct(id)
        handleMode(mode)
        handleModal()
    }

    const configModalState = (id) => {
        idProduct(id)
        handleModalState()
    }
    
    const configModalEdit = (id) => {
        idProduct(id)
        handleModalEdit()
    }

    const normalizeData = (d) => {
        console.log(d)
        return [
            ['#ID', d.id],
            ['Producto padre', d.ParentProduct.genericName],
            ['Proveedor', d.ParentProduct.Provider.name],
            ['Unidad de medida', d.ParentProduct.Provider.name],
            ['Familia', d.ParentProduct.ProductCategory.Sector.name],
            ['Stock minimo', d.minimumStock],
            ['Tiempo de vida', d.timeOfLifeRequired],
            ['Compra sugerida', d.suggestedPurchaseAmount],
            ['Tamaño', d.SizeCatalog.name],
            ['Reglas de recepción', d.receptionRule],
            ['Nombre', d.name],
            ['SKU', d.sku],
            ['Codigo de barras', d.productCode],
            ['Descripción', d.description],
            ['Sabor', d.flavor],            
            ['Margen nivel 1', d.firstProfitMargin],
            ['Cantidad 1', d.firstQuantityProduct],
            ['Margen nivel 2', d.secondProfitMargin],
            ['Cantidad 2', d.secondQuantityProduct],
            ['Margen nivel 3', d.thirdProfitMargin],
            ['Cantidad 3', d.thirdQuantityProduct],
            ['Margen nivel 4', d.fourthProfitMargin],
            ['Cantidad 4', d.fourthQuantityProduct],
            ['Margen nivel 5', d.fifthProfitMargin],
            ['Cantidad 5', d.fifthQuantityProduct],
            
        ]
    }

    const generateStructure = (data) => {
        return {
            columns: [{
                    label: 'Nombre',
                    field: 'name',
                    width: 270,
                },                
                {
                    label: 'SKU',
                    field: 'sku',
                    sort: 'asc',
                    width: 100,
                },                                
                {
                    label: 'Imagen',
                    field: 'imageThumbnail',
                    sort: 'disabled',
                    width: 150,
                },                                
                {
                    label: 'Estatus',
                    field: 'active',
                    sort: 'disabled',
                    width: 150,
                },                                
                {
                    label: 'Acciones',
                    field: 'actions',
                    sort: 'disabled',
                    width: 150,
                },
            ],
            rows: data.map(product => {
                let tmpProduct = product
                product.clickEvent = () => {setTechinalCardContent(normalizeData(tmpProduct))}
                product.provider = product.ParentProduct.Provider.name
                product.imageThumbnail = (<img width="100px" height="100px" src={product.imageThumbnail}/>)                                
                product.actions = (
                    <MDBDropdown size="sm">
                        <MDBDropdownToggle className="grey lighten-1">
                            <MDBIcon icon="ellipsis-h" />
                        </MDBDropdownToggle>
                        <MDBDropdownMenu basic>
                            <MDBDropdownItem onClick={() => configModalEdit(product.id)}>Editar</MDBDropdownItem>
                            <MDBDropdownItem onClick={() => configModalState(product.id)}>Cambiar estado</MDBDropdownItem>                            
                        </MDBDropdownMenu>
                    </MDBDropdown>
                )                
                product.active = (product.active) 
                    ? <p className="active-status">Activo</p> 
                    : <p className="inactive-status">Inactivo</p>
                
                return {...product}
            }) 
        }

    }

    const getProducts = async () => {
        try {
            const _users = await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API}/api/v1/product`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.sessionStorage.getItem('access_token')}`
                }
            })
    
            if(_users) {                
                const { data: {data} } = _users
                const newData = generateStructure(data)
                setGridStructure(newData)
            }
        } catch(err) {
            if(err.response.data.message !== 'There are no products')
                toastMessage('error', err.message)
        }        
    }    

    return(  
        <MDBCard>
            <MDBCardBody>
                <MDBDataTableV5
                    responsive
                    hover 
                    entriesOptions={[5, 20, 25]} 
                    entries={5} 
                    pagesAmount={4} 
                    data={gridStructure}/>
            </MDBCardBody>            
        </MDBCard>      
        
    )
}

export default ProductTable