const express = require('express');
const router = express.Router();
const DailyBill = require('../models/DailyBill');
//const BillCounter = require('../models/BillCounter');

// Generate bill number
async function generateBillNumber() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const yearShort = String(today.getFullYear()).slice(-2);
    const prefix = `${yearShort}${month}`;
    
    // Find or create counter for this month
    const [counter, created] = await BillCounter.findOrCreate({
        where: { prefix },
        defaults: { lastNumber: 0 }
    });
    
    // Increment and save
    counter.lastNumber += 1;
    await counter.save();
    
    // Format as YYMM-000001
    return `${prefix}-${String(counter.lastNumber).padStart(6, '0')}`;
}

// Save bill to database
router.post('/save-bill', async (req, res) => {
    try {
        const { date, billItems, totalBill } = req.body;
        
        // Extract product codes from bill items
        const productCodes = billItems.map(item => item.productCode);
        
        // Generate bill number
        const billId = await generateBillNumber();
        
        // Create bill record
        const newBill = await DailyBill.create({
            date,
            billId,
            productCodes,
            totalBill
        });
        
        res.status(201).json({
            success: true,
            message: 'Bill saved successfully',
            billId: newBill.billId
        });
    } catch (error) {
        console.error("Error saving bill:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to save bill" 
        });
    }
});

module.exports = router;