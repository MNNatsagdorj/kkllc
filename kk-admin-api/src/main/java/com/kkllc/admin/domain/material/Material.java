package com.kkllc.admin.domain.material;

import lombok.Data;

@Data
public class Material {
    private Long id;
    private String name;
    private String unit;
    private Long defaultPrice;
    private Boolean active;
}
