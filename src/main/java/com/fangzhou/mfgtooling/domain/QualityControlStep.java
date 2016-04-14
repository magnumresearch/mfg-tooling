package com.fangzhou.mfgtooling.domain;


import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

import com.fangzhou.mfgtooling.domain.enumeration.QualityControlType;

/**
 * A QualityControlStep.
 */
@Entity
@Table(name = "quality_control_step")
public class QualityControlStep implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private QualityControlType type;

    @Column(name = "feature")
    private String feature;

    @Column(name = "custom_constraint")
    private String customConstraint;

    @ManyToOne
    private ProcessStep processStep;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public QualityControlType getType() {
        return type;
    }

    public void setType(QualityControlType type) {
        this.type = type;
    }

    public String getFeature() {
        return feature;
    }

    public void setFeature(String feature) {
        this.feature = feature;
    }

    public String getCustomConstraint() {
        return customConstraint;
    }

    public void setCustomConstraint(String customConstraint) {
        this.customConstraint = customConstraint;
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
        QualityControlStep qualityControlStep = (QualityControlStep) o;
        if(qualityControlStep.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, qualityControlStep.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "QualityControlStep{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", type='" + type + "'" +
            ", feature='" + feature + "'" +
            ", customConstraint='" + customConstraint + "'" +
            '}';
    }
}
