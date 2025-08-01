package com.sop.financialcontrol.model;

/**
 * Enum representing the possible statuses of an expense.
 */
public enum ExpenseStatus {
    AWAITING_COMMITMENT("Awaiting Commitment"),
    PARTIALLY_COMMITTED("Partially Committed"),
    AWAITING_PAYMENT("Awaiting Payment"),
    PARTIALLY_PAID("Partially Paid"),
    PAID("Paid");

    private final String displayName;

    ExpenseStatus(String displayName) {
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
    public static ExpenseStatus fromDisplayName(String displayName) {
        for (ExpenseStatus status : ExpenseStatus.values()) {
            if (status.getDisplayName().equalsIgnoreCase(displayName)) {
                return status;
            }
        }
        return null;
    }
}