import React, { Fragment, useState, useEffect } from 'react'
import { 
    MDBDataTableV5, 
    MDBBtn, 
    MDBPopover, 
    MDBPopoverBody, 
} from 'mdbreact'
import { toast } from 'react-toastify'
import Assets from '../../assets/Assets'
import axios from 'axios'
import './providerTable.css'

const ProviderTable = ({ handleModal, handleMode, idProvider, changeTable, handleModalDetails, handleModalDetailsData }) => {
    const [gridStructure, setGridStructure] = useState({})

    useEffect(() => {
        getProviders()
    }, [changeTable])    

    const handleClickDetails = (data) => {
        handleModalDetailsData({
            bossName: data.bossName,
            telephoneBoss: data.telephoneBoss,
            emailBoss: data.emailBoss,
            level1: data.firstProfitMargin,
            level2: data.secondProfitMargin,
            level3: data.thirdProfitMargin,
            level4: data.fourthProfitMargin,
            level5: data.fifthProfitMargin,
            bankData: data.bankData
        })
        handleModalDetails()
    }

    const generateStructure = (data) => {
        return {
            columns: [{
                    label: 'Nombre',
                    field: 'name',
                    width: 270,
                },
                {
                    label: 'Dirección',
                    field: 'address',
                    width: 200,
                },
                {
                    label: 'Correo',
                    field: 'email',
                    sort: 'asc',
                    width: 100,
                },
                {
                    label: 'Teléfono',
                    field: 'telephone',
                    sort: 'disabled',
                    width: 100,
                },                
                {
                    label: 'Estatus',
                    field: 'status',
                    sort: 'disabled',
                    width: 100,
                },
                {
                    label: 'Recepción',
                    field: 'receptionRule',
                    sort: 'disabled',
                    width: 100
                },
                // {
                //     label: 'Detalles',
                //     field: 'details',
                //     sort: 'disabled',
                //     width: 100
                // },
                {
                    label: 'Editar',
                    field: 'edit',
                    sort: 'disabled',
                    width: 150,
                },
                {
                    label: '',
                    field: 'enable',
                    sort: 'disabled',
                    width: 150,
                }                
            ],
            rows: data.map(provider => {               
                provider.status = (provider.active === true) 
                    ? <p className="active-status">Activo</p> 
                    : <p className="inactive-status">Inactivo</p>
                
                provider.receptionRule = (
                    <MDBPopover
                        placement="right"
                        popover
                        clickable>                        
                        <MDBBtn size="sm" className="eye-button">
                            <img src={Assets.providerImgs.eye} 
                                className="eye-icon" 
                                alt="eye-icon"
                            ></img>
                        </MDBBtn>                        
                        <MDBPopoverBody>
                            <p>{provider.receptionRule || <h3>N/A</h3>}</p>
                        </MDBPopoverBody>                        
                    </MDBPopover>
                )

                // provider.details = (                    
                //     <MDBBtn size="sm" className="eye-button" onClick={() => handleClickDetails(provider)}>
                //         <img src={Assets.providerImgs.eye} 
                //             className="eye-icon" 
                //             alt="eye-icon"
                //         ></img>
                //     </MDBBtn>                    
                // )

                provider.edit = <div 
                            className="edit-icon-container text-center"
                            onClick={() => { 
                                handleModal()
                                handleMode('get_provider')
                                idProvider(provider.id)
                            }}
                        >
                            <img src={Assets.providerImgs.edit} 
                                className="edit-icon" 
                                alt="edit-icon"
                            ></img>
                        </div>
                provider.enable =  <div 
                                className="disable-icon-container text-center"
                                onClick={() => {
                                    handleModal()
                                    handleMode('delete_provider')
                                    idProvider(provider.id)
                                }}
                            >
                            {provider.active === true ? 'Inhabilitar' : 'Habilitar'}
                                <img src={provider.active === true ? Assets.providerImgs.disableRed : Assets.providerImgs.disable} 
                                    className="disable-icon" 
                                    alt="disable-icon"
                                ></img>
                            </div>
                
                return {...provider}
            }) 
        }

    }

    const updateNameTd = (dataRows) =>{
        // console.log("update name td")
        // console.log(dataRows)
        let table = document.getElementsByClassName("table");
        //console.log(table[0])
        let rows = table[0].getElementsByTagName("tr")
        for(let i = 1; i < rows.length; i++){
            //console.log(rows[i])
            let nameTd = rows[i].getElementsByTagName("td")[1]
            // console.log(nameTd.innerText)
            let provider = dataRows.filter(row => row.name === nameTd.innerText)
            // console.log(provider[0])
            nameTd.onclick = () => handleClickDetails(provider[0])
            nameTd.className = "details-name"
        }
    }
    
    const updateRightLeftArrows = (dataRows) =>{
        // console.log("updateArrows")
        let right = document.getElementsByClassName("fa-chevron-right");
        let left = document.getElementsByClassName("fa-chevron-left");
        //console.log(right[0])
        right[0].onclick = () => {
            setTimeout(function(){
                updateNameTd(dataRows)
                // console.log("data from arrows ready")
            }, 50);
        }
        left[0].onclick = () => {
            setTimeout(function(){
                updateNameTd(dataRows)
                // console.log("data from arrows ready")
            }, 50);
        }
    }

    const getProviders = async () => {
        // console.log("getProviders")
        try {
            const providers = await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API}/api/v1/provider`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.sessionStorage.getItem('access_token')}`
                }
            })
    
            if(providers) {                
                const { data: {data} } = providers
                //console.log(data)
                const newData = generateStructure(data)
                setGridStructure(newData)
                updateRightLeftArrows(newData.rows)
                updateNameTd(newData.rows)
            }
        } catch(err) {
            toast.error(err.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }        
    }    

    return(        
        <Fragment>
            <MDBDataTableV5
                hover 
                entriesOptions={[5, 20, 25]} 
                entries={5} 
                pagesAmount={4} 
                data={gridStructure}/>
        </Fragment>
    )
}

export default ProviderTable