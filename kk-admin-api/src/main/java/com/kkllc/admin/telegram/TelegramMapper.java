package com.kkllc.admin.telegram;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TelegramMapper {
    TelegramUser findByChatId(@Param("chatId") Long chatId);
    int upsertUser(TelegramUser u);
    int updateState(@Param("chatId") Long chatId,
                    @Param("state") String state,
                    @Param("stateData") String stateData);
    int updatePhone(@Param("chatId") Long chatId, @Param("phone") String phone);

    int insertOutbox(@Param("chatId") Long chatId,
                     @Param("kind") String kind,
                     @Param("payload") String payload,
                     @Param("sentOk") boolean sentOk);
}
