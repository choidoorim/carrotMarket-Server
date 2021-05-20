const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const keywordProvider = require("./keywordProvider");
const regionProvider = require("../Region/regionProvider");
const keywordDao = require("./keywordDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// 키워드알림 받을 동네 설정
exports.patchNoticeRegion = async function (noticeStatus, usrIdx, regionName) {
    try {
        const countNoticeRegionRows = await keywordProvider.retrieveNoticeRegionList(usrIdx);
        if(countNoticeRegionRows.length > 2) return errResponse(baseResponse.SIGNUP_NOTICEREGION_COUNT);

        const checkNoticeRegionRows = await regionProvider.checkRegion(usrIdx, regionName);
        if(checkNoticeRegionRows.length === 0) return errResponse(baseResponse.REGION_NOT_EXIST);
        if(checkNoticeRegionRows[0].noticeStatus === noticeStatus) return errResponse(baseResponse.NOT_CHANGE);

        const connection = await pool.getConnection(async (conn) => conn);

        const noticeRegionUpdateResult = await keywordDao.editNoticeRegion(connection, noticeStatus, usrIdx, regionName);
        connection.release();
        return response(baseResponse.REGION_NOTICE_SUCCESS, noticeRegionUpdateResult.info);

    } catch (err) {
        logger.error(`App - createKeyword Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.insertKeyword = async function (usrIdx, keyword) {
    try {
        let resultInfo; //추가된 키워드 성공 여부
        const countKeywordRows = await keywordProvider.retrieveKeywordCount(usrIdx);
        if(countKeywordRows.length > 30) return errResponse(baseResponse.SIGNUP_KEYWORD_COUNT);

        const keywordRows = await keywordProvider.retrieveKeywordName(usrIdx, keyword);
        if(keywordRows.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_KEYWORD);

        const alreadyKeywordRows = await keywordProvider.retrieveAlreadyKeywordName(usrIdx, keyword);
        const connection = await pool.getConnection(async (conn) => conn);

        //키워드를 등록 할 유저의 키워드가 이전에 등록되어 있었던 경우: status 값만 Y로 변경
        if(alreadyKeywordRows.length > 0){
            const keywordEditResult = await keywordDao.editKeyword(connection, usrIdx, keyword); //update
            resultInfo = keywordEditResult.info;
        }else {
            const keywordInsertResult = await keywordDao.insertKeyword(connection, usrIdx, keyword); //insert
            resultInfo = keywordInsertResult.insertId;
        }

        connection.release();
        return response(baseResponse.KEYWORD_INSERT_SUCCESS, resultInfo);

    } catch (err) {
        logger.error(`App - createKeyword Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteKeyword = async function (usrIdx, keyword) {
    try {
        const keywordRows = await keywordProvider.retrieveKeywordName(usrIdx, keyword);
        if(keywordRows.length === 0) return errResponse(baseResponse.DELETE_KIYWORD_NOT_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);

        const keywordDeleteResult = await keywordDao.deleteKeyword(connection, usrIdx, keyword);
        connection.release();

        return response(baseResponse.KEYWORD_DELETE_SUCCESS,keywordDeleteResult.info);

    } catch (err) {
        logger.error(`App - createKeyword Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}