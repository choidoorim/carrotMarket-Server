const jwtMiddleware = require("../../../config/jwtMiddleware");
const noticeProvider = require("../../app/Notice/noticeProvider");
const noticeService = require("../../app/Notice/noticeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

// 공지사항 조회
exports.getNotice = async function (req, res) {

    const selectNoticeResponse = await noticeProvider.retrieveNoticeList();

    return res.send(response(baseResponse.NOTICE_SELECT_SUCCESS, selectNoticeResponse));
};

// 공지사항 상세 조회
exports.getDetailNotice = async function (req, res) {

    const noticeIdx = req.params.noticeIdx;
    if (!noticeIdx) return res.send(errResponse(baseResponse.NOTICEID_EMPTY));

    const selectDetailNoticeResponse = await noticeProvider.retrieveDetailNoticeList(noticeIdx);

    return res.send(response(baseResponse.NOTICEDETAIL_SELECT_SUCCESS, selectDetailNoticeResponse));
};

// 공지사항 등록
exports.postNotice = async function (req, res) {
    const {noticeTitle, noticeContents} = req.body;

    if(!noticeTitle || noticeTitle === "") return res.send(errResponse(baseResponse.NOTICETITLE_EMPTY));
    if(!noticeContents || noticeContents === "") return res.send(errResponse(baseResponse.NOTICECONTENTS_EMPTY));

    const signUpNotice = await noticeService.createNotice(
        noticeTitle,
        noticeContents
    );

    return res.send(signUpNotice);
};

//공지사항 수정
exports.patchNotice = async function (req, res) {
    const noticeIdx = req.params.noticeIdx;
    const {noticeTitle, noticeContents} = req.body;

    if(!noticeIdx) return res.send(errResponse(baseResponse.NOTICEID_EMPTY));
    if(!noticeTitle || noticeTitle === "") return res.send(errResponse(baseResponse.NOTICETITLE_EMPTY));
    if(!noticeContents || noticeContents === "") return res.send(errResponse(baseResponse.NOTICECONTENTS_EMPTY));

    const editNotice = await noticeService.editNotice(noticeIdx, noticeTitle, noticeContents);
    return res.send(editNotice);
}

//공지사항 삭제
exports.patchDeleteNotice = async function (req, res) {
    const noticeIdx = req.params.noticeIdx;

    if(!noticeIdx) return res.send(errResponse(baseResponse.NOTICEID_EMPTY))

    const deleteNotice = await noticeService.deleteNotice(noticeIdx);
    return res.send(deleteNotice);
}

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
