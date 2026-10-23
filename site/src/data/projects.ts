import type { ImageMetadata } from 'astro';
import nxCover from '../assets/work/nail-xpress/cover.jpg';
import nxDetail1 from '../assets/work/nail-xpress/detail-1.jpg';
import nxDetail2 from '../assets/work/nail-xpress/detail-2.jpg';
import nxPhone from '../assets/work/nail-xpress/phone.jpg';
import gbCover from '../assets/work/guerrero-boxing-gym/cover.jpg';
import gbDetail1 from '../assets/work/guerrero-boxing-gym/detail-1.jpg';
import gbDetail2 from '../assets/work/guerrero-boxing-gym/detail-2.jpg';
import gbPhone from '../assets/work/guerrero-boxing-gym/phone.jpg';

// Only confirmed facts go here. Leave a field out (undefined) until it is confirmed;
// pages only render sections that have content.
export interface Shot { src: ImageMetadata; alt: string; caption: string }
export interface Project {
  slug: string;
  client: string;
  industry: string;
  location?: string;
  website?: string;
  year?: number;
  services?: string[]; // must match `filters` labels to be filterable
  summary?: string; // meta description
  headline?: string; // short line shown under the title
  deliverables?: string[]; // shown in the facts row (services is used for filters and tags)
  stats?: { value: string; label: string }[];
  palette?: { name: string; hex: string }[];
  challenge?: string;
  strategy?: string;
  design?: string;
  development?: string;
  content?: string;
  results?: string;
  cover?: Shot;
  details?: Shot[];
  phone?: Shot;
  tone: 'a' | 'b' | 'c'; // placeholder tone when an image is missing
  draft?: boolean; // true = kept out of the built site until the user approves it
}

const allProjects: Project[] = [
  {
    slug: 'nail-xpress',
    client: 'Nail Xpress',
    industry: 'Nail salon',
    location: 'Marietta, Georgia',
    website: 'https://xpressnailssalon.com/',
    services: ['Web design/development'],
    summary: 'Website design and development for Nail Xpress, a nail salon in Marietta, Georgia.',
    cover: { src: nxCover, alt: 'Nail Xpress homepage: a soft, blush-toned hero photo of a manicured hand beside the words Nail Xpress and a Book Appointment button.', caption: 'Homepage, desktop' },
    details: [
      { src: nxDetail1, alt: 'Nail Xpress philosophy section with a photo of a manicure in progress and the heading “Care, considered down to the last detail.”', caption: 'Philosophy section' },
      { src: nxDetail2, alt: 'Nail Xpress gallery section on a dark background showing three photos of the salon interior.', caption: 'Studio gallery' },
    ],
    phone: { src: nxPhone, alt: 'Nail Xpress homepage on a phone.', caption: 'Homepage, phone' },
    tone: 'b',
  },
  {
    slug: 'guerrero-boxing-gym',
    client: 'Guerrero Boxing Gym',
    industry: 'Boxing gym',
    location: 'Norcross, Georgia',
    website: 'https://guerreroboxinggym.com/',
    services: ['Web design/development', 'Photography', 'Video'],
    deliverables: ['Strategy', 'Copywriting', 'Web design', 'Development', 'Photography', 'Videography'],
    summary: 'Website design and development for Guerrero Boxing Gym, a family-owned boxing gym in Norcross, Georgia.',
    headline: 'A digital home built with the heart of a warrior.',
    stats: [
      { value: '2011', label: 'Serving Norcross since' },
      { value: '4', label: 'Pages: story, training, schedule, contact' },
      { value: '10+', label: 'Ages welcome, beginner to competitor' },
    ],
    challenge: 'A professional website that keeps the feel of a neighborhood gym and its Mexican heritage, not a generic fitness template.',
    strategy: 'Built on Guerrero’s own logo, with custom photography and a cinematic homepage video of Coach Lucio and the athletes.',
    results: 'A personal, local online presence that shows the coaching and community as the gym’s strength.',
    palette: [
      { name: 'Black', hex: '#0b0b0b' },
      { name: 'Warm ivory', hex: '#f5f1e8' },
      { name: 'Oxblood red', hex: '#981b1e' },
      { name: 'Mexican green', hex: '#0f7833' },
      { name: 'Silver', hex: '#d9dddf' },
    ],
    cover: { src: gbCover, alt: 'Guerrero Boxing Gym website section titled “A local gym with a fighter’s heart” with three photo cards: Built in Norcross, Every level, In your corner.', caption: 'About section, desktop' },
    details: [
      { src: gbDetail1, alt: 'Guerrero Boxing Gym homepage hero on black with the headline “Train like a warrior.” in white and red.', caption: 'Homepage hero, desktop' },
      { src: gbDetail2, alt: 'Guerrero Boxing Gym “Inside Guerrero” gallery with four training photos.', caption: 'Inside Guerrero gallery' },
    ],
    phone: { src: gbPhone, alt: 'Guerrero Boxing Gym homepage on a phone.', caption: 'Homepage, phone' },
    tone: 'a',
  },
];

// Only published projects are used anywhere on the site.
export const projects: Project[] = allProjects.filter((p) => !p.draft);
