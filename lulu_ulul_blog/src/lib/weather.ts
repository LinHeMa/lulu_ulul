export async function get36HrForecast(): Promise<any[]> {
  try {
    const response = await fetch('/api/weather');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const weather = await response.json();
    return weather;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}