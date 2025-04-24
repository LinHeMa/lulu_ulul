
<script lang="ts">
import './_style/page.scss'

const thisYear = new Date().getFullYear()
const myRealAge = thisYear - 1997
</script>

<svelte:head>
	<title>About Me | LinHeMa de Blog</title>
	<meta name="description" content="About Me" />
</svelte:head>

<div>
	<h1>About Me</h1>
	<blockquote class="blockquote">
		<p>
			我的名字叫林河馬，{myRealAge}歲。住在新北市西南部的住宅區一帶，未婚。
			我在一班的公司服務。每天都不需要加班就能回家。我不抽煙，酒僅止於淺嚐。
			晚上12點睡，每天要睡足7個小時。睡前，我一定喝一杯冰氣泡水，然後做20分鐘的柔軟操，上了床，不一定馬上熟睡。
			一覺到天亮，高機率把疲勞和壓力留到第二天。醫生說我大部分很正常。
		</p>
	</blockquote>
	<ul>
		<li>支持台灣獨立的工程師</li>
		<li>有一隻最愛的狗</li>
	</ul>
</div>
