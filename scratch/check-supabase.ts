import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  console.log('Fetching first story to check relationships...');
  const { data, error } = await supabase
    .from('stories')
    .select('*, trails(*), story_images(*)')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    // Try singular 'trail'
    console.log('Retrying with singular trail...');
    const { data: data2, error: error2 } = await supabase
      .from('stories')
      .select('*, trail(*), story_images(*)')
      .limit(1);
    
    if (error2) {
      console.error('Error 2:', error2);
    } else {
      console.log('Success with trail (singular)');
      console.log('Sample:', JSON.stringify(data2[0], null, 2));
    }
  } else {
    console.log('Success with trails (plural)');
    console.log('Sample:', JSON.stringify(data[0], null, 2));
  }
}

checkSchema();
