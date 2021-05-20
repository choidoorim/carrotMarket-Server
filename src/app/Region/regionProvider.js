const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const regionDao = require("./regionDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveRegion = async function (usrIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const regionListResult = await regionDao.selectRegion(connection, usrIdx);
    connection.release();

    return regionListResult;
};

exports.retrieveRegionInfo = async function (usrIdx, regionName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const regionInfoResult = await regionDao.selectRegionInfo(connection, usrIdx, regionName);
    connection.release();

    return regionInfoResult;
};

// 내 동네/ 인증 횟수 조회
exports.retrieveRegionList = async function (usrIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userRegionResult = await regionDao.selectUserRegion(connection, usrIdx);
    connection.release();

    return userRegionResult;
};

// 대표 동네 조회
exports.retrievesLeadRegionList = async function (usrIdx, regionName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userLeadRegionResult = await regionDao.selectUserLeadRegion(connection, usrIdx);
    connection.release();

    return userLeadRegionResult;
}

// 유저별 게시물 조회 지역범위 조회
exports.retrieveRegionRange = async function (usrIdx, regionName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userRegionRangeResult = await regionDao.selectRegionRange(connection, usrIdx, regionName);
    connection.release();

    return userRegionRangeResult;
};

//유저 지역 중복검사
exports.alreayRegionCheck = async function (regionName, usrIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    const userRegionCheckResult = await regionDao.selectAlreadyRegionCheck(
        connection,
        regionName,
        usrIdx
    );
    connection.release();

    return userRegionCheckResult;
};

//
exports.retrieveEnrollLeadRegion = async function (usrIdx, regionName) {
    const connection = await pool.getConnection(async (conn) => conn);

    const leadRegionNameResult = await regionDao.selectEnrollLeadRegionCount(
        connection,
        usrIdx,
        regionName
    );
    connection.release();

    return leadRegionNameResult;
}

// 동네 확인
exports.checkRegion = async function (usrIdx, regionName) {
    const connection = await pool.getConnection(async (conn) => conn);

    const checkRegionResult = await regionDao.selectCheckRegion(
        connection,
        usrIdx,
        regionName
    );
    connection.release();

    return checkRegionResult;
};

// // 유저별 등록된 지역 개수 체크
// exports.userRegionCountCheck = async function (usrIdx) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userRegionCountResult = await regionDao.selectUserCountRegion(connection, usrIdx);
//     connection.release();
//
//     return userRegionCountResult;
// };