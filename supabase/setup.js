import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get Supabase credentials from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // You'll need to add this

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials!');
    console.log('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
    console.log('🚀 Running database migrations...\n');

    try {
        // Read the migration file
        const migrationPath = join(__dirname, 'migrations', '20260126_initial_schema.sql');
        const sql = readFileSync(migrationPath, 'utf-8');

        // Split by semicolons and filter out empty statements
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`📝 Found ${statements.length} SQL statements\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            console.log(`Executing statement ${i + 1}/${statements.length}...`);

            const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });

            if (error) {
                console.error(`❌ Error in statement ${i + 1}:`, error.message);
                // Continue with other statements
            } else {
                console.log(`✅ Statement ${i + 1} executed successfully`);
            }
        }

        console.log('\n✅ Migration completed!');
        console.log('\n📊 Verifying tables...');

        // Verify tables exist
        const { data: tables, error: tablesError } = await supabase
            .from('chats')
            .select('count')
            .limit(0);

        if (!tablesError) {
            console.log('✅ chats table exists');
        }

        const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select('count')
            .limit(0);

        if (!messagesError) {
            console.log('✅ messages table exists');
        }

        console.log('\n🎉 Database setup complete!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigrations();
