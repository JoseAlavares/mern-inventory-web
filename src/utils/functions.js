export const validateEmail = (email) => {
    const pattern = RegExp(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);

    if(!pattern.test(email)) {
        return false
    }

    return true;
}

export const getPayloadToken = () => {
    let token = sessionStorage.getItem('access_token');
    let jwtObject = JSON.parse(atob(token.split('.')[1]))
    return jwtObject
}

export const formatNumeric = (input) => {
    return input.replace(/[^\d]/g, '')
}

export const formatFloat = (input, decimalNumber) => {
    if(typeof input === "number") {
        input = input.toString()
    }
    
    let src = input.trim()

    if (src !== '') {
        var nums = src.replace(/[^\.\d-]/g, '').split(/\./)
            
        //-- Decimales
        var decimals = decimalNumber
        //var decClass = oSrc.className.match(/precision-\d+/);
            
        // if (decClass != null) {
        //     decimals = Math.max(1, parseInt(decClass[0].replace(/precision-(\d+)/, '$1')));
        // }
            
        nums[1] = (nums[1] == null || nums[1] == '' ? '0' : nums[1])
        nums[1] = nums[1].substr(0, decimals).padEnd(decimals, '0', 1)
            
        //-- Enteros        
        //var length = $(oSrc).attr('maxlength');
        nums[0] = (nums[0] == null || nums[0] == '' ? '0' : nums[0])
            
        src = nums[0] + '.' + nums[1]
        //if (length != null) src = src.slice(-length);

        return src
    }

    throw new Error("Parameter error expcetion")
}

export const onlyNumbers = (input) => {
    if(!input || input === null || input === 'undefined') {
        return 0
    }
    const regex = new RegExp(/^(\d|-)?(\d|,)*\.?\d*$/)
    return regex.test(input)
}

export const cleanCharacters = (input) => {
    return input.replace(/[^\d.]/, '')
}