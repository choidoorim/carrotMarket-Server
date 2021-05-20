const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const regionProvider = require("./regionProvider");
const regionDao = require("./regionDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 인증 횟수 추가
exports.editCountAuthRegion = async function (usrIdx, regionName) {
    try {
        const selectRegionRows = await regionProvider.checkRegion(usrIdx, regionName);
        if(selectRegionRows.length === 0) return errResponse(baseResponse.REGIONS_INACTIVE_ACCOUNT);

        const connection = await pool.getConnection(async (conn) => conn);

        const updateCountAuthRegionResult = await regionDao.updateCountAuthRegion(connection, usrIdx, regionName);
        connection.release();

        return response(baseResponse.AUTHREGION_UPDATE_SUCCESS, updateCountAuthRegionResult[0].info);
    } catch (err) {
        logger.error(`App - editCountAuthRegion Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 유저별 게시물 조회 지역범위 설정
exports.editRegionRange = async function (usrIdx, regionName, maxRange) {
    try {
        const selectRegionRows = await regionProvider.checkRegion(usrIdx, regionName);
        if(selectRegionRows.length === 0) return errResponse(baseResponse.REGIONS_INACTIVE_ACCOUNT);
        if(selectRegionRows[0].maxRange === maxRange) return errResponse(baseResponse.NOT_CHANGE);

        const updateRegionRangeInfoParams = [maxRange, usrIdx, regionName];
        const connection = await pool.getConnection(async (conn) => conn);

        const updateRegionRangeResult = await regionDao.updateRegionRange(connection, updateRegionRangeInfoParams);
        connection.release();

        return response(baseResponse.REGIONRANGE_UPDATE_SUCCESS, updateRegionRangeResult[0].info);
    } catch (err) {
        logger.error(`App - editRegionRange Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 대표 동네 변경
// 내 동네 2개중 대표 동네 변경 시 다른 동네 leadStatus를 'N'으로 바꾼다.
exports.editLeadRegionList = async function (usrIdx, regionName) {
    try {
        let changeLeadRegionName;
        const checkLeadRegion = await regionProvider.retrieveEnrollLeadRegion(usrIdx, regionName);
        console.log(checkLeadRegion.length);
        if(checkLeadRegion.length === 0) return errResponse(baseResponse.LEAD_REGION_NOT_EXIST);

        const userRegionCountRows = await regionProvider.retrieveRegion(usrIdx); // 유저별 등록된 지역 개수 체크(최대 2개까지만 등록이 가능하다.)

        const connection = await pool.getConnection(async (conn) => conn);
        for(let i = 0; i < userRegionCountRows.length; i++) { // 전 대표 동네의 leadStatus를 'N'으로 변경
            if(regionName != userRegionCountRows[i].regionName){
                changeLeadRegionName = userRegionCountRows[i].regionName;
                const releaseLeadRegion = await regionDao.releaseLeadRegion(connection, usrIdx, changeLeadRegionName);
            }
        }

        const countSelectLeadRegionRows = await regionProvider.retrievesLeadRegionList(usrIdx);
        if(countSelectLeadRegionRows.length > 0 ) return errResponse(baseResponse.SIGNUP_LEADREGION_COUNT);

        const updateLeadRegionInfoParams = [usrIdx, regionName];

        const updateLeadRegionResult = await regionDao.updateLeadRegion(connection, updateLeadRegionInfoParams);
        connection.release();

        return response(baseResponse.LEADREGION_UPDATE_SUCCESS, updateLeadRegionResult[0].info);

    } catch (err) {
        logger.error(`App - editLeadRegionList Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 내 동네 삭제
exports.deleteUserRegion = async function (usrIdx, regionName) {
    try {
        // 삭제할 동네가 있는지 조회
        const checkRegionRows = await regionProvider.checkRegion(usrIdx, regionName);
        console.log(checkRegionRows.length);
        if(checkRegionRows.length === 0) return errResponse(baseResponse.REGION_NOT_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteRegionResult = await regionDao.deleteRegion(connection, usrIdx, regionName);
        connection.release();

        return response(baseResponse.REGION_DELETE_SUCCESS, deleteRegionResult[0].info);

    } catch (err) {
        logger.error(`App - deleteUserRegion Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

//내 동네 등록
exports.createUserRegion = async function (regionName, usrIdx, regionLatitue, regionLongitude) {
    try {
        let userRegionInfo;
        let changeLeadRegionName;
        const updateUserRegionInfoParams = [usrIdx, regionName];
        const insertUserRegionInfoParams = [regionName, usrIdx, regionLatitue, regionLongitude];

        const userRegionCountRows = await regionProvider.retrieveRegion(usrIdx); // 유저별 등록된 지역 개수 체크(최대 2개까지만 등록이 가능하다.)
        if(userRegionCountRows.length > 1) return errResponse(baseResponse.SIGNUP_REGION_COUNT);

        const userDistinctRegion = await regionProvider.checkRegion(usrIdx, regionName);
        if(userDistinctRegion.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_REGION);

        const connection = await pool.getConnection(async (conn) => conn);
        for(let i = 0; i < userRegionCountRows.length; i++) { // 기존 대표 지역 취소
            if(regionName != userRegionCountRows[i].regionName){
                changeLeadRegionName = userRegionCountRows[i].regionName;
                const releaseLeadRegion = await regionDao.releaseLeadRegion(connection, usrIdx, changeLeadRegionName);
            }
        }
        
        //기존에 등록되었던 지역일 경우 status만 변경
        const userAlreadyRegionRows = await regionProvider.alreayRegionCheck(regionName, usrIdx);
        if(userAlreadyRegionRows.length > 0){ //기존 삭제된 동네일 경우
            const userRegionUpdateResult =  await regionDao.updateUserRegion(connection, updateUserRegionInfoParams);
            userRegionInfo = userRegionUpdateResult[0].info;
            console.log("already");
        }else {
            const userRegionInsertResult = await regionDao.insertUserRegion(connection, insertUserRegionInfoParams);
            userRegionInfo = userRegionInsertResult[0].insertId;
            console.log("already not");
        }

        connection.release();
        return response(baseResponse.REGION_INSERT_SUCCESS, userRegionInfo);

    } catch (err) {
        logger.error(`App - createUserRegion Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//대표 동네 취소
// exports.deleteLeadRegionList = async function (usrIdx, regionName) {
//     try {
//         const countDeleteLeadRegionRows = await regionProvider.retrievesLeadRegionList(usrIdx);
//         console.log(countDeleteLeadRegionRows.length);
//         if(countDeleteLeadRegionRows.length === 0 ) return errResponse(baseResponse.LEADREGIONS_INACTIVE_ACCOUNT);
//
//         const deleteLeadRegionInfoParams = [usrIdx, regionName];
//
//         const connection = await pool.getConnection(async (conn) => conn);
//         const deleteLeadRegionResult = await regionDao.deleteLeadRegion(connection, deleteLeadRegionInfoParams);
//         connection.release();
//
//         return response(baseResponse.SUCCESS);
//
//     } catch (err) {
//         logger.error(`App - Region Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };