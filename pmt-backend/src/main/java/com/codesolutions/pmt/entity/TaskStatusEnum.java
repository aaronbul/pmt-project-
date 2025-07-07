package com.codesolutions.pmt.entity;

public enum TaskStatusEnum {
    TODO("À faire"),
    IN_PROGRESS("En cours"),
    REVIEW("En révision"),
    DONE("Terminé"),
    CANCELLED("Annulé");

    private final String displayName;

    TaskStatusEnum(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 