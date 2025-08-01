package com.sop.financialcontrol.model;

/**
 * Enum representing the possible types of expenses.
 */
public enum ExpenseType {
    BUILDING_WORK("Building Work"),
    HIGHWAY_WORK("Highway Work"),
    OTHER("Other");

    private final String displayName;

    ExpenseType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Convert a display name to the corresponding enum value.
     *
     * @param displayName The display name to convert
     * @return The corresponding enum value, or null if not found
     */
    public static ExpenseType fromDisplayName(String displayName) {
        for (ExpenseType type : ExpenseType.values()) {
            if (type.getDisplayName().equalsIgnoreCase(displayName)) {
                return type;
            }
        }
        return null;
    }
}