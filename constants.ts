import { BloodGroup, Donor, UrgentRequest } from './types';

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A−', 'B+', 'B−', 'O+', 'O−', 'AB+', 'AB−'];
export const DONATION_INTERVAL_DAYS = 120;
export const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 };

export const MOCK_DONORS: Donor[] = [
  {
    id: '1',
    fullName: 'Ariful Islam',
    phoneNumber: '01711223344',
    bloodGroup: 'O+',
    age: 28,
    location: { lat: 23.7940, lng: 90.4043, address: 'Banani, Dhaka' },
    lastDonationDate: '2023-10-15',
    isAvailable: true,
    hidePhone: false,
  },
  {
    id: '2',
    fullName: 'Sabina Yasmin',
    phoneNumber: '01811223344',
    bloodGroup: 'B+',
    age: 24,
    location: { lat: 23.7511, lng: 90.3934, address: 'Dhanmondi, Dhaka' },
    lastDonationDate: '2024-01-20',
    isAvailable: true,
    hidePhone: false,
  },
  {
    id: '3',
    fullName: 'Tanvir Rahman',
    phoneNumber: '01911223344',
    bloodGroup: 'A+',
    age: 32,
    location: { lat: 23.8817, lng: 90.3994, address: 'Uttara, Dhaka' },
    lastDonationDate: '2023-05-10',
    isAvailable: true,
    hidePhone: true,
  },
  {
    id: '4',
    fullName: 'Nusrat Jahan',
    phoneNumber: '01611223355',
    bloodGroup: 'AB+',
    age: 26,
    location: { lat: 23.7231, lng: 90.4102, address: 'Old Dhaka' },
    lastDonationDate: null,
    isAvailable: true,
    hidePhone: false,
  },
  {
    id: '5',
    fullName: 'Kamal Ahmed',
    phoneNumber: '01511223366',
    /* Fixed typo: replaced hyphen with correct minus sign character (U+2212) */
    bloodGroup: 'O−',
    age: 35,
    location: { lat: 23.7771, lng: 90.4244, address: 'Badda, Dhaka' },
    lastDonationDate: '2024-02-05',
    isAvailable: true,
    hidePhone: false,
  },
  {
    id: '6',
    fullName: 'Laila Karim',
    phoneNumber: '01311223377',
    /* Fixed typo: replaced hyphen with correct minus sign character (U+2212) */
    bloodGroup: 'B−',
    age: 29,
    location: { lat: 23.7461, lng: 90.3742, address: 'Mohammadpur, Dhaka' },
    lastDonationDate: '2023-11-20',
    isAvailable: true,
    hidePhone: false,
  }
];

export const MOCK_URGENT_REQUESTS: UrgentRequest[] = [
  {
    id: 'u1',
    patientName: 'Mrs. Rahima',
    bloodGroup: 'AB−',
    hospital: 'Dhaka Medical College Hospital',
    location: 'Shahbagh, Dhaka',
    contactNumber: '01700112233',
    requiredBy: new Date().toISOString(),
    message: 'Urgent surgery tomorrow morning. Need 2 bags of AB−.'
  }
];