package com.intelligent.missingperson.entity;

import java.io.Serializable;
import java.util.Objects;

public class DetailAreaAccountId implements Serializable {
    private Long area;
    private Long account;
    
    public DetailAreaAccountId() {}
    
    public DetailAreaAccountId(Long area, Long account) {
        this.area = area;
        this.account = account;
    }
    
    public Long getArea() {
        return area;
    }
    
    public void setArea(Long area) {
        this.area = area;
    }
    
    public Long getAccount() {
        return account;
    }
    
    public void setAccount(Long account) {
        this.account = account;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DetailAreaAccountId that = (DetailAreaAccountId) o;
        return Objects.equals(area, that.area) && Objects.equals(account, that.account);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(area, account);
    }
}
