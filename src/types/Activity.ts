export interface Activity {
  id: string;
  created_at: string;
  title: string;
  description: string;
  image: string;
  location: { longitude: string; latitude: string };
};