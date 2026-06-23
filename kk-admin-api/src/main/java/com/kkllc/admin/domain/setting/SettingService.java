package com.kkllc.admin.domain.setting;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class SettingService {

    private final SettingMapper mapper;

    public SettingService(SettingMapper mapper) {
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Map<String, String> getAll() {
        Map<String, String> out = new LinkedHashMap<>();
        for (Setting s : mapper.findAll()) {
            out.put(s.getKey(), s.getValue());
        }
        return out;
    }

    @Transactional(readOnly = true)
    public String get(String key) {
        return mapper.findValue(key);
    }

    @Transactional(readOnly = true)
    public String get(String key, String defaultValue) {
        String v = mapper.findValue(key);
        return v == null ? defaultValue : v;
    }

    @Transactional(readOnly = true)
    public boolean getBool(String key, boolean defaultValue) {
        String v = mapper.findValue(key);
        return v == null ? defaultValue : Boolean.parseBoolean(v.trim());
    }

    @Transactional
    public void set(String key, String value) {
        mapper.upsert(key, value);
    }

    @Transactional
    public void setAll(Map<String, String> values) {
        values.forEach(mapper::upsert);
    }
}
