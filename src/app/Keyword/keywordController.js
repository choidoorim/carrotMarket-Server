const keywordProvider = require("../../app/Keyword/keywordProvider");
const keywordService = require("../../app/Keyword/keywordService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");


//키워드/알림 받을 동네 조회 API
exports.getKeyword = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    if(!usrIdx) return res.send(baseResponse.USER_USERID_EMPTY);


    const selectKeywordResponse = await keywordProvider.retrieveKeywordList(usrIdx);
    const selectNoticeRegionResponse = await keywordProvider.retrieveNoticeRegionList(usrIdx);
    if(selectNoticeRegionResponse.length === 0 ) return res.send(baseResponse.REGIONS_INACTIVE_ACCOUNT);

    const result = {
        "keyword" : selectKeywordResponse,
        "region" : selectNoticeRegionResponse
    }

    return res.send(response(baseResponse.KEYWORD_SELECT_SUCCESS, result));
};

//유저별 키워드 추가
exports.postKeyword = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const { keyword } = req.body;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!keyword || keyword === "") return res.send(errResponse(baseResponse.KIYWORD_EMPTY));

    const insertKeywordResponse = await keywordService.insertKeyword(usrIdx, keyword);

    return res.send(insertKeywordResponse);

};

// 키워드알림 받을 동네 설정
exports.patchNoticeRegion = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const {noticeStatus, regionName} = req.body; //json 형식으로 받을 데이터의 변수는 {변수명} 으로 하기.
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!regionName || regionName === "") return res.send(errResponse(baseResponse.KIYWORD_EMPTY));
    if(!noticeStatus || noticeStatus === "") return res.send(errResponse(baseResponse.STATUS_EMPTY));

    const patchNoticeRegionResponse = await keywordService.patchNoticeRegion(noticeStatus, usrIdx, regionName);

    return res.send(patchNoticeRegionResponse);
};

//유저별 키워드 삭제
exports.patchKeyword = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const {keyword} = req.body; //json 형식으로 받을 데이터의 변수는 {변수명} 으로 하기.
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!keyword) return res.send(errResponse(baseResponse.KIYWORD_EMPTY));

    const deleteKeywordResponse = await keywordService.deleteKeyword(usrIdx, keyword);

    return res.send(deleteKeywordResponse);
};

// 알림 받을 동네 조회
// exports.getNoticeRegions = async function (req, res) {
//     const usrIdx = req.params.usrIdx;
//     if(!usrIdx) return res.send(baseResponse.USER_USERID_EMPTY);
//
//     const selectNoticeRegionResponse = await keywordProvider.retrieveNoticeRegionList(usrIdx);
//     if(selectNoticeRegionResponse.length === 0 ) return res.send(baseResponse.REGIONS_INACTIVE_ACCOUNT);
//
//     return res.send(selectNoticeRegionResponse);
// };