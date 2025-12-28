/**
 * About Me Images Data
 *
 * Each image should have:
 * - src: path to the image (relative to public folder)
 * - alt: descriptive alt text for accessibility
 * - caption: optional overlay text shown on hover
 * - orientation: 'horizontal' | 'vertical' | 'square' (auto-detected if not provided)
 * - priority: optional number for layout priority (higher = more prominent placement)
 *
 * The PhotoMosaic component will automatically arrange these images
 * in an aesthetically pleasing grid layout.
 */

export const aboutImages = [
  {
    src: "/about-gallery/hackmit-2024.jpg",
    alt: "HackMIT 2024",
    caption: "HackMIT 2024",
    orientation: "horizontal",
    priority: 3,
  },
  {
    src: "/about-gallery/banff.jpg",
    alt: "Banff trip",
    caption: null,
    orientation: "horizontal",
    priority: 2,
  },
  {
    src: "/about-gallery/art-museum.jpg",
    alt: "Art museum visit",
    caption: null,
    orientation: "horizontal",
    priority: 1,
  },
  {
    src: "/about-gallery/hackathon-team.jpg",
    alt: "Hackathon team",
    caption: null,
    orientation: "vertical",
    priority: 2,
  },
  {
    src: "/about-gallery/stripe-event.jpg",
    alt: "Stripe event",
    caption: "Congrats!",
    orientation: "horizontal",
    priority: 2,
  },
  {
    src: "/about-gallery/cenote-swim.jpg",
    alt: "Swimming in a cenote",
    caption: null,
    orientation: "vertical",
    priority: 1,
  },
  {
    src: "/about-gallery/vr-headset.jpg",
    alt: "Trying VR headset",
    caption: null,
    orientation: "vertical",
    priority: 1,
  },
  {
    src: "/about-gallery/poetry-night.jpg",
    alt: "Poetry night",
    caption: "Poetry Night",
    orientation: "horizontal",
    priority: 1,
  },
  {
    src: "/about-gallery/team-whiteboard.jpg",
    alt: "Team working at whiteboard",
    caption: null,
    orientation: "horizontal",
    priority: 1,
  },
  {
    src: "/about-gallery/balloons-celebration.jpg",
    alt: "Celebration with balloons",
    caption: null,
    orientation: "vertical",
    priority: 2,
  },
];

/**
 * Add new images to the gallery by adding objects to the array above.
 * The PhotoMosaic component will automatically re-layout when images change.
 *
 * Recommended image specifications:
 * - Horizontal: 4:3 aspect ratio
 * - Vertical: 3:4 aspect ratio
 * - Square: 1:1 aspect ratio
 * - Minimum resolution: 800px on shortest side
 * - Format: JPG or WebP for best performance
 */

export default aboutImages;
