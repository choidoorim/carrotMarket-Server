// 내 동네 조회
async function selectRegion(connection, usrIdx) {
    const selectRegionQuery = `
        SELECT idx, regionName, leadStatus
        FROM RegionTB
        WHERE usrIdx = ?
          AND status = 'Y';
    `;

    const [selectRegionRows] = await connection.query(selectRegionQuery, usrIdx);

    return selectRegionRows;
}

// 동네 정보 조회
async function selectRegionInfo(connection, usrIdx, regionName) {
    const selectRegionInfoQuery = `
        SELECT idx, regionName, maxRange
        FROM RegionTB
        WHERE usrIdx = ?
          AND regionName = ?;
  `;

    const [selectRegionInfoResult] = await connection.query(selectRegionInfoQuery, [usrIdx, regionName]);

    return selectRegionInfoResult;
}

// 내 동네/ 인증 횟수 조회
async function selectUserRegion(connection, usrIdx) {
    const selectUserRegionQuery = `
        select regionName, authCount, idx
        from RegionTB
        where usrIdx = ?
        and status = 'Y';
        `;
    const [userRegionRows] = await connection.query(selectUserRegionQuery, usrIdx);
    return userRegionRows;
}

// 대표 지역 조회
async function selectUserLeadRegion(connection, usrIdx) {
    const selectUserLeadRegionQuery = `
        select regionName, idx as usrIdx
        from RegionTB
        where usrIdx = ?
          and status = 'Y'
          and leadStatus = 'Y';
    `;
    const [userLeadRegionRows] = await connection.query(selectUserLeadRegionQuery, usrIdx);
    return userLeadRegionRows;
}

// 유저별 게시물 조회 지역범위 조회
async function selectRegionRange(connection, usrIdx, regionName) {
    const selectRegionRangeQuery = `
        select regionName as nearRegion
        from RegionTB RT
        where (6371 * acos(cos(radians((select regionLatitue
                                        from RegionTB
                                        where usrIdx = ?
                                          and status = 'Y'
                                          and regionName = ?))) * cos(radians(RT.regionLatitue)) *
                           cos(radians(RT.regionLongitude)
                               - radians((select regionLongitude
                                          from RegionTB
                                          where usrIdx = ?
                                            and status = 'Y'
                                            and regionName = ?))) + sin(radians((select regionLatitue
                                                                                   from RegionTB
                                                                                   where usrIdx = ?
                                                                                     and status = 'Y'
                                                                                     and regionName = ?))) *
                                                                      sin(radians(RT.regionLatitue)))) < RT.maxRange
        group by regionName;
    `;
    const [userRegionRangeRows] = await connection.query(
        selectRegionRangeQuery,
        [usrIdx, regionName, usrIdx, regionName, usrIdx, regionName]
    );
    return userRegionRangeRows;
}

async function selectRegionRangeCount(connection, usrIdx) {
    const selectRegionRangeQuery = `
        select regionName as 근처동네리스트
        from RegionTB RT
        where (6371 * acos(cos(radians((select regionLatitue
                                        from RegionTB
                                        where usrIdx = ?
                                          and status = 'Y'
                                          and leadStatus = 'Y'))) * cos(radians(RT.regionLatitue)) *
                           cos(radians(RT.regionLongitude)
                               - radians((select regionLongitude
                                          from RegionTB
                                          where usrIdx = ?
                                            and status = 'Y'
                                            and leadStatus = 'Y'))) + sin(radians((select regionLatitue
                                                                                   from RegionTB
                                                                                   where usrIdx = ?
                                                                                     and status = 'Y'
                                                                                     and leadStatus = 'Y'))) *
                                                                      sin(radians(RT.regionLatitue)))) < RT.maxRange
        group by regionName;
    `;
    const [userRegionRangeRows] = await connection.query(selectRegionRangeQuery, [usrIdx, usrIdx, usrIdx]);
    return userRegionRangeRows;
}

// 내 동네 등록
async function insertUserRegion(connection, insertUserRegionParams) {
    const insertUserRegionQuery = `
        INSERT INTO RegionTB(regionName, usrIdx, regionLatitue, regionLongitude, status, leadStatus, noticeStatus)
        VALUES (?, ?, ?, ?, 'Y', 'Y', 'Y');
    `;

    const insertUserRegionRow = await connection.query(
        insertUserRegionQuery,
        insertUserRegionParams
    );

    return insertUserRegionRow;
}

// 내 동네 등록(기존에 삭제 되었던 지역일 경우)
async function updateUserRegion(connection, updateUserRegionParams) {
    const updateUserRegionQuery = `
        UPDATE RegionTB
        SET status = 'Y', leadStatus = 'Y', noticeStatus = 'N'
        WHERE usrIdx = ? and regionName = ? and status = 'N';
    `;

    const updateUserRegionRow = await connection.query(
        updateUserRegionQuery,
        updateUserRegionParams
    );

    return updateUserRegionRow;
}

// 대표 동네 설정
async function updateLeadRegion(connection, updateLeadRegionInfoParams) {
    const updateLeadRegionQuery = `
        UPDATE RegionTB
        SET leadStatus = 'Y'
        WHERE usrIdx = ? and regionName = ? and status = 'Y';
    `;

    const updateLeadRegionRow = await connection.query(
        updateLeadRegionQuery,
        updateLeadRegionInfoParams
    );
    return updateLeadRegionRow;
}

// 유저별 게시물 조회 지역범위 설정
async function updateRegionRange(connection, updateRegionRangeInfoParams) {
    const updateRegionRangeQuery = `
        UPDATE RegionTB
            SET maxRange = ?
            WHERE usrIdx = ?
            AND regionName = ?
            AND status = 'Y'
            AND leadStatus = 'Y';
    `;

    const updateRegionRangeRow = await connection.query(
        updateRegionRangeQuery,
        updateRegionRangeInfoParams
    );

    return updateRegionRangeRow;
}

// 인증 횟수 증가
async function updateCountAuthRegion(connection, usrIdx, regionName) {
    const updateCountAuthRegionQuery = `
        UPDATE RegionTB
            SET authCount = authCount + 1, authStatus = 'Y'
            WHERE usrIdx = ?
            AND regionName = ?
            AND status = 'Y';
    `;

    const updateCountAuthRegionRow= await connection.query(
        updateCountAuthRegionQuery,
        [usrIdx, regionName]
    );
    return updateCountAuthRegionRow;
}

async function releaseLeadRegion(connection, usrIdx, changeLeadRegionName) {
    const releaseLeadRegionQuery = `
        UPDATE RegionTB
        SET leadStatus = 'N', noticeStatus = 'N'
        WHERE usrIdx = ? AND regionName = ?;
    `;

    const releaseLeadRegionResult = await connection.query(
        releaseLeadRegionQuery,
        [usrIdx, changeLeadRegionName]
    );

    return releaseLeadRegionResult;
}

// //대표 동네 취소
// async function deleteLeadRegion(connection, deleteLeadRegionInfoParams) {
//     const deleteLeadRegionQuery = `
//         UPDATE RegionTB
//         SET leadStatus = 'N'
//         WHERE usrIdx = ? and regionName = ? and status = 'Y';
//     `;
//
//     const deleteLeadRegionRow = await connection.query(
//         deleteLeadRegionQuery,
//         deleteLeadRegionInfoParams
//     );
//     return deleteLeadRegionRow;
// }

// 내 동네 삭제
async function deleteRegion(connection, usrIdx, regionName) {
    const deleteRegionQuery = `
        UPDATE RegionTB
        SET status = 'N', leadStatus =  'N', authStatus = 'N', noticeStatus = 'N'
        WHERE usrIdx = ? and regionName = ? and status = 'Y';
    `;

    const deleteRegionRow = await connection.query(deleteRegionQuery, [usrIdx, regionName]);

    return deleteRegionRow;
}

// 기존에 삭제 된 지역이 있는지 조회
async function selectAlreadyRegionCheck(connection, regionName, usrIdx) {
    const selectUserRegionCheckQuery = `
                SELECT regionName 
                FROM RegionTB 
                WHERE regionName = ? and usrIdx = ?;
                `;
    const [UserRegionRows] = await connection.query(selectUserRegionCheckQuery, [regionName, usrIdx]);
    return UserRegionRows;
}

// 유저 지역 등록 개수 검사
async function selectUserCountRegion(connection, usrIdx) {
    const selectUserCountRegionQuery = `
                SELECT regionName 
                FROM RegionTB 
                WHERE usrIdx = ? and status = 'Y';
                `;
    const [UserCountRegionRows] = await connection.query(selectUserCountRegionQuery, usrIdx);
    return UserCountRegionRows;
}

// 대표지역으로 설정 할 데이터가 있는지 검사
async function selectEnrollLeadRegionCount(connection, usrIdx, regionName) {
    const selectEnrollLeadRegionQuery = `
        select regionName
        from RegionTB
        where usrIdx = ?
          and regionName = ?
          and status = 'Y'
          and leadStatus = 'N';
    `
    const [leadRegionRows] = await connection.query(selectEnrollLeadRegionQuery, [usrIdx, regionName]);
    return leadRegionRows;
}

// 동네명으로 체크
async function selectCheckRegion(connection, usrIdx, regionName) {
    const selectRegionQuery = `
        select idx, status, regionName, noticeStatus, maxRange, usrIdx
            from RegionTB
            where usrIdx = ?
            and regionName = ?
            and status = 'Y';
    `;

    const regionRows = await connection.query(selectRegionQuery, [usrIdx, regionName]);

    return regionRows[0];
}

module.exports = {
    selectRegion,
    selectRegionInfo,
    selectUserRegion,
    selectUserLeadRegion,
    selectRegionRange,
    selectAlreadyRegionCheck,
    selectUserCountRegion,
    selectEnrollLeadRegionCount,
    selectCheckRegion,
    insertUserRegion,
    releaseLeadRegion,
    updateUserRegion,
    updateLeadRegion,
    updateRegionRange,
    updateCountAuthRegion,
    deleteRegion
};
