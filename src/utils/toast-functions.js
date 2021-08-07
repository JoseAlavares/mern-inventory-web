import { toast } from 'react-toastify'
const config = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}

function toastMessage(type, message) {
    if((!message || typeof message !== 'string') || (typeof type !== 'string' || !type )) {
        throw new Error('Parameter error')
    }
    
    switch(type) {
        case 'success':
            toast.success(message, config)
            break
        case 'error':
            toast.error(message, config)
            break
        case 'warning':
            toast.warn(message, config)
            break
        default:
            throw new Error(`Error in toast function: not exists the type: ${type}`)
    }
    
}

export { toastMessage }