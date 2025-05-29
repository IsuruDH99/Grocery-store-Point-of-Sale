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
  const [quantity, setQuantity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const [lastBillNumber, setLastBillNumber] = useState(0);
  const [isSaving, setIsSaving] = useState(false); // State to manage saving status

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/Product/get-products");
        const processedProducts = response.data.map(product => ({
          ...product,
          price: parseFloat(product.price)
        }));
        setProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("❌ Failed to load product data.");
      }
    };
    fetchProducts();
    // Initially generate a bill number, this will be a preview until a bill is saved
    generateBillNumber();
  }, []);

  // Generate bill number in format YYMM-000001
  const generateBillNumber = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const yearShort = String(today.getFullYear()).slice(-2);
    // You'll need to fetch the actual last bill number from your backend
    // to ensure unique and sequential bill numbers across sessions.
    // For now, this just increments a local state for demonstration.
    const newNumber = lastBillNumber + 1;
    const formattedNumber = `${yearShort}${month}-${String(newNumber).padStart(6, '0')}`;
    setBillNumber(formattedNumber);
  };

  // Add item to bill
  const handleAddItem = () => {
    if (!selectedProductCode) {
      toast.error("Please select a product.");
      return;
    }

    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      toast.error("Please enter a valid quantity greater than 0.");
      return;
    }

    const product = products.find(p => p.productCode === selectedProductCode);
    if (!product) {
      toast.error("Selected product not found.");
      return;
    }

    const newItem = {
      productCode: product.productCode,
      productName: product.productName,
      price: product.price,
      quantity: parsedQuantity,
      total: product.price * parsedQuantity
    };

    setBillItems([...billItems, newItem]);
    setSelectedProductCode("");
    setQuantity("");
    toast.success(`"${product.productName}" added to bill.`);
  };

  // Calculate total amount
  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + item.total, 0);
  };

  // Save bill to database
  const saveBill = async () => {
    setIsSaving(true);
    try {
      // You should send the current billNumber with the data to be saved
      const response = await axios.post("http://localhost:5000/DailyBill/save-bill", {
        billNumber: billNumber, // Include the generated bill number
        date: selectedDate,
        items: billItems, // Changed billItems to items to match common backend conventions (adjust if your backend expects billItems)
        totalAmount: calculateTotal() // Changed totalBill to totalAmount (adjust if your backend expects totalBill)
      });

      toast.success("✅ Bill saved successfully!");
      setIsModalOpen(false); // Close the modal
      setBillItems([]); // Clear bill items
      setLastBillNumber(prev => prev + 1); // Increment for the next bill number preview
      generateBillNumber(); // Generate a new bill number for the next transaction
    } catch (error) {
      console.error("Error saving bill:", error);
      toast.error("❌ Failed to save bill");
    } finally {
      setIsSaving(false);
    }
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
    setQuantity("");
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
              {product.productCode} - {product.productName}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity Input */}
      <div className="mb-4 flex items-center gap-4">
        <label className="w-32 text-gray-700 font-medium">Quantity:</label>
        <input
          type="number"
          min="0"
          step="0.001"
          value={quantity}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue === "" || /^[0-9]*\.?[0-9]*$/.test(inputValue)) {
              setQuantity(inputValue);
            }
          }}
          onBlur={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value) || value <= 0) {
              setQuantity("");
            } else {
              setQuantity(value.toString());
            }
          }}
          className="border rounded p-2 w-20"
          placeholder="0.000"
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
                <th className="border p-2">Price (Rs.)</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Total (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{item.productName}</td>
                  <td className="border p-2 text-right">{item.price.toFixed(2)}</td>
                  <td className="border p-2 text-center">
                    {Number.isInteger(item.quantity) ?
                      item.quantity : item.quantity.toFixed(3)}
                  </td>
                  <td className="border p-2 text-right">{item.total.toFixed(2)}</td>
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
              <th className="border p-2">Price (Rs.)</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Total (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, index) => (
              <tr key={index}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{item.productName}</td>
                <td className="border p-2 text-right">{item.price.toFixed(2)}</td>
                <td className="border p-2 text-center">
                  {Number.isInteger(item.quantity) ?
                    item.quantity : item.quantity.toFixed(3)}
                </td>
                <td className="border p-2 text-right">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t-2 pt-4 text-center">
          <p className="text-xl font-bold">Total: Rs.{calculateTotal().toFixed(2)}</p>
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
            onClick={async () => {
              await saveBill(); // Call saveBill when "Print Bill" is clicked
              window.print();
            }}
            disabled={isSaving} // Disable print button while saving
          >
            {isSaving ? "Saving..." : "Print & Save Bill"} {/* Change button text while saving */}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CalcBill;