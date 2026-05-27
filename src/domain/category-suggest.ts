import { Category } from './entities';

const KEYWORDS: { match: RegExp; categoryName: string }[] = [
  { match: /\b(milk|cheese|yogurt|butter|cream)\b/i, categoryName: 'Dairy' },
  { match: /\b(bread|bagel|croissant|muffin|toast|baguette)\b/i, categoryName: 'Bakery' },
  {
    match:
      /\b(apple|banana|orange|grape|berry|lettuce|tomato|onion|potato|carrot|broccoli|spinach|cucumber|fruit|vegetable|salad)\b/i,
    categoryName: 'Produce',
  },
  {
    match: /\b(chicken|beef|pork|bacon|sausage|fish|salmon|tuna|shrimp|meat|seafood)\b/i,
    categoryName: 'Meat & Seafood',
  },
  { match: /\b(frozen|ice cream|popsicle)\b/i, categoryName: 'Frozen' },
  {
    match: /\b(water|juice|soda|beer|wine|coffee|tea|drink|beverage)\b/i,
    categoryName: 'Beverages',
  },
  {
    match: /\b(chips|cookie|candy|chocolate|snack|pretzel|crackers|nuts)\b/i,
    categoryName: 'Snacks',
  },
  {
    match: /\b(rice|pasta|noodles|flour|sugar|salt|oil|sauce|spice|cereal|beans|canned)\b/i,
    categoryName: 'Pantry',
  },
  {
    match: /\b(detergent|toilet paper|paper towel|cleaner|sponge|trash|battery)\b/i,
    categoryName: 'Household',
  },
  {
    match: /\b(soap|shampoo|toothpaste|lotion|deodorant|razor|toothbrush)\b/i,
    categoryName: 'Personal Care',
  },
];

export function suggestCategoryByName(
  name: string,
  categories: Category[],
): Category | undefined {
  const trimmed = name.trim();
  if (!trimmed) return undefined;
  for (const k of KEYWORDS) {
    if (k.match.test(trimmed)) {
      return categories.find((c) => c.name === k.categoryName && !c.is_archived);
    }
  }
  return undefined;
}
