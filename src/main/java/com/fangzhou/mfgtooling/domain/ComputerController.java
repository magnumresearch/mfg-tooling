package com.fangzhou.mfgtooling.domain;


import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

import com.fangzhou.mfgtooling.domain.enumeration.Connectivity;

/**
 * A ComputerController.
 */
@Entity
@Table(name = "computer_controller")
public class ComputerController implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "operating_system")
    private String operatingSystem;

    @Column(name = "operating_software")
    private String operatingSoftware;

    @Enumerated(EnumType.STRING)
    @Column(name = "network")
    private Connectivity network;

    @ManyToOne
    private ProcessStep processStep;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOperatingSystem() {
        return operatingSystem;
    }

    public void setOperatingSystem(String operatingSystem) {
        this.operatingSystem = operatingSystem;
    }

    public String getOperatingSoftware() {
        return operatingSoftware;
    }

    public void setOperatingSoftware(String operatingSoftware) {
        this.operatingSoftware = operatingSoftware;
    }

    public Connectivity getNetwork() {
        return network;
    }

    public void setNetwork(Connectivity network) {
        this.network = network;
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
        ComputerController computerController = (ComputerController) o;
        if(computerController.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, computerController.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "ComputerController{" +
            "id=" + id +
            ", operatingSystem='" + operatingSystem + "'" +
            ", operatingSoftware='" + operatingSoftware + "'" +
            ", network='" + network + "'" +
            '}';
    }
}
