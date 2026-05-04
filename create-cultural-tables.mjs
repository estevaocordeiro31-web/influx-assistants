import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

async function main() {
  const conn = await mysql.createConnection(url);
  
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS cultural_events (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      start_date BIGINT,
      end_date BIGINT,
      active BOOLEAN DEFAULT TRUE,
      max_points INT DEFAULT 0,
      created_at BIGINT NOT NULL
    )
  `);
  console.log('✓ cultural_events created');

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS event_participants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id VARCHAR(100) NOT NULL,
      user_id INT NOT NULL,
      user_name VARCHAR(255),
      total_points INT DEFAULT 0,
      joined_at BIGINT NOT NULL,
      INDEX idx_event_user (event_id, user_id)
    )
  `);
  console.log('✓ event_participants created');

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS event_mission_progress (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id VARCHAR(100) NOT NULL,
      user_id INT NOT NULL,
      mission_id VARCHAR(100) NOT NULL,
      points INT DEFAULT 0,
      completed_at BIGINT,
      data TEXT,
      INDEX idx_event_user_mission (event_id, user_id, mission_id)
    )
  `);
  console.log('✓ event_mission_progress created');

  // Seed the Valentine's event
  await conn.execute(`
    INSERT IGNORE INTO cultural_events (id, name, description, start_date, end_date, active, max_points, created_at)
    VALUES ('valentines-2026', 'Valentine\\'s Day 2026', 'inFlux Restaurant - Valentine\\'s Day Edition', 
            ${new Date('2026-06-01').getTime()}, ${new Date('2026-06-12T23:59:59-03:00').getTime()}, 
            TRUE, 360, ${Date.now()})
  `);
  console.log('✓ valentines-2026 event seeded');

  await conn.end();
  console.log('Done!');
}

main().catch(console.error);
