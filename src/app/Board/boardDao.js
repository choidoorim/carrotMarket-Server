// 유저 관심주제 조회
async function selectTopics(connection, usrIdx) {
    const selectTopicsQuery = `
        SELECT ITT.idx as topicIdx, TT.topicName
        FROM InterestTopicTB ITT
        INNER JOIN TopicTB TT on ITT.topicIdx = TT.idx
        WHERE ITT.usrIdx = ?
          AND ITT.status = 'Y';
    `;

    const [selectTopicsResult] = await connection.query(
        selectTopicsQuery,
        usrIdx
    );

    return selectTopicsResult;
};

// 게시글 조회
async function selectBoards(connection, usrIdx, regionName) {
    const selectBoardsQuery = `
        select BT.idx                                                                                          as idx
             , BT.bdSubject                                                                                    as bdSubject
             , UT.usrNickName                                                                                  as usrNickName
             , RT.regionName                                                                                   as regionName
             , (select count(*)
                from BdSympathyTB BSPT
                where BT.idx = BSPT.boardIdx
                  and NOT BSPT.status = 'N')                                                                   as bdSympathyCount
             , case
                   when (select count(*) from CommentTB CT where BT.idx = CT.boardIdx) > 0
                       then (select count(*) from CommentTB CT where BT.idx = CT.boardIdx)
                   else 0
            end                                                                                                   commentCount
             , BT.bdContents                                                                                   as bdContents
             , case
                   when TIMESTAMPDIFF(second, BT.createAt, current_timestamp()) < 60
                       then concat(TIMESTAMPDIFF(second, BT.createAt, current_timestamp()), '초 전')
                   when TIMESTAMPDIFF(minute, BT.createAt, current_timestamp()) < 60
                       then concat(TIMESTAMPDIFF(minute, BT.createAt, current_timestamp()), '분 전')
                   when TIMESTAMPDIFF(hour, BT.createAt, current_timestamp()) < 24
                       then concat(TIMESTAMPDIFF(hour, BT.createAt, current_timestamp()), '시간 전')
                   when TIMESTAMPDIFF(day, BT.createAt, current_timestamp()) < 7
                       then concat(TIMESTAMPDIFF(day, BT.createAt, current_timestamp()), '일 전')
                   when TIMESTAMPDIFF(week, BT.createAt, current_timestamp()) < 4
                       then concat(TIMESTAMPDIFF(week, BT.createAt, current_timestamp()), '주 전')
                   when TIMESTAMPDIFF(month, BT.createAt, current_timestamp()) < 12
                       then concat(TIMESTAMPDIFF(month, BT.createAt, current_timestamp()), '달 전')
                   else concat(TIMESTAMPDIFF(year, BT.createAt, current_timestamp()), '년 전')
            end                                                                                                as createAt
        from BoardTB BT
                 inner join UserTB UT
                            on BT.usrIdx = UT.idx
                 inner join RegionTB RT
                            on BT.regionIdx = RT.idx
        where BT.status = 'Y'
          AND NOT BT.usrIdx = ?
          AND (6371 * acos(cos(radians((select regionLatitue
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
                                                                    sin(radians(RT.regionLatitue)))) < (select maxRange
                                                                                                        from RegionTB
                                                                                                        where usrIdx = ?
                                                                                                          and status = 'Y'
                                                                                                          and regionName = ?)
        order by BT.createAt DESC;
    `;

    const selectBoardsResult = await connection.query(
        selectBoardsQuery,
        [usrIdx, usrIdx, regionName, usrIdx, regionName, usrIdx, regionName, usrIdx, regionName]
    );

    return selectBoardsResult[0];
}

// 게시글 상세 조회
async function selectDetailBoard(connection, boardIdx) {
    const selectDetailBoardQuery = `
        select BT.bdSubject                                                          as bdSubject
             , UT.imgUrl                                                             as userProfileImage
             , UT.usrNickName                                                        as usrNickName
             , RT.regionName                                                         as regionName
             , concat('인증 ', RT.authCount, '회')                                      as authCount
             , case
                   when TIMESTAMPDIFF(second, BT.createAt, current_timestamp()) < 60
                       then concat(TIMESTAMPDIFF(second, BT.createAt, current_timestamp()), '초 전')
                   when TIMESTAMPDIFF(minute, BT.createAt, current_timestamp()) < 60
                       then concat(TIMESTAMPDIFF(minute, BT.createAt, current_timestamp()), '분 전')
                   when TIMESTAMPDIFF(hour, BT.createAt, current_timestamp()) < 24
                       then concat(TIMESTAMPDIFF(hour, BT.createAt, current_timestamp()), '시간 전')
                   when TIMESTAMPDIFF(day, BT.createAt, current_timestamp()) < 7
                       then concat(TIMESTAMPDIFF(day, BT.createAt, current_timestamp()), '일 전')
                   when TIMESTAMPDIFF(week, BT.createAt, current_timestamp()) < 4
                       then concat(TIMESTAMPDIFF(week, BT.createAt, current_timestamp()), '주 전')
                   when TIMESTAMPDIFF(month, BT.createAt, current_timestamp()) < 12
                       then concat(TIMESTAMPDIFF(month, BT.createAt, current_timestamp()), '달 전')
                   else concat(TIMESTAMPDIFF(year, BT.createAt, current_timestamp()), '년 전')
            end                                                                      as createAt
             , BT.bdContents                                                         as bdContents
             , (select count(*) from CommentTB CT where BT.idx = CT.boardIdx)        as CommentCount
             , (select count(*) from BdSympathyTB BSPT where BT.idx = BSPT.boardIdx and NOT BSPT.status = 'N') as BdSympathyCount
        from BoardTB BT
                 inner join UserTB UT
                            on BT.usrIdx = UT.idx
                 inner join RegionTB RT
                            on BT.regionIdx = RT.idx
        where BT.idx = ?
        and BT.status = 'Y'
        order by BT.createAt DESC;
    `;

    const selectDetailBoardResult = await connection.query(
        selectDetailBoardQuery,
        boardIdx
    );

    return selectDetailBoardResult[0];
}

async function selectBoardImages(connection, boardIdx) {
    const selectBoardImagesQuery = `
            select BIT.bdImgUrl, BIT.boardIdx, BIT.idx
                from BoardImgTB BIT
                         inner join BoardTB BT on BIT.boardIdx = BT.idx
                where BT.idx = ?;
    `;

    const selectBoardImagesResult = await connection.query(
        selectBoardImagesQuery,
        boardIdx
    );

    return selectBoardImagesResult[0];
}

async function selectBoardEmoji(connection, boardIdx) {
    const selectBoardEmojiQuery = `
        SELECT BST.status, BT.idx as boardIdx, BST.usrIdx as usrIdx
        FROM BdSympathyTB BST
                 inner join BoardTB BT on BST.boardIdx = BT.idx
        WHERE BT.idx = ? and NOT BST.status = 'N'
        GROUP BY status;
    `;

    const selectBoardEmojiResult = await connection.query(
        selectBoardEmojiQuery,
        boardIdx
    );

    return selectBoardEmojiResult[0];
}

async function selectBoardComments(connection, boardIdx) {
    const selectBoardCommentQuery = `
        select UT.usrNickName                                                          as usrNickName,
               UT.imgUrl                                                               as userProfile,
               case
                   when BT.usrIdx = UT.idx
                       then '작성자'
                   else ''
                   end                                                                 as writer,
               RT.regionName                                                           as regionName,
               case
                   when TIMESTAMPDIFF(second, CT.createAt, current_timestamp()) < 60
                       then concat(TIMESTAMPDIFF(second, CT.createAt, current_timestamp()), '초 전')
                   when TIMESTAMPDIFF(minute, CT.createAt, current_timestamp()) < 60
                       then concat(TIMESTAMPDIFF(minute, CT.createAt, current_timestamp()), '분 전')
                   when TIMESTAMPDIFF(hour, CT.createAt, current_timestamp()) < 24
                       then concat(TIMESTAMPDIFF(hour, CT.createAt, current_timestamp()), '시간 전')
                   when TIMESTAMPDIFF(day, CT.createAt, current_timestamp()) < 7
                       then concat(TIMESTAMPDIFF(day, CT.createAt, current_timestamp()), '일 전')
                   when TIMESTAMPDIFF(week, CT.createAt, current_timestamp()) < 4
                       then concat(TIMESTAMPDIFF(week, CT.createAt, current_timestamp()), '주 전')
                   when TIMESTAMPDIFF(month, CT.createAt, current_timestamp()) < 12
                       then concat(TIMESTAMPDIFF(month, CT.createAt, current_timestamp()), '달 전')
                   else concat(TIMESTAMPDIFF(year, CT.createAt, current_timestamp()), '년 전')
                   end                                                                 as createAt,
               CT.contents                                                             as contents,
               (select count(*) from CommentSympathyTB CSPT where CT.idx = CSPT.cmIdx) as sympathyCount,
               CT.idx                                                                  as cmIdx
        from CommentTB CT
                 inner join UserTB UT on CT.usrIdx = UT.idx
                 inner join RegionTB RT on CT.usrIdx = RT.usrIdx and RT.leadStatus = 'Y'
                 inner join BoardTB BT on CT.boardIdx = BT.idx
        where CT.status = 'Y'
          and BT.idx = ?
        order by CT.commentGroup , CT.cmlayer, CT.createAt;
    `;

    const selectBoardCommentResult = await connection.query(
        selectBoardCommentQuery,
        boardIdx
    );

    return selectBoardCommentResult[0];
}

async function selectCommentEmojis(connection, cmIdx) {
    const selectCommentEmojiQuery = `
    select CSPT.status, CT.idx as cmIdx, CSPT.usrIdx  as usrIdx
        from CommentSympathyTB CSPT
                 inner join CommentTB CT on CSPT.cmIdx = CT.idx
        where CT.idx = ? and NOT CSPT.status = 'N'
        group by CSPT.status;
    `;

    const selectCommentEmojiResult = await connection.query(
        selectCommentEmojiQuery,
        cmIdx
    );

    return selectCommentEmojiResult[0];
}

async function updateBoardEmoji(connection, boardIdx, usrIdx, emojiStatus) {
    const updateBoardEmojiQuery = `
        UPDATE BdSympathyTB
            SET status = ?
            WHERE usrIdx = ?
              AND boardIdx = ?;
    `;

    const updateBoardEmojiResult = await connection.query(
        updateBoardEmojiQuery,
        [emojiStatus, usrIdx, boardIdx]
    );

    return updateBoardEmojiResult;
}

async function updateCommentEmoji(connection, emojiStatus, cmIdx, usrIdx) {
    const updateCommentEmojiQuery = `
        UPDATE CommentSympathyTB
            SET status = ?
            WHERE cmIdx = ?
              AND usrIdx = ?;
    `;

    const updateCommentEmojiResult = await connection.query(
        updateCommentEmojiQuery,
        [emojiStatus, cmIdx, usrIdx]
    );

    return updateCommentEmojiResult;
}

async function insertBoard(connection, usrIdx, subject, contents) {
      const insertBoardQuery = `
            INSERT INTO BoardTB
                    ( status
                    , bdSubject
                    , usrIdx
                    , bdContents
                    , regionIdx)
            VALUES ( 'Y'
                   , ?
                   , ?
                   , ?
                   , (select idx from RegionTB where usrIdx = ? and status = 'Y' and leadStatus = 'Y'));
      `;

      const insertBoardResult = await connection.query(
          insertBoardQuery,
          [subject, usrIdx, contents, usrIdx]
      );

      return insertBoardResult;
}

async function insertBoardImage(connection, boardIdx, imgUrl) {
    const insertBoardImageQuery = `
        INSERT INTO BoardImgTB(boardIdx, bdImgUrl)
        VALUES (?, ?);
    `;

    const insertBoardImageResult = await connection.query(
        insertBoardImageQuery,
        [boardIdx, imgUrl, imgSeq]
    );

    return insertBoardImageResult;
}

async function insertBoardEmoji(connection, boardIdx, usrIdx, emojiStatus) {
    const insertBoardEmojiQuery = `
        INSERT INTO BdSympathyTB(status, usrIdx, boardIdx)
            VALUES (?, ?, ?);
    `;

    const insertBoardEmojiResult = await connection.query(
        insertBoardEmojiQuery,
        [emojiStatus, usrIdx, boardIdx]
    );

    return insertBoardEmojiResult;
}

async function insertCommentEmoji(connection, emojiStatus, cmIdx, usrIdx) {
    const insertCommentEmojiQuery = `   
        INSERT INTO CommentSympathyTB(status, cmIdx, usrIdx)
        VALUES (?, ?, ?);
    `;

    const insertCommentEmojiResult = await connection.query(
        insertCommentEmojiQuery,
        [emojiStatus, cmIdx, usrIdx]
    );

    return insertCommentEmojiResult;
}

async function insertBoardComment(connection, insertBoardCommentInfoParams) {
    const insertBoardCommentQuery = `
        INSERT INTO CommentTB
        (status, contents, cmlayer, boardIdx, usrIdx, commentGroup)
        VALUES 
        ('Y', ?, 0, ?, ?, ?);
    `;

    const insertBoardCommentResult = await connection.query(
        insertBoardCommentQuery,
        insertBoardCommentInfoParams
    );

    return insertBoardCommentResult;
}

async function insertBoardSubComment(connection, insertBoardSubCommentInfoParams) {
    const insertBoardSubCommentQuery = `
        INSERT INTO CommentTB
        (status, contents, cmlayer, boardIdx, usrIdx, commentGroup)
        VALUES
        ('Y', ?, 1, ?, ?, ?);
    `;

    const insertBoardSubCommentResult = await connection.query(
        insertBoardSubCommentQuery,
        insertBoardSubCommentInfoParams
    );

    return insertBoardSubCommentResult;
}

async function deleteBoardImage(connection, boardImgIdx) {
    const deleteBoardImageQuery = `
        DELETE
        FROM BoardImgTB
        WHERE idx = ?;
    `;

    const deleteBoardImageResult = await connection.query(
        deleteBoardImageQuery,
        boardImgIdx
    );

    return deleteBoardImageResult;
}

async function deleteBoard(connection, boardIdx, usrIdx){
    const deleteBoardQuery = `
        UPDATE BoardTB
        SET status = 'N'
        WHERE idx = ?
          AND usrIdx = ?;
    `;

    const deleteBoardResult = await connection.query(
        deleteBoardQuery,
        [boardIdx, usrIdx]
    );

    return deleteBoardResult;
}

async function deleteBoardImages(connection, boardIdx) {
    const deleteBoardImagesQuery = `
        DELETE
        FROM BoardImgTB
        WHERE boardIdx = ?;
    `;

    const deleteBoardImagesResult = await connection.query(
        deleteBoardImagesQuery,
        boardIdx
    );

    return deleteBoardImagesResult;
}

async function deleteBoardComments(connection, boardIdx) {
    const deleteBoardCommentsQuery = `
        UPDATE CommentTB
            SET status = 'N'
            WHERE boardIdx = ?;
    `;

    const deleteBoardCommentsResult = await connection.query(
        deleteBoardCommentsQuery,
        boardIdx
    );

    return deleteBoardCommentsResult;
}

async function deleteBoardEmoji(connection, boardIdx) {
    const deleteBoardEmojiQuery = `
        UPDATE BdSympathyTB
            SET status = 'N'
            WHERE boardIdx = ?;
    `;

    const deleteBoardEmojiResult = await connection.query(
        deleteBoardEmojiQuery,
        boardIdx
    );

    return deleteBoardEmojiResult;
}

async function deleteCommentEmoji(connection, boardIdx) {
    const deleteCommentEmojiQuery = `
        UPDATE CommentSympathyTB
            SET status = 'N'
            WHERE cmIdx = (SELECT CT.idx
                           FROM BoardTB BT
                                    INNER JOIN CommentTB CT on BT.idx = CT.boardIdx
                                    INNER JOIN CommentSympathyTB CST on CT.idx = CST.cmIdx
                           WHERE BT.idx = ?
                           GROUP BY CT.idx);
    `;

    const deleteCommentEmojiResult = await connection.query(
        deleteCommentEmojiQuery,
        boardIdx
    );

    return deleteCommentEmojiResult;
}

async function deleteBoardComment(connection, cmIdx) {
    const deleteBoardCommentQuery = `
        UPDATE CommentTB
        SET status = 'N'
        WHERE idx = ?;
    `;

    const deleteBoardCommentResult = connection.query(
        deleteBoardCommentQuery,
        cmIdx
    );

    return deleteBoardCommentResult;
}

async function checkBoardImage(connection, boardImgIdx) {
    const checkBoardImageQuery = `
        select bdImgUrl, boardIdx, idx
            from BoardImgTB
            where idx = ?;
    `;

    const selectBoardImageResult = await connection.query(
        checkBoardImageQuery,
        boardImgIdx
    );

    return selectBoardImageResult[0];
}

async function checkBoardEmoji(connection, boardIdx, usrIdx) {
    const checkBoardEmojiQuery = `
        select status, usrIdx, boardIdx
            from BdSympathyTB
            where usrIdx = ?
              and boardIdx = ?;
    `;

    const selectBoardEmojiResult = await connection.query(
        checkBoardEmojiQuery,
        [usrIdx, boardIdx]
    );

    return selectBoardEmojiResult[0];
}

async function checkCommentEmoji(connection, cmIdx, usrIdx) {
    const checkCommentEmojiQuery = `
        SELECT CT.contents, CST.status, CST.cmIdx, CST.usrIdx
            FROM CommentSympathyTB CST
            INNER JOIN CommentTB CT on CST.cmIdx = CT.idx
            WHERE CST.cmIdx = ?
              AND CST.usrIdx = ?;
    `;

    const selectCommentEmojiResult = await connection.query(
        checkCommentEmojiQuery,
        [cmIdx, usrIdx]
    );

    return selectCommentEmojiResult[0];
}

async function checkCommentEmojis(connection, boardIdx) {
    const checkCommentEmojisQuery = `
        SELECT status, cmIdx, usrIdx
        FROM CommentSympathyTB
        WHERE cmIdx = (SELECT CT.idx
                       FROM BoardTB BT
                                INNER JOIN CommentTB CT on BT.idx = CT.boardIdx
                                INNER JOIN CommentSympathyTB CST on CT.idx = CST.cmIdx
                       WHERE BT.idx = ?
                       GROUP BY CT.idx);
    `;

    const checkCommentEmojisResult = await connection.query(
        checkCommentEmojisQuery,
        boardIdx
    );

    return checkCommentEmojisResult[0];
}

async function checkBoard(connection, boardIdx) {
    const checkBoardQuery = `
        SELECT usrIdx, bdSubject, bdContents
        FROM BoardTB
        WHERE idx = ?;
    `;

    const checkBoardResult = await connection.query(
        checkBoardQuery,
        boardIdx
    );

    return checkBoardResult[0];
}

async function checkBoardComment(connection, boardIdx) {
    const checkBoardCommentQuery = `
        SELECT contents, status
            FROM CommentTB
            WHERE boardIdx = ?;
    `;

    const checkBoardCommentResult = await connection.query(
        checkBoardCommentQuery,
        boardIdx
    );

    return checkBoardCommentResult[0];
}

async function checkBoardEmojis(connection, boardIdx) {
    const checkBoardEmojisQuery = `
        SELECT status, boardIdx
            FROM BdSympathyTB
            WHERE boardIdx = ?;
    `;

    const checkBoardEmojisResult = await connection.query(
        checkBoardEmojisQuery,
        boardIdx
    );

    return checkBoardEmojisResult[0];
}

async function checkComment(connection, boardIdx) {
    const checkCommentQuery = `
        SELECT contents, cmlayer, usrIdx, commentGroup
        FROM CommentTB
        WHERE cmlayer = 0
          AND boardIdx = ?;
    `;

    const checkCommentResult = await connection.query(
        checkCommentQuery,
        boardIdx
    );

    return checkCommentResult[0];
}

async function checkCommentIdx(connection, cmIdx) {
    const checkCommentIdxQuery = `
        SELECT status, contents, cmlayer, boardIdx, usrIdx, commentGroup
        FROM CommentTB
        WHERE idx = ?;
    `;

    const checkCommentIdxResult = await connection.query(
        checkCommentIdxQuery,
        cmIdx
    );

    return checkCommentIdxResult[0];
}

module.exports = {
    selectTopics,
    selectBoards,
    selectDetailBoard,
    selectBoardImages,
    selectBoardEmoji,
    selectBoardComments,
    selectCommentEmojis,
    updateBoardEmoji,
    updateCommentEmoji,
    insertBoard,
    insertBoardImage,
    insertBoardEmoji,
    insertCommentEmoji,
    insertBoardComment,
    insertBoardSubComment,
    deleteBoardImage,
    deleteBoard,
    deleteBoardImages,
    deleteBoardComments,
    deleteBoardEmoji,
    deleteCommentEmoji,
    deleteBoardComment,
    checkBoardImage,
    checkBoardEmoji,
    checkCommentEmoji,
    checkCommentEmojis,
    checkBoard,
    checkBoardComment,
    checkBoardEmojis,
    checkComment,
    checkCommentIdx
}