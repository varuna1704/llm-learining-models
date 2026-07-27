import { test, expect } from '@playwright/test';

test.describe('ModelMap E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to root and clear localStorage to prevent cross-test state pollution
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    // Wait for the main container to load
    await page.waitForSelector('.app-container');
  });

  test('clicking topic and node, toggling Simple/Detailed depth', async ({ page }) => {
    // 1. Open a topic from the sidebar
    const topicItem = page.locator('.nav-item', { hasText: '📊 AI Model Library' });
    await expect(topicItem).toBeVisible();
    await topicItem.click();

    // Close the initial overview ExplanationPanel drawer so it does not overlay/intercept our canvas click!
    const closeBtn = page.locator('.panel-close-btn');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    // 2. Click the node group in the diagram canvas using its precise data-node-id and click it using force: true
    // This bypasses sibling text overlays while ensuring the click bubbles up to the <g> click handler.
    await page.waitForSelector('[data-node-id="models_reasoning"]');
    const nodeGroup = page.locator('[data-node-id="models_reasoning"]');
    await expect(nodeGroup).toBeVisible();
    await nodeGroup.click({ force: true });

    // Verify ExplanationPanel is open and showing the node title
    const panelTitle = page.locator('.panel-title', { hasText: 'Reasoning Models' });
    await expect(panelTitle).toBeVisible();

    // 3. Toggle Explanation Depth to ELI5 (Simple)
    const eli5Btn = page.getByRole('button', { name: 'ELI5 (Simple)' });
    await expect(eli5Btn).toBeVisible();
    await eli5Btn.click();

    // Verify the active state class on the button
    await expect(eli5Btn).toHaveClass(/active/);

    // Toggle back to Detailed
    const detailedBtn = page.getByRole('button', { name: 'Detailed' });
    await expect(detailedBtn).toBeVisible();
    await detailedBtn.click();
    await expect(detailedBtn).toHaveClass(/active/);
  });

  test('dragging and zooming the canvas', async ({ page }) => {
    // Close the initial ExplanationPanel drawer so we have more free canvas screen space
    const closeBtn = page.locator('.panel-close-btn');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    const canvas = page.locator('.canvas-svg');
    await expect(canvas).toBeVisible();

    // Focus/click canvas first to establish active mouse event listeners
    await canvas.click({ force: true });

    // Get initial transform of the transform group
    const canvasGroup = page.locator('.canvas-transform-group');
    await expect(canvasGroup).toBeAttached();
    const initialTransform = await canvasGroup.getAttribute('transform');

    page.on('console', msg => console.log(msg.text()));

    // Drag the canvas to pan (using very explicit coordinates)
    const boundingBox = await canvas.boundingBox();
    if (boundingBox) {
      // Find the absolute center
      const cx = boundingBox.x + boundingBox.width / 2;
      const cy = boundingBox.y + boundingBox.height / 2;
      
      // Go way out to the edge (right side) where nodes are unlikely to be
      const startX = boundingBox.x + boundingBox.width - 50;
      const startY = cy;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX - 100, startY - 100, { steps: 10 });
      await page.mouse.up();
    }

    // Verify transform attribute changed (panned)
    await expect(canvasGroup).not.toHaveAttribute('transform', initialTransform || '');
    const pannedTransform = await canvasGroup.getAttribute('transform');

    // Zoom the canvas (wheel event)
    await canvas.dispatchEvent('wheel', { deltaY: -120 }); // Zoom in

    // Verify zoom transform attribute updated
    await expect(canvasGroup).not.toHaveAttribute('transform', pannedTransform || '');
  });

  test('submitting a query to ChatTutor', async ({ page }) => {
    // Click header to expand the chat panel since it is collapsed by default
    const chatHeader = page.locator('.chat-header');
    await expect(chatHeader).toBeVisible();
    await chatHeader.click();

    // Select input field
    const chatInput = page.locator('.chat-input');
    await expect(chatInput).toBeVisible();

    // Type query
    await chatInput.fill('What is a token?');
    await chatInput.press('Enter');

    // Wait for the user message bubble and the retrieved assistant answer bubble
    const userMessage = page.locator('.chat-bubble.user', { hasText: 'What is a token?' });
    await expect(userMessage).toBeVisible();

    // Wait for the RAG search results to render (contains definition or links)
    const assistantMessage = page.locator('.chat-bubble.assistant').nth(1);
    await expect(assistantMessage).toBeVisible({ timeout: 15000 });
  });

  test('completing a quiz', async ({ page }) => {
    // Select topic to load its quiz
    const topicItem = page.locator('.nav-item', { hasText: '📊 AI Model Library' });
    await topicItem.click();

    // Click Take Quiz button in the sidebar ExplanationPanel
    const takeQuizBtn = page.getByRole('button', { name: /Take Quiz/ });
    await expect(takeQuizBtn).toBeVisible();
    await takeQuizBtn.click();

    // Answer Question 1
    const optionA1 = page.locator('.quiz-option-btn').first();
    await expect(optionA1).toBeVisible();
    await optionA1.click();
    
    const nextBtn1 = page.getByRole('button', { name: /Next Question|Finish Quiz/ });
    await expect(nextBtn1).toBeVisible();
    await nextBtn1.click();

    // Answer Question 2
    const optionA2 = page.locator('.quiz-option-btn').first();
    await expect(optionA2).toBeVisible();
    await optionA2.click();

    const nextBtn2 = page.getByRole('button', { name: /Next Question|Finish Quiz/ });
    await expect(nextBtn2).toBeVisible();
    await nextBtn2.click();

    // Answer Question 3
    const optionA3 = page.locator('.quiz-option-btn').first();
    await expect(optionA3).toBeVisible();
    await optionA3.click();

    const finishBtn = page.getByRole('button', { name: /Finish Quiz/ });
    await expect(finishBtn).toBeVisible();
    await finishBtn.click();

    // Verify completion screen
    const completionTitle = page.locator('h4', { hasText: 'Quiz Complete!' });
    await expect(completionTitle).toBeVisible();
    
    const closeBtn = page.getByRole('button', { name: 'Close' });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    // Verify quiz panel closed and returned to overview
    await expect(takeQuizBtn).toBeVisible();
  });
});
