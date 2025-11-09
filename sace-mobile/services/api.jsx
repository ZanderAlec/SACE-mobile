import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// normalize env URL (adiciona protocolo se faltando)
let API_URL = process.env.EXPO_PUBLIC_API_URL || '';
if (API_URL && !/^https?:\/\//i.test(API_URL)) {
    API_URL = 'http://' + API_URL.replace(/^\/+/, '');
}
console.log('Resolved API_URL:', API_URL);

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
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const isFormData =
        config.data &&
        (config.data instanceof FormData ||
          config.data._parts !== undefined ||
          config.data.constructor?.name === 'FormData');

      if (isFormData) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
      const fullUrl = (config.baseURL || '') + (config.url || '');
      console.log('REQ:', {
        method: config.method,
        fullUrl,
        isFormData,
        headers: config.headers,
      });
    } catch (e) {
      console.log('Interceptor error', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
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
            const response = await api.post('/login', { username: username, password });
            return response.data;
        } catch (error) {
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
      console.log('createRegister in:', formData);

      // Validação mínima
      if (!formData?.area_de_visita_id) {
        throw new Error('area_de_visita_id ausente');
      }

      const fd = new FormData();

      const toStr = (v) => (v === undefined || v === null ? '' : String(v));
      const toIntStr = (v, def = 0) => String(parseInt(v !== undefined ? v : def, 10) || 0);
      const toBoolStr = (v) => (v ? 'true' : 'false');

      fd.append('imovel_numero', toStr(formData.imovel_numero));
      fd.append('imovel_lado', toStr(formData.imovel_lado));
      fd.append('imovel_categoria_da_localidade', toStr(formData.imovel_categoria_da_localidade));
      fd.append('imovel_tipo', toStr(formData.imovel_tipo));
      fd.append('imovel_status', toStr(formData.imovel_status));
      fd.append('area_de_visita_id', toIntStr(formData.area_de_visita_id));

      fd.append('a1', toIntStr(formData.a1));
      fd.append('a2', toIntStr(formData.a2));
      fd.append('b', toIntStr(formData.b));
      fd.append('c', toIntStr(formData.c));
      fd.append('d1', toIntStr(formData.d1));
      fd.append('d2', toIntStr(formData.d2));
      fd.append('e', toIntStr(formData.e));

      if (formData.imovel_complemento) fd.append('imovel_complemento', toStr(formData.imovel_complemento));
      if (formData.formulario_tipo) fd.append('formulario_tipo', toStr(formData.formulario_tipo));

      fd.append('li', toBoolStr(formData.li));
      fd.append('pe', toBoolStr(formData.pe));
      fd.append('t', toBoolStr(formData.t));
      fd.append('df', toBoolStr(formData.df));
      fd.append('pve', toBoolStr(formData.pve));

      if (formData.numero_da_amostra) fd.append('numero_da_amostra', toStr(formData.numero_da_amostra));
      if (formData.quantiade_tubitos !== undefined) fd.append('quantiade_tubitos', toIntStr(formData.quantiade_tubitos));
      if (formData.observacao) fd.append('observacao', toStr(formData.observacao));
      if (formData.larvicidas) fd.append('larvicidas', toStr(formData.larvicidas));
      if (formData.adulticidas) fd.append('adulticidas', toStr(formData.adulticidas));

      if (Array.isArray(formData.files) && formData.files.length) {
        formData.files.forEach((file, i) => {
          if (file?.uri) {
            const uri = file.uri.startsWith('file://') ? file.uri : file.uri;
            const ext = file.name?.split('.').pop() || 'jpg';
            const name = file.name || `file_${i}.${ext}`;
            const type = file.type || (ext === 'png' ? 'image/png' : 'image/jpeg');
            fd.append('files', { uri, name, type });
          }
        });
      }

      console.log('FormData preview (serializado):');
      if (fd._parts) {
        console.log(fd._parts.map(([k, v]) => [k, typeof v === 'object' && v?.uri ? v : v].slice(0, 2)));
      }

      const resp = await api.post('/registro_de_campo', fd, {
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      console.log('createRegister OK status:', resp.status);
      return resp.data;
    } catch (error) {
      console.error('createRegister Network/Logic error:', {
        message: error.message,
        stack: error.stack,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  async updateRegister(id, formData) {
    // Mesma lógica — pode refatorar depois
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

export { api, areasApi, registersApi};
export default authApi;
