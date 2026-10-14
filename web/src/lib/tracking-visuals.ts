export type Vehicle = 'bike' | 'scooter' | 'car' | 'walk';
export type TrackingStage =
  | 'order'
  | 'receipt'
  | 'cooking'
  | 'rider'
  | 'rider-box'
  | 'rider-road'
  | 'pin'
  | 'delivered';

export function vehicleForCourier(courierId: string): Vehicle {
  const number = Number(courierId.split('-').at(-1)) || 0;
  return (['bike', 'scooter', 'car', 'walk'] as const)[number % 4];
}

export function illustrationStageFor(status: string): TrackingStage {
  switch (status) {
    case 'restaurant_accepted':
      return 'receipt';
    case 'preparing':
      return 'cooking';
    case 'courier_assigned':
      return 'rider';
    case 'picked_up':
      return 'rider-box';
    case 'en_route':
      return 'rider-road';
    case 'arriving':
      return 'pin';
    case 'delivered':
      return 'delivered';
    default:
      return 'order';
  }
}

export function progressSegmentFor(status: string): number {
  if (status === 'delivered') return 3;
  if (['courier_assigned', 'picked_up', 'en_route', 'arriving'].includes(status))
    return 2;
  if (['restaurant_accepted', 'preparing'].includes(status)) return 1;
  return 0;
}
