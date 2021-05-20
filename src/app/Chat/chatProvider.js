const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const chatDao = require("./chatDao");

exports.retriveChatRooms = async function(usrIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const chatRoomsListResult = await chatDao.selectChatRooms(connection, usrIdx);
    connection.release();

    return chatRoomsListResult;
};

exports.retriveChats = async function(roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const chatsListResult = await chatDao.selectChats(connection, roomIdx);
    connection.release();

    return chatsListResult;
};

exports.retriveSummaryProducts = async function(roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const SummaryProductsListResult = await chatDao.selectSummaryProducts(connection, roomIdx);
    connection.release();

    return SummaryProductsListResult;
};

exports.checkBuyer = async function(roomIdx, usrIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkBuyerResult = await chatDao.checkBuyer(connection, roomIdx, usrIdx);
    connection.release();

    return checkBuyerResult;
};

exports.checkChatRooms = async function(roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkChatRoomResult = await chatDao.checkChatRoom(connection, roomIdx);
    connection.release();

    return checkChatRoomResult;
};

exports.checkChatUser = async function(chatIdx, usrIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkChatUser = await chatDao.checkChatUser(connection, chatIdx, usrIdx);
    connection.release();

    return checkChatUser;
};