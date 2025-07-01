import React, { useState, useEffect } from "react";
import AdminLayout from "../Components/AdminLayout";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import { MdOutlineHome } from 'react-icons/md'

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", quantity: "", price: "" });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.Backend_URL}/products`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const addProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.quantity && newProduct.price) {
      axios.post(`${import.meta.env.Backend_URL}/add-product`, newProduct)
        .then((response) => {
          setProducts([...products, response.data]);
          setNewProduct({ name: "", quantity: "", price: "" });
        })
        .catch((error) => console.error("Error adding product:", error));
      toast.success("Product Added Successfully..!");
    } else {
      toast.error("Please Fill All The Fields..!");
    }
  };

  const deleteProduct = (id) => {
    axios.delete(`${import.meta.env.Backend_URL}/delete-product/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product._id !== id));
      })
      .catch((error) => console.error("Error deleting product:", error));
    toast.warning("Deleted Product..!")
  };

  const startEditing = (product) => {
    setEditingProduct(product);
  };

  const saveEditProduct = (e) => {
    e.preventDefault();
    if (editingProduct.name && editingProduct.quantity && editingProduct.price) {
      axios.put(`${import.meta.env.Backend_URL}/update-product/${editingProduct._id}`, editingProduct)
        .then((response) => {
          setProducts(products.map((product) =>
            product._id === editingProduct._id ? response.data : product
          ));
          setEditingProduct(null);
        })
        .catch((error) => console.error("Error updating product:", error));
      toast.success("Successful Updating Product..!");
    } else {
      toast.error("Please fill all the fields");
    }
  };

  return (

    <AdminLayout>
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-600 mb-4">
        <nav className="flex items-center space-x-2">
          <span className="text-gray-500">
            <Link to='/home'><MdOutlineHome fontSize={20} /></Link>
          </span>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-800">Inventory</span>
        </nav>
      </div>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">


        {/* Form */}
        <form
          onSubmit={editingProduct ? saveEditProduct : addProduct}
          className="bg-white p-6 rounded-xl shadow-md mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600 mb-1">Product Name:</label>
              <input
                type="text"
                placeholder="Product Name"
                value={editingProduct ? editingProduct.name : newProduct.name}
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, name: e.target.value })
                    : setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2 capitalize focus:outline-blue-500"
                required
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600 mb-1">Price:</label>
              <input
                type="number"
                placeholder="Price"
                value={editingProduct ? editingProduct.price : newProduct.price}
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                    : setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-blue-500"
                required
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600 mb-1">Quantity:</label>
              <input
                type="number"
                placeholder="Quantity"
                value={editingProduct ? editingProduct.quantity : newProduct.quantity}
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) })
                    : setNewProduct({ ...newProduct, quantity: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-blue-500"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {editingProduct ? "Save" : "Add Product"}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Product Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow p-4 mb-6">
          <table className="w-full  text-center text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-4">Product Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Stocks</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className=" py-2 capitalize">{product.name}</td>
                  <td className="py-2 text-blue-600 font-semibold">₹ {product.price.toFixed(2)}</td>
                  <td className="py-2">{product.quantity}</td>
                  <td className="py-2 font-semibold">
                    {product.quantity === 0 ? (
                      <span className="text-red-500">Out of Stock</span>
                    ) : (
                      <span className="text-green-500">Available</span>
                    )}
                  </td>
                  <td className="py-2">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => startEditing(product)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-gray-500 py-6">No products available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ToastContainer />
      </div>
    </AdminLayout>
  );
};

export default Inventory;