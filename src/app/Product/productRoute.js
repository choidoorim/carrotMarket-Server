module.exports = function (app){
    const product = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    //상품 조회 API
    app.get('/app/products', jwtMiddleware, product.getProducts);

    //상품 내역 조회 API - 찜하기 버튼 여부 때문에 userIdx 필요
    app.get('/app/products/:pdIdx/details', jwtMiddleware, product.getDetailProducts);

    //상품 등록 API
    app.post('/app/products', jwtMiddleware, product.postProducts);

    //상품 삭제 API
    app.patch('/app/products/:pdIdx/status', jwtMiddleware, product.deleteProduct);

    //상품 사진 조회 API
    app.get('/app/products/:pdIdx/images', product.getProductsImages);

    //상품 사진 등록 API - 여러 개 가능
    app.post('/app/products/images', jwtMiddleware, product.postProductImages);

    //상품 사진 삭제 API
    app.delete('/app/products/images/:imgIdx', jwtMiddleware, product.deleteProductImages);

    //상품 숨김 설정 API
    app.patch('/app/products/:pdIdx/hideStatus', jwtMiddleware, product.patchHideProducts);

    //상품 거래 상태 변경 API
    app.patch('/app/product/:pdIdx/status', jwtMiddleware, product.patchProductStatus);

    //찜 하기 API
    app.post('/app/products/pick', jwtMiddleware, product.postSelectProduct);

    //찜 삭제 API
    app.patch('/app/products/:pdIdx/unpick', jwtMiddleware, product.deleteSelectProduct);

}