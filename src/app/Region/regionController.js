const jwtMiddleware = require("../../../config/jwtMiddleware");
const regionProvider = require("../../app/Region/regionProvider");
const regionService = require("../../app/Region/regionService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

// 내 동네 조회
exports.getRegions = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const regionName = req.query.regionName;
    if(!usrIdx) return res.send(baseResponse.USER_USERID_EMPTY);
    if(!regionName) return res.send(baseResponse.SIGNUP_REGION_EMPTY);

    const selectRegionResponse = await regionProvider.retrieveRegion(usrIdx);
    if(selectRegionResponse.length === 0 ) return res.send(errResponse(baseResponse.REGION_SELECT_FAIL));
    const selectRegionInfo = await regionProvider.retrieveRegionInfo(usrIdx, regionName);
    if(selectRegionInfo.length === 0 ) return res.send(errResponse(baseResponse.REGION_SELECT_FAIL));
    const selectRegionRangeResponse = await regionProvider.retrieveRegionRange(usrIdx, regionName);
    if(selectRegionRangeResponse.length === 0 ) return res.send(errResponse(baseResponse.REGION_SELECT_FAIL));

    const result = {
        "regionChoice" : selectRegionResponse,
        "regionRange" : selectRegionInfo,
        "nearRegion" : selectRegionRangeResponse
    }


    return res.send(response(baseResponse.REGION_SELECT_SUCCESS, result));
};

// 유저별 게시물 조회 지역범위 조회
exports.getRegionRange = async function (req, res) {
    const usrIdx = req.params.usrIdx;
    const regionName = req.query.regionName;
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!regionName) return res.send(errResponse(baseResponse.SIGNUP_REGION_EMPTY));

    const selectRegionRange = await regionProvider.retrieveRegionRange(usrIdx, regionName);

    return res.send(response(baseResponse.NEARREGION_SELECT_SUCCESS, selectRegionRange));
};

exports.patchCountAuthRegion = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const {regionName} = req.body;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!regionName) return res.send(errResponse(baseResponse.SIGNUP_REGION_EMPTY));

    const updateCountAuthRegion = await regionService.editCountAuthRegion(usrIdx, regionName);

    return res.send(updateCountAuthRegion);
};

// 유저별 게시물 조회 지역범위 설정
exports.patchRegionRange = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const {regionName, maxRange} = req.body;
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!regionName || regionName === "") return res.send(errResponse(baseResponse.SIGNUP_REGION_EMPTY));
    if(maxRange < 1 || maxRange > 15) return res.send(errResponse(baseResponse.SIGNUP_REGION_MAXRANGE));

    const updateRegionRange = await regionService.editRegionRange(usrIdx, regionName, maxRange);

    return res.send(updateRegionRange);
};

// 대표 동네 설정
exports.patchLeadRegions = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const {regionName} = req.body;

    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!regionName || regionName === "") return res.send(errResponse(baseResponse.SIGNUP_REGION_EMPTY));

    const updateLeadRegionsResponse = await regionService.editLeadRegionList(usrIdx, regionName);

    return res.send(updateLeadRegionsResponse);
};

// 내 동네 등록
exports.postRegions = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const {regionName, regionLatitue, regionLongitude} = req.body;

    if(!regionName || regionName === "") return res.send(errResponse(baseResponse.SIGNUP_REGION_EMPTY));
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!regionLatitue || regionLatitue === "") return res.send(errResponse(baseResponse.SIGNUP_REGIONLATITUEE_EMPTY));
    if(!regionLongitude || regionLongitude === "") return res.send(errResponse(baseResponse.SIGNUP_REGIONLONGITUDE_EMPTY));

    const signUpRegionResponse = await regionService.createUserRegion(
        regionName,
        usrIdx,
        regionLatitue,
        regionLongitude
    );

    return res.send(signUpRegionResponse);

};

// 내 동네 삭제
exports.deleteRegions = async function (req, res) {
    const usrIdx = req.verifiedToken.userId;
    const {regionName} = req.body;

    if(!regionName || regionName === "") return res.send(errResponse(baseResponse.SIGNUP_REGION_EMPTY));
    if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const deleteRegionResponse = await regionService.deleteUserRegion(usrIdx, regionName);
    return res.send(deleteRegionResponse);
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

// 대표 동네 조회
// exports.getLeadRegions = async function (req, res) {
//     const usrIdx = req.params.usrIdx;
//     if(!usrIdx) return res.send(baseResponse.USER_USERID_EMPTY);
//
//     const selectLeadRegionResponse = await regionProvider.retrievesLeadRegionList(usrIdx);
//
//     return res.send(selectLeadRegionResponse);
// }

// 대표 동네 취소
// exports.deleteLeadRegions = async function (req, res) {
//     const usrIdx = req.params.usrIdx;
//     const {regionName} = req.body;
//
//     if(!usrIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
//     if(!regionName || regionName === "") return res.send(errResponse(baseResponse.SIGNUP_REGION_EMPTY));
//
//     const deleteLeadRegionsResponse = await regionService.deleteLeadRegionList(usrIdx, regionName);
//
//     return res.send(deleteLeadRegionsResponse);
//
// }