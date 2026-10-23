import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001',
});

export const productAPI = {
  getProducts: async ({ page, limit, category, sort }) => {
    const params = { 
      _page: page, 
      _limit: limit 
    };
    
    if (category && category !== '') params.category = category;
    if (sort && sort !== '') {
      const [field, order] = sort.split('_');
      params._sort = field;
      params._order = order;
    }
    
    const response = await instance.get('/products', { params });
    const data = response.data;

    console.log('Ответ от json-server:', data);

    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === 'object') {
      const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
      if (arrayKey) {
        return data[arrayKey];
      }
    }

    return [];
  },
  
  getProductById: async (id) => {
    const { data } = await instance.get(`/products/${id}`);
    return data;
  },
  
  createProduct: async (product) => {
    const { data } = await instance.post('/products', product);
    return data;
  },
  
  updateProduct: async ({ id, data: product }) => {
    const { data } = await instance.put(`/products/${id}`, product);
    return data;
  },
  
  deleteProduct: async (id) => {
    const { data } = await instance.delete(`/products/${id}`);
    return data;
  },
};

export const categoryAPI = {
  getCategories: async () => {
    const { data } = await instance.get('/categories');
    return data;
  },
};