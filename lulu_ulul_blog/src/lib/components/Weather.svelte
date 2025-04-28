<script lang="ts">
	import { get36HrForecast } from '$lib/weather';

	let weather = get36HrForecast();

	// 定義天氣圖標映射
	const weatherIcons = {
		晴天: '☀️',
		多雲: '⛅',
		陰天: '☁️',
		雨天: '🌧️',
		雷雨: '⛈️',
		下雪: '❄️'
	};

	// 獲取適當的天氣圖標
	function getWeatherIcon(weather) {
		// 預設圖標
		let defaultIcon = '🌤️';
		if (!weather) return defaultIcon;

		try {
			const weatherDesc =
				weather.records.location[0].weatherElement[0].time[0].parameter.parameterName;
			// 查找對應圖標或返回預設
			return weatherIcons[weatherDesc] || defaultIcon;
		} catch (e) {
			return defaultIcon;
		}
	}
</script>

<div class="weather-card">
	{#await weather}
		<div class="loading">
			<div class="spinner"></div>
			<p>載入中</p>
		</div>
	{:then weatherData}
		{#if weatherData && weatherData.records}
			<div class="weather-content">
				<div class="weather-header">
					<div class="weather-icon">
						{getWeatherIcon(weatherData)}
					</div>
					<h2>天氣</h2>
				</div>

				<div class="weather-info">
					<p class="weather-desc">
						{weatherData.records.location[0].weatherElement[0].time[0].parameter.parameterName}
					</p>

					<div class="temp-container">
						<p class="temp">
							<span class="value"
								>{weatherData.records.location[0].weatherElement[4].time[0].parameter
									.parameterName}</span
							>
							<span class="unit">°</span>
							<span class="label">最高</span>
						</p>

						<span class="temp-divider">|</span>

						<p class="temp">
							<span class="value"
								>{weatherData.records.location[0].weatherElement[2].time[0].parameter
									.parameterName}</span
							>
							<span class="unit">°</span>
							<span class="label">最低</span>
						</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="error">
				<p>無法獲取天氣資訊</p>
				<button on:click={() => (weather = get36HrForecast())}>重試</button>
			</div>
		{/if}
	{:catch error}
		<div class="error">
			<p>獲取失敗</p>
			<button on:click={() => (weather = get36HrForecast())}>重試</button>
		</div>
	{/await}
</div>

<style>
	.weather-card {
		background-color: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		padding: 24px;
		max-width: 350px;
		margin: 0 auto;
		color: #333;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		margin-bottom: 1rem;
		@media screen and (min-width: 768px) {
			margin: 0;
            margin-bottom: 1rem;
		}
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px 0;
		color: #888;
		font-size: 14px;
	}

	.spinner {
		border: 2px solid #f3f3f3;
		border-radius: 50%;
		border-top: 2px solid #888;
		width: 20px;
		height: 20px;
		animation: spin 1s linear infinite;
		margin-bottom: 10px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.weather-header {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}

	.weather-icon {
		font-size: 2.5rem;
		margin-right: 15px;
	}

	h2 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 500;
		color: #555;
	}

	.weather-info {
		padding: 5px 0;
	}

	.weather-desc {
		font-size: 1.8rem;
		margin-bottom: 15px;
		color: #333;
		font-weight: 300;
	}

	.temp-container {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-top: 20px;
	}

	.temp {
		display: flex;
		align-items: baseline;
	}

	.temp-divider {
		margin: 0 15px;
		color: #ddd;
		font-weight: 200;
		font-size: 1.5rem;
	}

	.value {
		font-size: 1.8rem;
		font-weight: 400;
	}

	.unit {
		font-size: 1.8rem;
		font-weight: 300;
		margin-right: 4px;
	}

	.label {
		font-size: 0.8rem;
		color: #888;
		margin-left: 4px;
	}

	.error {
		text-align: center;
		padding: 20px;
		color: #888;
	}

	button {
		background-color: transparent;
		border: 1px solid #ddd;
		color: #666;
		padding: 6px 12px;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
		margin-top: 10px;
		font-size: 0.8rem;
	}

	button:hover {
		background-color: #f9f9f9;
	}
</style>
