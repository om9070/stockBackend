const Stocks = require("../models/stock")

exports.getStock = async function (req, res) {
    try {
        const getAllStock = await Stocks.find();
        res.status(200).json({ message: 'Get All Stock successfully',status:true,data:getAllStock});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'getStockProblem' });
    }
};
