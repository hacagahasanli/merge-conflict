// ============================================================================
// OWNER: SET YOUR PRICES HERE. This is the only place prices live.
//
// price: a number in `currency` (e.g. 1200), or null while it is not decided.
//        null shows a dashed "Price TBD" badge on /services.
// days:  delivery time in working days, shown on the package card.
//        These are suggested starting values; confirm or change them.
// unit:  the small text after the price.
// ============================================================================
window.NALBAKI_PRICING = {
  currency: 'USD',
  packages: {
    playable: { price: null, days: 5, unit: 'per playable' }, // PLACEHOLDER: set price
    portal: { price: null, days: 5, unit: 'per game' }, // PLACEHOLDER: set price
    game: { price: null, days: 10, unit: 'fixed price' }, // PLACEHOLDER: set price
    webgl: { price: null, days: 5, unit: 'per sprint' }, // PLACEHOLDER: set price
  },
};
