// 상품 조회
async function selectProduct(connection, usrIdx, regionName) {
    const selectProductQuery = `
        select PT.idx                                                                        as pdIdx
             , (select imgUrl
                from PdImageTB
                where pdIdx = PT.idx
                group by pdIdx)                                                              as imgUrl
             , PT.pdTitle                                                                    as pdTitle
             , RT.regionName                                                                 as regionName
             , case
                   when PT.priceProposal = 'N'
                       then '끌올'
                   else ''
            end                                                                              as priceProposal
             , case
                   when TIMESTAMPDIFF(second, PT.createAt, current_timestamp()) < 60
                       then concat(TIMESTAMPDIFF(second, PT.createAt, current_timestamp()), '초 전')
                   when TIMESTAMPDIFF(minute, PT.createAt, current_timestamp()) < 60
                       then concat(TIMESTAMPDIFF(minute, PT.createAt, current_timestamp()), '분 전')
                   when TIMESTAMPDIFF(hour, PT.createAt, current_timestamp()) < 24
                       then concat(TIMESTAMPDIFF(hour, PT.createAt, current_timestamp()), '시간 전')
                   when TIMESTAMPDIFF(day, PT.createAt, current_timestamp()) < 7
                       then concat(TIMESTAMPDIFF(day, PT.createAt, current_timestamp()), '일 전')
                   when TIMESTAMPDIFF(week, PT.createAt, current_timestamp()) < 4
                       then concat(TIMESTAMPDIFF(week, PT.createAt, current_timestamp()), '주 전')
                   when TIMESTAMPDIFF(month, PT.createAt, current_timestamp()) < 12
                       then concat(TIMESTAMPDIFF(month, PT.createAt, current_timestamp()), '달 전')
                   else concat(TIMESTAMPDIFF(year, PT.createAt, current_timestamp()), '년 전')
            end                                                                              as createAt
             , case
                   when PT.status = 'Y'
                       then ''
                   when PT.status = 'R'
                       then '예약중'
                   when PT.status = 'C'
                       then '거래완료'
            end                                                                              as status
             , PT.price                                                                      as price
             , (select count(*) from ChatRoomTB CRT where PT.idx = CRT.pdIdx group by pdIdx) as chatRoomCount
             , (select count(*) from AttentionTB AT where PT.idx = AT.pdIdx group by pdIdx)  as attentionCount
        from ProductTB PT
            inner join RegionTB RT on PT.regionIdx = RT.idx
            inner join UserTB UT on RT.usrIdx = UT.idx
        where PT.sellUsrIdx != ? -- 직접 등록한 상품 제외
          and PT.hideStatus = 'N'
          and not PT.status = 'N'
          and (6371 * acos(cos(radians((select regionLatitue
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
        order by PT.createAt DESC;
    `;


    const selectProduct = await connection.query(
        selectProductQuery,
        [usrIdx, usrIdx, regionName, usrIdx, regionName, usrIdx, regionName, usrIdx, regionName]
    );

    return selectProduct[0];
}

async function selectDetailProduct(connection, usrIdx, pdIdx){
    const selectDetailProductQuery = `
                select UT.usrNickName                                                                as usrNickName
                     , UT.imgUrl                                                                     as userProfile
                     , RT.regionName                                                                 as regionName
                     , concat(UT.mannerTemp, 'C')                                                    as mannerTemp
                     , case
                           when PT.status = 'Y'
                               then ''
                           when PT.status = 'R'
                               then '예약중'
                           when PT.status = 'C'
                               then '거래완료'
                    end                                                                              as productSellStatus
                     , PT.pdTitle                                                                    as pdTitle
                     , PT.pdContents                                                                 as pdContents
                     , case
                           when TIMESTAMPDIFF(second, PT.createAt, current_timestamp()) < 60
                               then concat(TIMESTAMPDIFF(second, PT.createAt, current_timestamp()), '초 전')
                           when TIMESTAMPDIFF(minute, PT.createAt, current_timestamp()) < 60
                               then concat(TIMESTAMPDIFF(minute, PT.createAt, current_timestamp()), '분 전')
                           when TIMESTAMPDIFF(hour, PT.createAt, current_timestamp()) < 24
                               then concat(TIMESTAMPDIFF(hour, PT.createAt, current_timestamp()), '시간 전')
                           when TIMESTAMPDIFF(day, PT.createAt, current_timestamp()) < 7
                               then concat(TIMESTAMPDIFF(day, PT.createAt, current_timestamp()), '일 전')
                           when TIMESTAMPDIFF(week, PT.createAt, current_timestamp()) < 4
                               then concat(TIMESTAMPDIFF(week, PT.createAt, current_timestamp()), '주 전')
                           when TIMESTAMPDIFF(month, PT.createAt, current_timestamp()) < 12
                               then concat(TIMESTAMPDIFF(month, PT.createAt, current_timestamp()), '달 전')
                           else concat(TIMESTAMPDIFF(year, PT.createAt, current_timestamp()), '년 전')
                    end                                                                              as createAt
                     , PT.pdCategory                                                                 as productCategory
                     , (select count(*) from ChatRoomTB CRT where PT.idx = CRT.pdIdx group by pdIdx) as chatRoomCount
                     , (select count(*) from AttentionTB AT where PT.idx = AT.pdIdx group by pdIdx)  as attentionCount
                        , (select count(*) as 조회수 from SelectProductTB SPT where PT.idx = SPT.pdIdx)    as selectProductCount
                                                                               , case
                    when (select count(*) from AttentionTB AT where PT.idx = AT.pdIdx and AT.usrIdx = ?) = 1
                    then 'Y' -- AttentionTB에 접속한 유저가 관심을 눌렀을 경우
                    else 'N'
                end                                                                              as productAttention
             , concat(PT.price, '원')                                                         as price
             , case
                   when PT.priceProposal = 'N'
                       then '가격제안불가'
                   else '가격 제안하기'
                end                                                                              as priceProposal
        from ProductTB PT
                 inner join RegionTB RT on PT.regionIdx = RT.idx
                 inner join UserTB UT on PT.sellUsrIdx = UT.idx
        where PT.hideStatus = 'N'
          and not PT.status = 'N'
          and PT.idx = ?;
    `;

    const selectDetailProductRow = await connection.query(
        selectDetailProductQuery,
        [usrIdx, pdIdx]
    );

    return selectDetailProductRow[0];
}

async function selectProductImage(connection, pdIdx) {

    const selectProductImageQuery = `
        select idx ,imgUrl
            from PdImageTB
            where pdIdx = ?;
    `;

    const selectProductImageRow = await connection.query(
        selectProductImageQuery,
        [pdIdx]
    );

    return selectProductImageRow[0];
}

async function updateProductStatus(connection, pdIdx, status) {
    const updateProductStatusQuery = `
        UPDATE ProductTB
            SET status = ?
            WHERE idx = ?
    `;

    const updateProductStatusRows = await connection.query(
        updateProductStatusQuery,
        [status, pdIdx]
    );

    return updateProductStatusRows;
}

async function updateHideProduct(connection, pdIdx, hideStatus) {
    const updateHideProductQuery = `
    UPDATE ProductTB
        SET hideStatus = ?
        WHERE idx = ?;  
    `;

    const updateHideProductRows = await connection.query(
        updateHideProductQuery,
        [hideStatus, pdIdx]
    );

    return updateHideProductRows;
}

async function updateSelectProduct(connection, usrIdx, pdIdx) {
    const updateSelectProductQuery = `
        UPDATE  SelectProductTB
            SET status = 'Y'
            WHERE usrIdx = ? AND pdIdx = ?;
    `;

    const updateSelectProductRows = await connection.query(
        updateSelectProductQuery,
        [usrIdx, pdIdx]
    );

    return updateSelectProductRows;
}

async function insertSelectProduct(connection, usrIdx, pdIdx) {
    const insertSelectProductQuery = `
        INSERT INTO SelectProductTB(status, pdIdx, usrIdx)
            VALUES ('Y', ?, ?);
    `;

    const insertSelectProductRows = await connection.query(
        insertSelectProductQuery,
        [pdIdx, usrIdx]
    );

    return insertSelectProductRows;
}

async function insertProduct(connection, insertProductInfoParams) {
    const insertProductQuery = `
        INSERT INTO ProductTB
        ( createAt
        , updateAt
        , status
        , pdTitle
        , pdContents
        , regionIdx
        , sellUsrIdx
        , priceProposal
        , pdCategory
        , price
        , hideStatus)
        VALUES ( DEFAULT
               , DEFAULT
               , 'Y'
               , ?
               , ?
               , (select idx from RegionTB where usrIdx = ? and status = 'Y' and leadStatus = 'Y')
               , ?
               , ?
               , ?
               , ?
               , DEFAULT);
    `;

    const insertProductRow = await connection.query(
        insertProductQuery,
        insertProductInfoParams
    );

    return insertProductRow;
}

async function insertProductImage(connection, createProductImageInfoParams) {
    const insertProductImageQuery = `
        INSERT INTO PdImageTB (imgUrl, pdIdx)
            VALUES (?, ?);
    `;

    const insertProductImageRow = await connection.query(
        insertProductImageQuery,
        createProductImageInfoParams
    );

    return insertProductImageRow;
}

async function selectCheckProduct(connection, pdIdx) {
    const selectCheckProductQuery = `
        select idx, status, pdTitle, pdContents, regionIdx, sellUsrIdx, hideStatus
        from ProductTB
        where idx = ?;
    `;

    const selectCheckProductRow = await connection.query(
        selectCheckProductQuery,
        [pdIdx]
    );

    return selectCheckProductRow[0];
}

async function checkSelectProduct(connection, usrIdx, pdIdx, status) {
    const checkSelectProductQuery = `
        select status, usrIdx
            from SelectProductTB
            where usrIdx = ?
              and pdIdx = ?
              and status = ?;
    `;

    const checkSelectProductRows = await connection.query(
        checkSelectProductQuery,
        [usrIdx, pdIdx, status]
    );

    return checkSelectProductRows[0];
};

async function checkProductImage(connection, imgIdx) {
    const checkProductImageQuery = `
        select imgUrl, pdIdx, imgSeq, idx
        from PdImageTB
        where idx = ?
    `;

    const checkProductImageRows = await connection.query(
        checkProductImageQuery,
        imgIdx
    );

    return checkProductImageRows[0];
};

async function deleteSelectProduct(connection, pdIdx, usrIdx) {
    const deleteSelectProductQuery = `
        UPDATE  SelectProductTB
            SET status = 'N'
            WHERE usrIdx = ? AND pdIdx = ?;
    `;

    const deleteSelectProductResult = await connection.query(
        deleteSelectProductQuery,
        [usrIdx, pdIdx]
    );

    return deleteSelectProductResult;
};

async function deleteProductImage(connection, imgIdx) {
    const deleteProductImageQuery = `
        DELETE
        FROM PdImageTB
        WHERE idx = ?;
    `;

    const deleteProductImageRows = await connection.query(
        deleteProductImageQuery,
        imgIdx
    );

    return deleteProductImageRows;
};


async function deleteProduct(connection, pdIdx) {
    const deleteProductQuery = `
        UPDATE ProductTB
            SET status = 'N'
            WHERE idx = ?;
    `;

    const deleteProductResult = await connection.query(
        deleteProductQuery,
        pdIdx
    );

    return deleteProductResult;
};

async function deleteProductImages(connection, pdIdx) {
    const deleteProductQuery = `
        DELETE
        FROM PdImageTB
        WHERE pdIdx = ?;
    `;

    const deleteProductResult = await connection.query(
        deleteProductQuery,
        pdIdx
    );

    return deleteProductResult;
};

async function deleteSelectProducts(connection, pdIdx) {
    const deleteProductQuery = `
        UPDATE SelectProductTB
            SET status = 'N'
            WHERE pdIdx = ?;
    `;

    const deleteProductResult = await connection.query(
        deleteProductQuery,
        pdIdx
    );

    return deleteProductResult;
};

async function selectCheckProductImages(connection, pdIdx) {
    const selectCheckProductImagesQuery = `
        SELECT imgUrl, pdIdx, imgSeq
        FROM PdImageTB
        WHERE pdIdx = ?;
    `;

    const [selectCheckProductImagesResult] = await connection.query(
        selectCheckProductImagesQuery,
        pdIdx
    );

    return selectCheckProductImagesResult;
}

async function checkSelectProducts(connection, pdIdx) {
    const checkSelectProductsQuery = `
        SELECT status, pdIdx,usrIdx
        FROM SelectProductTB
        WHERE pdIdx = ?;
    `;

    const [checkSelectProductsResult] = await connection.query(
        checkSelectProductsQuery,
        pdIdx
    );

    return checkSelectProductsResult;
}

async function selectCheckChatRoom(connection, pdIdx, usrIdx) {
    const selectCheckChatRoomQuery = `
        SELECT sellerStatus, buyerStatus, sellerIdx, buyerIdx, pdIdx
        FROM ChatRoomTB
        WHERE pdIdx = ?
          AND buyerIdx = ?;
    `;

    const [selectCheckChatRoomResult] = await connection.query(
        selectCheckChatRoomQuery,
        [pdIdx, usrIdx]
    );

    return selectCheckChatRoomResult;
}

module.exports = {
    selectProduct,
    selectDetailProduct,
    selectProductImage,
    selectCheckProduct,
    checkSelectProduct,
    checkProductImage,
    updateProductStatus,
    updateHideProduct,
    updateSelectProduct,
    insertSelectProduct,
    insertProduct,
    insertProductImage,
    deleteSelectProduct,
    deleteProductImage,
    deleteProduct,
    deleteProductImages,
    deleteSelectProducts,
    selectCheckProductImages,
    checkSelectProducts,
    selectCheckChatRoom
}