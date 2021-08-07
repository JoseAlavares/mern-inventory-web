import React from 'react'
import { MDBListGroup, MDBListGroupItem, MDBIcon } from 'mdbreact'
import { NavLink } from 'react-router-dom'
import './SideBar.css'

const SideBar = () => {
    return (
        <div className="sidebar-fixed position-fixed">
            <a href="#!" className="logo-wrapper waves-effect">
                <img alt="MDB React Logo" className="img-fluid" src={`/logo_pelon.png`}/>
            </a>
            <MDBListGroup className="list-group-flush"> 
                <NavLink to="/home" activeClassName="custom-active" className="inicio-menu-titles">
                    <MDBListGroupItem>
                        Inicio
                    </MDBListGroupItem>
                </NavLink>   
                <p className="custom-active mb-0 menu-titles">Operaciones</p>  
                <NavLink to="/home" activeClassName="custom-active" className="subtitle-menu">
                    <MDBListGroupItem>
                        Cargas
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/stock" activeClassName="custom-active" className="subtitle-menu">
                    <MDBListGroupItem>
                        Inventario
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/home" activeClassName="custom-active" className="subtitle-menu">
                    <MDBListGroupItem>
                        Devoluciones
                    </MDBListGroupItem>
                </NavLink>
                <p className="custom-active mb-0 menu-titles">Administración</p>
                <NavLink to="/sector" activeClassName="custom-active" className="subtitle-menu">
                    <MDBListGroupItem>
                        Familia
                    </MDBListGroupItem>
                </NavLink>                
                <NavLink to="/category" activeClassName="custom-active" className="subtitle-menu">
                    <MDBListGroupItem>
                        Sub familia
                    </MDBListGroupItem>
                </NavLink>                                
                <NavLink to="/provider" activeClassName="custom-active" className="subtitle-menu">
                    <MDBListGroupItem>
                        Proveedor
                    </MDBListGroupItem>
                </NavLink>                
                <NavLink to="/product" activeClassName="custom-active" className="subtitle-menu">
                    <MDBListGroupItem>
                        Producto
                    </MDBListGroupItem>
                </NavLink>                 
                <NavLink to="/warehouse" activeClassName="custom-active" className="subtitle-menu">
                    <MDBListGroupItem>
                        Almacenes
                    </MDBListGroupItem>
                </NavLink> 
                <NavLink to="/section" activeClassName="custom-active" className="subtitle-menu">
                    <MDBListGroupItem>
                        Bodegas
                    </MDBListGroupItem>
                </NavLink> 
                <p className="custom-active mb-0 menu-titles">Configuración</p>
                <NavLink to="/user" activeClassName="custom-active" className="subtitle-menu">
                    <MDBListGroupItem>
                        Usuarios
                    </MDBListGroupItem>
                </NavLink>             
            </MDBListGroup>
        </div>
    )
}

export default SideBar