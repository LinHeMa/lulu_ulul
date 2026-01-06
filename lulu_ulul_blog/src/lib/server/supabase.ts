import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

const SUPABASE_URL = env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
	env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
	if (!client) {
		if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
			throw new Error('Supabase 未設定，請提供 SUPABASE_URL 與 SUPABASE_SERVICE_ROLE_KEY');
		}

		client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
			auth: {
				persistSession: false
			}
		});
	}

	return client;
};
