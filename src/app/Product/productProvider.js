const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const productDao = require("./productDao");

exports.retriveProductList = async function (usrIdx, regionName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productListResult = await productDao.selectProduct(connection, usrIdx, regionName);
    connection.release();

    return productListResult;
};

exports.retriveDetailProductList = async function (usrIdx, pdIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const detailProductListResult = await productDao.selectDetailProduct(connection, usrIdx, pdIdx);
    connection.release();

    return detailProductListResult;
};

exports.retriveProductImageList = async function (pdIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productImageListResult = await productDao.selectProductImage(connection, pdIdx);
    connection.release();

    return productImageListResult;
};

exports.checkProduct = async function (pdIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkProductResult = await productDao.selectCheckProduct(connection, pdIdx);
    connection.release();

    return checkProductResult;
};

exports.checkChatRoom = async function (pdIdx, usrIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkChatRoomResult = await productDao.selectCheckChatRoom(connection, pdIdx, usrIdx);
    connection.release();

    return checkChatRoomResult;
}

exports.checkProductImages = async function (pdIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkProductImagesResult = await productDao.selectCheckProductImages(connection, pdIdx);
    connection.release();

    return checkProductImagesResult;
};

exports.checkSelectProducts = async function (pdIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkSelectProductsResult = await productDao.checkSelectProducts(connection, pdIdx);
    connection.release();

    return checkSelectProductsResult;
};

exports.checkSelectProduct = async function (usrIdx ,pdIdx, status) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkSelectProductResult = await productDao.checkSelectProduct(connection, usrIdx, pdIdx, status);
    connection.release();

    return checkSelectProductResult;
};

exports.checkProductImage = async function (imgIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkProductImageResult = await productDao.checkProductImage(connection, imgIdx);
    connection.release();

    return checkProductImageResult;

};