package ies.project.busrush.dto.cache;

import java.io.Serializable;

public class StopBasicDtoc implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;

    private String designation;

    public StopBasicDtoc(String id, String designation) {
        this.id = id;
        this.designation = designation;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}
