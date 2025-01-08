/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Deletes ALL existing entries
    await knex('reports').del();
  
    // Inserts seed entries
    await knex('reports').insert([
      {
        id: 1,
        address: '123 Maple Street, Springfield',
        contact_name: 'John Doe',
        contact_phone: '123-456-7890',
        contact_email: 'johndoe@example.com',
        description: 'Flooding in the area due to heavy rain.',
        category: 'Flood',
        media: JSON.stringify(['images/flood1.jpg', 'images/flood2.jpg']),
        latitude: 39.7817,
        longitude: -89.6501,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        address: '456 Oak Avenue, Springfield',
        contact_name: 'Jane Smith',
        contact_phone: '987-654-3210',
        contact_email: 'janesmith@example.com',
        description: 'Trees downed by strong winds.',
        category: 'Wind Damage',
        media: JSON.stringify(['images/wind1.jpg']),
        latitude: 39.7820,
        longitude: -89.6512,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        address: '789 Pine Road, Springfield',
        contact_name: 'Alice Johnson',
        contact_phone: '555-555-5555',
        contact_email: 'alicej@example.com',
        description: 'Road blocked by landslide.',
        category: 'Landslide',
        media: JSON.stringify(['images/landslide1.jpg', 'images/landslide2.jpg']),
        latitude: 39.7800,
        longitude: -89.6525,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  }
  