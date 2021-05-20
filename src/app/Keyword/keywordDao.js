// 유저별 키워드 조회
async function selectKeyword(connection, usrIdx) {
    const selectKeywordQuery = `
        select idx , usrIdx, contents as keyword
        from KeyWordEnrollTB
        where usrIdx = ?
          and status = 'Y';
    `;

    const [keywordRows] = await connection.query(
        selectKeywordQuery,
        usrIdx
    );

    //console.log(keywordRows);

    return keywordRows;
}

// 유저 지역 조회
async function selectNoticeRegion(connection, usrIdx) {
    const selectNoticeRegionQuery = `
        select usrIdx, regionName, noticeStatus
        from RegionTB
        where usrIdx = ?
          and status = 'Y';
    `;

    const [keywordRows] = await connection.query(
        selectNoticeRegionQuery,
        usrIdx
    );
    //console.log(keywordRows);
    return keywordRows;
}

// 키워드 추가
async function insertKeyword(connection, usrIdx, keyword) {
    const insertKeywordQuery = `
        INSERT INTO KeyWordEnrollTB (status, usrIdx, contents)
        VALUES ('Y', ?, ?);
    `;

    const [keywordRows] = await connection.query(insertKeywordQuery, [usrIdx, keyword]);
    return keywordRows;
}

// 키워드 추가(같은 내용이 DB에 존재 할 경우)
async function editKeyword(connection, usrIdx, keyword) {
    const editKeywordQuery = `
        UPDATE KeyWordEnrollTB
        SET status  = 'Y'
        WHERE usrIdx = ? and contents = ? and status = 'N';
    `;

    const [keywordRows] = await connection.query(editKeywordQuery, [usrIdx, keyword]);
    return keywordRows;
}

// 키워드알림 받을 동네 설정
async function editNoticeRegion(connection, noticeStatus, usrIdx, regionName) {
    const editNoticeRegionQuery = `
        UPDATE RegionTB
        SET noticeStatus = ?
        WHERE usrIdx = ? and status = 'Y' and regionName = ?;
    `;

    const [keywordRows] = await connection.query(editNoticeRegionQuery, [noticeStatus, usrIdx, regionName]);
    return keywordRows;
}


// 키워드 삭제
async function deleteKeyword(connection, usrIdx, keyword) {
    const insertKeywordQuery = `
        UPDATE KeyWordEnrollTB
        SET status  = 'N'
        WHERE usrIdx = ? and contents = ? and status = 'Y';
    `;

    const [keywordRows] = await connection.query(insertKeywordQuery, [usrIdx, keyword]);
    return keywordRows;
}

// 유저별 등록 된 키워드 개수 검사
async function selectKeywordCount(connection, usrIdx) {
    const selectKeywordQuery = `
        select usrIdx, contents, status
        from KeyWordEnrollTB
        where usrIdx = ? and status = 'Y';
    `;

    const [keywordRows] = await connection.query(selectKeywordQuery, usrIdx);
    return keywordRows;
}

// 키워드 중복 검사
async function selectKeywordName(connection, usrIdx, keyword) {
    const selectKeywordQuery = `
        select usrIdx, contents
        from KeyWordEnrollTB
        where usrIdx = ?
          and contents = ?
          and status = 'Y';
    `;

    const [keywordRows] = await connection.query(selectKeywordQuery, [usrIdx, keyword]);
    return keywordRows;
}

// 이미 존재하는 키워드 검사
async function selectAlreadyKeywordName(connection, usrIdx, keyword) {
    const selectAlreadyKeywordNameQuery = `
        select usrIdx, contents
        from KeyWordEnrollTB
        where usrIdx = ?
          and contents = ?
          and status = 'N';
    `;

    const [keywordRows] = await connection.query(selectAlreadyKeywordNameQuery, [usrIdx, keyword]);
    return keywordRows;
}

module.exports = {
    selectKeyword,
    selectNoticeRegion,
    selectKeywordName,
    selectAlreadyKeywordName,
    selectKeywordCount,
    insertKeyword,
    editKeyword,
    editNoticeRegion,
    deleteKeyword
}