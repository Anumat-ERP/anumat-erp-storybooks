/**
 * Deterministic ERP sample data for the DataTable, ResourceList and
 * IndexTable stories. Not exported from the package.
 */

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const pick = <T>(r: () => number, list: readonly T[]) => list[Math.floor(r() * list.length)] as T;

export const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
export const number = new Intl.NumberFormat('en-US');

const FIRST = ['Acme', 'Northwind', 'Blue Harbor', 'Siam', 'Golden Leaf', 'Riverstone', 'Pacific', 'Summit', 'Lotus', 'Ironbark', 'Mekong', 'Evergreen'];
const LAST = ['Trading', 'Supplies', 'Logistics', 'Foods', 'Industrial', 'Retail', 'Partners', 'Wholesale', 'Distribution', 'Manufacturing'];
const CITIES = ['Bangkok', 'Chiang Mai', 'Singapore', 'Kuala Lumpur', 'Ho Chi Minh City', 'Jakarta', 'Manila', 'Phuket'];

export interface Customer {
  id: string;
  name: string;
  email: string;
  city: string;
  orders: number;
  spent: number;
}

export function makeCustomers(count: number, seed = 7): Customer[] {
  const r = rng(seed);
  return Array.from({ length: count }, (_, i) => {
    const name = `${pick(r, FIRST)} ${pick(r, LAST)}${i >= FIRST.length * 2 ? ` ${i + 1}` : ''}`;
    return {
      id: `cus_${1000 + i}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@example.com`,
      city: pick(r, CITIES),
      orders: Math.floor(r() * 180),
      spent: Math.round(r() * 250_000_00) / 100,
    };
  });
}

export type OrderStatus = 'Paid' | 'Pending' | 'Refunded' | 'Overdue';
export type Fulfilment = 'Fulfilled' | 'Unfulfilled' | 'Partial';

export interface Order {
  id: string;
  number: string;
  customer: string;
  date: Date;
  status: OrderStatus;
  fulfilment: Fulfilment;
  items: number;
  total: number;
}

export function makeOrders(count: number, seed = 11): Order[] {
  const r = rng(seed);
  const customers = makeCustomers(40, seed + 1);
  const start = Date.UTC(2026, 8, 27);
  return Array.from({ length: count }, (_, i) => ({
    id: `ord_${5000 + i}`,
    number: `#${10240 - i}`,
    customer: pick(r, customers).name,
    date: new Date(start - Math.floor(i * 3.7 + r() * 3) * 3_600_000),
    status: pick(r, ['Paid', 'Paid', 'Paid', 'Pending', 'Refunded', 'Overdue'] as const),
    fulfilment: pick(r, ['Fulfilled', 'Fulfilled', 'Unfulfilled', 'Partial'] as const),
    items: 1 + Math.floor(r() * 24),
    total: Math.round((20 + r() * 9_800) * 100) / 100,
  }));
}

export interface StockLevel {
  id: string;
  sku: string;
  product: string;
  bangkok: number;
  chiangMai: number;
  singapore: number;
  kualaLumpur: number;
  reserved: number;
  reorderPoint: number;
  unitCost: number;
}

const PRODUCTS = ['Stainless bolt M8 × 40', 'Hydraulic hose 1/2" (10 m)', 'Nitrile gloves, box of 100', 'Pallet wrap 500 mm', 'LED panel 600 × 600', 'Cable tie 300 mm (pack)', 'Safety boots, size 42', 'Thermal label roll 100 × 150', 'Copper pipe 15 mm', 'Industrial degreaser 20 L'];

export function makeStock(count: number, seed = 5): StockLevel[] {
  const r = rng(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: `sku_${i}`,
    sku: `SKU-${String(4100 + i * 7).padStart(5, '0')}`,
    product: PRODUCTS[i % PRODUCTS.length] as string,
    bangkok: Math.floor(r() * 5000),
    chiangMai: Math.floor(r() * 1200),
    singapore: Math.floor(r() * 2400),
    kualaLumpur: Math.floor(r() * 900),
    reserved: Math.floor(r() * 400),
    reorderPoint: 100 + Math.floor(r() * 900),
    unitCost: Math.round((0.2 + r() * 180) * 100) / 100,
  }));
}
