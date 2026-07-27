import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

(async () => {
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // High DPI screenshot
  });

  const page = await context.newPage();

  console.log('Navigating to app...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Homepage / Main Flowchart Canvas
  console.log('Taking screenshot 1: Flowchart Canvas...');
  await page.screenshot({ path: path.join(screenshotsDir, '01_homepage_canvas.png') });

  // 2. Node Explanation Panel Drawer
  console.log('Taking screenshot 2: Node Explanation Drawer...');
  const nodeGroup = page.locator('[data-node-id="models_reasoning"]');
  if (await nodeGroup.isVisible()) {
    await nodeGroup.click({ force: true });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '02_node_explanation_drawer.png') });
  }

  // 3. Interactive Quiz
  console.log('Taking screenshot 3: Interactive Quiz...');
  const quizBtn = page.getByRole('button', { name: /Take Quiz/i });
  if (await quizBtn.isVisible()) {
    await quizBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '03_interactive_quiz.png') });
  }

  // Close explanation drawer
  const closeBtn = page.locator('.panel-close-btn');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // 4. Fullscreen Lightbox Preview
  console.log('Taking screenshot 4: Fullscreen Lightbox Preview...');
  const previewBtn = page.getByRole('button', { name: /Preview/i });
  if (await previewBtn.isVisible()) {
    await previewBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '04_fullscreen_lightbox.png') });

    // Close lightbox
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // 5. Semantic AI Tutor (RAG)
  console.log('Taking screenshot 5: Semantic AI Tutor (RAG)...');
  const tutorHeader = page.locator('.chat-header');
  if (await tutorHeader.isVisible()) {
    await tutorHeader.click();
    await page.waitForTimeout(300);
    const tutorInput = page.locator('.chat-input');
    await tutorInput.fill('What is self-attention?');
    await page.locator('.chat-submit-btn').click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(screenshotsDir, '05_semantic_ai_tutor.png') });
  }

  // 6. AI Model Library Specifications
  console.log('Taking screenshot 6: AI Model Library...');
  const modelTab = page.locator('.nav-item', { hasText: 'AI Model Library' }).last();
  if (await modelTab.isVisible()) {
    await modelTab.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '06_model_library.png') });
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
})();
