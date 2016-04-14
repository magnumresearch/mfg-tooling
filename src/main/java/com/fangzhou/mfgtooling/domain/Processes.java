package com.fangzhou.mfgtooling.domain;


import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Processes.
 */
@Entity
@Table(name = "processes")
public class Processes implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    private ProcessStep startingStep;

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

    public ProcessStep getStartingStep() {
        return startingStep;
    }

    public void setStartingStep(ProcessStep processStep) {
        this.startingStep = processStep;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Processes processes = (Processes) o;
        if(processes.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, processes.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Processes{" +
            "id=" + id +
            ", name='" + name + "'" +
            '}';
    }
}
