package com.kkllc.admin.domain.quote;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QuoteMapper {
    List<Quote> findPage(@Param("status") String status,
                         @Param("offset") int offset, @Param("size") int size);
    long countPage(@Param("status") String status);
    long countUnread();
    Quote findById(@Param("id") Long id);
    int insert(Quote q);
    int markRead(@Param("id") Long id);
    int answer(@Param("id") Long id, @Param("estimate") Long estimate);
    int updateStatus(@Param("id") Long id, @Param("status") String status);
}
