import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductAdd = () => {
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [productQty, setProductQty] = useState("0");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/product/add-product",
        {
          productCode,
          productName,
          price,
          productQty: productQty || 0, // Ensure quantity is sent as 0 if empty
        }
      );

      if (response.status === 201) {
        toast.success("Product added successfully!");
        setProductCode("");
        setProductName("");
        setPrice("");
        setProductQty("0");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding product.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-2 pb-48">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative">

        {/* Toast container */}
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

        {/* Page title */}
        <h2 className="text-[28px] font-bold mb-6 text-blue-600 text-center pb-8">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-bold text-lg">
          {[
            { id: "productCode", label: "Product Code", value: productCode, setter: setProductCode },
            { id: "productName", label: "Product Name", value: productName, setter: setProductName },
            { id: "price", label: "Unit Price", value: price, setter: setPrice },
            { 
              id: "productQty", 
              label: "Product Qty", 
              value: productQty, 
              setter: setProductQty,
              type: "number",
              min: "0"
            },
          ].map(({ id, label, value, setter, type = "text", min }) => (
            <div key={id} className="grid grid-cols-3 items-center gap-4">
              <label htmlFor={id} className="text-base font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                id={id}
                value={value}
                onChange={(e) => setter(e.target.value)}
                required={id !== "productQty"} // Make Qty optional
                min={min}
                className="col-span-2 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductAdd;