package com.intelligent.missingperson.entity;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "DETAIL_AREA_ACCOUNT")
@IdClass(DetailAreaAccountId.class)
public class DetailAreaAccount {
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Area", nullable = false)
    private Area area;
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Account", nullable = false)
    private Account account;
    
    // Constructors
    public DetailAreaAccount() {}
    
    public DetailAreaAccount(Area area, Account account) {
        this.area = area;
        this.account = account;
    }
    
    // Getters and Setters
    public Area getArea() {
        return area;
    }
    
    public void setArea(Area area) {
        this.area = area;
    }
    
    public Account getAccount() {
        return account;
    }
    
    public void setAccount(Account account) {
        this.account = account;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DetailAreaAccount that = (DetailAreaAccount) o;
        return Objects.equals(area, that.area) && Objects.equals(account, that.account);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(area, account);
    }
}
