import React, { useEffect, useState } from  'react'
import Select from 'react-select'
import axios from 'axios'
import { toastMessage } from '../../utils/toast-functions'

const WarehouseSelection = ({ confIdWarehouse, refreshTable }) => {
    const [warehouses, setWarehouses] = useState([])
    const [valueSelect, setValueSelect] = useState({})
    const API_BACKEND = process.env.REACT_APP_API
    const HEADERS = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.sessionStorage.getItem('access_token')}`
    }
    
    const handleWarehouseSelect = (obj) => {
        setValueSelect({
            value: obj.value,
            label: obj.label
        })
        confIdWarehouse(obj.value)
        refreshTable()
    }

    const getWarehouses = async () => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${API_BACKEND}/api/v1/warehouse`,
                headers: HEADERS
            })

            if(!result) {
                console.error('Ocurrio un problema con la peticion /api/v1/warehouse')
            }

            const {data: {data}} = result
            setWarehouses(data.map(d => ({
                value: d.id,
                label: d.name
            })))
        } catch (err) {
            console.error(err.message)
            toastMessage('error', 'Ocurrio un error con los alamacennes')
        }
    }

    useEffect(() => {
        getWarehouses()
    }, [])

    return (
        <Select
            options={warehouses}
            value={valueSelect.value ?{value: valueSelect.value, label: valueSelect.label} : null}
            onChange={handleWarehouseSelect}/>
    )
}

export default WarehouseSelection