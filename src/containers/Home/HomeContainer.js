import React, { Fragment } from "react"
import Header from '../../common-components/Header/Header'
import SideBar from '../../common-components/SideBar/SideBar'

const HomeContainer = ({ children }) => {
    
    return (
        <div className="flexible-content">
            <Header/>
            <SideBar/>
            <main id="content" className="p-5">
                Build...
            </main>
            {/*<Footer/>*/}
        </div>
    )
}

export default HomeContainer