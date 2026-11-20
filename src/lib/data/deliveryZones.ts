import { DeliveryZone } from '@/types/order';

export const DELIVERY_ZONES: DeliveryZone[] = [
  // Brazzaville Zones
  { id: 'bz-centre', city: 'Brazzaville', zoneName: 'Centre-ville / Plateau / Mpila', deliveryFee: 1500, estimatedHoursMin: 2, estimatedHoursMax: 4 },
  { id: 'bz-poto', city: 'Brazzaville', zoneName: 'Poto-Poto / Moungali / Ouenze', deliveryFee: 2000, estimatedHoursMin: 2, estimatedHoursMax: 5 },
  { id: 'bz-bacongo', city: 'Brazzaville', zoneName: 'Bacongo / Makélékélé / Diata', deliveryFee: 2000, estimatedHoursMin: 2, estimatedHoursMax: 5 },
  { id: 'bz-talangai', city: 'Brazzaville', zoneName: 'Talangaï / Kintélé / Mikalou', deliveryFee: 2500, estimatedHoursMin: 3, estimatedHoursMax: 6 },
  { id: 'bz-mfilou', city: 'Brazzaville', zoneName: 'Mfilou / Moukondo / Mansimou', deliveryFee: 3000, estimatedHoursMin: 3, estimatedHoursMax: 8 },
  { id: 'bz-djiri', city: 'Brazzaville', zoneName: 'Djiri / Nkombo / Massengo', deliveryFee: 3500, estimatedHoursMin: 4, estimatedHoursMax: 12 },

  // Pointe-Noire Zones
  { id: 'pn-centre', city: 'Pointe-Noire', zoneName: 'Centre-ville / Port / Côte Sauvage', deliveryFee: 1500, estimatedHoursMin: 2, estimatedHoursMax: 4 },
  { id: 'pn-lumumba', city: 'Pointe-Noire', zoneName: 'Lumumba / Grand Marché / Fond Tié-Tié', deliveryFee: 2000, estimatedHoursMin: 2, estimatedHoursMax: 5 },
  { id: 'pn-tietie', city: 'Pointe-Noire', zoneName: 'Tié-Tié / Rex / Mpita', deliveryFee: 2000, estimatedHoursMin: 2, estimatedHoursMax: 5 },
  { id: 'pn-mongo', city: 'Pointe-Noire', zoneName: 'Mongo-Mpoukou / Vindoulou', deliveryFee: 2500, estimatedHoursMin: 3, estimatedHoursMax: 6 },
  { id: 'pn-ngoyo', city: 'Pointe-Noire', zoneName: 'Ngoyo / Tchimbamba / Loandjili', deliveryFee: 3000, estimatedHoursMin: 4, estimatedHoursMax: 8 },
];
