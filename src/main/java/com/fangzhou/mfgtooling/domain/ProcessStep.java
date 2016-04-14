package com.fangzhou.mfgtooling.domain;


import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

import com.fangzhou.mfgtooling.domain.enumeration.ProcessType;

/**
 * A ProcessStep.
 */
@Entity
@Table(name = "process_step")
public class ProcessStep implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ProcessType type;

    @Column(name = "name")
    private String name;

    @OneToOne
    @JoinColumn(unique = true)
    private ProcessStep following;

    @ManyToOne
    private PartFacet partFacet;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProcessType getType() {
        return type;
    }

    public void setType(ProcessType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ProcessStep getFollowing() {
        return following;
    }

    public void setFollowing(ProcessStep processStep) {
        this.following = processStep;
    }

    public PartFacet getPartFacet() {
        return partFacet;
    }

    public void setPartFacet(PartFacet partFacet) {
        this.partFacet = partFacet;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ProcessStep processStep = (ProcessStep) o;
        if(processStep.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, processStep.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "ProcessStep{" +
            "id=" + id +
            ", type='" + type + "'" +
            ", name='" + name + "'" +
            '}';
    }
}
