import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import spinner icon

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true); // Start loading
    setTimeout(() => {
      navigate("/login"); // Navigate after delay
    }, 1000);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://thumbs.dreamstime.com/b/supermarket-aisle-shopping-cart-digital-icons-floating-futuristic-technology-grocery-store-shelves-supermarket-aisle-shopping-cart-375948281.jpg')",
      }}
    >
      <div className="bg-white/50 p-8 rounded-lg shadow-lg text-center max-w-2xl mx-4">
        <motion.h1
          className="text-5xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Grocery-store-Point of Sale
        </motion.h1>

        <motion.p
          className="text-gray-700 mb-8 text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          "Smart Billing. Simple Management."<br></br>
Empower your grocery store with a seamless billing system—fast, secure, and designed to fit your daily operations. Handle user roles, manage products, and generate accurate bills effortlessly.

        </motion.p>

        <motion.button
          onClick={handleClick}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md text-lg font-semibold flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
            >
              <AiOutlineLoading3Quarters className="text-xl animate-spin" />
            </motion.div>
          ) : (
            "Get Started Now"
          )}
        </motion.button>
      </div>
    </div>
  );
}

export default Home;
