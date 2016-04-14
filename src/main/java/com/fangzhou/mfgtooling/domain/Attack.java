package com.fangzhou.mfgtooling.domain;


import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

import com.fangzhou.mfgtooling.domain.enumeration.AttackType;

/**
 * A Attack.
 */
@Entity
@Table(name = "attack")
public class Attack implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private AttackType type;

    @ManyToOne
    private ProcessStep processStep;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AttackType getType() {
        return type;
    }

    public void setType(AttackType type) {
        this.type = type;
    }

    public ProcessStep getProcessStep() {
        return processStep;
    }

    public void setProcessStep(ProcessStep processStep) {
        this.processStep = processStep;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Attack attack = (Attack) o;
        if(attack.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, attack.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Attack{" +
            "id=" + id +
            ", type='" + type + "'" +
            '}';
    }
}
