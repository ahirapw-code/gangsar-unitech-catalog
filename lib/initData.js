import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';

export async function initializeData() {
  const db = await getDb();

  // Check if categories exist
  const categoryCount = await db.collection('categories').countDocuments();
  
  if (categoryCount === 0) {
    const categories = [
      {
        id: uuidv4(),
        name: 'Bearings',
        slug: 'bearings',
        description: 'Industrial grade ball bearings and roller bearings',
        image: 'https://images.pexels.com/photos/20339264/pexels-photo-20339264.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Industrial Valves',
        slug: 'industrial-valves',
        description: 'Gate valves, ball valves, and control valves',
        image: 'https://images.pexels.com/photos/36825977/pexels-photo-36825977.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Gearboxes',
        slug: 'gearboxes',
        description: 'Worm gearboxes, helical gearboxes, and gear reducers',
        image: 'https://images.pexels.com/photos/10290624/pexels-photo-10290624.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Pumps',
        slug: 'pumps',
        description: 'Centrifugal pumps, gear pumps, and water pumps',
        image: 'https://images.pexels.com/photos/675987/machine-mill-industry-steam-675987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Mechanical Components',
        slug: 'mechanical-components',
        description: 'Couplings, chains, sprockets, and pulleys',
        image: 'https://images.unsplash.com/photo-1579300057543-c555ba83cdb8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHw0fHxpbmR1c3RyaWFsJTIwbWFjaGluZXJ5fGVufDB8fHxibHVlfDE3Nzk4NzExNjd8MA&ixlib=rb-4.1.0&q=85',
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Conveyor Parts',
        slug: 'conveyor-parts',
        description: 'Conveyor belts, rollers, and idlers',
        image: 'https://images.pexels.com/photos/27102103/pexels-photo-27102103.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        createdAt: new Date()
      }
    ];

    await db.collection('categories').insertMany(categories);
    console.log('Categories initialized');

    // Create sample products
    const products = [
      {
        id: uuidv4(),
        sku: 'BRG-6205-2RS',
        name: 'Deep Groove Ball Bearing 6205-2RS',
        slug: 'deep-groove-ball-bearing-6205-2rs',
        category: 'Bearings',
        categorySlug: 'bearings',
        description: 'High-quality deep groove ball bearing with rubber seals on both sides. Ideal for electric motors, pumps, and general machinery.',
        specifications: [
          { label: 'Bore Diameter', value: '25mm' },
          { label: 'Outer Diameter', value: '52mm' },
          { label: 'Width', value: '15mm' },
          { label: 'Seal Type', value: '2RS (Rubber Sealed)' },
          { label: 'Material', value: 'Chrome Steel' }
        ],
        price: 45000,
        originalPrice: 45000,
        isPromo: false,
        inStock: true,
        images: [
          'https://images.pexels.com/photos/20339264/pexels-photo-20339264.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        ],
        featured: true,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        sku: 'VLV-BV-DN50',
        name: 'Ball Valve DN50 Stainless Steel',
        slug: 'ball-valve-dn50-stainless-steel',
        category: 'Industrial Valves',
        categorySlug: 'industrial-valves',
        description: 'Industrial grade 2-piece ball valve with full port design. Perfect for water, oil, and gas applications.',
        specifications: [
          { label: 'Size', value: 'DN50 (2 inch)' },
          { label: 'Material', value: 'SS316 Stainless Steel' },
          { label: 'Pressure Rating', value: 'PN25' },
          { label: 'Connection', value: 'Threaded BSP/NPT' },
          { label: 'Temperature Range', value: '-20°C to 180°C' }
        ],
        price: 320000,
        originalPrice: 380000,
        isPromo: true,
        discount: 16,
        inStock: true,
        images: [
          'https://images.pexels.com/photos/36825977/pexels-photo-36825977.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        ],
        featured: true,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        sku: 'GBX-NMRV040',
        name: 'NMRV040 Worm Gearbox Reducer',
        slug: 'nmrv040-worm-gearbox-reducer',
        category: 'Gearboxes',
        categorySlug: 'gearboxes',
        description: 'Compact aluminum housing worm gear reducer with high torque capacity. Suitable for conveyor systems and packaging machinery.',
        specifications: [
          { label: 'Model', value: 'NMRV040' },
          { label: 'Ratio', value: '1:10 to 1:100' },
          { label: 'Input Power', value: 'Up to 0.37kW' },
          { label: 'Output Torque', value: 'Up to 82Nm' },
          { label: 'Mounting', value: 'Foot/Flange' }
        ],
        price: 850000,
        originalPrice: 1100000,
        isPromo: true,
        discount: 23,
        inStock: true,
        images: [
          'https://images.pexels.com/photos/10290624/pexels-photo-10290624.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        ],
        featured: true,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        sku: 'PMP-CP-150',
        name: 'Centrifugal Pump CP-150 1.5HP',
        slug: 'centrifugal-pump-cp-150',
        category: 'Pumps',
        categorySlug: 'pumps',
        description: 'Single stage centrifugal pump with cast iron body. Efficient for water circulation, irrigation, and industrial processes.',
        specifications: [
          { label: 'Power', value: '1.5HP / 1.1kW' },
          { label: 'Flow Rate', value: 'Up to 150 L/min' },
          { label: 'Head', value: 'Up to 25m' },
          { label: 'Inlet/Outlet', value: '1.5" / 1.25"' },
          { label: 'Material', value: 'Cast Iron' }
        ],
        price: 1250000,
        originalPrice: 1250000,
        isPromo: false,
        inStock: true,
        images: [
          'https://images.pexels.com/photos/675987/machine-mill-industry-steam-675987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        ],
        featured: true,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        sku: 'CPL-JAW-L100',
        name: 'Jaw Coupling L100 Spider',
        slug: 'jaw-coupling-l100-spider',
        category: 'Mechanical Components',
        categorySlug: 'mechanical-components',
        description: 'Flexible jaw coupling with polyurethane spider insert. Absorbs shock and compensates for misalignment.',
        specifications: [
          { label: 'Type', value: 'L100 Jaw Coupling' },
          { label: 'Bore Range', value: '14-38mm' },
          { label: 'Material', value: 'Cast Iron + Polyurethane' },
          { label: 'Torque', value: 'Up to 125Nm' },
          { label: 'Hardness', value: '95 Shore A' }
        ],
        price: 180000,
        originalPrice: 240000,
        isPromo: true,
        discount: 25,
        inStock: true,
        images: [
          'https://images.unsplash.com/photo-1579300057543-c555ba83cdb8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHw0fHxpbmR1c3RyaWFsJTIwbWFjaGluZXJ5fGVufDB8fHxibHVlfDE3Nzk4NzExNjd8MA&ixlib=rb-4.1.0&q=85'
        ],
        featured: false,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        sku: 'CNV-RLR-89',
        name: 'Conveyor Roller 89mm Diameter',
        slug: 'conveyor-roller-89mm',
        category: 'Conveyor Parts',
        categorySlug: 'conveyor-parts',
        description: 'Heavy duty steel conveyor roller with precision bearing. Standard length 600mm, customizable.',
        specifications: [
          { label: 'Diameter', value: '89mm' },
          { label: 'Length', value: '600mm (customizable)' },
          { label: 'Bearing', value: '6204ZZ' },
          { label: 'Shaft', value: '20mm' },
          { label: 'Load Capacity', value: 'Up to 150kg' }
        ],
        price: 125000,
        originalPrice: 125000,
        isPromo: false,
        inStock: true,
        images: [
          'https://images.pexels.com/photos/27102103/pexels-photo-27102103.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        ],
        featured: false,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        sku: 'BRG-6308-ZZ',
        name: 'Deep Groove Ball Bearing 6308-ZZ',
        slug: 'deep-groove-ball-bearing-6308-zz',
        category: 'Bearings',
        categorySlug: 'bearings',
        description: 'Heavy duty deep groove ball bearing with metal shields. Suitable for high-speed applications.',
        specifications: [
          { label: 'Bore Diameter', value: '40mm' },
          { label: 'Outer Diameter', value: '90mm' },
          { label: 'Width', value: '23mm' },
          { label: 'Seal Type', value: 'ZZ (Metal Shield)' },
          { label: 'Speed Rating', value: '7500 rpm' }
        ],
        price: 95000,
        originalPrice: 130000,
        isPromo: true,
        discount: 27,
        inStock: true,
        images: [
          'https://images.pexels.com/photos/20339264/pexels-photo-20339264.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        ],
        featured: true,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        sku: 'VLV-GV-DN80',
        name: 'Gate Valve DN80 Cast Iron',
        slug: 'gate-valve-dn80-cast-iron',
        category: 'Industrial Valves',
        categorySlug: 'industrial-valves',
        description: 'Rising stem gate valve for water and steam applications. PN10 pressure rating.',
        specifications: [
          { label: 'Size', value: 'DN80 (3 inch)' },
          { label: 'Material', value: 'Cast Iron GG25' },
          { label: 'Pressure Rating', value: 'PN10' },
          { label: 'Connection', value: 'Flanged' },
          { label: 'Stem Type', value: 'Rising Stem' }
        ],
        price: 420000,
        originalPrice: 420000,
        isPromo: false,
        inStock: true,
        images: [
          'https://images.pexels.com/photos/36825977/pexels-photo-36825977.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        ],
        featured: false,
        createdAt: new Date()
      }
    ];

    await db.collection('products').insertMany(products);
    console.log('Products initialized');
  }
}