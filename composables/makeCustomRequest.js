export default async (attrs) => {
    if(process.client){
    const config = useRuntimeConfig()
    const backendUrl = config.public.API_BASE_URL;
    const token = localStorage.getItem('OAuth-token');
    if(!token){
        navigateTo('/login');
    }
    const url = backendUrl + attrs.url;
    const method = attrs.method ? attrs.method : 'GET';
    const body = attrs.body ? attrs.body : {};
    const query = attrs.query ? attrs.query : {};

    const headers = {
        ...attrs.headers,
        'Authorization' : 'Bearer '+token        
    }

    try {
        if(method == 'POST' || method == 'post'){
            const response = await $fetch(url , {
                method : method,
                body : body,
                headers : headers,
                query: query,
            });
            return response;   
        }
        if(method == 'PATCH' || method == 'patch'){
            const response = await $fetch(url , {
                method : method,
                body : body,
                headers : headers,
                query: query,
            });
            return response;   
        }
        else{
            const response = await $fetch(url , {
                method : method,
                headers : headers,
                query: query,
            });
            return response;            
        }
    } catch (error) {
        return error;
    }

    const basic = {
        url : url,
        method : method,
        query : query
    };
    const basicWithHeaders = {
        ...basic,
        headers : headers        
    }
    const withBody = {...basic , 'body' : body};
    
    const withBodyHeaders = {
        ...basic,
        headers : headers
    }

    if(headers && Object.keys(body).length === 0){
        const response = await $fetch(url , basicWithHeaders);
        return response;
    }
    else if(headers && body){
        const response = await $fetch(url , withBodyHeaders);
        return response;
    }
    else if(body && Object.keys(headers).length === 0){
        const response = await $fetch(url , withBody);
        return response;
    }
    else {
        const response = await $fetch(url , basic);
        return response;
    }
    }
}