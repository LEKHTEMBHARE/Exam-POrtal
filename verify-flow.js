const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000/index.html');
  await page.fill('#email', 'lekhstudent1@gmail.com');
  await page.fill('#password', 'Python@2026S1');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForURL('**/student.html');
  await page.click('#startTestBtn');
  await page.waitForURL('**/test.html');

  for (let i = 0; i < 20; i++) {
    const optionCount = await page.locator('.option-button').count();
    if (optionCount > 0) {
      await page.locator('.option-button').first().click();
    } else {
      await page.locator('#programAnswer').fill('num = 10\nif num % 2 == 0:\n    print("even")\nelse:\n    print("odd")');
    }
    if (i < 19) {
      await page.click('#nextBtn');
      await page.waitForTimeout(150);
    }
  }

  await page.click('#submitBtn');
  await page.click('#confirmSubmitBtn');
  await page.waitForURL('**/result.html');
  await page.click('#goToFeedback');
  await page.waitForURL('**/feedback.html');
  await page.fill('#studentName', 'Student 1');
  await page.click('.star[data-rating-value="4"]');
  await page.selectOption('#testDifficulty', 'Moderate');
  await page.selectOption('#questionQuality', 'Good');
  await page.selectOption('#timeManagement', 'Good');
  await page.selectOption('#websiteExperience', 'Good');
  await page.fill('#liked', 'Smooth and clear design');
  await page.fill('#improvements', 'Need more code practice');
  await page.fill('#suggestions', 'Continue improving usability');
  await page.click('#feedbackForm button[type="submit"]');
  await page.waitForTimeout(1200);

  await page.goto('http://localhost:8000/index.html');
  await page.fill('#email', 'pythonadmin@gmail.com');
  await page.fill('#password', 'Python@Admin2026');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForURL('**/admin.html');

  const bodyText = await page.locator('body').innerText();
  console.log(JSON.stringify({
    url: page.url(),
    hasStudentResults: bodyText.includes('Student Results'),
    hasFeedbackOverview: bodyText.includes('Feedback Overview'),
    hasQuestionReview: bodyText.includes('Question Bank Review')
  }, null, 2));

  await browser.close();
})();
