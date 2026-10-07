// Only confirmed facts go here. Leave a field out (undefined) until it is confirmed;
// pages only render sections that have content.
export interface Project {
  slug: string;
  client: string;
  industry: string;
  website?: string;
  year?: number;
  services?: string[]; // must match `filters` labels to be filterable
  summary?: string;
  challenge?: string;
  strategy?: string;
  design?: string;
  development?: string;
  content?: string;
  results?: string;
  tone: 'a' | 'b' | 'c'; // placeholder image tone until real images exist
}

export const projects: Project[] = [
  {
    slug: 'xpress-nails-salon',
    client: 'Xpress Nails Salon',
    industry: 'Nail salon',
    website: 'https://xpressnailssalon.com/',
    tone: 'b',
  },
  {
    slug: 'guerrero-boxing-gym',
    client: 'Guerrero Boxing Gym',
    industry: 'Boxing gym',
    tone: 'a',
  },
];
