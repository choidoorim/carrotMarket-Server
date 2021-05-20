const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const productProvider = require("./productProvider");
const productDao = require("./productDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.createProduct = async function (insertProductInfoParams) {
    try {
        if(insertProductInfoParams.length != 7) return errResponse(baseResponse.CHECK_PARMETER_LENGTH);

        const connection = await pool.getConnection(async (conn) => conn);
        const insertProductResult = await productDao.insertProduct(connection, insertProductInfoParams);
        connection.release();

        return response(baseResponse.PRODUCT_INSERT_SUCCESS, insertProductResult[0].insertId);

    } catch (err) {
        logger.error(`App - createProduct Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.createProductImage = async function (usrIdx, pdIdx, imageUrl) {
    try {
        const selectProductRows = await productProvider.checkProduct(pdIdx);
        if(selectProductRows.length === 0) return errResponse(baseResponse.PRODUCT_NOT_EXIST);
        if(selectProductRows[0].status === 'N') return errResponse(baseResponse.PRODUCT_NOT_EXIST);
        if(selectProductRows[0].sellUsrIdx !== usrIdx) return errResponse(baseResponse.DIFFERENT_PRODUCT_IMAGE_USER);


        const selectProductImageRows = await productProvider.retriveProductImageList(pdIdx);
        if(selectProductImageRows.length > 10) return errResponse(baseResponse.SIGNUP_PRODUCT_IMAGE_COUNT);

        const createProductImageInfoParams = [imageUrl, pdIdx];

        const connection = await pool.getConnection(async (conn) => conn);
        const insertProductImage = await productDao.insertProductImage(connection, createProductImageInfoParams);
        connection.release();

        return response(baseResponse.PRODUCT_IMAGE_INSERT_SUCCESS, insertProductImage[0].insertId);

    } catch (err) {
        logger.error(`App - createProductImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editHideProduct = async function (usrIdx, pdIdx, hideStatus) {
    try {
        const selectProductRows = await productProvider.checkProduct(pdIdx);
        if(selectProductRows.length === 0) return errResponse(baseResponse.PRODUCT_NOT_EXIST);
        if(selectProductRows[0].sellUsrIdx !== usrIdx) return errResponse(baseResponse.DIFFERENT_PRODUCT_IMAGE_USER);

        if(selectProductRows[0].hideStatus === hideStatus) return errResponse(baseResponse.NOT_CHANGE);
        const connection = await pool.getConnection(async (conn) => conn);
        const updateHideProductResult = await productDao.updateHideProduct(connection, pdIdx, hideStatus);
        connection.release();

        return response(baseResponse.PRODUCT_HIDE_STATUS_UPDATE_SUCCESS, updateHideProductResult[0].info);

    } catch (err) {
        logger.error(`App - editHideProduct Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editProductStatus = async function (usrIdx, pdIdx, status) {
    try {
        const selectProductRows = await productProvider.checkProduct(pdIdx);
        if(selectProductRows.length === 0) return errResponse(baseResponse.PRODUCT_NOT_EXIST);
        if(selectProductRows[0].sellUsrIdx !== usrIdx) return errResponse(baseResponse.DIFFERENT_PRODUCT_IMAGE_USER);

        const connection = await pool.getConnection(async (conn) => conn);
        const updateProductStatus = await productDao.updateProductStatus(connection, pdIdx, status);
        connection.release();

        return response(baseResponse.PRODUCT_STATUS_UPDATE_SUCCESS, updateProductStatus[0].info);

    } catch (err) {
        logger.error(`App - editProductStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editSelectProduct = async function (usrIdx, pdIdx) {
    try {
        let resultInfo;
        const selectProductRows = await productProvider.checkProduct(pdIdx);
        if(selectProductRows.length === 0) return errResponse(baseResponse.PRODUCT_NOT_EXIST);

        const statusY = 'Y'; //찜 테이블에 존재할 경우 삭제 된 내역이 존재할 경우의 status 값
        const checkYSelectProduct = await productProvider.checkSelectProduct(usrIdx, pdIdx, statusY);
        if(checkYSelectProduct.length > 0) return errResponse(baseResponse.PRODUCT_ALREADY_PICK);

        const statusN = 'N'; //찜 테이블에 존재할 경우 삭제 된 내역이 존재할 경우의 status 값
        const checkNSelectProductRows = await productProvider.checkSelectProduct(usrIdx, pdIdx, statusN);
        const connection = await pool.getConnection(async (conn) => conn);
        if(checkNSelectProductRows.length > 0) { //찜 테이블에 있을 경우
            console.log(`update`);
            const updateSelectProduct = await productDao.updateSelectProduct(connection, usrIdx, pdIdx);
            resultInfo = updateSelectProduct[0].info;
        }
        else {
            console.log(`insert`);
            const insertSelectProduct = await productDao.insertSelectProduct(connection, usrIdx, pdIdx);
            resultInfo = insertSelectProduct[0].insertId
        }
        connection.release();

        return response(baseResponse.PRODUCT_PICK_SUCCESS, resultInfo);

    } catch (err) {
        logger.error(`App - editSelectProduct Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteSelectProduct = async function (pdIdx, usrIdx) {
    try {
        const statusY = 'Y'; //찜 테이블에 존재할 경우 등록 된 내역이 존재할 경우의 status 값
        const checkSelectProductRows = await productProvider.checkSelectProduct(usrIdx, pdIdx, statusY);
        if(checkSelectProductRows.length === 0 ) return errResponse(baseResponse.USER_SELECTPRODUCT_NOT_EXIST);
        if(checkSelectProductRows[0].usrIdx !== usrIdx) return errResponse(baseResponse.PRODUCT_NOT_PICK_USER);

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteSelectProductResult = await productDao.deleteSelectProduct(connection, pdIdx, usrIdx);
        connection.release();

        return response(baseResponse.PRODUCT_PICK_DELETE_SUCCESS, deleteSelectProductResult[0].info);
    } catch (err) {
        logger.error(`App - deleteSelectProduct Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteProductImage = async function (usrIdx, imgIdx) {
    try {
        const productImageRows = await productProvider.checkProductImage(imgIdx);
        if(productImageRows.length === 0) return errResponse(baseResponse.USER_PRODUCTIMAGE_NOT_EXIST);
        console.log(productImageRows[0].pdIdx);
        let pdIdx = productImageRows[0].pdIdx;

        const selectProductRows = await productProvider.checkProduct(pdIdx);
        if(selectProductRows.length === 0) return errResponse(baseResponse.PRODUCT_NOT_EXIST);
        if(selectProductRows[0].sellUsrIdx !== usrIdx) return errResponse(baseResponse.DIFFERENT_PRODUCT_IMAGE_USER);

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteProductImage = await productDao.deleteProductImage(connection, imgIdx);
        connection.release();

        return response(baseResponse.PRODUCT_IMAGE_DELETE_SUCCESS, deleteProductImage[0].affectedRows);

    } catch (err) {
        logger.error(`App - deleteProductImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteProduct = async function (usrIdx, pdIdx) {
    try {
        const checkProduct = await productProvider.checkProduct(pdIdx);
        if(checkProduct.length === 0) return errResponse(baseResponse.PRODUCT_NOT_EXIST);
        if(checkProduct[0].sellUsrIdx !== usrIdx) return errResponse(baseResponse.PRODUCT_NOT_ENROLL_USER);
        if(checkProduct[0].status === 'N') return errResponse(baseResponse.PRODUCT_ALREADY_DELETE);

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteProductResult = await productDao.deleteProduct(connection, pdIdx);

        const checkProductImages = await productProvider.checkProductImages(pdIdx);
        if(checkProductImages.length > 0) {
            const deleteProductImagesResult = await productDao.deleteProductImages(connection, pdIdx);
        } else console.log('Img Empty');

        const checkSelectProducts = await productProvider.checkSelectProducts(pdIdx);
        if(checkSelectProducts.length > 0) {
            const deleteSelectProductsResult = await productDao.deleteSelectProducts(connection, pdIdx);
        } else console.log('Select Empty');

        connection.release();

        return response(baseResponse.PRODUCT_DELETE_SUCCESS, deleteProductResult[0].info);

    } catch (err) {
        logger.error(`App - deleteProduct Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}