import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { 
    MDBNavbar, 
    MDBNavbarBrand, 
    MDBNavbarNav, 
    MDBNavbarToggler, 
    MDBCollapse, 
    MDBNavItem,
    MDBDropdownToggle,
    MDBDropdown,
    MDBIcon,
    MDBDropdownMenu,
    MDBDropdownItem
} from 'mdbreact'
import './Header.css'

const Header = () => {
    const [collapse, setCollapse] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const history = useHistory()

    const onClick = () => {        
        setCollapse(!collapse)
    }

    const logout = () => {
        window.sessionStorage.removeItem('access_token')
        history.push('/auth')
    }

    return (
        <MDBNavbar className="flexible-navbar" expand="md" scrolling>
            <MDBNavbarToggler onClick = { onClick } />
            <MDBCollapse isOpen = { collapse } navbar>                
                <MDBNavbarNav right>                   
                    <MDBNavItem>
                        <MDBDropdown>
                            <MDBDropdownToggle nav caret>
                                <MDBIcon icon="user" className="user-icon"/>
                            </MDBDropdownToggle>
                            <MDBDropdownMenu className="dropdown-default fix-menu">
                                <MDBDropdownItem href="#!" onClick={logout}>Cerrar sesion
                                </MDBDropdownItem>
                                <MDBDropdownItem href="#!">Perfil</MDBDropdownItem>                                
                            </MDBDropdownMenu>
                        </MDBDropdown>
                    </MDBNavItem>
                </MDBNavbarNav>
            </MDBCollapse>
        </MDBNavbar>
    )
}

export default Header