import axios from "axios";

const instance = axios.create({baseURL: "http://localhost:3001",});

let serverVersionPromise = null;

const detectServerVersion = () => {
  if (!serverVersionPromise) {
    serverVersionPromise = instance
      .get("/products", { params: { _page: 1 } })
      .then(({ data }) => (Array.isArray(data) ? "legacy" : "v1"))
      .catch((error) => {
        serverVersionPromise = null;
        throw error;
      });
  }
  return serverVersionPromise;
};

export const productAPI = {
  getProducts: async ({ page = 1, limit = 6, category, sort } = {}) => {
    const version = await detectServerVersion();
    const params = { _page: page };

    if (category) params.category = category;

    if (version === "legacy") {
      params._limit = limit;
      if (sort) {
        const [field, order] = sort.split("_");
        params._sort = field;
        params._order = order;
      }
    } else {
      params._per_page = limit;
      if (sort) {
        const [field, order] = sort.split("_");
        params._sort = order === "desc" ? `-${field}` : field;
      }
    }

    const { data } = await instance.get("/products", { params });
    return Array.isArray(data) ? data : (data?.data ?? []);
  },

  getProductById: async (id) => {
    const { data } = await instance.get(`/products/${id}`);
    return data;
  },

  createProduct: async (product) => {
    const { data } = await instance.post("/products", product);
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
    const { data } = await instance.get("/categories");
    return data;
  },
};
