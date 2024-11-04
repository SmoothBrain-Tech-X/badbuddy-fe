export interface Party {
  id: string;
  title: string;
  time: string;
  location: string;
  participants: {
    current: number;
    max: number;
  };
  host: {
    name: string;
    avatar: string;
  };
  type: 'practice' | 'tournament';
}

export interface Venue {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  courtCount: number;
  priceRange: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface QuickAction {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  color: string;
}
