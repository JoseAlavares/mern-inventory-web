import React, {} from 'react'
import { 
    MDBContainer,
    MDBBtn,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader,
    MDBRow,
    MDBCol  
} from 'mdbreact'
import { formatFloat } from '../../utils/functions'
import './providerModal.css'

const ProviderModalDetails = ({ handleModalDetails, openModalDetails, providerData }) => {
    //const [modalDetailsOpen, setModalDetailsOpen] = useState(false)

    // const handleModalDetails = () => {
    //     setModalDetailsOpen(!modalDetailsOpen)
    // }

    return (
        <MDBContainer>
            <MDBModal isOpen={openModalDetails} toggle={handleModalDetails} centered>
                <MDBModalHeader toggle={handleModalDetails}>
                    Detalles del proveedor
                </MDBModalHeader>
                <MDBModalBody>                    
                    <MDBRow>
                        <MDBCol md="6">
                            <h4>Margenes de utilidad</h4>
                            <ul>
                                <li>Nivel 1: <span>{formatFloat(providerData.level1 || 0, 2)}%</span></li>
                                <li>Nivel 2: <span>{formatFloat(providerData.level2 || 0, 2)}%</span></li>
                                <li>Nivel 3: <span>{formatFloat(providerData.level3 || 0, 2)}%</span></li>
                                <li>Nivel 4: <span>{formatFloat(providerData.level4 || 0, 2)}%</span></li>
                                <li>Nivel 5: <span>{formatFloat(providerData.level5 || 0, 2)}%</span></li>
                            </ul>
                        </MDBCol>
                        <MDBCol md="6">
                            <div>
                                <h4>Datos bancarios</h4>
                                <p>{providerData.bankData}</p>
                            </div>
                        </MDBCol>
                    </MDBRow> 
                    <MDBRow>
                        <MDBCol md="6">
                            <h4>Datos de el jefe</h4>
                            <label>Nombre: <span>{providerData.bossName}</span></label>
                            <label>Telefono: <span>{providerData.telephoneBoss}</span></label>
                            <label>Correo: <span>{providerData.emailBoss}</span></label>
                        </MDBCol>
                    </MDBRow>                   
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn className="cancel-button" onClick={handleModalDetails}>Cerrar</MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        </MDBContainer>
    )
}

export default ProviderModalDetails