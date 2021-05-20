// 유저별 관심주제 조회
async function selectTopic(connection, usrIdx) {
    const selectTopicQuery = `
        select TT.topicName, ITT.status
        from InterestTopicTB ITT
        inner join TopicTB TT on ITT.topicIdx = TT.idx
        where ITT.usrIdx = ?;
    `;
    const [topicRows] = await connection.query(
        selectTopicQuery,
        usrIdx
    );
    return topicRows;
}

async function updateTopic(connection, status, topicName, usrIdx) {
    const updateTopicQuery = `
        UPDATE InterestTopicTB
        SET status = ?
        WHERE topicIdx = (select idx from TopicTB where topicName = ?)
          and usrIdx = ?;
    `;

    const [updateTopicRow] = await connection.query(updateTopicQuery, [status, topicName, usrIdx]);
    return updateTopicRow;
}

async function insertTopic(connection, usrIdx) {
    const insertTopicQuery = `
    INSERT INTO InterestTopicTB(usrIdx, topicIdx)
    values (?, 1),
           (?, 2),
           (?, 3),
           (?, 4),
           (?, 5),
           (?, 6),
           (?, 7),
           (?, 8),
           (?, 9),
           (?, 10),
           (?, 11),
           (?, 12),
           (?, 13),
           (?, 14),
           (?, 15);
    `;
    
    //동일한 usrIdx 값을 여러개 넣기위한 로직
    const resultUsrIdx = [];
    for(let i = 0; i < 15; i++){
        resultUsrIdx[i] = usrIdx;
    }

    const insertTopicRow = await connection.query(insertTopicQuery, resultUsrIdx);

    return insertTopicRow;
}

async function selectCheckTopic(connection, status, topicName, usrIdx) {
    const selectTopicQuery = `
        SELECT ITT.topicIdx, ITT.status, TT.topicName
        FROM InterestTopicTB ITT
                 INNER JOIN TopicTB TT on ITT.topicIdx = TT.idx
        WHERE ITT.usrIdx = ? AND TT.topicName = ? AND ITT.status = ?;
    `;

    const topicRows = await connection.query(
        selectTopicQuery,
        [usrIdx, topicName, status]
    );

    return topicRows;
}

module.exports = {
    selectTopic,
    updateTopic,
    insertTopic,
    selectCheckTopic
};