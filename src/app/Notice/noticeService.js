const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const noticeProvider = require("./noticeProvider");
const noticeDao = require("./noticeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 공지사항 등록
exports.createNotice = async function (noticeTitle, noticeContents) {
    try {
        const insertNoticeInfoParams = [noticeTitle, noticeContents];
        const connection = await pool.getConnection(async (conn) => conn);

        const noticeInsertResult = await noticeDao.insertNoticeInfo(connection, insertNoticeInfoParams);
        connection.release();
        return response(baseResponse.NOTICE_ENROLL_SUCCESS,`추가된 공지사항 idx: ${noticeInsertResult.insertId}`);

    } catch (err) {
        logger.error(`App - createNotice Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 공지사항 수정
exports.editNotice = async function (noticeIdx, noticeTitle, noticeContents) {
    try{
        const noticeRows = await noticeProvider.retrieveDetailNoticeList(noticeIdx);
        if(noticeRows.length === 0) // 수정할 공지사항이 없는 경우
            return errResponse(baseResponse.NOTICE_NOT_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);
        const editNoticeResult = await noticeDao.updateNotice(connection, noticeIdx, noticeTitle, noticeContents);
        connection.release();

        return response(baseResponse.NOTICE_UPDATE_SUCCESS, editNoticeResult.info);

    } catch (err){
        logger.error(`App - editNotice Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 공지사항 삭제
exports.deleteNotice = async function (noticeIdx) {
    try {
        const noticeRows = await noticeProvider.retrieveDetailNoticeList(noticeIdx);
        console.log(noticeRows.length);
        if(noticeRows.length === 0) return errResponse(baseResponse.NOTICE_NOT_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteNoticeResult = await noticeDao.deleteNotice(connection, noticeIdx);
        connection.release();

        return response(baseResponse.NOTICE_DELETE_SUCCESS, deleteNoticeResult.info);

    }catch (err){
        logger.error(`App - deleteNotice Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};