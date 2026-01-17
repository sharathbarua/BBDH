
export type BloodGroup = 'A+' | 'A−' | 'B+' | 'B−' | 'O+' | 'O−' | 'AB+' | 'AB−';

export interface Donor {
  id: string;
  fullName: string;
  phoneNumber: string;
  bloodGroup: BloodGroup;
  age: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  lastDonationDate: string | null; // ISO format
  isAvailable: boolean;
  hidePhone: boolean;
  distance?: number; // Calculated on the fly
}

export interface UrgentRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  hospital: string;
  location: string;
  contactNumber: string;
  requiredBy: string; // ISO format
  message: string;
}

export type AppTab = 'home' | 'search' | 'map' | 'profile';
