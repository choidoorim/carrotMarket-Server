module.exports = function (app) {
    const keyword = require("./keywordController");
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    // 키워드/알림 받을 동네 조회 API
    app.get('/app/keywords', jwtMiddleware, keyword.getKeyword);

    // 키워드 등록 API
    // 경우에 따라 patch 역할을 수행(이전에 삭제한 데이터를 다시 등록하는 경우)
    app.post('/app/keywords', jwtMiddleware, keyword.postKeyword);

    // 키워드알림 받을 동네 설정 API (noticeStatus : Y(OK)/N(NO))
    app.patch('/app/keyword/notices/regions/status', jwtMiddleware, keyword.patchNoticeRegion);

    // 키워드 삭제 API
    app.patch('/app/keywords/status', jwtMiddleware, keyword.patchKeyword);

    // 키워드알림 받을 동네 조회 API
    // app.get('/app/noticeRegions/:usrIdx', keyword.getNoticeRegions);
}