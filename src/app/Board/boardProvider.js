const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const boardDao = require("./boardDao");

exports.selectBoards = async function(usrIdx, regionName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const boardSelectResult = await boardDao.selectBoards(connection, usrIdx, regionName);
    connection.release();

    return boardSelectResult;
};

exports.selectUsersTopic = async function(usrIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const TopicSelectResult = await boardDao.selectTopics(connection, usrIdx);
    connection.release();

    return TopicSelectResult;
}

exports.selectDetailBoard = async function(boardIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectDetailBoardResult = boardDao.selectDetailBoard(connection, boardIdx);
    connection.release();

    return selectDetailBoardResult;
};

exports.selectBoardImages = async function(boardIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    const selectBoardImagesResult = boardDao.selectBoardImages(connection, boardIdx);
    connection.release();

    return selectBoardImagesResult;
};

exports.selectBoardEmoji = async function(boardIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectBoardEmojiResult = await boardDao.selectBoardEmoji(connection, boardIdx);
    connection.release();

    return selectBoardEmojiResult;

};

exports.selectBoardComment = async function(boardIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectBoardCommentResult = await boardDao.selectBoardComments(connection, boardIdx);
    connection.release();

    return selectBoardCommentResult;
};

exports.selectCommentEmoji = async function(cmIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectCommentEmojiResult = await boardDao.selectCommentEmojis(connection, cmIdx);
    connection.release();

    return selectCommentEmojiResult;
};

exports.checkBoardImage = async function(boardImgIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectBoardImageResult = await boardDao.checkBoardImage(connection ,boardImgIdx);
    connection.release();

    return selectBoardImageResult;
};

exports.checkBoardEmoji = async function (boardIdx, usrIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectBoardEmojiResult = await boardDao.checkBoardEmoji(connection , boardIdx, usrIdx);
    connection.release();

    return selectBoardEmojiResult;
};

exports.checkBoardEmojis = async function (boardIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectBoardEmojisResult = await boardDao.checkBoardEmojis(connection , boardIdx);
    connection.release();

    return selectBoardEmojisResult;
};

exports.checkBoardComment = async function (boardIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectBoardCommentResult = await boardDao.checkBoardComment(connection, boardIdx);
    connection.release();

    return selectBoardCommentResult;
};

exports.checkCommentEmoji = async function (cmIdx, usrIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectCommentEmojiResult = await boardDao.checkCommentEmoji(connection , cmIdx, usrIdx);
    connection.release();

    return selectCommentEmojiResult;
};

exports.checkCommentEmojis = async function (boardIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectCommentEmojisResult = await boardDao.checkCommentEmojis(connection , boardIdx);
    connection.release();

    return selectCommentEmojisResult;
};

exports.checkBoard = async function (boardIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectBoardResult = await boardDao.checkBoard(connection, boardIdx);
    connection.release();

    return selectBoardResult;
};

exports.checkComment = async function (boardIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectCheckCommentResult = await boardDao.checkComment(connection, boardIdx);
    connection.release();

    return selectCheckCommentResult;
};

exports.checkCommentIdx = async function (cmIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectCheckCommentIdx = await boardDao.checkCommentIdx(connection, cmIdx);
    connection.release();

    return selectCheckCommentIdx;
}