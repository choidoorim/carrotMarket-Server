const jwtMiddleware = require("../../../config/jwtMiddleware");
const productProvider = require("../../app/Product/productProvider");
const regionProvider = require("../../app/Region/regionProvider");
const productService = require("../../app/Product/productService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");

// 상품 조회
exports.getProducts = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const regionName = req.query.regionName;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!regionName) return res.send(errResponse(baseResponse.SIGNUP_REGION_EMPTY));

    const selectUserLeadRegionResult = await regionProvider.retrievesLeadRegionList(usrIdx);
    const selectProductResponse = await productProvider.retriveProductList(usrIdx, regionName);
    if(selectProductResponse.length === 0) return res.send(errResponse(baseResponse.PRODUCT_NOT_EXIST));

    const result = {
        "myRegion" : selectUserLeadRegionResult,
        "product" : selectProductResponse
    }

    return res.send(response(baseResponse.PRODUCT_SELECT_SUCCESS, result));
};

// 상품 내역 조회
exports.getDetailProducts = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const pdIdx = req.params.pdIdx;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!pdIdx) return res.send(errResponse(baseResponse.USER_PRODUCTID_EMPTY));

    const selectDetailProductResponse = await productProvider.retriveDetailProductList(usrIdx, pdIdx);
    const selectProductImageResponse = await productProvider.retriveProductImageList(pdIdx);

    const result = {
        "productImage" : selectProductImageResponse,
        "productContents" : selectDetailProductResponse
    }

    return res.send(response(baseResponse.PRODUCT_DETAIL_SELECT_SUCCESS, result));

};

// 상품 등록
exports.postProducts = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const { pdTitle, pdContents, priceProposal, pdCategory, price} = req.body;
    const insertProductInfoParams = [pdTitle, pdContents, usrIdx, usrIdx, priceProposal, pdCategory, price];

    let regStatus = /^([Y|N])?$/; //status 정규식
    let regStatusResult = regStatus.exec(priceProposal);

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!pdTitle || pdTitle === "") return res.send(errResponse(baseResponse.PRODUCT_TITLE_EMPTY));
    if(!pdContents || pdContents === "") return res.send(errResponse(baseResponse.PRODUCT_CONTENTS_EMPTY));
    if(!priceProposal || priceProposal === "") return res.send(errResponse(baseResponse.PRODUCT_PRICEPROPOSAL_EMPTY));
    if(regStatusResult === null) return res.send(errResponse(baseResponse.STATUS_FORM_DIFFERENT));
    if(!pdCategory || pdCategory === "") return res.send(errResponse(baseResponse.PRODUCT_CATEGORY_EMPTY));
    if(!price) return res.send(errResponse(baseResponse.PRODUCT_PRICE_EMPTY));

    const insertProductResponse = await productService.createProduct(insertProductInfoParams);

    return res.send(insertProductResponse);

};

// 상품 이미지 조회
exports.getProductsImages = async function (req, res) {
    const pdIdx = req.params.pdIdx;

    if(!pdIdx) return res.send(errResponse(baseResponse.USER_PRODUCTID_EMPTY));

    const selectProductImageResponse = await productProvider.retriveProductImageList(pdIdx);

    return res.send(response(baseResponse.PRODUCT_IMAGE__SELECT_SUCCESS, selectProductImageResponse));
};

// 상품 이미지 등록
exports.postProductImages = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const productImageInfo = req.body;
    let insertProductImages;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    for(let i = 0; i < productImageInfo.length; i++){
        if(!productImageInfo[i].pdIdx) return res.send(errResponse(baseResponse.PRODUCT_ID_EMPTY));
        if(!productImageInfo[i].imageUrl || productImageInfo[i].imageUrl === "") return res.send(errResponse(baseResponse.PRODUCT_IMAGE_EMPTY));
    }

    for(let i = 0; i < productImageInfo.length; i++){
        insertProductImages = await productService.createProductImage(usrIdx, productImageInfo[i].pdIdx, productImageInfo[i].imageUrl);
    }

    return res.send(insertProductImages);
};

// 숨기기 활성화/비활성화
exports.patchHideProducts = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const pdIdx = req.params.pdIdx;
    const {hideStatus} = req.body;

    let regStatus = /^([Y|N])?$/; //status 정규식
    let regStatusResult = regStatus.exec(hideStatus);


    if(!pdIdx) return res.send(errResponse(baseResponse.USER_PRODUCTID_EMPTY));
    if(!hideStatus || hideStatus === "") return res.send(errResponse(baseResponse.HIDE_PRODUCT_STATUS_EMPTY));
    if(regStatusResult === null) return res.send(errResponse(baseResponse.STATUS_FORM_DIFFERENT));

    const updateHideProducts = await productService.editHideProduct(usrIdx, pdIdx, hideStatus);

    return res.send(updateHideProducts);
};

// 상품 상태 변경 API
exports.patchProductStatus = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const pdIdx = req.params.pdIdx;
    const {status} = req.body;

    let regStatus = /^([Y|N|C])?$/; //status 정규식
    let regStatusResult = regStatus.exec(status);

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!pdIdx) return res.send(errResponse(baseResponse.USER_PRODUCTID_EMPTY));
    if(regStatusResult === null) return res.send(errResponse(baseResponse.STATUS_FORM_DIFFERENT));

    const updateProductStatus = await productService.editProductStatus(usrIdx, pdIdx, status);

    return res.send(updateProductStatus);
};

exports.postSelectProduct = async function (req, res) {
    // 기존에 찜 테이블에 데이터가 있을 경우와 없을 경우 두가지로 나눠서 진행
    const usrIdx = req.verifiedToken.userId;
    const {pdIdx} = req.body;

    if(!usrIdx) return res.send(baseResponse.USER_USERID_EMPTY);
    if(!pdIdx) return res.send(baseResponse.USER_PRODUCTID_EMPTY);

    const editSelectProduct = await productService.editSelectProduct(usrIdx, pdIdx);

    return res.send(editSelectProduct);
};

exports.deleteSelectProduct = async function (req, res) {
    const pdIdx = req.params.pdIdx;
    const usrIdx = req.verifiedToken.userId;

    if(!usrIdx) return res.send(baseResponse.USER_USERID_EMPTY);
    if(!pdIdx) return res.send(baseResponse.USER_PRODUCTID_EMPTY);

    const deleteSelectProduct = await productService.deleteSelectProduct(pdIdx, usrIdx);

    return res.send(deleteSelectProduct);
};

exports.deleteProductImages = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const imgIdx = req.params.imgIdx;

    if(!usrIdx) return res.send(baseResponse.USER_USERID_EMPTY);
    if(!imgIdx) return res.send(baseResponse.PRODUCT_IMAGE_EMPTY);

    const deleteProductImages = await productService.deleteProductImage(usrIdx, imgIdx);

    return res.send(deleteProductImages);
};

exports.deleteProduct = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const pdIdx = req.params.pdIdx;

    if(!usrIdx) return res.send(baseResponse.USER_USERID_EMPTY);
    if(!pdIdx) return res.send(baseResponse.USER_PRODUCTID_EMPTY);

    const deleteProduct = await productService.deleteProduct(usrIdx, pdIdx);

    return res.send(deleteProduct);
};