//공지사항 조회
async function selectNotice(connection) {
    const selectNoticeQuery = `
                select idx ,date_format(createAt, '%Y.%m.%d') as createAt, noticeTitle
                from NoticeTB
                where status = 'Y'
                order by createAt DESC;
                `;
    const [noticeRows] = await connection.query(selectNoticeQuery);
    return noticeRows;
}

//공지사항 상세 조회
async function selectDetailNotice(connection, noticeIdx) {
    const selectDetailNoticeQuery = `
                select idx, date_format(createAt, '%Y.%m.%d') as createAt, noticeTitle, noticeContents
                from NoticeTB
                where idx = ? and status = 'Y';
                `;
    const [detailNoticeRows] = await connection.query(selectDetailNoticeQuery, noticeIdx);
    return detailNoticeRows;
}

//공지사항 추가
async function insertNoticeInfo(connection, insertNoticeInfoParams) {
    const insertNoticeInfoQuery = `
        INSERT INTO NoticeTB(noticeTitle, noticeContents, status)
        VALUES (?, ?, 'Y');
    `;

    const insertUserInfoRow = await connection.query(
        insertNoticeInfoQuery,
        insertNoticeInfoParams
    );

    return insertUserInfoRow[0];
}

//공지사항 수정
async function updateNotice(connection, noticeIdx, noticeTitle, noticeContents) {
    const updateNoticeQuery = `
        UPDATE NoticeTB 
        SET noticeTitle    = ?,
            noticeContents = ?
        WHERE idx = ?;
    `;
    const updateNoticeRow = await connection.query(updateNoticeQuery, [noticeTitle, noticeContents, noticeIdx]);
    return updateNoticeRow[0];
}

//공지사항 삭제
async function deleteNotice(connection, noticeIdx) {
    const updateNoticeQuery = `
        UPDATE NoticeTB 
        SET status = 'N'
        WHERE idx = ?;
    `;
    const updateNoticeRow = await connection.query(updateNoticeQuery, noticeIdx);
    return updateNoticeRow[0];
}

module.exports = {
    selectNotice,
    selectDetailNotice,
    insertNoticeInfo,
    updateNotice,
    deleteNotice
};
