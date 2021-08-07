import React, { useEffect, useState, Fragment, useMemo } from 'react'
import { 
    MDBDataTableV5 ,
    MDBBtn,
    MDBDropdown,
    MDBDropdownToggle,
    MDBIcon,
    MDBDropdownItem,
    MDBDropdownMenu,
    MDBBadge,
    MDBRow,
    MDBCol,
} from 'mdbreact'
import axios from 'axios'
import { toastMessage } from '../../utils/toast-functions'
import { useHistory } from 'react-router-dom'
import Select from'react-select'

const StockTable = ({ handleWarehouseId, changeTable, handleChildProductId, handleModalAdd, handleModalExit, handleProductBatchId }) => {
    const [gridStructure, setGridStructure] = useState({})
    const [warehouseId, setWarehouseId] = useState(0)
    const [warehouses, setWarehouses] = useState([])
    const [selectValues, setSelectValues] = useState({})
    const history = useHistory()
    const API_BACKEND = process.env.REACT_APP_API
    const HEADERS = {
        "Contet-Type": "application/json",
        "Authorization": `Bearer ${window.sessionStorage.getItem('access_token')}`
    }

    const configureModalInput = (idChildProduct, idProductBatch) => {
        handleChildProductId(idChildProduct)
        handleProductBatchId(idProductBatch)
        handleModalAdd()
    }

    const configureModalOutput = (idChildProduct, idProductBatch) => {
        handleChildProductId(idChildProduct)
        handleProductBatchId(idProductBatch)
        handleModalExit()
    }

    const generateMovements = (idChildProduct, idProductBatch) => {
        
        return (
            <Fragment>
                <MDBBtn 
                    size="sm" 
                    onClick={() => configureModalInput(idChildProduct, idProductBatch)}>
                    Entrada
                </MDBBtn>
                <MDBBtn 
                    size="sm" 
                    onClick={() => configureModalOutput(idChildProduct, idProductBatch)}>
                    Salida
                </MDBBtn>
            </Fragment>
        )
    }

    const generateActions = (idChildProdcut, IdInventory) => {        
        return (
            <MDBDropdown size="sm">
                <MDBDropdownToggle className="grey lighten-1">
                    <MDBIcon icon="ellipsis-h" />
                </MDBDropdownToggle>
                <MDBDropdownMenu basic>
                    <MDBDropdownItem 
                        onClick={() => history.push(`/batch/${idChildProdcut}/${IdInventory}`)}>
                        Lotes
                    </MDBDropdownItem>
                </MDBDropdownMenu>
            </MDBDropdown>
        )
    }

    const getInventories = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${API_BACKEND}/api/v1/inventory/${warehouseId}`,
                headers: HEADERS
            })
    
            if(!result) {
                toastMessage('error', 'No existen datos')
                return
            }
    
            const {data: {data} } = result                        
            const structure = generateStructure(data.map(d => {
                return {
                    id: d.id,
                    sku: d.ChildProduct.sku,
                    product: d.ChildProduct.name,
                    totalQuantity: (<MDBBadge pill>{Number.parseFloat(d.totalQuantity).toFixed(2)}</MDBBadge>),
                    image: (<img width="100px" height="100px" src={d.ChildProduct.imageThumbnail}/>),
                    movements: generateMovements(d.ChildProduct.id, d.id),
                    actions: generateActions(d.ChildProduct.id, d.id),
                }
            }))
            
            setGridStructure(structure)
        } catch (err) {
            toastMessage('error', err.message)            
        }        
    }
    
    

    const getWarehouses = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${API_BACKEND}/api/v1/warehouse`,
                headers: HEADERS
            })

            if(!result) {
                toastMessage('warning', 'Ocurrio un problema con los almacenes')
                return
            }

            const {data: {data}} = result
            setWarehouses(data.map(d => ({value: d.id, label: d.name})))            
        } catch (err) {
            console.error(err.message)
            toastMessage('error', 'Ocurrio un error con los almacenes')
        }
    }

    const handleSelectWarehouses = (obj) => {
        setWarehouseId(obj.value)
        handleWarehouseId(obj.value)
        setSelectValues({
            ...selectValues,
            warehouse_id: obj.value,
            warehouse_name: obj.label
        })
    }
    
    useEffect(() => {
        getWarehouses()
        
        if(warehouseId) {
            getInventories()
        }       
        
    }, [changeTable, warehouseId])

    const generateStructure = (data) => {        
        return {
            columns: [{
              label: 'SKU',
              field: 'sku',
              width: 300,
            },            
            {
              label: 'Imagen',
              field: 'image',
              width: 300,
            },            
            {
              label: 'Producto',
              field: 'product',
              width: 300,
            },            
            {
              label: 'Cantidad',
              field: 'totalQuantity',
              sort: 'asc',
              width: 400,
            },
            {
              label: 'Movimientos',
              field: 'movements',
              sort: 'asc',
              width: 400,
            },
            {
              label: 'Acciones',
              field: 'actions',
              sort: 'asc',
              width: 400,
            },
          ],
          rows: data.map(d => {
                return {  
                    id: d.id,
                    sku: d.sku,
                    product: d.product,
                    totalQuantity: d.totalQuantity,
                    image: d.image,
                    movements: d.movements,
                    actions: d.actions,
                }
            })
  
        }

    }    

    return(
        <Fragment>
            <MDBRow>                            
                <MDBCol md="6">
                    <label>Ubicaciones</label>
                    <Select
                        options={warehouses}
                        onChange={handleSelectWarehouses}
                        value={
                            (selectValues.warehouse_id) 
                                ? {value: selectValues.warehouse_id, label: selectValues.warehouse_name}
                                : null
                            }/>
                </MDBCol>
            </MDBRow> 
            <MDBRow>
                <MDBCol md="12">
                    <MDBDataTableV5
                        hover
                        entriesOptions={[5, 20, 25]}
                        entries={5}
                        entriesLabel={"Mostrar estas filas:"}
                        pagesAmount={4}
                        data={gridStructure}
                        pagingTop
                        searchTop
                        searchLabel={"Buscar un producto..."}
                        searchBottom={false}/>            
                </MDBCol>
            </MDBRow>                         
        </Fragment>        
    )
}

export default StockTable