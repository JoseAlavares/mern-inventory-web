import React from 'react'
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle
} from 'mdbreact'
import './TechnicalCard.css'

const Item = ({ data }) => {
    return (
        <div className="item">
            <label>{data[0]}: </label>
            <span style={{marginLeft: 5}}>
                <b>{data[1] || "N/A"}</b>
            </span>
        </div>
    )
}

const TechnicalCard = ({ techinalCardContent }) => {    
    return (
        <MDBCard>
            <MDBCardBody>
                <MDBCardTitle>Detalles</MDBCardTitle>
                <div className="wrapper">
                    <div className="items">
                        {techinalCardContent.length
                            ? techinalCardContent.map(t => (<Item data={t} key={t[0]}/>))
                            : <p>Da click en un registro para ver su información</p>
                        }
                    </div>
                </div>
            </MDBCardBody>
        </MDBCard>
    )            
}

export default TechnicalCard