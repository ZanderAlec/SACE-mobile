import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Log API URL for debugging (will show undefined if not set)
console.log('API_URL from .env:', API_URL || 'NOT SET - Check your .env file');

const api = axios.create({
    baseURL: API_URL,
    timeout: 60000, // 60 second timeout for file uploads
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        try {
            // Skip token check for login endpoint (login doesn't need token)
            const isLoginRequest = config.url === '/login' || config.url?.endsWith('/login');
            
            if (!isLoginRequest) {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log('Token added to request for:', config.url);
                } else {
                    console.warn('No token found in AsyncStorage for request:', config.url);
                }
            }
            
            // For FormData, remove Content-Type to let React Native set it with boundary
            // Check if data is FormData (React Native FormData)
            const isFormData = config.data && (
                config.data instanceof FormData || 
                (typeof FormData !== 'undefined' && config.data.constructor && config.data.constructor.name === 'FormData') ||
                (config.data._parts !== undefined) ||
                (config.data._streams !== undefined)
            );
            
            if (isFormData) {
                // Remove Content-Type header completely - React Native will set it with boundary
                delete config.headers['Content-Type'];
                delete config.headers['content-type'];
                // Increase timeout for FormData requests
                if (!config.timeout || config.timeout < 60000) {
                    config.timeout = 60000;
                }
                console.log('FormData request detected, Content-Type removed, timeout:', config.timeout);
                console.log('Headers after FormData detection:', Object.keys(config.headers));
            } else {
                console.log('Not FormData, keeping Content-Type:', config.headers['Content-Type']);
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration and connection errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle connection errors (network issues, server down, etc.)
        if (!error.response) {
            const fullUrl = (error.config?.baseURL || 'NOT SET') + (error.config?.url || '');
            console.error('\n========== CONNECTION ERROR ==========');
            console.error('Error message:', error.message);
            console.error('Error code:', error.code);
            console.error('Full Request URL:', fullUrl);
            console.error('API_URL from env:', API_URL || 'NOT SET - Check .env file');
            console.error('\nPossible causes:');
            console.error('1. Server is not running on', error.config?.baseURL || 'unknown');
            console.error('2. Network connectivity issue');
            console.error('3. Wrong URL in .env file');
            if (error.config?.baseURL?.includes('localhost') || error.config?.baseURL?.includes('127.0.0.1')) {
                console.error('\n⚠️  LOCALHOST DETECTED - This will NOT work on Android!');
                console.error('For Android Emulator: Use http://10.0.2.2:5000');
                console.error('For Physical Device: Use your computer IP (e.g., http://192.168.1.100:5000)');
                console.error('Find your IP: Windows: ipconfig | Mac/Linux: ifconfig');
            }
            console.error('=====================================\n');
            
            // Add helpful info to error object for UI
            error.isNetworkError = true;
            error.helpfulMessage = error.config?.baseURL?.includes('localhost') || error.config?.baseURL?.includes('127.0.0.1')
                ? 'Erro: localhost não funciona no Android. Use 10.0.2.2 (emulador) ou o IP do computador (dispositivo físico).'
                : 'Erro de conexão. Verifique se o servidor está rodando e a URL no .env está correta.';
        }
        
        if (error.response?.status === 401) {
            // Token expired or invalid, clear stored token
            try {
                await AsyncStorage.removeItem('authToken');
            } catch (clearError) {
                console.error('Error clearing token:', clearError);
            }
        }
        return Promise.reject(error);
    }
);


const authApi = {
    async login(username, password) {
        try {
            const loginUrl = API_URL ? `${API_URL}/login` : '/login';
            console.log('Attempting login to:', loginUrl);
            console.log('API_URL value:', API_URL || 'UNDEFINED - Check your .env file');
            const response = await api.post('/login', { username: username, password });
            return response.data;
        } catch (error) {
            // Error is already logged by the interceptor
            throw error;
        }
    },

}

const areasApi = {
    async getAreas() {
        try {
            const response = await api.get('/area_de_visita');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    async getRegistrosByArea(area_de_visita_id) {
        try {
            const response = await api.get(`/area_de_visita/${area_de_visita_id}/registros`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}

const registersApi = {
    async getRegisters() {
        try {
            const response = await api.get('/registro_de_campo');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    async createRegister(formData) {
        try {
            console.log('createRegister called with:', formData);
            // Use FormData for file upload support
            const data = new FormData();
            console.log('FormData instance created:', data instanceof FormData);
            
            // Required string fields - always append even if empty
            data.append('imovel_numero', String(formData.imovel_numero || ''));
            data.append('imovel_lado', String(formData.imovel_lado || ''));
            data.append('imovel_categoria_da_localidade', String(formData.imovel_categoria_da_localidade || ''));
            data.append('imovel_tipo', String(formData.imovel_tipo || ''));
            data.append('imovel_status', String(formData.imovel_status || ''));
            
            // Required integer field - area_de_visita_id
            data.append('area_de_visita_id', parseInt(formData.area_de_visita_id, 10));
            
            // Required integer fields - deposit counts (a1, a2, b, c, d1, d2, e)
            data.append('a1', parseInt(formData.a1 || 0, 10));
            data.append('a2', parseInt(formData.a2 || 0, 10));
            data.append('b', parseInt(formData.b || 0, 10));
            data.append('c', parseInt(formData.c || 0, 10));
            data.append('d1', parseInt(formData.d1 || 0, 10));
            data.append('d2', parseInt(formData.d2 || 0, 10));
            data.append('e', parseInt(formData.e || 0, 10));
            
            // Optional string fields
            if (formData.imovel_complemento) {
                data.append('imovel_complemento', String(formData.imovel_complemento));
            }
            if (formData.formulario_tipo) {
                data.append('formulario_tipo', String(formData.formulario_tipo));
            }
            
            // Boolean flags - send actual booleans (FormData will convert to strings)
            data.append('li', formData.li === true);
            data.append('pe', formData.pe === true);
            data.append('t', formData.t === true);
            data.append('df', formData.df === true);
            data.append('pve', formData.pve === true);
            
            // Optional string fields
            if (formData.numero_da_amostra) {
                data.append('numero_da_amostra', String(formData.numero_da_amostra));
            }
            
            // Optional integer field - quantiade_tubitos
            if (formData.quantiade_tubitos !== undefined && formData.quantiade_tubitos !== null) {
                data.append('quantiade_tubitos', parseInt(formData.quantiade_tubitos, 10));
            }
            
            // Optional string fields
            if (formData.observacao) {
                data.append('observacao', String(formData.observacao));
            }
            
            // Optional JSON string fields - larvicidas and adulticidas
            if (formData.larvicidas) {
                data.append('larvicidas', String(formData.larvicidas));
            }
            if (formData.adulticidas) {
                data.append('adulticidas', String(formData.adulticidas));
            }
            
            // Add files if they exist
            if (formData.files && Array.isArray(formData.files) && formData.files.length > 0) {
                console.log('Adding files to FormData:', formData.files.length);
                formData.files.forEach((file, index) => {
                    if (file.uri) {
                        // React Native FormData file format for Android/iOS
                        const fileExtension = file.name?.split('.').pop() || file.uri.split('.').pop() || 'jpg';
                        const fileName = file.name || `file_${index}.${fileExtension}`;
                        const fileType = file.type || `image/${fileExtension === 'png' ? 'png' : 'jpeg'}`;
                        
                        console.log(`Appending file ${index}:`, { uri: file.uri, name: fileName, type: fileType });
                        
                        // React Native FormData expects this format
                        data.append('files', {
                            uri: file.uri,
                            name: fileName,
                            type: fileType,
                        });
                    }
                });
            } else {
                console.log('No files to upload');
            }
            
            console.log('FormData being sent:', {
                imovel_numero: formData.imovel_numero,
                imovel_lado: formData.imovel_lado,
                imovel_categoria_da_localidade: formData.imovel_categoria_da_localidade,
                imovel_tipo: formData.imovel_tipo,
                imovel_status: formData.imovel_status,
                area_de_visita_id: formData.area_de_visita_id,
                a1: formData.a1,
                a2: formData.a2,
                b: formData.b,
                c: formData.c,
                d1: formData.d1,
                d2: formData.d2,
                e: formData.e,
            });
            
            // React Native FormData automatically sets Content-Type with boundary
            // The interceptor will handle removing Content-Type header for FormData
            console.log('About to send POST request with FormData');
            console.log('FormData type check:', data instanceof FormData, typeof data, data.constructor?.name);
            console.log('FormData has _parts:', data._parts ? 'yes' : 'no');
            console.log('FormData has _streams:', data._streams ? 'yes' : 'no');
            
            // Use axios with proper config for FormData
            const response = await api.post('/registro_de_campo', data, {
                timeout: 60000, // 60 second timeout for file uploads
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                // Don't use transformRequest - let the interceptor handle it
            });
            console.log('Request successful:', response.status);
            return response.data;
        } catch (error) {
            console.error('API Error Details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText,
            });
            throw error;
        }
    },
    
    async deleteRegister(registro_de_campo_id) {
        try {
            const response = await api.delete(`/registro_de_campo/${registro_de_campo_id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    async updateRegister(registro_de_campo_id, formData) {
        try {
            console.log('updateRegister called with:', { registro_de_campo_id, formData });
            // Use FormData for file upload support
            const data = new FormData();
            console.log('FormData instance created:', data instanceof FormData);
            
            // Required string fields - always append even if empty
            data.append('imovel_numero', String(formData.imovel_numero || ''));
            data.append('imovel_lado', String(formData.imovel_lado || ''));
            data.append('imovel_categoria_da_localidade', String(formData.imovel_categoria_da_localidade || ''));
            data.append('imovel_tipo', String(formData.imovel_tipo || ''));
            data.append('imovel_status', String(formData.imovel_status || ''));
            
            // Required integer field - area_de_visita_id
            data.append('area_de_visita_id', parseInt(formData.area_de_visita_id, 10));
            
            // Required integer fields - deposit counts (a1, a2, b, c, d1, d2, e)
            data.append('a1', parseInt(formData.a1 || 0, 10));
            data.append('a2', parseInt(formData.a2 || 0, 10));
            data.append('b', parseInt(formData.b || 0, 10));
            data.append('c', parseInt(formData.c || 0, 10));
            data.append('d1', parseInt(formData.d1 || 0, 10));
            data.append('d2', parseInt(formData.d2 || 0, 10));
            data.append('e', parseInt(formData.e || 0, 10));
            
            // Optional string fields
            if (formData.imovel_complemento) {
                data.append('imovel_complemento', String(formData.imovel_complemento));
            }
            if (formData.formulario_tipo) {
                data.append('formulario_tipo', String(formData.formulario_tipo));
            }
            
            // Boolean flags - send actual booleans (FormData will convert to strings)
            data.append('li', formData.li === true);
            data.append('pe', formData.pe === true);
            data.append('t', formData.t === true);
            data.append('df', formData.df === true);
            data.append('pve', formData.pve === true);
            
            // Optional string fields
            if (formData.numero_da_amostra) {
                data.append('numero_da_amostra', String(formData.numero_da_amostra));
            }
            
            // Optional integer field - quantiade_tubitos
            if (formData.quantiade_tubitos !== undefined && formData.quantiade_tubitos !== null) {
                data.append('quantiade_tubitos', parseInt(formData.quantiade_tubitos, 10));
            }
            
            // Optional string fields
            if (formData.observacao) {
                data.append('observacao', String(formData.observacao));
            }
            
            // Optional JSON string fields - larvicidas and adulticidas
            if (formData.larvicidas) {
                data.append('larvicidas', String(formData.larvicidas));
            }
            if (formData.adulticidas) {
                data.append('adulticidas', String(formData.adulticidas));
            }
            
            // Add files if they exist
            if (formData.files && Array.isArray(formData.files) && formData.files.length > 0) {
                console.log('Adding files to FormData:', formData.files.length);
                formData.files.forEach((file, index) => {
                    if (file.uri) {
                        // React Native FormData file format for Android/iOS
                        const fileExtension = file.name?.split('.').pop() || file.uri.split('.').pop() || 'jpg';
                        const fileName = file.name || `file_${index}.${fileExtension}`;
                        const fileType = file.type || `image/${fileExtension === 'png' ? 'png' : 'jpeg'}`;
                        
                        console.log(`Appending file ${index}:`, { uri: file.uri, name: fileName, type: fileType });
                        
                        // React Native FormData expects this format
                        data.append('files', {
                            uri: file.uri,
                            name: fileName,
                            type: fileType,
                        });
                    }
                });
            } else {
                console.log('No files to upload');
            }
            
            console.log('FormData being sent for update:', {
                registro_de_campo_id,
                imovel_numero: formData.imovel_numero,
                imovel_lado: formData.imovel_lado,
                imovel_categoria_da_localidade: formData.imovel_categoria_da_localidade,
                imovel_tipo: formData.imovel_tipo,
                imovel_status: formData.imovel_status,
                area_de_visita_id: formData.area_de_visita_id,
            });
            
            // Use axios with proper config for FormData
            const response = await api.put(`/registro_de_campo/${registro_de_campo_id}`, data, {
                timeout: 60000, // 60 second timeout for file uploads
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });
            console.log('Update request successful:', response.status);
            return response.data;
        } catch (error) {
            console.error('API Error Details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText,
            });
            throw error;
        }
    },
}

export default authApi;
export { areasApi, registersApi, api };