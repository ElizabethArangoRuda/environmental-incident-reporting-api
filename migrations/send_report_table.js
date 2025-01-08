/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('reports', (table) => {
      table.increments('id').primary(); // Primary key
  
      // Address field
      table.string('address').notNullable();
  
      // Contact details
      table.string('contact_name').notNullable();
      table.string('contact_phone').notNullable();
      table.string('contact_email').notNullable();
  
      // Description of the report
      table.text('description').notNullable();
  
      // Report category
      table.string('category').notNullable();
  
      // Media storage (e.g., file paths or URLs)
      table.json('media');
  
      // Geolocation data
      table.decimal('latitude', 10, 7);
      table.decimal('longitude', 10, 7);
  
      // Timestamps
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex) {
    return knex.schema.dropTable('reports');
  }
  
  