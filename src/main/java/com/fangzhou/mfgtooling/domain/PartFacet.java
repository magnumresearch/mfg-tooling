package com.fangzhou.mfgtooling.domain;


import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

import com.fangzhou.mfgtooling.domain.enumeration.Facets;

/**
 * A PartFacet.
 */
@Entity
@Table(name = "part_facet")
public class PartFacet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "name")
    private Facets name;

    @ManyToOne
    private Part part;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Facets getName() {
        return name;
    }

    public void setName(Facets name) {
        this.name = name;
    }

    public Part getPart() {
        return part;
    }

    public void setPart(Part part) {
        this.part = part;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        PartFacet partFacet = (PartFacet) o;
        if(partFacet.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, partFacet.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "PartFacet{" +
            "id=" + id +
            ", name='" + name + "'" +
            '}';
    }
}
