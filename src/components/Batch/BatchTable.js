import React, { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MDBDataTableV5, MDBBadge } from 'mdbreact'
import axios from 'axios'
import { formatFloat } from '../../utils/functions'
import { toastMessage } from '../../utils/toast-functions'
import { useHistory } from 'react-router-dom'

const BatchTable = ({ changeTable }) => {
    const history = useHistory()
    const { idChildProduct, idInventory } = useParams()
    const [gridStructure, setGridStructure] = useState({})
    const columns = [
        // {
        //     label: 'Zona',
        //     field: 'zone',
        //     sort: 'desc',
        //     width: 150,
        // },
        {
            label: 'Lote',
            field: 'batchCode',
            sort: 'desc',
            width: 270,
        },
        {
            label: 'Estatus',
            field: 'active',
            width: 200,
        },
        {
            label: 'Cantidad',
            field: 'productQuantity',
            sort: 'desc',
            width: 200,
        },
        {
            label: 'Fecha de entrada',
            field: 'arrivalDate',
            sort: 'desc',
            width: 150,
        },
        {
            label: 'Fecha de caducidad',
            field: 'expirationDate',
            sort: 'desc',
            width: 150,
        },
    ]

    useEffect(() => {
        getBatches()
    }, [changeTable])    

    const generateStructure = (data) => {
        return {
            columns: columns,            
            rows: data
        }

    }

    const generateBadge = (info) => {
        return <MDBBadge pill>{info}</MDBBadge>
    }

    const getBatches = async () => {
        try {
            const _users = await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API}/api/v1/batch/${idChildProduct}/${idInventory}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.sessionStorage.getItem('access_token')}`
                }
            })
    
            if(_users) {                
                const { data: {data} } = _users
                const newData = generateStructure(data.map(d => ({
                    id: d.id,
                    //zone: d.Zone.name,
                    batchCode: d.batchCode,
                    active: generateBadge(d.active ? 'Activo' : 'Inactivo'),
                    productQuantity: formatFloat(d.productQuantity, 2),
                    arrivalDate: d.arrivalDate,
                    expirationDate: d.expirationDate
                })))
                setGridStructure(newData)
            }
            else {
                setGridStructure([])
            }
            
            return
        } catch(err) {            
            if(err.response.status === 404) {
                toastMessage('warning', 'No existen lotes para este inventario')
                return
            }
            
            console.error(err.message)
            toastMessage('error', 'Ocurrio un error, contacta a soporte tecnico')
            return            
        }        
    }    

    return(        
        <Fragment>
            <div onClick={() => history.push('/stock')}>
                <span>
                    <i class="fas fa-arrow-left" style={{
                        marginRight: 5, 
                        marginTop: 15, 
                        marginBottom: 15}}>                        
                    </i>
                    Regresar
                </span>
            </div>            
            
            <MDBDataTableV5
                hover 
                entriesOptions={[5, 20, 25]} 
                entries={5} 
                entriesLabel={"Mostrar estas filas:"}
                pagesAmount={4} 
                data={gridStructure}/>
        </Fragment>
    )
}

export default BatchTable