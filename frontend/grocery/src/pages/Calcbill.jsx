import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const CalcBill = () => {
  const [products, setProducts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [billItems, setBillItems] = useState([]);
  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const [lastBillNumber, setLastBillNumber] = useState(0);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/Product/get-products");
        // Ensure price is a number when setting products
        const processedProducts = response.data.map(product => ({
          ...product,
          price: parseFloat(product.price) // Convert price to a number
        }));
        setProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("❌ Failed to load product data.");
      }
    };
    fetchProducts();

    // Generate initial bill number
    generateBillNumber();
  }, []);

  // Generate bill number in format YYMM-000001
  const generateBillNumber = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const yearShort = String(today.getFullYear()).slice(-2);
    const newNumber = lastBillNumber + 1;

    const formattedNumber = `${yearShort}${month}-${String(newNumber).padStart(6, '0')}`;
    setBillNumber(formattedNumber);
    return formattedNumber;
  };

  // Add item to bill
  const handleAddItem = () => {
    if (!selectedProductCode || quantity <= 0) {
      toast.error("Please select a product and enter a valid quantity.");
      return;
    }

    const product = products.find(p => p.productCode === selectedProductCode);
    if (!product) {
      toast.error("Selected product not found.");
      return;
    }

    // Now product.price is guaranteed to be a number due to the parsing in useEffect
    const newItem = {
      productCode: product.productCode,
      productName: product.productName,
      price: product.price,
      quantity: quantity,
      total: product.price * quantity
    };

    setBillItems([...billItems, newItem]);
    setSelectedProductCode("");
    setQuantity(1);
    toast.success(`"${product.productName}" added to bill.`);
  };

  // Calculate total amount
  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + item.total, 0);
  };

  // Generate bill and open modal
  const handleGenerateBill = () => {
    if (billItems.length === 0) {
      toast.error("Please add at least one item to generate a bill.");
      return;
    }
    setIsModalOpen(true);
  };

  // Clear bill
  const handleClearBill = () => {
    setBillItems([]);
    setSelectedProductCode("");
    setQuantity(1);
    toast.info("Bill cleared.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-center">Supermarket Billing</h2>

      {/* Date Selection */}
      <div className="mb-4 flex items-center gap-4">
        <label className="w-32 text-gray-700 font-medium">Bill Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {/* Bill Number Display */}
      <div className="mb-4 flex items-center gap-4">
        <label className="w-32 text-gray-700 font-medium">Bill No:</label>
        <div className="border rounded p-2 bg-gray-100">
          {billNumber}
        </div>
      </div>

      {/* Product Selection */}
      <div className="mb-4 flex items-center gap-4">
        <label className="w-32 text-gray-700 font-medium">Product:</label>
        <select
          value={selectedProductCode}
          onChange={(e) => setSelectedProductCode(e.target.value)}
          className="flex-1 border rounded p-2"
        >
          <option value="">-- Select Product --</option>
          {products.map((product) => (
            <option key={product.productCode} value={product.productCode}>
              {product.productCode} - {product.productName} (₹{product.price.toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      {/* Quantity Input */}
      <div className="mb-4 flex items-center gap-4">
        <label className="w-32 text-gray-700 font-medium">Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="border rounded p-2 w-20"
        />
      </div>

      {/* Add Item Button */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>

      {/* Bill Items Table */}
      <div className="mb-6">
        {billItems.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">SL.</th>
                <th className="border p-2">Item</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{item.productName}</td>
                  <td className="border p-2 text-right">₹{item.price.toFixed(2)}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-right">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No items added to the bill yet.</p>
        )}
      </div>

      {/* Total Amount */}
      <div className="mb-6 text-center">
        <div className="text-2xl font-bold p-4 bg-blue-100 rounded inline-block">
          Total Bill: Rs.{calculateTotal().toFixed(2)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleGenerateBill}
          disabled={billItems.length === 0}
          className={`bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 ${
            billItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Generate Bill
        </button>
        <button
          onClick={handleClearBill}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Clear Bill
        </button>
      </div>

      {/* Bill Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Bill"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            width: "500px",
            maxWidth: "90%",
            padding: "20px",
            borderRadius: "8px",
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
      >
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">SUPERMARKET</h2>
          <p className="text-sm text-gray-600">INVOICE</p>
        </div>

        <div className="flex justify-between mb-4 text-sm">
          <div>
            <p>Bill No: {billNumber}</p>
            <p>Date: {selectedDate}</p>
          </div>
        </div>

        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">SL.</th>
              <th className="border p-2">Item</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, index) => (
              <tr key={index}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{item.productName}</td>
                <td className="border p-2 text-right">₹{item.price.toFixed(2)}</td>
                <td className="border p-2 text-center">{item.quantity}</td>
                <td className="border p-2 text-right">₹{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t-2 pt-4 text-center">
          <p className="text-xl font-bold">Total: ₹{calculateTotal().toFixed(2)}</p>
        </div>

        <div className="mt-6 text-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => {
              window.print();
              setIsModalOpen(false);
              setLastBillNumber(prev => prev + 1);
              handleClearBill();
            }}
          >
            Print Bill
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CalcBill;