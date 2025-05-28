import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/Product/get-products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("❌ Failed to load product data.");
      }
    };
    fetchProducts();
  }, []);

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await axios.delete(`http://localhost:5000/Product/delete-product/${selectedProduct.pid}`);
      setProducts((prev) => prev.filter((p) => p.pid !== selectedProduct.pid));
      toast.success("Product successfully deleted!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("❌ Failed to delete product.");
    }
    setShowModal(false);
  };

  return (
    <div className="mx-auto p-6 rounded-lg w-11/12 max-w-4xl relative">
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

      <h6 className="text-[32px] font-semibold text-center text-gray-700 mb-8">
        Product Records
      </h6>

      <div className="flex justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate("/ProductAdd")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
        >
          Add New Product
        </button>
      </div>

      <div className="relative overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="w-full text-sm text-left text-black">
          <thead className="text-xm text-black uppercase bg-indigo-500">
            <tr className="text-center">
              <th scope="col" className="px-6 py-3">Product Code</th>
              <th scope="col" className="px-6 py-3">Product Name</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Product Qty</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.pid}
                  className="bg-white border-b hover:bg-gray-50 text-center transition duration-150"
                >
                  <td className="px-6 py-3 text-base">{product.pid}</td>
                  <td className="px-6 py-3 text-base">{product.productName}</td>
                  <td className="px-6 py-3 text-base">{product.price}</td>
                  <td className="px-6 py-3 text-base">{product.quantity}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => confirmDelete(product)}
                      className="text-sm px-4 py-1.5 bg-red-500 hover:bg-red-400 text-white rounded shadow transition-all duration-150"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="sm">
        <Modal.Header closeButton className="py-2">
          <Modal.Title className="text-sm">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-xs">
          Are you sure you want to delete{" "}
          <span className="font-bold">{selectedProduct?.productName}</span> (Product Code: {selectedProduct?.pid})?
        </Modal.Body>
        <Modal.Footer className="py-2">
          <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewProducts;