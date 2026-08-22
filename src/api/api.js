import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function register(payload){
    const res = await api.post('/register', payload);
    return res.data;
}
export async function login(payload){
    const res = await api.post('/login', payload);
    return res.data;
}

//Categories
export async function getCategories(params ={}){
    const res = await api.get('/categories', {params});
    return res.data;
}
export async function getCategory(id){
    const res = await api.get(`/categories/${id}`);
    return res.data;
}
export async function createCategory(payload){
    const res = await api.post(`/categories`, payload);
    return res.data;
}
export async function updateCategory(id, payload){
    const res = await api.put(`/categories/${id}`, payload);
    return res.data;
}
export async function deleteCategory(id){
    const res = await api.delete(`/categories/${id}`);
    return res.data;
}

//Products
export async function getProducts(params = {}){
    const res = await api.get("/products", {params});
    return res.data;
}
export async function getProduct(id){
    const res = await api.get(`/products/${id}`);
    return res.data;
}
export async function createProduct(payload){
    const res = await api.post("/products", payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}
export async function updateProduct(id,payload){
    const res = await api.patch(`/products/${id}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}
export async function deleteProduct(id){
    const res = await api.delete(`/products/${id}`);
    return res.data;
}
export async function getProductStock(payload = {}){
    const res = await api.post('/products/stock', payload);
    return res.data;
}

// Users
export async function getUsers(params = {}){
    const res = await api.get('/users', {params});
    return res.data;
}
export async function dataUser(){
    const res = await api.get('/users/profile');
    return res.data;
}
export async function updateMyUser(payload){
    const res = await api.patch('/users/edit', payload);
    return res.data;
}
export async function createUser(payload){
    const res = await api.post('/users',payload);
    return res.data;
}
export async function deleteUser(id){
    const res = await api.delete(`/users/${id}`);
    return res.data;
}
export async function updateUser(id,payload){
    const res = await api.patch(`/users/${id}`, payload);
    return res.data;
}

// Roles
export async function getRoles(params = {}){
    const res = await api.get('/roles', {params});
    return res.data;
}
export async function createRole(payload){
    const res = await api.post('/roles', payload);
    return res.data;
}
export async function updateRole(id,payload){
    const res = await api.patch(`/roles/${id}`, payload);
    return res.data;
}
export async function deleteRole(id){
    const res = await api.delete(`/roles/${id}`);
    return res.data;
}

// Profile
export async function getMyProfile(){
    const res = await api.get(`/users/me`);
    return res.data;
}
export async function createProfile(payload){
    const res = await api.post('/users/me', payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}
export async function updateMyProfile(payload){
    const res = await api.patch(`/users/me`,payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}

// Units
export async function getUnits(params = {}){
    const res = await api.get('/units', {params});
    return res.data;
}
export async function createUnit(payload){
    const res = await api.post('/units', payload);
    return res.data;
}
export async function updateUnit(id,payload){
    const res = await api.patch(`/units/${id}`, payload);
    return res.data;
}
export async function deleteUnit(id){
    const res = await api.delete(`/units/${id}`);
    return res.data;
}

// Supplier
export async function getSuppliers(params = {}){
    const res = await api.get('/suppliers', {params});
    return res.data;
}
export async function createSupplier(payload){
    const res = await api.post('/suppliers', payload);
    return res.data;
}
export async function updateSupplier(id, payload){
    const res = await api.patch(`/suppliers/${id}`, payload);
    return res.data;
}
export async function deleteSupplier(id){
    const res = await api.delete(`/suppliers/${id}`);
    return res.data;
}

// Customer
export async function getCustomers(params ={}){
    const res = await api.get('/customers', {params});
    return res.data;
}
export async function createCustomer(payload){
    const res = await api.post('/customers', payload);
    return res.data;
}
export async function updateCustomer(id,payload){
    const res = await api.patch(`/customers/${id}`, payload);
    return res.data;
}
export async function deleteCustomer(id){
    const res = await api.delete(`/customers/${id}`);
    return res.data;
}
// Movement
export async function getMovements(params ={}){
    const res = await api.get('/movements/list', {params});
    return res.data;
}
export async function createMovement(payload){
    const res = await api.post(`/movements`, payload)
    return res.data;
}
export async function getMovementsRequest(params={}){
    const res = await api.get('/movements/list-requests', {params});
    return res.data;
}
export async function userActivity(params = {}){
    const res = await api.get('/movements', {params});
    return res.data;
}

// Request
export async function getRequests(params = {}){
    const res = await api.get('/requests/list', {params});
    return res.data;
}
export async function createRequest(paylod){
    const res = await api.post('/requests', paylod);
    return res.data;
}
export async function cancelRequest(id, payload){
    const res = await api.patch(`/requests/${id}/cancel`,payload);
    return res.data;
}
export async function approvedRequest(id){
    const res = await api.patch(`/requests/${id}/approved`);
    return res.data;
}
export async function rejectRequest(id,payload){
    const res = await api.patch(`/requests/${id}/reject`, payload);
    return res.data;
}
export async function getRequestItems(id){
    const res = await api.get(`/requests/${id}/reqItems`);
    return res.data;
}
// Dashboard
export async function dashboardSummary(params={}){
    const res = await api.get('/dashboards/summary',{params});
    return res.data;
}
export async function userDashboard(params={}){
    const res = await api.get('/dashboards/user-summary',{params});
    return res.data;
}

export default api;