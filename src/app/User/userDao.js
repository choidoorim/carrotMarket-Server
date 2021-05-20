//유저 이름 조회 2021.05.04 CDR
async function selectUserName(connection, usrIdx) {
  const selectUserNickNameQuery = `
                SELECT usrNickName, idx
                FROM UserTB
                WHERE idx = ? AND status = 'Y';
                `;
  const userNameRows = await connection.query(selectUserNickNameQuery, [usrIdx]);
  return userNameRows[0];
}

// 유저 프로필 조회
async function selectUserProfile(connection, usrIdx) {
  const selectUserProfileQuery = `
                select UT.imgUrl      as profileImage
                     , UT.usrNickName as usrNickName
                     , RT.regionName  as regionName
                     , concat('#', UT.idx) as idx
                from RegionTB RT
                       inner join UserTB UT
                                  on RT.usrIdx = UT.idx
                where UT.idx = ?
                  and RT.status = 'Y'
                  and RT.leadStatus = 'Y'
                  and UT.status = 'Y';
                `;
  const [userProfileRows] = await connection.query(selectUserProfileQuery, usrIdx);
  return userProfileRows;
}

// 유저 상세 프로필 조회
async function selectUserDetailProfile(connection, usrIdx) {
  const selectUserDetailProfileQuery = `
                select UT.imgUrl                             as profileImage 
                , UT.usrNickName                             as usrNickName
                , concat('#', UT.idx)                        as idx
                , concat(UT.mannerTemp, 'C')                 as mannerTemp
                , case
                    when UT.tradeRate = 0 then '-%'
                    else concat(UT.tradeRate, '%')
                end                                           as tradeRate
                , case
                    when UT.responeRate = 0 then '-%'
                    else concat(UT.responeRate, '%')
                end                                           as responeRate
                , date_format(UT.createAt, '%Y년 %m월 %d일 가입') as createAt
                from UserTB UT
                    inner join RegionTB RT
                        on UT.idx = RT.usrIdx
                            and RT.leadStatus = 'Y'
                            and RT.status = 'Y'
                where UT.idx = ?;
                `;
  const [userDetailProfileRows] = await connection.query(selectUserDetailProfileQuery, usrIdx);
  return userDetailProfileRows;
}

//유저 생성 2021.05.03 CDR
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserTB(phoneNum, usrNickName, status)
        VALUES (?, ?, 'Y');
    `;
  const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
  );

  return insertUserInfoRow;
}

//유저 핸드폰번호 중복검사 2021.05.03 CDR
async function selectUserPhoneNum(connection, phonenumber) {
  const selectUserPhoneNumQuery = `
                SELECT phoneNum, usrNickName, idx 
                FROM UserTB 
                WHERE phoneNum = ?;
                `;
  const [phonenumberRows] = await connection.query(selectUserPhoneNumQuery, phonenumber);
  return phonenumberRows;
}

//유저 닉네임 중복 검사 2021.05.03 CDR
async function selectUserNickName(connection, usrNickName) {
  const selectUserNickNameQuery = `
                SELECT phoneNum, usrNickName 
                FROM UserTB 
                WHERE usrNickName = ?;
                `;
  const [nickNameRows] = await connection.query(selectUserNickNameQuery, usrNickName);
  return nickNameRows;
}

async function selectUserAccountTest(connection,  phoneNumber, usrIdx) {
  const selectUserAccountQuery = `
      SELECT idx, status, phoneNum, usrNickName
      FROM UserTB
      WHERE phoneNum = ?
        AND idx = ?;
        `;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      [phoneNumber, usrIdx]
  );
  return selectUserAccountRow[0];
}

async function selectCheckUserNickName(connection, usrIdx, usrNickName) {
  const selectCheckUserNickNameQuery = `
    SELECT idx, usrNickName
    FROM UserTB
    WHERE idx = ?
      AND usrNickName = ?;
  `;

  const selectCheckUserNickNameRow = await connection.query(
      selectCheckUserNickNameQuery,
      [usrIdx, usrNickName]
  );

  return selectCheckUserNickNameRow;
}

//유저 닉네임 변경 2021.05.04 CDR
async function updateUserNickName(connection, usrIdx, usrNickName) {
  const updateUserNickNameQuery = `
  UPDATE UserTB 
  SET usrNickName = ?
  WHERE idx = ?;
  `;
  const updateUserNickNameRow = await connection.query(updateUserNickNameQuery, [usrNickName, usrIdx]);
  return updateUserNickNameRow[0];
}

//유저 삭제
async function updateUserStatus(connection, usrIdx) {
  const updateUserStatusQuery = `
  UPDATE UserTB 
  SET status = 'N'
  WHERE idx = ?;
  `;
  const updateUserStatusRow = await connection.query(updateUserStatusQuery, usrIdx);
  return updateUserStatusRow[0];
}

async function updateUserImage(connection, imgUrl, usrIdx) {
  const updateUserImageQuery = `
      UPDATE UserTB
      SET imgUrl = ?
      WHERE idx = ?;
  `;

  const updateUserImageResult = await connection.query(updateUserImageQuery, [imgUrl, usrIdx]);
  return updateUserImageResult[0];
}

async function selectUserStatusCheck(connection, usrIdx) {
  const selectUserStatusCheckQuery = `
    SELECT idx, status, usrNickName
    FROM UserTB
    WHERE idx = ?;
  `;

  const [selectUserStatusCheckRows] = await connection.query(selectUserStatusCheckQuery, usrIdx);

  return selectUserStatusCheckRows;
}

async function selectCheckUsers(connection, phoneNumber) {
  const selectCheckUsersQuery = `
  SELECT status, phoneNum, usrNickName, imgUrl, mannerTemp, tradeRate, responeRate
FROM UserTB
WHERE phoneNum = ?;
  `

  const [selectCheckUsersResult] = await connection.query(selectCheckUsersQuery, phoneNumber);

  return selectCheckUsersResult;
}

// async function updateUserInfo(connection, id, nickname) {
//   const updateUserQuery = `
//   UPDATE UserInfo
//   SET nickname = ?
//   WHERE id = ?;
//   `;
//   const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
//   return updateUserRow[0];
// }

// async function updateUserInfoTest(connection, userIdx, nickName) {
//   const updateUserQuery = `
//     UPDATE UserTB
//     SET usrNickName = ?
//     WHERE idx = ?;
//   `;
//   const updateUserRow = await connection.query(updateUserQuery, [nickName, userIdx]);
//   return updateUserRow[0];
// }

// 모든 유저 조회
// async function selectUser(connection) {
//   const selectUserListQuery = `
//                 SELECT email, nickname
//                 FROM UserInfo;
//                 `;
//   const [userRows] = await connection.query(selectUserListQuery);
//   return userRows;
// }

// 이메일로 회원 조회
// async function selectUserEmail(connection, email) {
//   const selectUserEmailQuery = `
//                 SELECT email, nickname
//                 FROM UserInfo
//                 WHERE email = ?;
//                 `;
//   const [emailRows] = await connection.query(selectUserEmailQuery, email);
//   return emailRows;
// }

// 패스워드 체크
// async function selectUserPassword(connection, selectUserPasswordParams) {
//   const selectUserPasswordQuery = `
//         SELECT email, nickname, password
//         FROM UserInfo
//         WHERE email = ? AND password = ?;`;
//   const selectUserPasswordRow = await connection.query(
//       selectUserPasswordQuery,
//       selectUserPasswordParams
//   );
//
//   return selectUserPasswordRow;
// }

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
// async function selectUserAccount(connection, email) {
//   const selectUserAccountQuery = `
//         SELECT status, id
//         FROM UserInfo
//         WHERE email = ?;
//         `;
//   const selectUserAccountRow = await connection.query(
//       selectUserAccountQuery,
//       email
//   );
//   return selectUserAccountRow[0];
// }

module.exports = {
  selectUserAccountTest,
  selectUserPhoneNum,
  selectUserNickName,
  insertUserInfo,
  selectUserName,
  selectUserDetailProfile,
  selectUserProfile,
  updateUserNickName,
  updateUserStatus,
  updateUserImage,
  selectCheckUserNickName,
  selectUserStatusCheck,
  selectCheckUsers
};
