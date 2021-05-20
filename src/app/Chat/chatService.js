const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const chatProvider = require("./chatProvider");
const productProvider = require("../Product/productProvider");
const chatDao = require("./chatDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.insertChatRooms = async function (pdIdx, usrIdx) {
    try {
        const selectProductRows = await productProvider.checkProduct(pdIdx);
        if(selectProductRows.length === 0) return errResponse(baseResponse.PRODUCT_NOT_EXIST);
        if(selectProductRows[0].sellUsrIdx === usrIdx) return errResponse(baseResponse.PRODUCT_MEMBER);

        const checkChatRoom = await productProvider.checkChatRoom(pdIdx, usrIdx);
        if(checkChatRoom.length > 0) return errResponse(baseResponse.CHATROOM_ALREADY_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);
        const insertChatRoomsResult = await chatDao.insertChatRooms(connection, pdIdx, usrIdx);
        connection.release();

        return response(baseResponse.CHATROOM_INSERT_SUCCESS, insertChatRoomsResult.insertId);
    } catch (err) {
        logger.error(`App - insertChatRooms Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.insertChats = async function (roomIdx, usrIdx, contents) {
    try {
        const checkChatRooms = await chatProvider.checkChatRooms(roomIdx);
        if(checkChatRooms.length === 0) return errResponse(baseResponse.CHATROOM_NOT_EXIST);
        console.log(checkChatRooms[0]);
        if(checkChatRooms[0].sellerIdx !== usrIdx && checkChatRooms[0].buyerIdx !== usrIdx)
            return errResponse(baseResponse.NOT_CHATROOM_MEMBER);

        const connection = await pool.getConnection(async (conn) => conn);
        const insertChatsResult = await chatDao.insertChats(connection, roomIdx, usrIdx, contents);
        connection.release();

        return response(baseResponse.CHAT_INSERT_SUCCESS, insertChatsResult[0].insertId);
    } catch (err) {
        logger.error(`App - insertChats Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteChatRooms = async function (roomIdx, usrIdx){
    try {
        let resultInfo;
        const checkChatRooms = await chatProvider.checkChatRooms(roomIdx);
        if(checkChatRooms.length === 0) return errResponse(baseResponse.CHATROOM_NOT_EXIST);
        if(checkChatRooms[0].sellerIdx !== usrIdx && checkChatRooms[0].buyerIdx !== usrIdx)
            return errResponse(baseResponse.NOT_CHATROOM_MEMBER);

        const checkBuyerRows = await chatProvider.checkBuyer(roomIdx, usrIdx);
        const connection = await pool.getConnection(async (conn) => conn);

        if(checkBuyerRows.length === 0){ //구매자가 아니라면 판매자이기에
            const deleteSellerChatRoomsResult = await chatDao.deleteSellerChatRooms(connection, roomIdx, usrIdx);
            resultInfo = deleteSellerChatRoomsResult[0].info;
        }else {
            const deleteBuyerChatRoomsResult = await chatDao.deleteBuyerChatRooms(connection, roomIdx, usrIdx);
            resultInfo = deleteBuyerChatRoomsResult[0].info;
        }
        connection.release();

        return response(baseResponse.CHATROOM_DELETE_SUCCESS, resultInfo);
    } catch (err) {
        logger.error(`App - deleteChatRooms Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteChats = async function (usrIdx, chatIdx) {
    try {
        const checkChatUser = await chatProvider.checkChatUser(chatIdx, usrIdx);
        if(checkChatUser.length === 0) return errResponse(response(baseResponse.NOT_CHAT_MEMBER));

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteChatsResult = await chatDao.deleteChats(connection, chatIdx);
        connection.release();

        return response(baseResponse.CHAT_DELETE_SUCCESS, deleteChatsResult[0].info);

    } catch (err){
        logger.error(`App - deleteChats Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
