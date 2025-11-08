export const CATEGORIES = [
  'Tractors',
  'Implements', 
  'Vehicles',
  'Maps',
  'Tools',
  'Textures',
  'Other'
];

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'title', label: 'Name' }
];

export const USER_ROLES = {
  USER: 'user',
  CREATOR: 'creator',
  ADMIN: 'admin'
};

export const MOD_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};