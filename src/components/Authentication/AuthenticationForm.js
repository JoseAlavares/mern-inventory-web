import React, { Fragment } from 'react'
import {     
	MDBCol, 
	MDBInput, 
	MDBCard,
	MDBCardBody,
    MDBBtn
} from "mdbreact";

//Styles
import './AuthenticationForm.css'

const AuthenticationForm = ({handleInput, inputValues, login, loading}) => {
    return(
        <Fragment>
            <MDBCard id="login-form" className="auth-form">
                <MDBCardBody>
                    <MDBCol md="12" lg="12">    				
                        <form>
                            <p className="h5 text-center mb-4">Acceso al sistema</p>
                            <div className="grey-text">
                                <MDBInput
                                    onChange={handleInput}
                                    value={inputValues.user || ''}
                                    name="user"
                                    label="Correo" 
                                    icon="envelope" 
                                    group type="text" 
                                    validate error="wrong"
                                    success="right" />
                                <MDBInput
                                    onChange={handleInput}
                                    value={inputValues.password || ''}
                                    name="password"
                                    label="Contraseña" 
                                    icon="lock" 
                                    group type="password" 
                                validate />

                            </div>
                            <div className="text-center">
                                <MDBBtn 
                                    color="success"
                                    onClick={login}>
                                    {loading &&
                                        <div className="spinner-border text-warning" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    ||
                                        "Enviar"
                                    }
                                    
                                </MDBBtn>
                            </div>
                        </form>      				
                    </MDBCol>
                </MDBCardBody>                
            </MDBCard>
        </Fragment>
    )
}

export default AuthenticationForm