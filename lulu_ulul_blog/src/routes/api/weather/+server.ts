import type { RequestHandler } from "@sveltejs/kit";
import { WEATHER_TOKEN } from '$env/static/private';
import { json } from "@sveltejs/kit";

const API_BASE = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore';

enum APIType {
    '36hrForecast' = 'F-C0032-001',
}

export const GET: RequestHandler = async () => {
    const endpoint = `${API_BASE}/${APIType["36hrForecast"]}?Authorization=${WEATHER_TOKEN}&limit=20&format=JSON&locationName=%E8%87%BA%E5%8C%97%E5%B8%82&sort=time`
    
    const headers: HeadersInit = {
        'Accept': 'application/json',
    };
    const response = await fetch(endpoint, { headers });
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    const data = await response.json();
    return json(data)
}