const { Builder, By, Key, until } = require("selenium-webdriver");
require('dotenv').config();

async function example() {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        await driver.get("https://twitter.com/login");

        // Wait for the username field to be visible and enabled
        let usernameField = await driver.wait(until.elementLocated(By.name("text")), 20000);
        await driver.wait(until.elementIsVisible(usernameField), 20000);
        await driver.wait(until.elementIsEnabled(usernameField), 20000);
        await usernameField.sendKeys(process.env.TWITTERUSERNAME);

        // Click the "Next" button
        let nextButton = await driver.wait(until.elementLocated(By.xpath("//span[text()='Next']")), 20000);
        await nextButton.click();

        // Wait for the additional security field to be visible and enabled if it exists
        let securityField = await driver.wait(until.elementLocated(By.name("text")), 20000).catch(() => null);
        if (securityField) {
            await driver.wait(until.elementIsVisible(securityField), 20000);
            await driver.wait(until.elementIsEnabled(securityField), 20000);
            await securityField.sendKeys(process.env.TWITTERADDITIONALUSERNAME);

            // Click the "Next" button again
            nextButton = await driver.wait(until.elementLocated(By.xpath("//span[text()='Next']")), 20000);
            await nextButton.click();
        }

        // Wait for the password field to be visible and enabled
        let passwordField = await driver.wait(until.elementLocated(By.name("password")), 20000);
        await driver.wait(until.elementIsVisible(passwordField), 20000);
        await driver.wait(until.elementIsEnabled(passwordField), 20000);
        await passwordField.sendKeys(process.env.TWITTERPASSWORD, Key.RETURN);

        // Wait for the home page to load by checking if the home timeline is visible
        await driver.wait(until.elementLocated(By.css("section[aria-labelledby*='accessible-list']")), 10000);

        // Navigate to the "What's happening" section and extract the topics
        console.log("Navigating to the 'What's happening' section...");
        let whatsHappeningSection;
        try {
            whatsHappeningSection = await driver.findElement(By.xpath("//span[contains(text(), 'What’s happening')]"));
        } catch (error) {
            console.error("Failed to find the 'What's happening' section:", error);
            return;
        }

        let topics;
        try {
            topics = await driver.findElements(By.xpath("//div[@data-testid='trend']"));
            console.log(`Found ${topics.length} topics.`);
        } catch (error) {
            console.error("Failed to find topics:", error);
        }
        let trends = [];
        for (let i = 0; i < topics.length; i++) {
            let topic = topics[i];
            let description = await topic.findElement(By.xpath(".//span[contains(@class, 'css-1jxf684') and not(contains(text(), 'Trending'))]")).getText();
            if (description.charAt(0) == "#") {
                trends.push(description.slice(1))
            }
            else {
                trends.push(description);
            }
        }
        // console.log(trends);
        return trends;
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        await driver.quit();
    }
}
module.exports = { example };