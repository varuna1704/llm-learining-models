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

  test('navigating homepage and entering interactive labs', async ({ page }) => {
    // Verify hero section is visible on homepage boot
    const heroTitle = page.locator('h1', { hasText: 'Learn How Large Language Models Actually Work' });
    await expect(heroTitle).toBeVisible();

    // Click "Enter Interactive Labs" button
    const labsBtn = page.getByRole('button', { name: '🧪 Enter Interactive Labs' });
    await expect(labsBtn).toBeVisible();
    await labsBtn.click();

    // Verify Lab Index header is displayed
    const labHeader = page.locator('h2', { hasText: 'Interactive LLM Engineering Laboratories' });
    await expect(labHeader).toBeVisible();

    // Verify Tokenizer Lab component is visible by default
    const tokenizerTitle = page.locator('h3', { hasText: 'Interactive Tokenizer Simulator' });
    await expect(tokenizerTitle).toBeVisible();
  });

  test('interacting with Tokenizer Lab and Self-Attention Lab', async ({ page }) => {
    // Navigate to Labs via sidebar
    const labsNavItem = page.locator('.nav-item', { hasText: '🧪 Interactive Labs' });
    await labsNavItem.click();

    // Switch tokenization algorithm to WordPiece
    const wordpieceBtn = page.getByRole('button', { name: 'WORDPIECE' });
    await expect(wordpieceBtn).toBeVisible();
    await wordpieceBtn.click();

    // Switch to Self-Attention Simulator Lab
    const attentionLabTab = page.getByRole('button', { name: /Self-Attention Simulator/ });
    await expect(attentionLabTab).toBeVisible();
    await attentionLabTab.click();

    // Verify Self-Attention Lab title
    const attentionTitle = page.locator('h3', { hasText: 'Interactive Self-Attention Simulator' });
    await expect(attentionTitle).toBeVisible();
  });

  test('opening achievements modal', async ({ page }) => {
    // Click achievements menu item in sidebar
    const streakBtn = page.locator('.nav-item', { hasText: '🏆 Achievements' });
    await expect(streakBtn).toBeVisible();
    await streakBtn.click();

    // Verify Achievements modal header
    const modalTitle = page.locator('.compare-modal-title', { hasText: 'Learning Progress & Achievements' });
    await expect(modalTitle).toBeVisible();
  });

  test('clicking topic and node in flowchart explorer', async ({ page }) => {
    // 1. Open a topic from the sidebar
    const topicItem = page.locator('.nav-item', { hasText: '📊 AI Model Library' });
    await expect(topicItem).toBeVisible();
    await topicItem.click();

    // Close the initial overview ExplanationPanel drawer
    const closeBtn = page.locator('.panel-close-btn');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    // 2. Click the node group in the diagram canvas
    await page.waitForSelector('[data-node-id="models_reasoning"]');
    const nodeGroup = page.locator('[data-node-id="models_reasoning"]');
    await expect(nodeGroup).toBeVisible();
    await nodeGroup.click({ force: true });

    // Verify ExplanationPanel is open and showing the node title
    const panelTitle = page.locator('.panel-title', { hasText: 'Reasoning Models' });
    await expect(panelTitle).toBeVisible();
  });

  test('submitting a query to ChatTutor', async ({ page }) => {
    const chatHeader = page.locator('.chat-header');
    await expect(chatHeader).toBeVisible();
    await chatHeader.click();

    const chatInput = page.locator('.chat-input');
    await expect(chatInput).toBeVisible();

    await chatInput.fill('What is a token?');
    await chatInput.press('Enter');

    const userMessage = page.locator('.chat-bubble.user', { hasText: 'What is a token?' });
    await expect(userMessage).toBeVisible();

    const assistantMessage = page.locator('.chat-bubble.assistant').nth(1);
    await expect(assistantMessage).toBeVisible({ timeout: 15000 });
  });
});
