
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Klassischer Miswak Stick',
    price: 3.99,
    description: 'Frisch geerntet und einzeln vakuumverpackt für maximale Frische und Hygiene.',
    image: 'https://picsum.photos/seed/miswak1/600/600',
    category: 'Einzelstücke'
  },
  {
    id: '2',
    name: 'Miswak Reise-Set',
    price: 12.50,
    description: 'Enthält zwei Miswak-Sticks und ein elegantes Etui aus Bambus für unterwegs.',
    image: 'https://picsum.photos/seed/miswak-travel-bamboo/600/600',
    category: 'Sets'
  },
  {
    id: '3',
    name: 'Miswak Premium Vorratspack',
    price: 29.90,
    description: '10 handverlesene Miswak-Sticks für die ganze Familie oder den Monatsvorrat.',
    image: 'https://picsum.photos/seed/miswak3/600/600',
    category: 'Vorrat'
  },
  {
    id: '4',
    name: 'Miswak mit Minz-Extrakt',
    price: 4.50,
    description: 'Die Kraft des klassischen Miswak, verfeinert mit natürlichem Minz-Öl für extra Frische.',
    image: 'https://picsum.photos/seed/miswak4/600/600',
    category: 'Aroma'
  }
];
