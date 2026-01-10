import { MockupScenario } from './types';

export const SCENARIOS: MockupScenario[] = [
  {
    id: 'vintage',
    title: 'Vintage Store',
    description: 'Rustic wooden counter in a retro shop.',
    promptSuffix: 'Generate a photorealistic image of the packaging on a wooden table in a vintage antique shop. Warm, atmospheric lighting with blurred vintage items in the background. Cinematic, retro feel.',
    icon: '🕰️'
  },
  {
    id: 'studio_softbox',
    title: 'Pro Studio Softbox',
    description: 'Indoor studio lighting with softbox.',
    promptSuffix: 'Professional product photography in a studio setting. Use softbox lighting for soft, diffused shadows and even illumination to highlight the packaging details. High-end commercial look, crisp focus, neutral background.',
    icon: '💡'
  },
  {
    id: 'home',
    title: 'Cozy Home',
    description: 'Lifestyle shot in a living room.',
    promptSuffix: 'Lifestyle photography in a cozy modern home. The product is on a coffee table or wooden shelf. Soft natural light coming from a window, blurred living room background, inviting atmosphere.',
    icon: '🏠'
  },
  {
    id: 'white_podium',
    title: 'Clean Podium',
    description: 'Marble/Acrylic stand with reflection.',
    promptSuffix: 'Product placed on a smooth white marble or acrylic display podium. Clean white background. Subtle, elegant reflection of the product on the surface. High-key lighting, minimalist and premium.',
    icon: '⚪'
  },
  {
    id: 'luxury_window',
    title: 'Luxury Window Display',
    description: 'Mall showcase with spotlights.',
    promptSuffix: 'Simulate a high-end mall window display. Dramatic spotlighting on the product. The background is a deep, rich brand wall or an artistic installation. Create a sense of luxury and exclusivity.',
    icon: '💎'
  },
  {
    id: 'nature',
    title: 'Nature Outdoors',
    description: 'Organic setting with rocks and sunlight.',
    promptSuffix: 'Product placed outdoors on a mossy rock or natural stone. Dappled sunlight filtering through trees. Fresh, organic, and eco-friendly vibe. Shallow depth of field.',
    icon: '🌿'
  },
  {
    id: 'kitchen',
    title: 'Modern Kitchen',
    description: 'Marble counter with ingredients.',
    promptSuffix: 'Placed on a clean marble kitchen countertop. Morning sunlight. Blurred kitchen background with fresh ingredients or utensils implies usage. Bright and airy.',
    icon: '🍳'
  },
  {
    id: 'industrial',
    title: 'Industrial Loft',
    description: 'Concrete textures and dramatic shadows.',
    promptSuffix: 'Edgy industrial style. Placed on a raw concrete surface. Dramatic, high-contrast lighting. Urban loft aesthetic with cool tones.',
    icon: '🏭'
  },
  {
    id: 'pastel',
    title: 'Pastel Art',
    description: 'Trendy geometric shapes and soft colors.',
    promptSuffix: 'Abstract art direction. Surrounded by geometric primitive shapes (spheres, cubes) in soft pastel colors (pink, mint, blue). Soft, dreamy lighting. Trendy 3D render style.',
    icon: '🎨'
  },
  {
    id: 'office',
    title: 'Workspace',
    description: 'Professional desk setup.',
    promptSuffix: 'On a professional office desk next to a laptop and a notebook. Smart workspace environment. Focus on the product with a blurred office background.',
    icon: '💼'
  }
];