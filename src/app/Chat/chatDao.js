async function selectChatRooms(connection, usrIdx) {
    const selectChatRoomsQuery = `
        select CRT.idx as chatRoomIdx
            ,  case
                   when UT.idx = CRT.sellerIdx
                       then (select UST.imgUrl from UserTB UST where UST.idx = CRT.buyerIdx)
                   else (select UST.imgUrl from UserTB UST where UST.idx = CRT.sellerIdx)
            end                                                                                   as sellerProfileImg
             , case
                   when UT.idx = CRT.sellerIdx
                       then (select UST.usrNickName from UserTB UST where UST.idx = CRT.buyerIdx)
                   else (select UST.usrNickName from UserTB UST where UST.idx = CRT.sellerIdx)
            end                                                                                   as sellerNickName

             , case
                   when UT.idx = CRT.sellerIdx -- 내가 구매자일 수도 판매자일수도 있기에 상대에 대한 정보를 얻기위해 조건문을 넣음
                       then (select RGT.regionName from RegionTB RGT where RGT.usrIdx = CRT.buyerIdx and RGT.leadStatus = 'Y')
                   else (select RGT.regionName from RegionTB RGT where RGT.usrIdx = CRT.sellerIdx and RGT.leadStatus = 'Y')
            end                                                                                   as regionName
             , CCT.contents                                                                       as contents
             , case
                   when TIMESTAMPDIFF(second, CCT.createAt, current_timestamp()) < 60
                       then concat(TIMESTAMPDIFF(second, CCT.createAt, current_timestamp()), '초 전')
                   when TIMESTAMPDIFF(minute, CCT.createAt, current_timestamp()) < 60
                       then concat(TIMESTAMPDIFF(minute, CCT.createAt, current_timestamp()), '분 전')
                   when TIMESTAMPDIFF(hour, CCT.createAt, current_timestamp()) < 24
                       then concat(TIMESTAMPDIFF(hour, CCT.createAt, current_timestamp()), '시간 전')
                   when TIMESTAMPDIFF(day, CCT.createAt, current_timestamp()) < 7
                       then date_format(CCT.createAt, '%m월 %d일')
            end                                                                                   as createAt
             , (select PIT.imgUrl from PdImageTB PIT where PT.idx = PIT.pdIdx group by PIT.pdIdx) as productImg
        from ProductTB PT
                 inner join ChatRoomTB CRT on PT.idx = CRT.pdIdx
                 inner join ChatContentsTB CCT on CRT.idx = CCT.roomIdx
                 inner join UserTB UT on CRT.buyerIdx = UT.idx or CRT.sellerIdx = UT.idx
        where CCT.createAt = (select max(createAt)
                              from ChatContentsTB SCCT
                              where CRT.idx = SCCT.roomIdx
                              group by SCCT.roomIdx) -- 채팅방중 채팅내역이 제일 최신날짜를인 데이터를 가져옴
          and UT.idx = ?
        order by CCT.createAt desc;
    `;

    const selectChatRoomsResult = await connection.query(
        selectChatRoomsQuery,
        usrIdx
    );

    return selectChatRoomsResult[0];
}

async function selectChats(connection, roomIdx) {
    const selectChatsQuery = `
        select CRT.idx                         as chatRoomIdx
             , date_format(CCT.createAt, '%Y년 %m월 %d일') as createAt
             , date_format(CCT.createAt, '%r') as createAt
             , CCT.contents                    as contents
             , CCT.usrIdx
             , CCT.idx                         as chatIdx
        from ChatContentsTB CCT
                 inner join UserTB UT on CCT.usrIdx = UT.idx
                 inner join ChatRoomTB CRT on CCT.roomIdx = CRT.idx
        where CRT.idx = ?
        and CCT.status = 'Y';
    `;

    const selectChatsResult = await connection.query(
        selectChatsQuery,
        roomIdx
    );

    return selectChatsResult[0];
}

async function selectSummaryProducts(connection, roomIdx) {
    const selectSummaryProductsQuery = `
        select PT.idx                                                                             as productIdx
             , (select PIT.imgUrl from PdImageTB PIT where PT.idx = PIT.pdIdx group by PIT.pdIdx) as productImg
             , UT.usrNickName
             , concat(UT.mannerTemp, 'C')                                                         as sellerMannerTemp
             , case
                   when PT.status = 'Y'
                       then ''
                   when PT.status = 'R'
                       then '예약중'
                   when PT.status = 'C'
                       then '거래완료'
            end                                                                                   as productStatus
             , PT.pdTitle
             , PT.price                                                                           as price
        from ProductTB PT
                 inner join UserTB UT on UT.idx = PT.sellUsrIdx
                 inner join ChatRoomTB CRT on PT.idx = CRT.pdIdx
        where CRT.idx = ?;
    `;

    const selectSummaryProductsResult = await connection.query(
        selectSummaryProductsQuery,
        roomIdx
    );

    return selectSummaryProductsResult[0];
}

async function insertChats(connection, roomIdx, usrIdx, contents) {
    const insertChatsQuery = `
        INSERT INTO ChatContentsTB(contents, roomIdx, usrIdx, status)
        VALUES (?, ?, ?, 'Y');
    `;

    const insertChatsResult = await connection.query(
        insertChatsQuery,
        [contents, roomIdx, usrIdx]
    );

    return insertChatsResult;
}

async function insertChatRooms(connection, pdIdx, usrIdx) {
    const insertChatRoomsQuery = `
        INSERT INTO ChatRoomTB(sellerStatus, buyerStatus, sellerIdx, buyerIdx, pdIdx)
        VALUES ('Y', 'Y', (select sellUsrIdx from ProductTB where idx = ?), ?, ?);
    `;

    const insertChatRoomsResult = await connection.query(
        insertChatRoomsQuery,
        [pdIdx, usrIdx, pdIdx]
    );

    return insertChatRoomsResult[0];
}

async function deleteSellerChatRooms(connection, roomIdx, usrIdx){
    const deleteSellerChatRoomsQuery = `
        UPDATE ChatRoomTB
        SET sellerStatus = 'N'
        WHERE idx = ?
          AND sellerIdx = ?;
    `;

    const deleteSellerChatRoomsResult = await connection.query(
        deleteSellerChatRoomsQuery,
        [roomIdx, usrIdx]
    );

    return deleteSellerChatRoomsResult;
}

async function deleteBuyerChatRooms(connection, roomIdx, usrIdx) {
    const deleteBuyerChatRoomsQuery = `
        UPDATE ChatRoomTB
        SET buyerStatus = 'N'
        WHERE idx = ?
          AND buyerIdx = ?;
    `;

    const deleteBuyerChatRoomsResult = await connection.query(
        deleteBuyerChatRoomsQuery,
        [roomIdx, usrIdx]
    );

    return deleteBuyerChatRoomsResult;
}

async function deleteChats(connection, chatIdx) {
    const deleteChatsQuery = `
        UPDATE ChatContentsTB
        SET status = 'N'
        WHERE idx = ?;
    `;

    const deleteChatsResult = await connection.query(
        deleteChatsQuery,
        chatIdx
    );

    return deleteChatsResult;
}

async function checkBuyer(connection, roomIdx, usrIdx) {
    const checkBuyerQuery = `
        select sellerStatus, buyerStatus, sellerIdx, buyerIdx
        from ChatRoomTB
        where idx = ?
          and buyerIdx = ?;
    `;

    const checkBuyerResult = await connection.query(
        checkBuyerQuery,
        [roomIdx, usrIdx]
    );

    return checkBuyerResult[0];
}

async function checkChatRoom(connection, roomIdx) {
    const checkChatRoomQuery = `
        SELECT sellerStatus, buyerStatus, sellerIdx, buyerIdx, pdIdx
        FROM ChatRoomTB
        WHERE idx = ?;
    `;

    const checkChatRoomRows = await connection.query(
        checkChatRoomQuery,
        roomIdx
    );

    return checkChatRoomRows[0];
}

async function checkChatUser(connection, chatIdx, usrIdx) {
    const checkChatUserQuery = `
        SELECT contents, roomIdx, contentCheckStatus, usrIdx, status
        FROM ChatContentsTB
        WHERE usrIdx = ?
          AND idx = ?;
    `;

    const checkChatUserResult = await connection.query(
        checkChatUserQuery,
        [usrIdx, chatIdx]
    );

    return checkChatUserResult[0];
}

module.exports = {
    selectChatRooms,
    selectChats,
    selectSummaryProducts,
    insertChats,
    insertChatRooms,
    deleteSellerChatRooms,
    deleteBuyerChatRooms,
    deleteChats,
    checkBuyer,
    checkChatRoom,
    checkChatUser
}