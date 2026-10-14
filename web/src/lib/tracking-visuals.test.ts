import { expect, it } from 'vitest';
import { illustrationStageFor, progressSegmentFor, vehicleForCourier } from './tracking-visuals';

it('maps every order state to its tracking illustration and progress segment', () => {
  expect(['placed', 'restaurant_accepted', 'preparing', 'courier_assigned', 'picked_up', 'en_route', 'arriving', 'delivered'].map(illustrationStageFor)).toEqual([
    'order', 'receipt', 'cooking', 'rider', 'rider-box', 'rider-road', 'pin', 'delivered',
  ]);
  expect(['placed', 'restaurant_accepted', 'preparing', 'courier_assigned', 'picked_up', 'en_route', 'arriving', 'delivered'].map(progressSegmentFor)).toEqual([0, 1, 1, 2, 2, 2, 2, 3]);
});

it('assigns a stable rotating set of four vehicles across the fictional couriers', () => {
  expect(Array.from({ length: 8 }, (_, i) => vehicleForCourier(`courier-${i}`))).toEqual([
    'bike', 'scooter', 'car', 'walk', 'bike', 'scooter', 'car', 'walk',
  ]);
  expect(vehicleForCourier('courier-7')).toBe(vehicleForCourier('courier-7'));
});
