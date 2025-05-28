const express = require('express');
const router = express.Router();
const db = require('../models');
const Product = db.Product;

// Add new product
router.post('/add-product', async (req, res) => {
  try {
    const { productCode, productName, price, productQty } = req.body;

    if (!productCode || !productName || !price) {
      return res.status(400).json({ message: 'Product Code, Name, and Price are required' });
    }

    if (isNaN(price) || parseFloat(price) < 0) {
      return res.status(400).json({ message: 'Please enter a valid price' });
    }

    const existingProduct = await Product.findOne({ where: { productCode } });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product code already exists' });
    }

    const newProduct = await Product.create({
      productCode,
      productName,
      unitPrice: parseFloat(price),
      productQty: productQty ? parseFloat(productQty) : 0,
    });

    res.status(201).json({
      productCode: newProduct.productCode,
      productName: newProduct.productName,
      price: newProduct.unitPrice,
      productQty: newProduct.productQty
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all products
router.get('/get-products', async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['productCode', 'productName', 'unitPrice', 'productQty'],
      order: [['productName', 'ASC']],
    });

    const transformedProducts = products.map((product) => ({
      productCode: product.productCode,
      productName: product.productName,
      price: product.unitPrice,
      productQty: product.productQty,
      pid: product.productCode // For compatibility with existing frontend
    }));

    res.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update product
router.put('/update-product/:productCode', async (req, res) => {
  try {
    const { productCode } = req.params;
    const { price, productQty } = req.body;

    if (!price || isNaN(price) || parseFloat(price) < 0) {
      return res.status(400).json({ message: 'Please enter a valid price' });
    }

    if (productQty === undefined || isNaN(productQty) || parseFloat(productQty) < 0) {
      return res.status(400).json({ message: 'Please enter a valid quantity' });
    }

    const [updated] = await Product.update(
      { 
        unitPrice: parseFloat(price),
        productQty: parseFloat(productQty)
      },
      { where: { productCode } }
    );

    if (updated) {
      const updatedProduct = await Product.findOne({ where: { productCode } });
      return res.json({
        productCode: updatedProduct.productCode,
        productName: updatedProduct.productName,
        price: updatedProduct.unitPrice,
        productQty: updatedProduct.productQty
      });
    }

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete product
router.delete('/delete-product/:productCode', async (req, res) => {
  try {
    const { productCode } = req.params;

    const deleted = await Product.destroy({ where: { productCode } });

    if (deleted) {
      return res.json({ message: 'Product deleted successfully' });
    }

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;