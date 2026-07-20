package bg.ochsner.site.domain;

/** The "тип запитване" selector on the contact form. */
public enum RequestType {
    /** Интересувам се от термопомпа */
    HEAT_PUMP_INTEREST,
    /** Въпрос от съществуващ клиент */
    EXISTING_CUSTOMER,
    /** Друго */
    OTHER
}
