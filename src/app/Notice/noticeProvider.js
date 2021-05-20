const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const noticeDao = require("./noticeDao");

// Provider: Read 비즈니스 로직 처리

//공지사항 전체조회
exports.retrieveNoticeList = async function () {

    const connection = await pool.getConnection(async (conn) => conn);
    const noticeListResult = await noticeDao.selectNotice(connection);
    connection.release();

    return noticeListResult;
};

//공지사항 조회
exports.retrieveDetailNoticeList = async function (noticeIdx) {
    
    const connection = await pool.getConnection(async (conn) => conn);
    const detailNoticeListResult = await noticeDao.selectDetailNotice(connection, noticeIdx);
    connection.release();

    return detailNoticeListResult;
};