const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const url = process.env.TEST_URL || 'http://localhost:8080';
  const outputDir = path.join(process.cwd(), 'artifacts', 'screenshots');
  fs.mkdirSync(outputDir, { recursive: true });

  const viewports = [
    { name: 'mobile-360', width: 360, height: 800 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'desktop-1024', width: 1024, height: 768 },
    { name: 'desktop-1440', width: 1440, height: 900 }
  ];

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    const page = await browser.newPage();
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // small delay to allow CSS transitions / fonts
      await page.waitForTimeout(800);

      const filePath = path.join(outputDir, `${vp.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log('Saved screenshot:', filePath);
    }

    // capture a close-up of the hero area (select by .hero)
    try {
      const hero = await page.$('.hero');
      if (hero) {
        const rect = await page.evaluate(el => {
          const { x, y, width, height } = el.getBoundingClientRect();
          return { x, y, width, height };
        }, hero);
        const heroPath = path.join(outputDir, `hero-clip.png`);
        await page.screenshot({ path: heroPath, clip: { x: Math.max(0, rect.x), y: Math.max(0, rect.y), width: Math.min(rect.width, vp.width), height: Math.min(rect.height, vp.height) } });
        console.log('Saved hero clip:', heroPath);
      } else {
        console.log('No .hero element found for hero clip.');
      }
    } catch (err) {
      console.log('Error while capturing hero clip:', err.message);
    }

  } catch (err) {
    console.error('Screenshot script error:', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }

  console.log('Screenshots completed.');
})();
