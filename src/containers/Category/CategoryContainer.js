import React, { Fragment, useState } from 'react'
import { MDBRow, MDBCol, MDBBtn } from 'mdbreact'
import Assets from '../../assets/Assets'
import CategoryTable from '../../components/CategoryTable/CategoryTable'
import CategoryModal from '../../components/CategoryModal/CategoryModal'
import Header from '../../common-components/Header/Header'
import SideBar from '../../common-components/SideBar/SideBar'
import './categoryContainer.css'

const CategoryContainer = () => {
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState('')
    const [id, setId] = useState(null)
    const [changeTable, setChangeTable] = useState(false)

    const handleModal = () => {
        setOpen(!open)
    }

    const handleMode = (data) => {
        setMode(data)
    }

    const idCategory = (_id) => {
        setId(_id)
    }

    const refreshTable = () => {
        setChangeTable(!changeTable)
    }

    return(
        <div className="flexible-content">
            <Header/>
            <SideBar/>
            <main id="content" className="p-5">
                <Fragment>
                    <MDBRow>
                        <MDBCol md="4" lg="4" sm="12" xs="12">
                            <h3 className="section-title">Sub familia</h3>
                        </MDBCol>
                        <MDBCol md="4" lg="4" sm="12" xs="12" className="offset-md-4 offset-lg-4 text-right">
                            <button className="btn Ripple-parent add-btn" onClick={() => {
                                handleModal()
                                setMode('new_category')
                            }}>
                                <img src={Assets.categoryImgs.plus} 
                                    className="add-icon" 
                                    alt="plus-icon"
                                ></img><label className="add-btn-text">Agregar</label>
                            </button>
                        </MDBCol>
                    </MDBRow> 
                    <CategoryModal
                        open={open}
                        mode={mode}
                        id={id}
                        handleModal={handleModal}
                        refreshTable={refreshTable}
                        />
                    <MDBRow>
                        <MDBCol md="12">
                            <CategoryTable
                                handleModal={handleModal}
                                handleMode={handleMode}
                                idCategory={idCategory}
                                changeTable={changeTable}
                                />
                        </MDBCol>
                    </MDBRow>            
                </Fragment>
            </main>            
        </div>        
    )
}

export default CategoryContainer