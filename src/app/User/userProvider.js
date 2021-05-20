const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

// exports.retrieveUserList = async function (email) {
//   if (!email) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userListResult = await userDao.selectUser(connection);
//     connection.release();
//
//     return userListResult;
//
//   } else {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const userListResult = await userDao.selectUserEmail(connection, email);
//     connection.release();
//
//     return userListResult;
//   }
// };

// exports.retrieveUser = async function (userId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const userResult = await userDao.selectUserId(connection, userId);
//
//   connection.release();
//
//   return userResult[0];
// };

// 유저 닉네임 조회
exports.retrieveUser = async function (usrIdx) {
  const connection = await pool.getConnection(async (conn) => conn);

  const userResult = await userDao.selectUserName(connection, usrIdx);

  connection.release();

  return userResult;
};

//유저 프로필 조회
exports.retrieveUserProfile = async function (usrIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserProfile(connection, usrIdx);
  if(userResult.length === 0) return errResponse(baseResponse.PROFILE_SELECT_FAIL);
  connection.release();

  return response(baseResponse.PROFILE_SELECT_SUCCESS, userResult[0]);
};

//유저 상세 프로필 조회
exports.retrieveUserDetailProfile = async function (usrIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserDetailProfile(connection, usrIdx);

  connection.release();

  return userResult;
};

exports.userStatusCheck = async function (usrIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const userStatusCheckResult = await userDao.selectUserStatusCheck(connection, usrIdx);
  connection.release();

  return userStatusCheckResult;
}

//유저 핸드폰번호 중복검사 2021.05.03 CDR
exports.phonenumberCheck = async function (phonenumber) {
  const connection = await pool.getConnection(async (conn) => conn);
  const phonenumberCheckResult = await userDao.selectUserPhoneNum(connection, phonenumber);
  connection.release();

  return phonenumberCheckResult;
};

//유저 닉네임 중복검사
exports.nickNameCheck = async function (usrNickName) {
  const connection = await pool.getConnection(async (conn) => conn);
  const usrNickNameCheckResult = await userDao.selectUserNickName(connection, usrNickName);
  connection.release();

  return usrNickNameCheckResult;
};

exports.retrieveUserNickName = async function (usrIdx, usrNickName) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkNickNameResult = await userDao.selectCheckUserNickName(connection, usrIdx, usrNickName);
  connection.release();

  return checkNickNameResult;
};

exports.checkUsers = async function (phoneNumber) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkUsersResult = await userDao.selectCheckUsers(connection, usrIdx, usrNickName);
  connection.release();

  return checkUsersResult;
}

//계정 체크
exports.accountCheck = async function (phoneNumber, usrIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccountTest(connection, phoneNumber, usrIdx);
  connection.release();

  return userAccountResult;
};
// exports.passwordCheck = async function (selectUserPasswordParams) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const passwordCheckResult = await userDao.selectUserPassword(
//       connection,
//       selectUserPasswordParams
//   );
//   connection.release();
//   return passwordCheckResult[0];
// };

// exports.accountCheck = async function (email) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const userAccountResult = await userDao.selectUserAccount(connection, email);
//   connection.release();
//
//   return userAccountResult;
// };


// exports.emailCheck = async function (email) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const emailCheckResult = await userDao.selectUserEmail(connection, email);
//   connection.release();
//
//   return emailCheckResult;
// };