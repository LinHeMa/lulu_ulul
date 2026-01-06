import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const SUPABASE_URL = privateEnv.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_SECRET_KEY =
	privateEnv.SUPABASE_SECRET_KEY ||
	privateEnv.SUPABASE_SERVICE_ROLE_KEY ||
	import.meta.env.VITE_SUPABASE_SECRET_KEY ||
	import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_PUBLISHABLE_KEY =
	privateEnv.SUPABASE_PUBLISHABLE_KEY ||
	publicEnv.PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let adminClient: SupabaseClient | null = null;
let publicClient: SupabaseClient | null = null;

const authOptions = {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
		detectSessionInUrl: false
	}
} as const;

export const getSupabaseAdminClient = (): SupabaseClient => {
	if (!adminClient) {
		if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
			throw new Error('Supabase 未設定，請提供 SUPABASE_URL 與 SUPABASE_SECRET_KEY');
		}

		adminClient = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, authOptions);
	}

	return adminClient;
};

export const getSupabasePublicClient = (): SupabaseClient => {
	if (!SUPABASE_URL) {
		throw new Error('Supabase 未設定，請提供 SUPABASE_URL');
	}

	if (!SUPABASE_PUBLISHABLE_KEY) {
		return getSupabaseAdminClient();
	}

	if (!publicClient) {
		publicClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, authOptions);
	}

	return publicClient;
};
