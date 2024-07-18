const { name } = require('ejs');
const fs = require('fs');
const path = require('path');
const { isEmail } = require('validator');

const filePath = path.join(__dirname, 'cartprod.json');

const loadCartProd = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }
    return [];
};

const saveCart = (products) => {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
};

const ValidateProducts = (product) => {
    
}