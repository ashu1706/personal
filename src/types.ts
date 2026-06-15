export interface RSVP {
  id: string;
  name: string;
  attending: boolean;
  dietPreference: string;
  secretMessage: string;
  createdAt: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  avatar: string; // Cute emoji representative
  stamp: string; // Cute romantic stamp like Love, Forever, Together
  createdAt: string;
}

export interface PhotoMoment {
  id: string;
  url: string;
  title: string;
  date: string;
  caption: string;
}

export interface RestaurantDetails {
  name: string;
  address: string;
  date: string;
  time: string;
  dressCode: string;
  reservationName: string;
  lat: number;
  lng: number;
  mapEmbedUrl: string;
}
