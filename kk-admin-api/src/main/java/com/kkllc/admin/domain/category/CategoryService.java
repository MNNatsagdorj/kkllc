package com.kkllc.admin.domain.category;

import com.kkllc.admin.common.BizException;
import com.kkllc.admin.common.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryMapper mapper;

    public CategoryService(CategoryMapper mapper) {
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<Category> list() {
        return mapper.findAll();
    }

    @Transactional
    public Long create(CategoryDto.SaveReq req) {
        Category c = new Category();
        c.setName(req.name());
        c.setIconKey(req.iconKey() == null ? "box" : req.iconKey());
        c.setSortOrder(req.sortOrder() == null ? 0 : req.sortOrder());
        c.setActive(req.active() == null ? Boolean.TRUE : req.active());
        mapper.insert(c);
        return c.getId();
    }

    @Transactional
    public void update(Long id, CategoryDto.SaveReq req) {
        Category c = mapper.findById(id);
        if (c == null) throw new BizException(ErrorCode.NOT_FOUND);
        c.setName(req.name());
        if (req.iconKey() != null) c.setIconKey(req.iconKey());
        if (req.sortOrder() != null) c.setSortOrder(req.sortOrder());
        if (req.active() != null) c.setActive(req.active());
        mapper.update(c);
    }

    @Transactional
    public void delete(Long id) {
        if (mapper.countProducts(id) > 0) {
            throw new BizException(ErrorCode.CATEGORY_IN_USE);
        }
        mapper.deleteById(id);
    }
}
