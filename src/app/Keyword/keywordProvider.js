const { pool } = require("../../../config/database");
const keywordDao = require("./keywordDao");
const { logger } = require("../../../config/winston");

//유저별 키워드 조회
exports.retrieveKeywordList = async function (usrIdx) {

    const connection = await pool.getConnection(async (conn) => conn);
    const keywordListResult = await keywordDao.selectKeyword(connection, usrIdx);
    connection.release();

    return keywordListResult;
}

// 알림 받을 동네 조회
exports.retrieveNoticeRegionList = async function (usrIdx) {

    const connection = await pool.getConnection(async (conn) => conn);
    const NoticeRegionListResult = await keywordDao.selectNoticeRegion(connection, usrIdx);
    connection.release();

    return NoticeRegionListResult;
}


//키워드 중복 검사
exports.retrieveKeywordName = async function (usrIdx, keyword) {

    const connection = await pool.getConnection(async (conn) => conn);
    const keywordListResult = await keywordDao.selectKeywordName(connection, usrIdx, keyword);
    connection.release();

    return keywordListResult;
}

//이미 존재하는 키워드 검사(키워드 등록 시 사용)
exports.retrieveAlreadyKeywordName = async function (usrIdx, keyword) {

    const connection = await pool.getConnection(async (conn) => conn);
    const keywordListResult = await keywordDao.selectAlreadyKeywordName(connection, usrIdx, keyword);
    connection.release();

    return keywordListResult;
}

// 등록 된 키워드 개수 검사
exports.retrieveKeywordCount = async function (usrIdx) {

    const connection = await pool.getConnection(async (conn) => conn);
    const keywordListResult = await keywordDao.selectKeywordCount(connection, usrIdx);
    connection.release();

    return keywordListResult;
}