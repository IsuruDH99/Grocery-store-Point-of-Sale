import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

// Set the app root for accessibility (required by react-modal)
Modal.setAppElement("#root");

const ProductEdit = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    productCode: "",
    productName: "",
    price: "",
    productQty: "0",
  });
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const showSuccess = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/product/get-products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      showError("Failed to load products");
    }
  };

  const openModal = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
    setDeleteConfirm(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteConfirm(false);
  };

  const handlePriceChange = (e) => {
    setCurrentProduct({ ...currentProduct, price: e.target.value });
  };

  const handleQtyChange = (e) => {
    setCurrentProduct({ ...currentProduct, productQty: e.target.value });
  };

  const handleUpdate = async () => {
    if (!currentProduct.price || isNaN(currentProduct.price)) {
      showError("Please enter a valid price");
      return;
    }

    if (isNaN(currentProduct.productQty) || currentProduct.productQty < 0) {
      showError("Please enter a valid quantity (0 or higher)");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/product/update-product/${currentProduct.productCode}`,
        {
          price: currentProduct.price,
          productQty: currentProduct.productQty || 0,
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productCode === currentProduct.productCode
            ? { ...product, price: currentProduct.price, productQty: currentProduct.productQty }
            : product
        )
      );

      showSuccess("Product updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Failed to update product:", error);
      showError(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/product/delete-product/${currentProduct.productCode}`
      );

      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.productCode !== currentProduct.productCode
        )
      );

      showSuccess("Product deleted successfully!");
      closeModal();
    } catch (error) {
      console.error("Failed to delete product:", error);
      showError(error.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-4xl mx-auto">
      <ToastContainer
        position="top-center"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: "65px" }}
      />

      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <table className="w-full text-left border-collapse">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-2">Product Code</th>
            <th className="p-2">Product Name</th>
            <th className="p-2">Price (Rs.)</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.productCode} className="border-b">
                <td className="p-2">{product.productCode}</td>
                <td className="p-2">{product.productName}</td>
                <td className="p-2">Rs. {product.price}</td>
                <td className="p-2">{product.productQty}</td>
                <td className="p-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => openModal(product)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for editing product */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Product"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            padding: "25px",
            borderRadius: "8px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {currentProduct.productName} ({currentProduct.productCode})
        </h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={currentProduct.productName}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Price (Rs.)</label>
          <input
            type="number"
            value={currentProduct.price}
            onChange={handlePriceChange}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={currentProduct.productQty}
            onChange={handleQtyChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>

        <div className="flex justify-between mt-8">
          <div>
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                disabled={loading}
              >
                <FaTrash className="inline mr-2" />
                Delete Product
              </button>
            ) : (
              <div className="space-x-2">
                <span className="text-red-600 font-medium">Are you sure?</span>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!deleteConfirm && (
            <div className="space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProductEdit;